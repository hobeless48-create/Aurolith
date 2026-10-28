import { BOARD_COLUMNS, BOARD_ROWS, CASTLE_FIRST_COLUMN, CASTLE_LAST_COLUMN, getHex, hexNeighbors } from './board.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { hexDistance, type HexPoint } from './pathfinding.js';
import type { CardCastEvent, MatchState, OutriderAlertEvent, PlayerId, UnitState } from './simulation.js';
import type { MonsterState } from './camp.js';
import type { CombatEvent } from './combat.js';
import type { FacilityAttackEvent } from './facilities.js';
import { breachedWallHexes, corePoint, type WallState } from './structures.js';
import { tileId } from './board.js';
import { BOSS_DEFINITIONS } from './bosses.js';
import type { BossCombatEvent } from './bosses.js';
import type { TrapEvent, TrapState } from './traps.js';
import type { ItemEvent } from './items.js';
import { canDetectBrushOccupant } from './concealment.js';
import { hasLineOfSight } from './line-of-sight.js';
export { hasLineOfSight } from './line-of-sight.js';

export type Visibility = 0 | 1 | 2;
export type VisionMask = Uint8Array;
export type VisibleCardCastEvent = Readonly<{ tick: number; ownerId: PlayerId; cardId: string; targets: readonly HexPoint[] }>;

/** Enemy card cues require both live sight and a unit the viewer may identify. */
export function projectCardCastEvents(events: readonly CardCastEvent[], viewerId: PlayerId, mask: VisionMask, visibleEnemyUnitIds: ReadonlySet<string> = new Set()): VisibleCardCastEvent[] {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  return events.flatMap((event) => {
    const targets = event.targets.filter((target) => mask[indexOf(target)] === 2
      && (event.ownerId === viewerId || target.unitId !== null && visibleEnemyUnitIds.has(target.unitId)))
      .map(({ col, row }) => ({ col, row }));
    return targets.length ? [{ tick: event.tick, ownerId: event.ownerId, cardId: event.cardId, targets }] : [];
  });
}

export type VisibleCombatEvent = Readonly<{ tick: number; type: CombatEvent['type']; skillId: CombatEvent['skillId']; sourceId: string | null; targetId: string | null; source: HexPoint | null; target: HexPoint | null }>;

export type VisibleBossCombatEvent = BossCombatEvent;
/** Boss hit/ability/summon cues are projected only when their event hex is currently visible. */
export function projectBossCombatEvents(events: readonly BossCombatEvent[], mask: VisionMask): VisibleBossCombatEvent[] {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  return events.filter((event) => mask[indexOf(event)] === 2);
}

