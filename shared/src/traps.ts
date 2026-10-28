import { getHex } from './board.js';
import { damageAfterArmor, isUnitTargetable } from './combat.js';
import { bastionDamageBps } from './items.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { hexDistance } from './pathfinding.js';
import type { PlayerId, PlayerState, UnitState } from './simulation.js';

export const LANDMINE_CARD_ID = 'card:alchemical-landmine';
export const TRAP_CARD_KINDS = {
  [LANDMINE_CARD_ID]: 'landmine',
  'card:spike-chokepoint': 'spike-chokepoint',
  'card:decoy-illusion': 'decoy-illusion',
  'card:ambush-net': 'ambush-net',
  'card:explosive-gas-cloud': 'explosive-gas-cloud',
} as const;
export type TrapCardId = keyof typeof TRAP_CARD_KINDS;
export type TrapKind = typeof TRAP_CARD_KINDS[TrapCardId];
export const TRAP_FUSE_TICKS = 12;
export const LANDMINE_SLOW_TICKS = 50;
export const TRAP_GAS_TICKS = 60;
export const TRAP_GAS_INTERVAL_TICKS = 10;
export const TRAP_GAS_DAMAGE = 35;
export const TRAP_BLAST_RADIUS = 1; // Provisional for traps whose source says area but gives no radius.
export const TRAP_ROOT_TICKS = 40;
export const TRAP_BLIND_TICKS = 40;
export const TRAP_SKILL_DISABLE_TICKS = 80;

export type TrapReveal = Readonly<{ playerId: PlayerId; untilTick: number }>;
export type TrapState = Readonly<{
  id: string;
  kind: TrapKind;
  ownerId: PlayerId;
  col: number;
  row: number;
  placedAtTick: number;
  triggeredAtTick: number | null;
  detonateAtTick: number | null;
  cloudUntilTick: number | null;
  gasDamageAtTick: Readonly<Record<string, number>>;
  revealedTo: readonly TrapReveal[];
}>;
export type TrapEvent = Readonly<{
  id: string;
  tick: number;
  type: 'placed' | 'warning' | 'detonate' | 'slow-applied' | 'slow-expired' | 'root-applied' | 'blind-applied' | 'skills-disabled' | 'gas-damage' | 'cloud-expired' | 'revealed';
  trapId: string;
  kind: TrapKind | null;
  ownerId: PlayerId;
  col: number;
  row: number;
  targetId?: string;
}>;

export function isTrapCardId(cardId: string): cardId is TrapCardId {
  return Object.hasOwn(TRAP_CARD_KINDS, cardId);
}

export function validTrapHex(kind: TrapKind, col: number, row: number): boolean {
  const hex = getHex(col, row);
  if (!hex?.isWalkable) return false;
  if (kind === 'landmine') return ['battlefield', 'west-jungle', 'east-jungle'].includes(hex.zone);
  if (kind === 'spike-chokepoint') return true;
  if (kind === 'ambush-net') return ['battlefield', 'west-jungle', 'east-jungle'].includes(hex.zone);
  if (kind === 'explosive-gas-cloud') return true;
  return true;
}

export function validLandmineHex(col: number, row: number): boolean {
  return validTrapHex('landmine', col, row);
}

export function placeTrap(ownerId: PlayerId, kind: TrapKind, col: number, row: number, tick: number): TrapState {
  return { id: `trap:${kind}:${ownerId}:${tick}`, kind, ownerId, col, row, placedAtTick: tick, triggeredAtTick: null, detonateAtTick: null, cloudUntilTick: null, gasDamageAtTick: {}, revealedTo: [] };
}

export function placeLandmine(ownerId: PlayerId, col: number, row: number, tick: number): TrapState {
  return placeTrap(ownerId, 'landmine', col, row, tick);
}

export type TrapAdvanceResult = Readonly<{ players: [PlayerState, PlayerState]; traps: TrapState[]; events: TrapEvent[] }>;

function event(trap: TrapState, tick: number, type: TrapEvent['type'], targetId?: string): TrapEvent {
  return { id: `trap:${type}:${trap.id}:${tick}${targetId ? `:${targetId}` : ''}`, tick, type, trapId: trap.id, kind: trap.kind, ownerId: trap.ownerId, col: trap.col, row: trap.row, ...(targetId ? { targetId } : {}) };
}

function trapDamage(unit: UnitState, trap: TrapState, tick: number, catalog: FixtureCatalog): number {
  if (trap.kind === 'ambush-net') return 0;
  if (trap.kind === 'spike-chokepoint') return 100; // Armor-piercing per the card source.
  const base = trap.kind === 'decoy-illusion' ? 150 : trap.kind === 'landmine' ? 200 : TRAP_GAS_DAMAGE;
  const definition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
  const resist = definition.magicResist;
  return Math.max(1, Math.round(damageAfterArmor(base, resist) * bastionDamageBps(unit, tick, catalog) / 10000));
}

