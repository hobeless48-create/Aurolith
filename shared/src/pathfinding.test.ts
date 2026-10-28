import { describe, expect, it } from 'vitest';
import { getHex, hexNeighbors, tileId } from './board.js';
import { canTraverse, findHexPath, hexDistance } from './pathfinding.js';

describe('frontal hex routing', () => {
  it('allows units to walk through decorative terrain props', () => {
    const decorative = [
      { col: 47, row: 38, kind: 'boulder' }, { col: 102, row: 51, kind: 'boulder' },
      { col: 58, row: 39, kind: 'tree' }, { col: 91, row: 50, kind: 'tree' },
      { col: 67, row: 42, kind: 'fence' }, { col: 82, row: 47, kind: 'fence' },
      { col: 23, row: 40, kind: 'canopy' }, { col: 126, row: 49, kind: 'canopy' },
    ];
    for (const point of decorative) {
      expect(getHex(point.col, point.row)?.decoration).toBe(point.kind);
      expect(canTraverse(point)).toBe(true);
    }
    const path = findHexPath({ col: 47, row: 37 }, { col: 47, row: 39 });
    expect(path).not.toBeNull();
    expect(path).toContainEqual({ col: 47, row: 38 });
  });

  it('finds a stable route through a front gate', () => {
    const start = { col: 75, row: 12 };
    const end = { col: 75, row: 45 };
    const path = findHexPath(start, end)!;
    expect(path[0]).toEqual(start);
    expect(path.at(-1)).toEqual(end);
    expect(path.some((point) => point.row === 19 && getHex(point.col, point.row)?.terrain === 'gate')).toBe(true);
    for (let index = 1; index < path.length; index++) {
      expect(hexNeighbors(path[index - 1].col, path[index - 1].row)).toContainEqual(path[index]);
      expect(canTraverse(path[index])).toBe(true);
    }
    expect(findHexPath(start, end)).toEqual(path);
    expect(path.length - 1).toBeGreaterThanOrEqual(hexDistance(start, end));
  });

  it('never routes through cloud corners or unbreached side walls', () => {
    expect(findHexPath({ col: 75, row: 12 }, { col: 15, row: 12 })).toBeNull();
    expect(canTraverse({ col: 51, row: 12 }, { breachedWallHexes: new Set([tileId(51, 12)]) })).toBe(false);
    expect(findHexPath({ col: 51, row: 45 }, { col: 52, row: 12 })?.some((point) => point.col === 51 && point.row < 20)).toBe(false);
  });

  it('opens a front wall hex only after a breach is recorded', () => {
    const wall = { col: 62, row: 19 };
    expect(canTraverse(wall)).toBe(false);
    expect(canTraverse(wall, { breachedWallHexes: new Set([tileId(62, 19)]) })).toBe(true);
    expect(findHexPath({ col: 62, row: 20 }, wall, { breachedWallHexes: new Set([tileId(62, 19)]) })?.at(-1)).toEqual(wall);
  });

  it('lets defenders use their gates while attackers require a breach in each layer', () => {
    const northGate = { col: 75, row: 19 };
    const northInnerGate = { col: 75, row: 8 };
    expect(canTraverse(northGate, { travelerId: 'player:north' })).toBe(true);
    expect(canTraverse(northInnerGate, { travelerId: 'player:north' })).toBe(true);
    expect(canTraverse(northGate, { travelerId: 'player:south' })).toBe(false);
    expect(canTraverse(northInnerGate, { travelerId: 'player:south' })).toBe(false);
    expect(findHexPath({ col: 75, row: 20 }, { col: 75, row: 5 }, { travelerId: 'player:south' })).toBeNull();
    const breached = new Set([...[62, 63, 64, 65, 66, 67].map((col) => tileId(col, 19)), ...[62, 63, 64, 65, 66, 67].map((col) => tileId(col, 8))]);
    const route = findHexPath({ col: 75, row: 20 }, { col: 75, row: 5 }, { travelerId: 'player:south', breachedWallHexes: breached });
    expect(route).not.toBeNull();
    expect(route?.some((point) => point.row === 19 && point.col >= 62 && point.col <= 67)).toBe(true);
    expect(route?.some((point) => point.row === 8 && point.col >= 62 && point.col <= 67)).toBe(true);
  });
});