/** Project transient combat cues only for units the viewer can actually detect. */
export function projectCombatEvents(events: readonly CombatEvent[], mask: VisionMask, visibleUnitIds: ReadonlySet<string>): VisibleCombatEvent[] {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  return events.flatMap((event) => {
    const source = mask[indexOf(event.source)] === 2 && visibleUnitIds.has(event.sourceId) ? event.source : null;
    const target = mask[indexOf(event.target)] === 2 && visibleUnitIds.has(event.targetId) ? event.target : null;
    return source || target ? [{ tick: event.tick, type: event.type, skillId: event.skillId, sourceId: source ? event.sourceId : null, targetId: target ? event.targetId : null, source, target }] : [];
  });
}
export type VisibleOutriderAlertEvent = Readonly<{ id: string; tick: number; col: number; row: number }>;
/** The scouting player owns this signal: the alert is created only when their Outrider directly detects the ambusher. */
export function projectOutriderAlertEvents(events: readonly OutriderAlertEvent[], viewerId: PlayerId): VisibleOutriderAlertEvent[] {
  return events.filter((event) => event.ownerId === viewerId).map(({ id, tick, col, row }) => ({ id, tick, col, row }));
}
export type VisibleFacilityAttackEvent = Readonly<{ tick: number; source: HexPoint | null; target: HexPoint | null; damage: number | null }>;
export function projectFacilityAttackEvents(events: readonly FacilityAttackEvent[], mask: VisionMask): VisibleFacilityAttackEvent[] {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  return events.flatMap((event) => {
    const source = mask[indexOf(event.source)] === 2 ? event.source : null;
    const target = mask[indexOf(event.target)] === 2 ? event.target : null;
    return source || target ? [{ tick: event.tick, source, target, damage: target ? event.damage : null }] : [];
  });
}
export type VisibleTrapEvent = Readonly<{ tick: number; type: TrapEvent['type']; col: number; row: number }>;
export function projectTrapEvents(events: readonly TrapEvent[], viewerId: PlayerId, mask: VisionMask): VisibleTrapEvent[] {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  return events.flatMap((event) => event.ownerId === viewerId || event.type !== 'placed' && mask[indexOf(event)] === 2
    ? [{ tick: event.tick, type: event.type, col: event.col, row: event.row }] : []);
}
export type VisibleItemEvent = Readonly<{ tick: number; type: ItemEvent['type']; col: number; row: number }>;
export function projectItemEvents(events: readonly ItemEvent[], viewerId: PlayerId, mask: VisionMask): VisibleItemEvent[] {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  return events.flatMap((event) => event.ownerId === viewerId || mask[indexOf(event)] === 2
    ? [{ tick: event.tick, type: event.type, col: event.col, row: event.row }] : []);
}
export type PlayerViewState = Readonly<{
  tick: number;
  phase: MatchState['phase'];
  own: MatchState['players'][number];
  enemy: Readonly<{ id: PlayerId; visibleUnits: readonly UnitState[] }>;
  neutral: Readonly<{ visibleMonsters: readonly MonsterState[]; visibleCampRespawns: readonly Readonly<{ campId: string; respawnAtTick: number | null }>[]; visibleBosses: readonly Readonly<{ id: string; col: number; row: number; hp: number; maxHp: number; relicUnclaimed: boolean }>[]; bossWarnings: readonly Readonly<{ id: string; col: number; row: number; spawnTick: number }>[] }>;
  traps: Readonly<{ friendly: readonly TrapState[]; visibleEnemy: readonly TrapState[]; decoys: readonly HexPoint[] }>;
  structures: Readonly<{ friendlyWalls: readonly WallState[]; visibleEnemyWalls: readonly WallState[]; friendlyFacilities: MatchState['players'][number]['facilities']; visibleEnemyFacilities: MatchState['players'][number]['facilities']; visibleCores: readonly Readonly<{ ownerId: PlayerId; col: number; row: number; hp: number }>[] }>;
  visibleTerrain: readonly Readonly<{ col: number; row: number; terrain: string; visibility: 1 | 2 }>[];
  result: MatchState['result'];
}>;

function indexOf(point: HexPoint): number { return point.row * BOARD_COLUMNS + point.col; }

function revealFrom(mask: VisionMask, origin: HexPoint, radius: number, breached: ReadonlySet<string>): void {
  for (let row = Math.max(0, origin.row - radius); row <= Math.min(BOARD_ROWS - 1, origin.row + radius); row++) {
    for (let col = Math.max(0, origin.col - radius); col <= Math.min(BOARD_COLUMNS - 1, origin.col + radius); col++) {
      const point = { col, row };
      if (hexDistance(origin, point) <= radius && hasLineOfSight(origin, point, breached)) mask[indexOf(point)] = 2;
    }
  }
}

function cube(point: HexPoint): { x: number; y: number; z: number } {
  const x = point.col - (point.row - (point.row & 1)) / 2;
  return { x, y: -x - point.row, z: point.row };
}

function revealOutrider(mask: VisionMask, scout: UnitState, anchor: HexPoint, target: HexPoint, breached: ReadonlySet<string>): void {
  const origin = cube(scout);
  const start = cube(anchor);
  const end = cube(target);
  const forward = { x: end.x - start.x, y: end.y - start.y, z: end.z - start.z };
  const magnitude = Math.max(1, Math.abs(forward.x), Math.abs(forward.y), Math.abs(forward.z));
  for (let row = Math.max(0, scout.row - 6); row <= Math.min(BOARD_ROWS - 1, scout.row + 6); row++) {
    for (let col = Math.max(0, scout.col - 6); col <= Math.min(BOARD_COLUMNS - 1, scout.col + 6); col++) {
      const point = { col, row };
      if (hexDistance(scout, point) > 6) continue;
      const cell = cube(point);
      const vector = { x: cell.x - origin.x, y: cell.y - origin.y, z: cell.z - origin.z };
      if (vector.x * forward.x + vector.y * forward.y + vector.z * forward.z < magnitude) continue;
      if (hasLineOfSight(scout, point, breached)) mask[indexOf(point)] = 2;
    }
  }
}