function applyTrapDamage(players: [PlayerState, PlayerState], trap: TrapState, unit: UnitState, tick: number, catalog: FixtureCatalog): [PlayerState, PlayerState] {
  const side = unit.ownerId === 'player:north' ? 0 : 1;
  const damage = trapDamage(unit, trap, tick, catalog);
  const hp = Math.max(0, unit.hp - damage);
  players[side] = { ...players[side], units: players[side].units.map((entry): UnitState => entry.id === unit.id
    ? { ...entry, hp, respawnAtTick: hp === 0 ? tick + 300 : entry.respawnAtTick, attackProgressMilli: hp === 0 ? 0 : entry.attackProgressMilli, channelCompleteAtTick: hp === 0 ? null : entry.channelCompleteAtTick, channelTargetId: hp === 0 ? null : entry.channelTargetId, snaredUntilTick: hp === 0 ? 0 : entry.snaredUntilTick, slowUntilTick: hp === 0 ? 0 : entry.slowUntilTick, rootedUntilTick: hp === 0 ? 0 : entry.rootedUntilTick, blindedUntilTick: hp === 0 ? 0 : entry.blindedUntilTick, skillsDisabledUntilTick: hp === 0 ? 0 : entry.skillsDisabledUntilTick }
    : entry) };
  return players;
}

function affectBlast(players: [PlayerState, PlayerState], trap: TrapState, tick: number, catalog: FixtureCatalog, events: TrapEvent[]): [PlayerState, PlayerState] {
  const enemySide = trap.ownerId === 'player:north' ? 1 : 0;
  const enemy = players[enemySide];
  const candidates = enemy.units.filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick) && hexDistance(unit, trap) <= TRAP_BLAST_RADIUS);
  const targets = trap.kind === 'spike-chokepoint' ? candidates.slice(0, 3) : candidates;
  for (const unit of targets) {
    players = applyTrapDamage(players, trap, unit, tick, catalog);
    const updated = players[enemySide].units.find((entry) => entry.id === unit.id)!;
    if (updated.hp <= 0) continue;
    if (trap.kind === 'landmine') {
      players[enemySide] = { ...players[enemySide], units: players[enemySide].units.map((entry) => entry.id === unit.id ? { ...entry, slowUntilTick: tick + LANDMINE_SLOW_TICKS } : entry) };
      events.push(event(trap, tick, 'slow-applied', unit.id));
    } else if (trap.kind === 'spike-chokepoint') {
      players[enemySide] = { ...players[enemySide], units: players[enemySide].units.map((entry) => entry.id === unit.id ? { ...entry, rootedUntilTick: tick + TRAP_ROOT_TICKS } : entry) };
      events.push(event(trap, tick, 'root-applied', unit.id));
    } else if (trap.kind === 'decoy-illusion') {
      players[enemySide] = { ...players[enemySide], units: players[enemySide].units.map((entry) => entry.id === unit.id ? { ...entry, blindedUntilTick: tick + TRAP_BLIND_TICKS } : entry) };
      events.push(event(trap, tick, 'blind-applied', unit.id));
    } else if (trap.kind === 'ambush-net' && ['assassin', 'marksman'].includes(catalog.units.find((definition) => definition.id === unit.definitionId)!.role)) {
      players[enemySide] = { ...players[enemySide], units: players[enemySide].units.map((entry) => entry.id === unit.id ? { ...entry, skillsDisabledUntilTick: tick + TRAP_SKILL_DISABLE_TICKS } : entry) };
      const ownerSide = trap.ownerId === 'player:north' ? 0 : 1;
      players[ownerSide] = { ...players[ownerSide], trapRevealedUnits: [
        ...players[ownerSide].trapRevealedUnits.filter((entry) => entry.unitId !== unit.id),
        { unitId: unit.id, untilTick: tick + TRAP_SKILL_DISABLE_TICKS },
      ] };
      events.push(event(trap, tick, 'skills-disabled', unit.id));
    }
  }
  return players;
}

