import { getHex } from './board.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import type { PlayerId, PlayerState, UnitState } from './simulation.js';

export type MaterialName = 'Gilded Ore' | 'Ironwood Timber';
export type ItemId = 'item:executioners-claw' | 'item:bastion-plate';
export type ItemDefinition = Readonly<{ id: ItemId; name: string; recipe: readonly [MaterialName, MaterialName]; roles: readonly string[]; attackBonus: number; hpBonus: number; summary: string }>;
export const ITEM_FIXTURES: readonly ItemDefinition[] = [
  { id: 'item:executioners-claw', name: "Executioner's Claw", recipe: ['Gilded Ore', 'Gilded Ore'], roles: ['fighter', 'marksman', 'assassin'], attackBonus: 28, hpBonus: 0, summary: '+28 ATK; +20% damage to enemies below 30% HP' },
  { id: 'item:bastion-plate', name: 'Bastion Plate', recipe: ['Gilded Ore', 'Ironwood Timber'], roles: ['fighter', 'tanker', 'assassin'], attackBonus: 20, hpBonus: 300, summary: '+20 ATK, +300 HP; 10% less damage above 70% HP' },
];
export const BAZAAR_COMMON_PRICE_MILLI = 150000;
export const CRAFT_COST_MILLI = 30000;
export const CRAFT_TICKS = 100;
export const FIELD_EQUIP_TICKS = 80;

export type CraftJob = Readonly<{ unitId: string; itemId: ItemId; col: number; row: number; startedAtTick: number; readyAtTick: number }>;
export type EquipJob = Readonly<{ unitId: string; itemId: ItemId; col: number; row: number; startedAtTick: number; readyAtTick: number }>;
export type ItemEvent = Readonly<{ id: string; tick: number; type: 'craft-start' | 'craft-complete' | 'craft-cancel' | 'equip-start' | 'equip-complete' | 'equip-cancel'; ownerId: PlayerId; unitId: string; itemId: ItemId; col: number; row: number }>;

export function itemDefinition(id: string): ItemDefinition | null { return ITEM_FIXTURES.find((item) => item.id === id) ?? null; }
export function itemAttackBonus(unit: UnitState): number { return itemDefinition(unit.equippedItemId ?? '')?.attackBonus ?? 0; }
export function itemHpBonus(unit: UnitState): number { return itemDefinition(unit.equippedItemId ?? '')?.hpBonus ?? 0; }
export function executionBonusBps(unit: UnitState, targetHp: number, targetMaxHp: number): number {
  return unit.equippedItemId === 'item:executioners-claw' && targetHp * 10 < targetMaxHp * 3 ? 12000 : 10000;
}
export function bastionDamageBps(unit: UnitState, tick: number, catalog: FixtureCatalog = fixtureCatalog): number {
  if (unit.equippedItemId !== 'item:bastion-plate') return 10000;
  const definition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
  const levelBps = unit.level === 3 ? 12000 : unit.level === 2 ? 11000 : 10000;
  const scaledHp = Math.round(definition.hp * (10000 + 1000 * Math.min(6, Math.floor(tick / 1500))) * levelBps / 100000000) + 300;
  return unit.hp * 10 > scaledHp * 7 ? 9000 : 10000;
}

export function resourceStation(ownerId: PlayerId): { col: number; row: number } { return { col: 75, row: ownerId === 'player:north' ? 12 : 77 }; }
export function isSafeEquipHex(ownerId: PlayerId, unit: UnitState): boolean {
  const hex = getHex(unit.col, unit.row);
  return !!hex && hex.terrain === 'fortress' && (ownerId === 'player:north' ? hex.zone === 'north-castle' && unit.row < 8 : hex.zone === 'south-castle' && unit.row > 81);
}

