import { getHex, NORTH_INNER_WALL_ROW, SOUTH_INNER_WALL_ROW, tileId } from './board.js';
import { combatScaleBps, criticalAttack } from './combat.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { hexDistance, type HexPoint } from './pathfinding.js';
import { damageFacility, distanceToFacility, facilityPotencyBps, type FacilityAttackEvent } from './facilities.js';
import { itemAttackBonus } from './items.js';
import type { MatchResult, PlayerId, PlayerState, UnitState } from './simulation.js';

export type WallState = Readonly<{ id: string; ownerId: PlayerId; layer: 'outer' | 'inner'; col: number; row: number; width: 6; hp: number; maxHp: number; resistanceBps: number; contactTicks: number; absenceTicks: number }>;
const NORTH_SEGMENT_STARTS = [62, 52, 68, 77, 84] as const;
const INNER_WALL_HP = 4500;

function wallState(id: string, ownerId: PlayerId, layer: WallState['layer'], col: number, row: number, hp: number): WallState {
  return { id, ownerId, layer, col, row, width: 6, hp, maxHp: hp, resistanceBps: 7000, contactTicks: 0, absenceTicks: 0 };
}

/** Five discrete breachable front segments per castle, mirrored by 180° rotation. */
export function createOuterWalls(catalog: FixtureCatalog = fixtureCatalog): WallState[] {
  return NORTH_SEGMENT_STARTS.flatMap((northCol, index): WallState[] => [
    wallState(index === 0 ? catalog.wall.id : `wall:north:outer:${index + 1}`, 'player:north', 'outer', northCol, 19, catalog.wall.hp),
    wallState(`wall:south:outer:${index + 1}`, 'player:south', 'outer', 149 - (northCol + 5), 70, catalog.wall.hp),
  ]);
}

export function createInnerWalls(): WallState[] {
  return NORTH_SEGMENT_STARTS.flatMap((northCol, index): WallState[] => [
    wallState(`wall:north:inner:${index + 1}`, 'player:north', 'inner', northCol, NORTH_INNER_WALL_ROW, INNER_WALL_HP),
    wallState(`wall:south:inner:${index + 1}`, 'player:south', 'inner', 149 - (northCol + 5), SOUTH_INNER_WALL_ROW, INNER_WALL_HP),
  ]);
}

export function createCastleWalls(catalog: FixtureCatalog = fixtureCatalog): WallState[] { return [...createOuterWalls(catalog), ...createInnerWalls()]; }

export function corePoint(ownerId: PlayerId): HexPoint { return { col: 75, row: ownerId === 'player:north' ? 5 : 84 }; }
export function breachedWallHexes(walls: readonly WallState[]): ReadonlySet<string> {
  const breached = new Set<string>();
  for (const wall of walls) if (wall.hp === 0) for (let col = wall.col; col < wall.col + wall.width; col++) breached.add(tileId(col, wall.row));
  return breached;
}
export function distanceToWall(unit: HexPoint, wall: WallState): number {
  let nearest = Infinity;
  for (let col = wall.col; col < wall.col + wall.width; col++) nearest = Math.min(nearest, hexDistance(unit, { col, row: wall.row }));
  return nearest;
}

type Strike = { attacker: UnitState; targetId: string; kind: 'wall' | 'facility' | 'core'; damage: number };
export type StructureCombatResult = Readonly<{ players: [PlayerState, PlayerState]; walls: WallState[]; result: MatchResult | null; batteryEvents: FacilityAttackEvent[] }>;

function reflectedWallDamageBps(owner: PlayerState, wall: WallState, walls: readonly WallState[]): number {
  const layerWalls = walls.filter((entry) => entry.ownerId === owner.id && entry.layer === wall.layer).sort((a, b) => a.col - b.col);
  const wallIndex = layerWalls.findIndex((entry) => entry.id === wall.id);
  return owner.facilities.reduce((sum, slot) => {
    if (slot.kind !== 'arcane-barrier' || slot.tier === 0 || slot.hp <= 0) return sum;
    const center = { col: slot.col + 1, row: slot.row + 1 };
    const protectedIndex = layerWalls.reduce((best, entry, index) => distanceToWall(center, entry) < distanceToWall(center, layerWalls[best]) ? index : best, 0);
    if (Math.abs(protectedIndex - wallIndex) > (slot.tier === 3 ? 1 : 0)) return sum;
    return sum + Math.round(([0, 2000, 3000, 4000] as const)[slot.tier] * facilityPotencyBps(owner.facilities, slot) / 10000);
  }, 0);
}

