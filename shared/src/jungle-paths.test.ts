import { describe, expect, it } from 'vitest';
import { allHexes, BOARD_COLUMNS, BOARD_ROWS, getHex, terrainMoveSpeedBps } from './board.js';
import { findHexPath, hexDistance } from './pathfinding.js';
import { createInitialState, stepMatch, type MatchState } from './simulation.js';

describe('fortress-to-jungle paths', () => {
  it.each([
    { owner: 'player:north' as const, gate: { col: 59, row: 19 }, end: { col: 30, row: 29 }, zone: 'west-jungle', jungleCol: 29 },
    { owner: 'player:north' as const, gate: { col: 91, row: 19 }, end: { col: 119, row: 29 }, zone: 'east-jungle', jungleCol: 120 },
    { owner: 'player:south' as const, gate: { col: 58, row: 70 }, end: { col: 30, row: 60 }, zone: 'west-jungle', jungleCol: 29 },
    { owner: 'player:south' as const, gate: { col: 90, row: 70 }, end: { col: 119, row: 60 }, zone: 'east-jungle', jungleCol: 120 },
  ])('connects $owner to the edge of $zone through a front gate', ({ owner, gate, end, zone, jungleCol }) => {
    expect(getHex(end.col, end.row)).toMatchObject({ terrain: 'highway', zone: 'battlefield', isWalkable: true, isBrush: false });
    expect(getHex(jungleCol, end.row)?.zone).toBe(zone);
    expect(terrainMoveSpeedBps(jungleCol, end.row)).toBe(10000);
    const route = findHexPath(gate, end, { travelerId: owner });
    expect(route).not.toBeNull();
    const roads = route!.filter((point) => getHex(point.col, point.row)!.terrain === 'highway');
    expect(roads.length / route!.length).toBeGreaterThan(0.8);
    expect(route!.every((point) => getHex(point.col, point.row)!.isWalkable)).toBe(true);
    expect(findHexPath(gate, end, { travelerId: owner === 'player:north' ? 'player:south' : 'player:north' })).toBeNull();
  });

  it('mirrors upper access roads into lower access roads without opening castle walls', () => {
    for (const hex of allHexes()) {
      if (hex.zone === 'west-jungle' || hex.zone === 'east-jungle') expect(hex.terrain).not.toBe('highway');
      if (hex.row < 20 || hex.row > 34 || hex.terrain !== 'highway') continue;
      expect(getHex(BOARD_COLUMNS - 1 - hex.col, BOARD_ROWS - 1 - hex.row)?.terrain).toBe('highway');
      expect(hex.isBrush).toBe(false);
    }
    expect(getHex(51, 15)).toMatchObject({ terrain: 'wall', isWalkable: false });
    expect(getHex(98, 74)).toMatchObject({ terrain: 'wall', isWalkable: false });
    expect(getHex(40, 12)).toMatchObject({ terrain: 'cloud', isWalkable: false });
    expect(terrainMoveSpeedBps(30, 29)).toBe(11000);
    expect(terrainMoveSpeedBps(65, 40)).toBe(10000);
  });
});

/** Identical fighter, distance, orders and effects: only the ground changes. */
function travelTicks(col: number, detached = false): number {
  const initial = createInitialState(401);
  const north = initial.players[0];
  const unit = { ...north.units[0], col, row: 35 };
  const destination = { col, row: 40 };
  const platoon = { ...north.platoons[0], unitIds: [unit.id], anchor: detached ? destination : { col, row: 35 }, order: null, route: [], moveProgressMilli: 0 };
  let state: MatchState = { ...initial, players: [
    { ...north, units: [unit], platoons: [platoon, ...north.platoons.slice(1).map((entry) => ({ ...entry, unitIds: [] }))] },
    initial.players[1],
  ] };
  if (!detached) state = stepMatch(state, [{ tick: 1, sequence: 1, playerId: north.id,
    command: { type: 'set-order', platoonId: platoon.id, target: destination } }]).state;
  while (state.tick < 100) {
    const current = detached ? state.players[0].units[0] : state.players[0].platoons[0].anchor;
    // Detached soldiers rejoin the two-hex formation envelope.
    if (hexDistance(current, destination) <= (detached ? 2 : 0)) return state.tick;
    state = stepMatch(state).state;
  }
  throw new Error(`Travel did not finish within 100 ticks: ${JSON.stringify({ col, detached, unit: state.players[0].units[0], platoon: state.players[0].platoons[0] })}`);
}

describe('terrain speed during simulation', () => {
  it('gets a commanded platoon to the same-distance destination sooner on a path', () => {
    const normal = travelTicks(65);
    const road = travelTicks(75);
    expect(road).toBeLessThan(normal);
    expect(normal / road).toBeCloseTo(1.1, 1);
  });

  it('also accelerates detached units rallying back to their platoon', () => {
    const normal = travelTicks(65, true);
    const road = travelTicks(75, true);
    expect(road).toBeLessThan(normal);
    expect(normal / road).toBeCloseTo(1.1, 1);
  });
});