function makeEvent(type: ItemEvent['type'], player: PlayerState, unit: UnitState, itemId: ItemId, tick: number): ItemEvent {
  return { id: `item:${type}:${player.id}:${unit.id}:${tick}`, tick, type, ownerId: player.id, unitId: unit.id, itemId, col: unit.col, row: unit.row };
}

export function buyMaterial(player: PlayerState, material: MaterialName): { player: PlayerState; error: string | null } {
  if (player.goldMilli < BAZAAR_COMMON_PRICE_MILLI) return { player, error: 'Insufficient gold for Bazaar material' };
  return { player: { ...player, goldMilli: player.goldMilli - BAZAAR_COMMON_PRICE_MILLI, materials: { ...player.materials, [material]: (player.materials[material] ?? 0) + 1 } }, error: null };
}

export function beginCraft(player: PlayerState, itemId: ItemId, unitId: string, tick: number): { player: PlayerState; event: ItemEvent | null; error: string | null } {
  const definition = itemDefinition(itemId);
  const unit = player.units.find((entry) => entry.id === unitId && entry.hp > 0);
  if (!definition) return { player, event: null, error: 'Unknown item recipe' };
  if (!unit) return { player, event: null, error: 'Crafter must be an alive friendly unit' };
  const station = resourceStation(player.id);
  if (unit.col !== station.col || unit.row !== station.row) return { player, event: null, error: 'Crafter must stand at the friendly Resource Tab' };
  if (player.craftJobs.some((job) => job.unitId === unit.id) || player.equipJobs.some((job) => job.unitId === unit.id)) return { player, event: null, error: 'Unit is already channeling' };
  const required = definition.recipe.reduce<Record<string, number>>((count, material) => ({ ...count, [material]: (count[material] ?? 0) + 1 }), {});
  if (Object.entries(required).some(([material, count]) => (player.materials[material] ?? 0) < count)) return { player, event: null, error: 'Missing recipe materials' };
  if (player.goldMilli < CRAFT_COST_MILLI) return { player, event: null, error: 'Insufficient gold to craft' };
  const materials = { ...player.materials };
  for (const [material, count] of Object.entries(required)) materials[material] -= count;
  const job: CraftJob = { unitId, itemId, col: unit.col, row: unit.row, startedAtTick: tick, readyAtTick: tick + CRAFT_TICKS };
  return { player: { ...player, goldMilli: player.goldMilli - CRAFT_COST_MILLI, materials, craftJobs: [...player.craftJobs, job] }, event: makeEvent('craft-start', player, unit, itemId, tick), error: null };
}

export function beginEquip(player: PlayerState, itemId: ItemId, unitId: string, tick: number, catalog: FixtureCatalog = fixtureCatalog): { player: PlayerState; event: ItemEvent | null; error: string | null } {
  const definition = itemDefinition(itemId);
  const unit = player.units.find((entry) => entry.id === unitId && entry.hp > 0);
  if (!definition) return { player, event: null, error: 'Unknown item' };
  if (!unit) return { player, event: null, error: 'Recipient must be an alive friendly unit' };
  if (!definition.roles.includes(catalog.units.find((entry) => entry.id === unit.definitionId)!.role)) return { player, event: null, error: 'Item is incompatible with this class' };
  if (unit.equippedItemId) return { player, event: null, error: 'Unit already holds an item' };
  if (player.craftJobs.some((job) => job.unitId === unit.id) || player.equipJobs.some((job) => job.unitId === unit.id)) return { player, event: null, error: 'Unit is already channeling' };
  if ((player.arsenal[itemId] ?? 0) < 1) return { player, event: null, error: 'Item is not in the Arsenal' };
  const arsenal = { ...player.arsenal, [itemId]: player.arsenal[itemId] - 1 };
  if (isSafeEquipHex(player.id, unit)) {
    return { player: { ...player, arsenal, units: player.units.map((entry) => entry.id === unit.id ? { ...entry, equippedItemId: itemId, hp: entry.hp + definition.hpBonus } : entry) }, event: makeEvent('equip-complete', player, unit, itemId, tick), error: null };
  }
  const job: EquipJob = { unitId, itemId, col: unit.col, row: unit.row, startedAtTick: tick, readyAtTick: tick + FIELD_EQUIP_TICKS };
  return { player: { ...player, arsenal, equipJobs: [...player.equipJobs, job] }, event: makeEvent('equip-start', player, unit, itemId, tick), error: null };
}