/** Structure damage resolves after unit and camp attacks; overkill never inflates wall score. */
export function advanceStructureCombat(input: readonly [PlayerState, PlayerState], previous: readonly WallState[], tick: number, catalog: FixtureCatalog = fixtureCatalog): StructureCombatResult {
  let walls = previous.map((wall) => ({ ...wall }));
  if (tick < 3000) return { players: [...input] as [PlayerState, PlayerState], walls, result: null, batteryEvents: [] };
  const strikes: Strike[] = [];
  const engaged = new Set<string>();
  for (const player of input) {
    const enemyId: PlayerId = player.id === 'player:north' ? 'player:south' : 'player:north';
    for (const unit of player.units) {
      const platoon = player.platoons.find((entry) => entry.id === unit.platoonId);
      if (unit.hp <= 0 || platoon?.stance === 'retreat') continue;
      const definition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
      const targetWall = walls.filter((wall) => wall.ownerId === enemyId && wall.hp > 0 && distanceToWall(unit, wall) <= definition.range)
        .sort((a, b) => distanceToWall(unit, a) - distanceToWall(unit, b) || a.hp - b.hp || a.id.localeCompare(b.id))[0];
      if (targetWall && definition.role !== 'siege') engaged.add(targetWall.id);
      if (unit.attackProgressMilli < 1000) continue;
      const attack = criticalAttack(Math.round((definition.attack + itemAttackBonus(unit)) * combatScaleBps(tick) * (unit.level === 3 ? 11000 : unit.level === 2 ? 10500 : 10000) / 100000000), unit.id, tick, player.bossBuffs.eyesUntil > tick);
      const siegeBonus = player.bossBuffs.emperorUntil > tick && definition.attackType === 'physical' ? Math.round(100 / definition.attacksPerSecond) : 0;
      if (targetWall) {
        const surgeBps = player.cardEffects.overtimeSurgeUntil > tick ? 12500 : 10000;
        const resistance = definition.role === 'siege' ? 0 : targetWall.resistanceBps;
        strikes.push({ attacker: unit, targetId: targetWall.id, kind: 'wall', damage: Math.max(1, Math.round(attack * (10000 - resistance) * surgeBps / 100000000) + siegeBonus) });
      } else if (walls.some((wall) => wall.ownerId === enemyId && wall.layer === 'outer' && wall.hp === 0)
        && getHex(unit.col, unit.row)?.zone === (enemyId === 'player:north' ? 'north-castle' : 'south-castle')) {
        const owner = input.find((entry) => entry.id === enemyId)!;
        const facility = owner.facilities.filter((entry) => entry.kind && entry.hp > 0 && distanceToFacility(unit, entry) <= definition.range)
          .sort((a, b) => distanceToFacility(unit, a) - distanceToFacility(unit, b) || a.hp - b.hp || a.id.localeCompare(b.id))[0];
        if (facility) strikes.push({ attacker: unit, targetId: facility.id, kind: 'facility', damage: Math.max(1, Math.round(attack * (definition.role === 'siege' ? 1 : 0.3)) + siegeBonus) });
        else if (walls.some((wall) => wall.ownerId === enemyId && wall.layer === 'inner' && wall.hp === 0)
          && hexDistance(unit, corePoint(enemyId)) <= definition.range) strikes.push({ attacker: unit, targetId: enemyId, kind: 'core', damage: Math.max(1, attack + siegeBonus) });
      } else if (walls.some((wall) => wall.ownerId === enemyId && wall.layer === 'outer' && wall.hp === 0)
        && walls.some((wall) => wall.ownerId === enemyId && wall.layer === 'inner' && wall.hp === 0)
        && hexDistance(unit, corePoint(enemyId)) <= definition.range) {
        strikes.push({ attacker: unit, targetId: enemyId, kind: 'core', damage: Math.max(1, attack + siegeBonus) });
      }
    }
  }
  walls = walls.map((wall): WallState => {
    if (wall.hp === 0) return wall;
    if (engaged.has(wall.id)) {
      const contactTicks = wall.contactTicks + 1;
      return { ...wall, contactTicks: contactTicks >= 150 ? 0 : contactTicks, absenceTicks: 0, resistanceBps: contactTicks >= 150 ? Math.max(4000, wall.resistanceBps - 500) : wall.resistanceBps };
    }
    const absenceTicks = wall.absenceTicks + 1;
    return { ...wall, contactTicks: 0, absenceTicks: absenceTicks >= 100 ? 0 : absenceTicks, resistanceBps: absenceTicks >= 100 ? Math.min(7000, wall.resistanceBps + 500) : wall.resistanceBps };
  });
  strikes.sort((a, b) => a.attacker.id.localeCompare(b.attacker.id));
  let players = input.map((player): PlayerState => ({ ...player, units: [...player.units] })) as [PlayerState, PlayerState];
  for (const strike of strikes) {
    if (strike.kind === 'wall') {
      const index = walls.findIndex((wall) => wall.id === strike.targetId);
      if (walls[index].hp === 0) continue;
      const actual = Math.min(walls[index].hp, strike.damage);
      const wallOwner = players.find((player) => player.id === walls[index].ownerId)!;
      const reflected = Math.round(actual * reflectedWallDamageBps(wallOwner, walls[index], previous) / 10000);
      walls[index] = { ...walls[index], hp: walls[index].hp - actual };
      players = players.map((player) => player.id === strike.attacker.ownerId ? { ...player, wallDamage: player.wallDamage + actual } : player) as [PlayerState, PlayerState];
      if (reflected > 0) players = players.map((player) => player.id === strike.attacker.ownerId ? { ...player, units: player.units.map((unit) => {
        if (unit.id !== strike.attacker.id || unit.hp <= 0) return unit;
        const hp = Math.max(0, unit.hp - reflected);
        return { ...unit, hp, respawnAtTick: hp === 0 ? tick + 300 : unit.respawnAtTick, channelCompleteAtTick: hp === 0 ? null : unit.channelCompleteAtTick, channelTargetId: hp === 0 ? null : unit.channelTargetId, lastCombatTick: tick, lastAttackTargetId: hp === 0 ? null : unit.lastAttackTargetId, lastAttackTick: hp === 0 ? 0 : unit.lastAttackTick };
      }) } : player) as [PlayerState, PlayerState];
    } else if (strike.kind === 'facility') {
      const ownerId: PlayerId = strike.attacker.ownerId === 'player:north' ? 'player:south' : 'player:north';
      if (!players.find((player) => player.id === ownerId)?.facilities.some((facility) => facility.id === strike.targetId && facility.hp > 0)) continue;
      players = players.map((player) => player.id === ownerId ? damageFacility(player, strike.targetId, strike.damage, tick) : player) as [PlayerState, PlayerState];
    } else {
      players = players.map((player) => player.id === strike.targetId ? { ...player, coreHp: Math.max(0, player.coreHp - strike.damage) } : player) as [PlayerState, PlayerState];
    }
    players = players.map((player) => player.id === strike.attacker.ownerId ? { ...player, units: player.units.map((unit) => unit.id === strike.attacker.id ? { ...unit, attackProgressMilli: 0, lastCombatTick: tick, lastStructureAttackTick: tick } : unit) } : player) as [PlayerState, PlayerState];
  }
  const batteryEvents: FacilityAttackEvent[] = [];
  for (const side of [0, 1] as const) {
    const defender = players[side];
    if (defender.coreHp <= 0 || defender.coreHp >= 2250 || defender.batteryDisabled || defender.batteryReadyAtTick > tick) continue;
    const powerSlot = defender.batteryPowerSlotId === null
      ? defender.facilities.find((slot) => slot.zone === 'outer-courtyard' && (slot.kind === 'arcane-barrier' || slot.kind === 'sanctuary') && slot.tier > 0 && slot.hp > 0)
      : defender.facilities.find((slot) => slot.id === defender.batteryPowerSlotId && (slot.kind === 'arcane-barrier' || slot.kind === 'sanctuary') && slot.tier > 0 && slot.hp > 0);
    if (!powerSlot) continue;
    if (defender.batteryPowerSlotId === null) players[side] = { ...defender, batteryPowerSlotId: powerSlot.id };
    const enemySide = (1 - side) as 0 | 1;
    const core = corePoint(defender.id);
    const target = players[enemySide].units.filter((unit) => unit.hp > 0 && Math.max(unit.lastAttackTick, unit.lastStructureAttackTick) >= tick - 20 && Math.max(unit.lastAttackTick, unit.lastStructureAttackTick) > 0 && hexDistance(unit, core) <= 6)
      .sort((a, b) => hexDistance(a, core) - hexDistance(b, core) || a.id.localeCompare(b.id))[0];
    if (!target) continue;
    players[side] = { ...players[side], batteryReadyAtTick: tick + 40 };
    players[enemySide] = { ...players[enemySide], units: players[enemySide].units.map((unit) => unit.id === target.id ? {
      ...unit, hp: Math.max(0, unit.hp - 150), respawnAtTick: unit.hp <= 150 ? tick + 300 : unit.respawnAtTick,
      channelCompleteAtTick: unit.hp <= 150 ? null : unit.channelCompleteAtTick, channelTargetId: unit.hp <= 150 ? null : unit.channelTargetId,
      attackProgressMilli: unit.hp <= 150 ? 0 : unit.attackProgressMilli, lastCombatTick: tick,
      lastAttackTargetId: unit.hp <= 150 ? null : unit.lastAttackTargetId, lastAttackTick: unit.hp <= 150 ? 0 : unit.lastAttackTick,
    } : unit) };
    batteryEvents.push({ id: `facility:core-battery:${tick}:${defender.id}`, tick, source: core, target: { col: target.col, row: target.row }, damage: Math.min(150, target.hp) });
  }
  const northDead = players[0].coreHp === 0;
  const southDead = players[1].coreHp === 0;
  const result: MatchResult | null = northDead || southDead
    ? { winnerId: northDead && southDead ? null : northDead ? 'player:south' : 'player:north', reason: northDead && southDead ? 'draw' : 'core-collapse' }
    : null;
  return { players, walls, result, batteryEvents };
}

