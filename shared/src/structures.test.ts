import { describe, expect, it } from 'vitest';
import { findHexPath } from './pathfinding.js';
import { createInitialState, stepMatch, validateMatchState } from './simulation.js';
import { damageFacility } from './facilities.js';
import { advanceStructureCombat, breachedWallHexes, createCastleWalls, createInnerWalls, createOuterWalls, validateCastleWalls, validateOuterWalls } from './structures.js';

describe('outer walls and core objective', () => {
  it('does not attack or pressure a wall while retreating', () => {
    const state = createInitialState(54);
    const wall = state.walls.find((entry) => entry.ownerId === 'player:south' && entry.layer === 'outer' && entry.col === 60)!;
    const attacker = { ...state.players[0].units[0], col: wall.col, row: wall.row - 1, attackProgressMilli: 1000 };
    const north = { ...state.players[0], units: [attacker], platoons: state.players[0].platoons.map((platoon, index) => index === 0
      ? { ...platoon, stance: 'retreat' as const, unitIds: [attacker.id] } : platoon) };
    const result = advanceStructureCombat([north, state.players[1]], state.walls, 3000);
    expect(result.walls.find((entry) => entry.id === wall.id)).toMatchObject({ hp: wall.hp, contactTicks: wall.contactTicks });
  });

  it('builds Arcane Barrier only in a courtyard slot', () => {
    const initial = createInitialState(55);
    const funded = { ...initial, players: [{ ...initial.players[0], goldMilli: 300000 }, initial.players[1]] as typeof initial.players };
    const keep = stepMatch(funded, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'build-facility', slotId: funded.players[0].facilities[4].id, kind: 'arcane-barrier' } }]);
    expect(keep.rejected).toEqual([{ sequence: 1, reason: 'Arcane Barrier requires a courtyard slot' }]);
    const court = stepMatch(keep.state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'build-facility', slotId: funded.players[0].facilities[0].id, kind: 'arcane-barrier' } }]);
    expect(court.accepted).toEqual([2]);
    expect(court.state.players[0].facilities[0]).toMatchObject({ kind: 'arcane-barrier', pendingTier: 1 });
    expect(validateMatchState(court.state)).toEqual([]);
  });

  it('reflects wall damage while the adjacent Arcane Barrier survives', () => {
    const state = createInitialState(56);
    const wall = state.walls.find((entry) => entry.ownerId === 'player:south' && entry.layer === 'outer' && entry.col === 60)!;
    const attacker = { ...state.players[0].units[0], col: wall.col, row: wall.row - 1, attackProgressMilli: 1000 };
    const north = { ...state.players[0], units: [attacker] };
    const power = { ...state.players[1].facilities[0], kind: 'arcane-barrier' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const south = { ...state.players[1], facilities: [power, ...state.players[1].facilities.slice(1)] };
    const reflected = advanceStructureCombat([north, south], state.walls, 3000);
    const wallDamage = wall.hp - reflected.walls.find((entry) => entry.id === wall.id)!.hp;
    expect(wallDamage).toBeGreaterThan(0);
    expect(reflected.players[0].units[0].hp).toBe(attacker.hp - Math.round(wallDamage * 0.2));
    const disabled = advanceStructureCombat([north, damageFacility(south, power.id, 500, 3000)], state.walls, 3000);
    expect(disabled.players[0].units[0].hp).toBe(attacker.hp);
  });

  it('fires a true-damage Core battery below half health every 40 ticks until its linked facility is destroyed', () => {
    const state = createInitialState(57);
    const attacker = { ...state.players[0].units[0], col: 75, row: 83, lastStructureAttackTick: 3000 };
    const north = { ...state.players[0], units: [attacker] };
    const power = { ...state.players[1].facilities[0], kind: 'arcane-barrier' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const south = { ...state.players[1], coreHp: 2249, facilities: [power, ...state.players[1].facilities.slice(1)] };
    expect(advanceStructureCombat([north, { ...south, coreHp: 2250 }], state.walls, 3001).batteryEvents).toEqual([]);
    expect(advanceStructureCombat([north, { ...south, facilities: state.players[1].facilities }], state.walls, 3001).batteryEvents).toEqual([]);
    const armed = advanceStructureCombat([state.players[0], south], state.walls, 3001);
    expect(armed.batteryEvents).toEqual([]);
    expect(armed.players[1].batteryPowerSlotId).toBe(power.id);
    const first = advanceStructureCombat([north, south], state.walls, 3001);
    expect(first.batteryEvents).toHaveLength(1);
    expect(first.players[0].units[0].hp).toBe(attacker.hp - 150);
    expect(first.players[1]).toMatchObject({ batteryPowerSlotId: power.id, batteryReadyAtTick: 3041 });
    expect(advanceStructureCombat(first.players, state.walls, 3002).batteryEvents).toEqual([]);
    const renewed = [{ ...first.players[0], units: [{ ...first.players[0].units[0], lastStructureAttackTick: 3040 }] }, first.players[1]] as const;
    const second = advanceStructureCombat(renewed, state.walls, 3041);
    expect(second.batteryEvents).toHaveLength(1);
    const destroyed = damageFacility(second.players[1], power.id, 500, 3042);
    expect(destroyed.batteryDisabled).toBe(true);
    const afterDestruction = advanceStructureCombat([{ ...second.players[0], units: [{ ...second.players[0].units[0], lastStructureAttackTick: 3080 }] }, destroyed], state.walls, 3081);
    expect(afterDestruction.batteryEvents).toEqual([]);
    expect(afterDestruction.players[1].batteryPowerSlotId).toBe(power.id);
    const rebuilt = { ...destroyed, facilities: [power, ...destroyed.facilities.slice(1)] };
    expect(advanceStructureCombat([{ ...second.players[0], units: [{ ...second.players[0].units[0], lastStructureAttackTick: 3080 }] }, rebuilt], state.walls, 3081).batteryEvents).toEqual([]);
  });

  it('targets the nearest recent attacker rather than an idle intruder', () => {
    const state = createInitialState(58);
    const far = { ...state.players[0].units[0], col: 75, row: 79, lastStructureAttackTick: 3000 };
    const near = { ...state.players[0].units[1], col: 75, row: 82, lastAttackTick: 3000 };
    const idle = { ...state.players[0].units[2], col: 75, row: 83 };
    const power = { ...state.players[1].facilities[0], kind: 'arcane-barrier' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const north = { ...state.players[0], units: [far, near, idle] };
    const south = { ...state.players[1], coreHp: 2249, facilities: [power, ...state.players[1].facilities.slice(1)] };
    const result = advanceStructureCombat([north, south], state.walls, 3001);
    expect(result.players[0].units[0].hp).toBe(far.hp);
    expect(result.players[0].units[1].hp).toBe(near.hp - 150);
    expect(result.players[0].units[2].hp).toBe(idle.hp);
  });
  it('accepts a courtyard Sanctuary as battery power but not an inner keep Sanctuary', () => {
    const state = createInitialState(59);
    const attacker = { ...state.players[0].units[0], col: 75, row: 83, lastStructureAttackTick: 3000 };
    const north = { ...state.players[0], units: [attacker] };
    const court = { ...state.players[1].facilities[0], kind: 'sanctuary' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const keep = { ...state.players[1].facilities[4], kind: 'sanctuary' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const south = { ...state.players[1], coreHp: 2249, facilities: [court, ...state.players[1].facilities.slice(1)] };
    expect(advanceStructureCombat([north, { ...south, facilities: [state.players[1].facilities[0], ...south.facilities.slice(1, 4), keep, south.facilities[5]] }], state.walls, 3001).batteryEvents).toEqual([]);
    const powered = advanceStructureCombat([north, south], state.walls, 3001);
    expect(powered.batteryEvents).toHaveLength(1);
    expect(powered.players[1].batteryPowerSlotId).toBe(court.id);
    const disabled = damageFacility(powered.players[1], court.id, 500, 3002);
    expect(disabled.batteryDisabled).toBe(true);
  });
  it('places ten validated six-hex segments with mirrored player approaches', () => {
    const walls = createOuterWalls();
    expect(walls).toHaveLength(10);
    expect(validateOuterWalls(walls)).toEqual([]);
    for (let index = 0; index < 10; index += 2) {
      expect(walls[index].col + walls[index + 1].col + 5).toBe(149);
      expect(walls[index].row + walls[index + 1].row).toBe(89);
    }
    expect(createInnerWalls()).toHaveLength(10);
    expect(createCastleWalls()).toHaveLength(20);
    expect(validateCastleWalls(createCastleWalls())).toEqual([]);
  });

  it('caps overkill wall score and opens the destroyed front footprint for routing', () => {
    const state = createInitialState(51);
    const southWall = state.walls[1];
    const attacker = { ...state.players[0].units[0], definitionId: 'unit-def:sapper-drox', col: southWall.col, row: 69, attackProgressMilli: 1000 };
    const north = { ...state.players[0], units: [attacker, ...state.players[0].units.slice(1)] };
    const walls = state.walls.map((wall) => wall.id === southWall.id ? { ...wall, hp: 5 } : wall);
    expect(advanceStructureCombat([north, state.players[1]], walls, 2999).walls[1].hp).toBe(5);
    const result = advanceStructureCombat([north, state.players[1]], walls, 3000);
    expect(result.walls[1].hp).toBe(0);
    expect(result.players[0].wallDamage).toBe(5);
    expect(result.players[0].units[0].attackProgressMilli).toBe(0);
    const breached = breachedWallHexes(result.walls);
    expect(breached.size).toBe(6);
    const path = findHexPath({ col: southWall.col, row: 69 }, { col: southWall.col, row: 71 }, { breachedWallHexes: breached });
    expect(path).toContainEqual({ col: southWall.col, row: 70 });
  });

  it('requires both outer and inner breaches before a core can fall', () => {
    const start = createInitialState(52);
    const north = { ...start.players[0], units: start.players[0].units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 83, attackProgressMilli: 1000 } : unit) };
    const players = [north, { ...start.players[1], coreHp: 1 }] as const;
    const outerOnly = start.walls.map((wall) => wall.ownerId === 'player:south' && wall.layer === 'outer' && wall.id.endsWith(':1') ? { ...wall, hp: 0 } : wall);
    expect(advanceStructureCombat(players, outerOnly, 3000).players[1].coreHp).toBe(1);
    const bothLayers = outerOnly.map((wall) => wall.ownerId === 'player:south' && wall.layer === 'inner' && wall.id.endsWith(':1') ? { ...wall, hp: 0 } : wall);
    const result = advanceStructureCombat(players, bothLayers, 3000);
    expect(result.players[1].coreHp).toBe(0);
    expect(result.result).toEqual({ winnerId: 'player:north', reason: 'core-collapse' });
  });

  it('decays resistance after continuous contact and recovers after absence', () => {
    const start = createInitialState(53);
    const wall = start.walls[1];
    const attacker = { ...start.players[0].units[0], col: wall.col, row: wall.row - 1, attackProgressMilli: 0 };
    const north = { ...start.players[0], units: [attacker] };
    let walls = [...start.walls];
    for (let tick = 3000; tick < 3150; tick++) walls = advanceStructureCombat([north, start.players[1]], walls, tick).walls;
    expect(walls[1].resistanceBps).toBe(6500);
    const away = { ...north, units: [{ ...attacker, col: 75, row: 45 }] };
    for (let tick = 3150; tick < 3250; tick++) walls = advanceStructureCombat([away, start.players[1]], walls, tick).walls;
    expect(walls[1].resistanceBps).toBe(7000);
    expect(validateCastleWalls(walls)).toEqual([]);
  });

  it('lets an intruder damage a courtyard facility after an outer breach with non-siege resistance', () => {
    const state = createInitialState(54);
    const slot = { ...state.players[1].facilities[0], kind: 'caravan-post' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const south = { ...state.players[1], facilities: [slot, ...state.players[1].facilities.slice(1)] };
    const attacker = { ...state.players[0].units[0], col: 58, row: 74, attackProgressMilli: 1000 };
    const north = { ...state.players[0], units: [attacker] };
    expect(advanceStructureCombat([north, south], state.walls, 3000).players[1].facilities[0].hp).toBe(500);
    const walls = state.walls.map((wall) => wall.ownerId === 'player:south' && wall.layer === 'outer' && wall.id.endsWith(':1') ? { ...wall, hp: 0 } : wall);
    const result = advanceStructureCombat([north, south], walls, 3000);
    expect(result.players[1].facilities[0].hp).toBe(478);
    expect(result.players[0].units[0].attackProgressMilli).toBe(0);
  });
});