function onStandingRampart(unit: UnitState, walls: readonly WallState[]): boolean {
  if (getHex(unit.col, unit.row)?.zone !== (unit.ownerId === 'player:north' ? 'north-castle' : 'south-castle')) return false;
  const adjacent = new Set(hexNeighbors(unit.col, unit.row).map((point) => tileId(point.col, point.row)));
  return walls.some((wall) => wall.ownerId === unit.ownerId && wall.hp > 0
    && Array.from({ length: wall.width }, (_, offset) => tileId(wall.col + offset, wall.row)).some((id) => adjacent.has(id)));
}

export function visionRadiusForUnit(unit: UnitState, walls: readonly WallState[], catalog: FixtureCatalog = fixtureCatalog): number {
  const role = catalog.units.find((entry) => entry.id === unit.definitionId)?.role;
  if (role === 'marksman' && onStandingRampart(unit, walls)) return 6;
  const zone = getHex(unit.col, unit.row)?.zone;
  return (zone === 'west-jungle' || zone === 'east-jungle') && role !== 'assassin' ? 2 : 4;
}

export function computeVision(state: MatchState, viewerId: PlayerId, explored?: VisionMask, catalog: FixtureCatalog = fixtureCatalog): VisionMask {
  const mask = new Uint8Array(BOARD_COLUMNS * BOARD_ROWS);
  if (explored) {
    if (explored.length !== mask.length) throw new Error('Vision mask has wrong board size');
    for (let index = 0; index < mask.length; index++) if (explored[index]) mask[index] = 1;
  }
  const player = state.players.find((entry) => entry.id === viewerId);
  if (!player) throw new Error('Unknown viewer');
  // The home fortress and a ten-row front with ten-column side warning strips stay visible.
  const isNorth = viewerId === 'player:north';
  for (let row = isNorth ? 0 : 70; row <= (isNorth ? 19 : BOARD_ROWS - 1); row++)
    for (let col = CASTLE_FIRST_COLUMN; col <= CASTLE_LAST_COLUMN; col++) mask[indexOf({ col, row })] = 2;
  for (let row = isNorth ? 20 : 60; row <= (isNorth ? 29 : 69); row++)
    for (let col = CASTLE_FIRST_COLUMN - 10; col <= CASTLE_LAST_COLUMN + 10; col++) mask[indexOf({ col, row })] = 2;
  const breached = breachedWallHexes(state.walls);
  const elevatedPassage = new Set(breached);
  for (const wall of state.walls) if (wall.ownerId === viewerId && wall.hp > 0)
    for (let col = wall.col; col < wall.col + wall.width; col++) elevatedPassage.add(tileId(col, wall.row));
  for (const unit of player.units) {
    if (unit.hp <= 0) continue;
    const radius = visionRadiusForUnit(unit, state.walls, catalog);
    revealFrom(mask, unit, radius, radius === 6 ? elevatedPassage : breached);
  }
  const opponent = state.players.find((entry) => entry.id !== viewerId)!;
  for (const reveal of player.trapRevealedUnits) {
    if (reveal.untilTick <= state.tick) continue;
    const unit = opponent.units.find((entry) => entry.id === reveal.unitId && entry.hp > 0);
    if (unit) revealFrom(mask, unit, 0, breached);
  }
  for (const area of player.reconAreas) if (area.visionUntilTick > state.tick) revealFrom(mask, area, 12, breached);
  const enemyCore = viewerId === 'player:north' ? { col: 75, row: 77 } : { col: 75, row: 12 };
  for (const platoon of player.platoons.filter((entry) => entry.macro === 'outrider' && !entry.order)) {
    const scout = player.units.find((unit) => unit.hp > 0 && unit.platoonId === platoon.id && catalog.units.find((definition) => definition.id === unit.definitionId)?.role === 'assassin');
    if (scout) revealOutrider(mask, scout, platoon.anchor, enemyCore, breached);
  }
  if (player.bossBuffs.eyesRevealUntil > state.tick) {
    const northCourtyard = viewerId === 'player:south';
    for (let row = northCourtyard ? 0 : 70; row <= (northCourtyard ? 19 : 89); row++)
      for (let col = CASTLE_FIRST_COLUMN; col <= CASTLE_LAST_COLUMN; col++) mask[indexOf({ col, row })] = 2;
  }
  return mask;
}