export function validateOuterWalls(walls: readonly WallState[], catalog: FixtureCatalog = fixtureCatalog): string[] {
  const expected = createOuterWalls(catalog);
  return validateWalls(walls, expected);
}

export function validateCastleWalls(walls: readonly WallState[], catalog: FixtureCatalog = fixtureCatalog): string[] {
  return validateWalls(walls, createCastleWalls(catalog));
}

function validateWalls(walls: readonly WallState[], expected: readonly WallState[]): string[] {
  const errors: string[] = [];
  if (walls.length !== expected.length || new Set(walls.map((wall) => wall.id)).size !== walls.length) errors.push('Wall count or IDs invalid');
  for (const [index, wall] of walls.entries()) {
    const blueprint = expected[index];
    if (!blueprint || wall.id !== blueprint.id || wall.ownerId !== blueprint.ownerId || wall.layer !== blueprint.layer || wall.col !== blueprint.col || wall.row !== blueprint.row || wall.width !== 6 || !Number.isSafeInteger(wall.hp) || wall.hp < 0 || wall.hp > wall.maxHp || wall.maxHp !== blueprint.maxHp || !Number.isSafeInteger(wall.resistanceBps) || wall.resistanceBps < 4000 || wall.resistanceBps > 7000 || wall.resistanceBps % 500 !== 0 || !Number.isSafeInteger(wall.contactTicks) || wall.contactTicks < 0 || wall.contactTicks >= 150 || !Number.isSafeInteger(wall.absenceTicks) || wall.absenceTicks < 0 || wall.absenceTicks >= 100) errors.push(`Invalid wall ${wall.id}`);
    for (let col = wall.col; col < wall.col + wall.width; col++) if (getHex(col, wall.row)?.terrain !== 'wall') errors.push(`Wall footprint ${wall.id} has a non-wall tile`);
  }
  return errors;
}