/** Trigger on enemy entry, hold the triggering unit during the fuse, then resolve the trap's fixture effect. */
export function advanceTraps(beforeMovement: readonly [PlayerState, PlayerState], afterMovement: readonly [PlayerState, PlayerState], previous: readonly TrapState[], tick: number, catalog: FixtureCatalog = fixtureCatalog): TrapAdvanceResult {
  let players = [...afterMovement] as [PlayerState, PlayerState];
  const events: TrapEvent[] = [];
  for (const player of players) for (const unit of player.units) if (unit.hp > 0 && unit.slowUntilTick === tick) {
    events.push({ id: `trap:slow-expired:${tick}:${unit.id}`, tick, type: 'slow-expired', trapId: '', kind: null, ownerId: player.id, col: unit.col, row: unit.row });
  }
  const traps: TrapState[] = [];
  for (const incomingTrap of previous) {
    const previousTrap = { ...incomingTrap, revealedTo: incomingTrap.revealedTo.filter((entry) => entry.untilTick > tick) };
    if (previousTrap.cloudUntilTick !== null) {
      if (tick >= previousTrap.cloudUntilTick) {
        events.push(event(previousTrap, tick, 'cloud-expired'));
        continue;
      }
      let trap = previousTrap;
      const enemySide = trap.ownerId === 'player:north' ? 1 : 0;
      const hits = { ...trap.gasDamageAtTick };
      for (const unit of players[enemySide].units) {
        if (unit.hp <= 0 || !isUnitTargetable(unit, tick) || hexDistance(unit, trap) > TRAP_BLAST_RADIUS) continue;
        const lastHit = hits[unit.id] ?? (trap.detonateAtTick ?? tick);
        if (tick - lastHit < TRAP_GAS_INTERVAL_TICKS) continue;
        players = applyTrapDamage(players, trap, unit, tick, catalog);
        hits[unit.id] = tick;
        events.push(event(trap, tick, 'gas-damage', unit.id));
      }
      trap = { ...trap, gasDamageAtTick: hits };
      traps.push(trap);
      continue;
    }
    if (previousTrap.triggeredAtTick === null) {
      const unit = players.flatMap((player) => player.units).find((candidate) => {
        if (candidate.ownerId === previousTrap.ownerId || candidate.hp <= 0 || candidate.col !== previousTrap.col || candidate.row !== previousTrap.row) return false;
        const prior = beforeMovement.flatMap((player) => player.units).find((entry) => entry.id === candidate.id);
        return prior && (prior.col !== candidate.col || prior.row !== candidate.row);
      });
      if (!unit) { traps.push(previousTrap); continue; }
      const side = unit.ownerId === 'player:north' ? 0 : 1;
      players[side] = { ...players[side], units: players[side].units.map((entry): UnitState => entry.id === unit.id ? { ...entry, snaredUntilTick: tick + TRAP_FUSE_TICKS + 1 } : entry) };
      const armed = { ...previousTrap, triggeredAtTick: tick, detonateAtTick: tick + TRAP_FUSE_TICKS };
      traps.push(armed);
      events.push(event(armed, tick, 'warning'));
      continue;
    }
    if (previousTrap.detonateAtTick! > tick) { traps.push(previousTrap); continue; }
    events.push(event(previousTrap, tick, 'detonate'));
    if (previousTrap.kind === 'explosive-gas-cloud') {
      traps.push({ ...previousTrap, cloudUntilTick: tick + TRAP_GAS_TICKS + 1, gasDamageAtTick: {} });
      continue;
    }
    players = affectBlast(players, previousTrap, tick, catalog, events);
  }
  return { players, traps, events };
}

export function validateTraps(traps: readonly TrapState[], tick: number): string[] {
  const errors: string[] = [];
  if (new Set(traps.map((trap) => trap.id)).size !== traps.length) errors.push('Duplicate trap ID');
  for (const trap of traps) {
    const validKind = Object.values(TRAP_CARD_KINDS).includes(trap.kind);
    const validTimes = Number.isSafeInteger(trap.placedAtTick) && trap.placedAtTick > 0 && trap.placedAtTick <= tick
      && ((trap.triggeredAtTick === null && trap.detonateAtTick === null && trap.cloudUntilTick === null)
        || (trap.triggeredAtTick !== null && trap.detonateAtTick === trap.triggeredAtTick + TRAP_FUSE_TICKS
          && trap.triggeredAtTick >= trap.placedAtTick && trap.detonateAtTick <= tick
          && (trap.kind === 'explosive-gas-cloud' ? trap.cloudUntilTick !== null && trap.cloudUntilTick > tick : trap.cloudUntilTick === null)));
    const validOwner = trap.ownerId === 'player:north' || trap.ownerId === 'player:south';
    if (!validKind || !validTrapHex(trap.kind, trap.col, trap.row) || !validTimes || !validOwner
      || !trap.gasDamageAtTick || Object.values(trap.gasDamageAtTick).some((value) => !Number.isSafeInteger(value) || value < 0)
      || trap.revealedTo.some((reveal) => !validOwner || !Number.isSafeInteger(reveal.untilTick) || reveal.untilTick <= tick)) errors.push(`Invalid trap ${trap.id}`);
  }
  return errors;
}
