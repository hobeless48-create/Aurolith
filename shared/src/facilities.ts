import { getHex, tileId } from './board.js';
import { hexDistance } from './pathfinding.js';
import { combatScaleBps, damageAfterArmor, isUnitTargetable } from './combat.js';
import { bastionDamageBps } from './items.js';
import { canDetectBrushOccupant } from './concealment.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import type { PlayerId, PlayerState, UnitState } from './simulation.js';

export type FacilityKind = 'caravan-post' | 'ballista' | 'arcane-barrier' | 'sanctuary';
export type FacilityTier = 0 | 1 | 2 | 3;
export type FacilityState = Readonly<{
  id: string;
  ownerId: PlayerId;
  col: number;
  row: number;
  zone: 'outer-courtyard' | 'inner-keep';
  kind: FacilityKind | null;
  tier: FacilityTier;
  pendingTier: 1 | 2 | 3 | null;
  readyAtTick: number | null;
  hp: number;
  maxHp: number;
  rubbleUntilTick: number;
  nextAttackTick: number;
  pendingGoldCostMilli: number;
  pendingXpCost: number;
}>;

export const FACILITY_BUILD_TICKS = 50; // Provisional: the source does not specify a build duration.
export const FACILITY_RUBBLE_TICKS = 100;
export const FACILITY_COSTS = [0, 150, 250, 400] as const;
export const FACILITY_XP_COSTS = [0, 0, 100, 250] as const;
export const FACILITY_HP = [0, 500, 750, 1000] as const;
const CARAVAN_GOLD = [0, 150, 300, 500] as const;
const BALLISTA_DAMAGE = [0, 2000, 3000, 4000] as const;

const NORTH_SLOTS = [
  { col: 55, row: 14, zone: 'outer-courtyard' },
  { col: 65, row: 14, zone: 'outer-courtyard' },
  { col: 82, row: 14, zone: 'outer-courtyard' },
  { col: 92, row: 14, zone: 'outer-courtyard' },
  { col: 64, row: 2, zone: 'inner-keep' },
  { col: 83, row: 2, zone: 'inner-keep' },
] as const;

export function createFacilitySlots(ownerId: PlayerId): FacilityState[] {
  return NORTH_SLOTS.map((slot, index) => ({
    id: `facility-slot:${ownerId.endsWith('north') ? 'north' : 'south'}:${index + 1}`,
    ownerId,
    col: slot.col,
    row: ownerId === 'player:north' ? slot.row : 89 - (slot.row + 2),
    zone: slot.zone,
    kind: null,
    tier: 0,
    pendingTier: null,
    readyAtTick: null,
    hp: 0,
    maxHp: 0,
    rubbleUntilTick: 0,
    nextAttackTick: 0,
    pendingGoldCostMilli: 0,
    pendingXpCost: 0,
  }));
}

export function facilityFootprint(slot: Pick<FacilityState, 'col' | 'row'>): { col: number; row: number }[] {
  return Array.from({ length: 9 }, (_, index) => ({ col: slot.col + index % 3, row: slot.row + Math.floor(index / 3) }));
}

export function distanceToFacility(point: { col: number; row: number }, slot: FacilityState): number {
  return Math.min(...facilityFootprint(slot).map((hex) => hexDistance(point, hex)));
}

export function occupiedFacilityHexes(players: readonly Pick<PlayerState, 'facilities'>[], tick: number): ReadonlySet<string> {
  const blocked = new Set<string>();
  for (const player of players) for (const slot of player.facilities) {
    if ((!slot.kind || slot.hp <= 0) && slot.rubbleUntilTick <= tick) continue;
    for (const point of facilityFootprint(slot)) blocked.add(tileId(point.col, point.row));
  }
  return blocked;
}

export function facilityCategory(kind: FacilityKind): 'production' | 'combat' {
  return kind === 'caravan-post' ? 'production' : 'combat';
}

export function facilityPotencyBps(slots: readonly FacilityState[], slot: FacilityState): number {
  if (!slot.kind || slot.tier === 0 || slot.hp <= 0) return 0;
  const copies = slots.filter((other) => other.kind === slot.kind && other.tier > 0 && other.hp > 0)
    .sort((a, b) => b.tier - a.tier || a.id.localeCompare(b.id));
  return copies[0]?.id === slot.id ? 10000 : 5000;
}

export function caravanPaymentMilli(slots: readonly FacilityState[], tick: number): number {
  if (tick <= 0 || tick % 600 !== 0) return 0;
  return slots.reduce((sum, slot) => sum + (slot.kind === 'caravan-post' ? CARAVAN_GOLD[slot.tier] * 1000 * facilityPotencyBps(slots, slot) / 10000 : 0), 0);
}