/** Only view data may cross a player transport boundary. */
export function projectPlayerView(state: MatchState, viewerId: PlayerId, mask: VisionMask, catalog: FixtureCatalog = fixtureCatalog): PlayerViewState {
  if (mask.length !== BOARD_COLUMNS * BOARD_ROWS) throw new Error('Vision mask has wrong board size');
  const own = state.players.find((player) => player.id === viewerId);
  const opponent = state.players.find((player) => player.id !== viewerId);
  if (!own || !opponent) throw new Error('Invalid player view');
  const visibleTerrain: { col: number; row: number; terrain: string; visibility: 1 | 2 }[] = [];
  const breached = breachedWallHexes(state.walls);
  for (let index = 0; index < mask.length; index++) {
    if (mask[index] === 0) continue;
    const col = index % BOARD_COLUMNS;
    const row = Math.floor(index / BOARD_COLUMNS);
    visibleTerrain.push({ col, row, terrain: mask[index] === 2 && breached.has(tileId(col, row)) ? 'rubble' : getHex(col, row)!.terrain, visibility: mask[index] as 1 | 2 });
  }
  return {
    tick: state.tick,
    phase: state.phase,
    own,
    enemy: { id: opponent.id, visibleUnits: opponent.units.filter((unit) => unit.hp > 0 && mask[indexOf(unit)] === 2
      && (canDetectBrushOccupant(own.units, unit, catalog) || own.trapRevealedUnits.some((entry) => entry.unitId === unit.id && entry.untilTick > state.tick))) },
    neutral: {
      visibleMonsters: [...state.camps.flatMap((camp) => camp.monsters.filter((monster) => monster.hp > 0 && mask[indexOf(monster)] === 2)), ...state.bosses.flatMap((boss) => boss.minions.filter((minion) => minion.hp > 0 && mask[indexOf(minion)] === 2))],
      visibleBosses: state.bosses.filter((boss) => boss.spawnedAtTick !== null && mask[indexOf(boss)] === 2).map((boss) => ({ id: boss.id, col: boss.col, row: boss.row, hp: boss.hp, maxHp: BOSS_DEFINITIONS.find((definition) => definition.id === boss.id)!.hp, relicUnclaimed: !!boss.relic && !boss.relic.claimedBy })),
      bossWarnings: BOSS_DEFINITIONS.filter((boss) => state.tick >= boss.spawnTick - 300 && state.tick < boss.spawnTick).map((boss) => ({ id: boss.id, col: boss.col, row: boss.row, spawnTick: boss.spawnTick })),
      visibleCampRespawns: state.camps.flatMap((camp) => {
        const definition = catalog.camps.find((entry) => entry.id === camp.id)!;
        return mask[indexOf({ col: definition.col, row: definition.row })] === 2 ? [{ campId: camp.id, respawnAtTick: camp.respawnAtTick }] : [];
      }),
    },
    traps: {
      friendly: state.traps.filter((trap) => trap.ownerId === viewerId),
      visibleEnemy: state.traps.filter((trap) => trap.ownerId !== viewerId && (trap.revealedTo.some((entry) => entry.playerId === viewerId && entry.untilTick > state.tick) || trap.triggeredAtTick !== null && mask[indexOf(trap)] === 2)),
      // A live Decoy Illusion is projected only as its fake unit silhouette while in sight.
      decoys: state.traps.filter((trap) => trap.ownerId !== viewerId && trap.kind === 'decoy-illusion' && trap.triggeredAtTick === null && mask[indexOf(trap)] === 2).map(({ col, row }) => ({ col, row })),
    },
    structures: {
      friendlyWalls: state.walls.filter((wall) => wall.ownerId === viewerId),
      visibleEnemyWalls: state.walls.filter((wall) => wall.ownerId !== viewerId && Array.from({ length: wall.width }, (_, offset) => mask[indexOf({ col: wall.col + offset, row: wall.row })] === 2).some(Boolean)),
      friendlyFacilities: own.facilities,
      visibleEnemyFacilities: opponent.facilities.filter((slot) => (slot.kind || slot.rubbleUntilTick > state.tick)
        && Array.from({ length: 9 }, (_, index) => mask[indexOf({ col: slot.col + index % 3, row: slot.row + Math.floor(index / 3) })] === 2).some(Boolean)),
      visibleCores: state.players.filter((player) => player.id === viewerId || mask[indexOf(corePoint(player.id))] === 2).map((player) => ({ ownerId: player.id, ...corePoint(player.id), hp: player.coreHp })),
    },
    visibleTerrain,
    result: state.result,
  };
}