/** Channels are interrupted by movement, death, or any attack/damage during the channel. */
export function progressItemChannels(player: PlayerState, tick: number): { player: PlayerState; events: ItemEvent[] } {
  let next = player;
  const events: ItemEvent[] = [];
  const craftJobs: CraftJob[] = [];
  for (const job of player.craftJobs) {
    const unit = next.units.find((entry) => entry.id === job.unitId);
    const interrupted = !unit || unit.hp <= 0 || unit.col !== job.col || unit.row !== job.row || unit.lastCombatTick >= job.startedAtTick;
    if (interrupted) {
      const definition = itemDefinition(job.itemId)!;
      const materials = { ...next.materials };
      for (const material of definition.recipe) materials[material] = (materials[material] ?? 0) + 1;
      next = { ...next, materials, goldMilli: next.goldMilli + CRAFT_COST_MILLI };
      if (unit) events.push(makeEvent('craft-cancel', next, unit, job.itemId, tick));
    } else if (tick >= job.readyAtTick) {
      next = { ...next, arsenal: { ...next.arsenal, [job.itemId]: (next.arsenal[job.itemId] ?? 0) + 1 } };
      events.push(makeEvent('craft-complete', next, unit, job.itemId, tick));
    } else craftJobs.push(job);
  }
  next = { ...next, craftJobs };
  const equipJobs: EquipJob[] = [];
  for (const job of player.equipJobs) {
    const unit = next.units.find((entry) => entry.id === job.unitId);
    const interrupted = !unit || unit.hp <= 0 || unit.col !== job.col || unit.row !== job.row || unit.lastCombatTick >= job.startedAtTick;
    if (interrupted) {
      next = { ...next, arsenal: { ...next.arsenal, [job.itemId]: (next.arsenal[job.itemId] ?? 0) + 1 } };
      if (unit) events.push(makeEvent('equip-cancel', next, unit, job.itemId, tick));
    } else if (tick >= job.readyAtTick) {
      const definition = itemDefinition(job.itemId)!;
      next = { ...next, units: next.units.map((entry) => entry.id === unit.id ? { ...entry, equippedItemId: job.itemId, hp: entry.hp + definition.hpBonus } : entry) };
      events.push(makeEvent('equip-complete', next, unit, job.itemId, tick));
    } else equipJobs.push(job);
  }
  return { player: { ...next, equipJobs }, events };
}

export function validateItemState(player: PlayerState, tick: number, catalog: FixtureCatalog = fixtureCatalog): string[] {
  const errors: string[] = [];
  if (Object.entries(player.arsenal).some(([id, count]) => !itemDefinition(id) || !Number.isSafeInteger(count) || count < 0)) errors.push('Invalid Arsenal');
  const activeUnits = new Set<string>();
  for (const job of [...player.craftJobs, ...player.equipJobs]) {
    if (!player.units.some((unit) => unit.id === job.unitId) || !itemDefinition(job.itemId) || job.startedAtTick < 1 || job.readyAtTick <= tick || activeUnits.has(job.unitId)) errors.push(`Invalid item channel ${job.unitId}`);
    activeUnits.add(job.unitId);
  }
  for (const unit of player.units) if (unit.equippedItemId && (!itemDefinition(unit.equippedItemId) || !itemDefinition(unit.equippedItemId)!.roles.includes(catalog.units.find((entry) => entry.id === unit.definitionId)?.role ?? ''))) errors.push(`Invalid equipment on ${unit.id}`);
  return errors;
}