export function progressFacilities(slots: readonly FacilityState[], tick: number): { facilities: FacilityState[]; instantGoldMilli: number } {
  const facilities = slots.map((slot): FacilityState => {
    if (!slot.pendingTier || slot.readyAtTick === null || slot.readyAtTick > tick || slot.hp <= 0) return slot;
    const tier = slot.pendingTier;
    const maxHp = FACILITY_HP[tier];
    return { ...slot, tier, hp: maxHp - (slot.maxHp - slot.hp), maxHp, pendingTier: null, readyAtTick: null, pendingGoldCostMilli: 0, pendingXpCost: 0 };
  });
  const instantGoldMilli = facilities.reduce((sum, slot, index) => sum + (slot.kind === 'caravan-post' && slot.tier === 3 && slots[index].tier < 3
    ? Math.round(500000 * facilityPotencyBps(facilities, slot) / 10000) : 0), 0);
  return { facilities, instantGoldMilli };
}

export function damageFacility(player: PlayerState, slotId: string, damage: number, tick: number): PlayerState {
  const slot = player.facilities.find((entry) => entry.id === slotId);
  if (!slot || !slot.kind || slot.hp <= 0 || damage <= 0) return player;
  const hp = Math.max(0, slot.hp - damage);
  if (hp > 0) return { ...player, facilities: player.facilities.map((entry) => entry.id === slotId ? { ...entry, hp } : entry) };
  const refundGoldMilli = slot.pendingTier && slot.tier > 0 ? Math.floor(slot.pendingGoldCostMilli / 2) : 0;
  const refundXp = slot.pendingTier && slot.tier > 0 ? Math.floor(slot.pendingXpCost / 2) : 0;
  return {
    ...player,
    batteryDisabled: player.batteryDisabled || player.batteryPowerSlotId === slotId,
    goldMilli: player.goldMilli + refundGoldMilli,
    facilityXpSpent: player.facilityXpSpent - refundXp,
    facilities: player.facilities.map((entry) => entry.id === slotId ? {
      ...entry, kind: null, tier: 0 as const, pendingTier: null, readyAtTick: null, hp: 0, maxHp: 0,
      rubbleUntilTick: tick + FACILITY_RUBBLE_TICKS, nextAttackTick: 0, pendingGoldCostMilli: 0, pendingXpCost: 0,
    } : entry),
  };
}

export function ballistaShot(player: PlayerState, enemies: readonly UnitState[], tick: number): { player: PlayerState; targetId: string; damage: number; slotId: string } | null {
  if (tick < 3000) return null;
  const slot = player.facilities.find((entry) => entry.kind === 'ballista' && entry.tier > 0 && entry.hp > 0 && entry.nextAttackTick <= tick
    && enemies.some((unit) => unit.hp > 0 && isUnitTargetable(unit, tick) && canDetectBrushOccupant(player.units, unit) && hexDistance({ col: entry.col + 1, row: entry.row + 1 }, unit) <= 5));
  if (!slot) return null;
  const target = enemies.filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick) && canDetectBrushOccupant(player.units, unit) && hexDistance({ col: slot.col + 1, row: slot.row + 1 }, unit) <= 5)
    .sort((a, b) => hexDistance({ col: slot.col + 1, row: slot.row + 1 }, a) - hexDistance({ col: slot.col + 1, row: slot.row + 1 }, b) || a.id.localeCompare(b.id))[0];
  if (!target) return null;
  const damage = Math.round(BALLISTA_DAMAGE[slot.tier] * facilityPotencyBps(player.facilities, slot) / 10000);
  return { player: { ...player, facilities: player.facilities.map((entry) => entry.id === slot.id ? { ...entry, nextAttackTick: tick + 250 } : entry) }, targetId: target.id, damage, slotId: slot.id };
}

export type FacilityAttackEvent = Readonly<{ id: string; tick: number; source: { col: number; row: number }; target: { col: number; row: number }; damage: number }>;
export function advanceBallistaCombat(input: readonly [PlayerState, PlayerState], tick: number, catalog: FixtureCatalog = fixtureCatalog): { players: [PlayerState, PlayerState]; events: FacilityAttackEvent[] } {
  const players = [...input] as [PlayerState, PlayerState];
  const events: FacilityAttackEvent[] = [];
  const damageByTarget = new Map<string, number>();
  for (const side of [0, 1] as const) {
    const enemySide = (1 - side) as 0 | 1;
    for (let shotIndex = 0; shotIndex < 6; shotIndex++) {
      const shot = ballistaShot(players[side], input[enemySide].units, tick);
      if (!shot) break;
      players[side] = shot.player;
      const target = input[enemySide].units.find((unit) => unit.id === shot.targetId)!;
      const targetDefinition = catalog.units.find((unit) => unit.id === target.definitionId)!;
      const armor = Math.round(targetDefinition.defense * combatScaleBps(tick) / 10000);
      const damage = Math.max(1, Math.round(damageAfterArmor(shot.damage, armor) * (input[enemySide].bossBuffs.emperorUntil > tick ? 0.85 : 1) * bastionDamageBps(target, tick, catalog) / 10000));
      damageByTarget.set(target.id, (damageByTarget.get(target.id) ?? 0) + damage);
      const slot = shot.player.facilities.find((entry) => entry.id === shot.slotId)!;
      events.push({ id: `facility:ballista:${tick}:${shot.slotId}`, tick, source: { col: slot.col + 1, row: slot.row + 1 }, target: { col: target.col, row: target.row }, damage });
    }
  }
  for (const side of [0, 1] as const) players[side] = { ...players[side], units: players[side].units.map((unit) => {
    const incoming = damageByTarget.get(unit.id) ?? 0;
    if (incoming === 0) return unit;
    const hp = Math.max(0, unit.hp - incoming);
    return { ...unit, hp, respawnAtTick: hp === 0 ? tick + 300 : null, attackProgressMilli: hp === 0 ? 0 : unit.attackProgressMilli, channelCompleteAtTick: hp === 0 ? null : unit.channelCompleteAtTick, channelTargetId: hp === 0 ? null : unit.channelTargetId, stunnedUntilTick: hp === 0 ? 0 : unit.stunnedUntilTick, lastCombatTick: tick };
  }) };
  return { players, events };
}

export function validateFacilitySlots(player: PlayerState): string[] {
  const expected = createFacilitySlots(player.id);
  const errors: string[] = [];
  if (player.facilities.length !== 6 || new Set(player.facilities.map((slot) => slot.id)).size !== 6) errors.push('Invalid facility slot count or IDs');
  if (!Number.isSafeInteger(player.facilityXpSpent) || player.facilityXpSpent < 0 || player.facilityXpSpent > player.commanderXp) errors.push('Invalid facility XP spending');
  for (const [index, slot] of player.facilities.entries()) {
    const blueprint = expected[index];
    if (!blueprint || slot.id !== blueprint.id || slot.ownerId !== player.id || slot.col !== blueprint.col || slot.row !== blueprint.row || slot.zone !== blueprint.zone || !facilityFootprint(slot).every((point) => getHex(point.col, point.row)?.terrain === 'fortress')) errors.push(`Invalid facility footprint ${slot.id}`);
    if ((slot.kind !== null && slot.kind !== 'caravan-post' && slot.kind !== 'ballista' && slot.kind !== 'arcane-barrier' && slot.kind !== 'sanctuary') || ![0, 1, 2, 3].includes(slot.tier) || !Number.isSafeInteger(slot.hp) || slot.hp < 0 || slot.hp > slot.maxHp || !Number.isSafeInteger(slot.rubbleUntilTick) || slot.rubbleUntilTick < 0 || !Number.isSafeInteger(slot.nextAttackTick) || slot.nextAttackTick < 0) errors.push(`Invalid facility state ${slot.id}`);
    if (slot.kind === 'arcane-barrier' && slot.zone !== 'outer-courtyard') errors.push(`Arcane Barrier must occupy a courtyard slot: ${slot.id}`);
    if (slot.kind === null && (slot.tier !== 0 || slot.hp !== 0 || slot.maxHp !== 0 || slot.pendingTier !== null || slot.readyAtTick !== null)) errors.push(`Invalid empty facility ${slot.id}`);
    if (slot.kind !== null && (slot.maxHp !== FACILITY_HP[slot.tier === 0 ? 1 : slot.tier] || slot.pendingTier !== null && (slot.pendingTier !== slot.tier + 1 || slot.readyAtTick === null) || slot.pendingTier === null && slot.readyAtTick !== null)) errors.push(`Invalid built facility ${slot.id}`);
  }
  for (const category of ['production', 'combat'] as const) if (player.facilities.filter((slot) => slot.kind && facilityCategory(slot.kind) === category).length > 3) errors.push(`Too many ${category} facilities`);
  return errors;
}
