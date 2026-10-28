import { BOARD_COLUMNS, BOARD_ROWS, CASTLE_FIRST_COLUMN, CASTLE_LAST_COLUMN, getHex, hexNeighbors, NORTH_CASTLE_LAST_ROW, NORTH_INNER_WALL_ROW, SOUTH_CASTLE_FIRST_ROW, SOUTH_INNER_WALL_ROW, terrainMoveSpeedBps, tileId } from './board.js';

export type HexPoint = Readonly<{ col: number; row: number }>;
export type RouteOptions = Readonly<{ breachedWallHexes?: ReadonlySet<string>; blockedHexes?: ReadonlySet<string>; travelerId?: 'player:north' | 'player:south' }>;

function indexOf(point: HexPoint): number { return point.row * BOARD_COLUMNS + point.col; }
function pointAt(index: number): HexPoint { return { col: index % BOARD_COLUMNS, row: Math.floor(index / BOARD_COLUMNS) }; }
function axial(point: HexPoint): { q: number; r: number } { return { q: point.col - (point.row - (point.row & 1)) / 2, r: point.row }; }

export function hexDistance(a: HexPoint, b: HexPoint): number {
  const from = axial(a);
  const to = axial(b);
  const dq = from.q - to.q;
  const dr = from.r - to.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Breaches can open only the two frontal wall rows; side and rear walls remain sealed. */
export function canTraverse(point: HexPoint, options: RouteOptions = {}): boolean {
  const hex = getHex(point.col, point.row);
  if (!hex) return false;
  if (options.blockedHexes?.has(tileId(point.col, point.row))) return false;
  if (hex.terrain === 'gate' && options.travelerId) {
    const ownerId = point.row === NORTH_CASTLE_LAST_ROW || point.row === NORTH_INNER_WALL_ROW ? 'player:north' : 'player:south';
    return options.travelerId === ownerId;
  }
  if (hex.isWalkable) return true;
  return hex.terrain === 'wall'
    && (point.row === NORTH_CASTLE_LAST_ROW || point.row === SOUTH_CASTLE_FIRST_ROW || point.row === NORTH_INNER_WALL_ROW || point.row === SOUTH_INNER_WALL_ROW)
    && point.col >= CASTLE_FIRST_COLUMN && point.col <= CASTLE_LAST_COLUMN
    && (options.breachedWallHexes?.has(tileId(point.col, point.row)) ?? false);
}

type Entry = { index: number; cost: number; estimate: number };
function less(a: Entry, b: Entry): boolean {
  const aTotal = a.cost + a.estimate;
  const bTotal = b.cost + b.estimate;
  return aTotal < bTotal || (aTotal === bTotal && (a.estimate < b.estimate || (a.estimate === b.estimate && a.index < b.index)));
}

class MinHeap {
  private data: Entry[] = [];
  get length(): number { return this.data.length; }
  push(entry: Entry): void {
    let i = this.data.length;
    this.data.push(entry);
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!less(entry, this.data[parent])) break;
      this.data[i] = this.data[parent];
      i = parent;
    }
    this.data[i] = entry;
  }
  pop(): Entry {
    const first = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length === 0) return first;
    let i = 0;
    while (i * 2 + 1 < this.data.length) {
      let child = i * 2 + 1;
      if (child + 1 < this.data.length && less(this.data[child + 1], this.data[child])) child++;
      if (!less(this.data[child], last)) break;
      this.data[i] = this.data[child];
      i = child;
    }
    this.data[i] = last;
    return first;
  }
}

/** Stable A* over the canonical 150×90 odd-row hex board. Includes start and target. */
export function findHexPath(start: HexPoint, target: HexPoint, options: RouteOptions = {}): HexPoint[] | null {
  if (!canTraverse(start, options) || !canTraverse(target, options)) return null;
  const startIndex = indexOf(start);
  const targetIndex = indexOf(target);
  if (startIndex === targetIndex) return [start];
  const size = BOARD_COLUMNS * BOARD_ROWS;
  const cost = new Int32Array(size).fill(0x7fffffff);
  const previous = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size);
  const frontier = new MinHeap();
  cost[startIndex] = 0;
  frontier.push({ index: startIndex, cost: 0, estimate: hexDistance(start, target) * 100 });
  while (frontier.length) {
    const current = frontier.pop();
    if (closed[current.index] || current.cost !== cost[current.index]) continue;
    if (current.index === targetIndex) {
      const path: HexPoint[] = [];
      for (let at = targetIndex; at !== -1; at = previous[at]) path.push(pointAt(at));
      return path.reverse();
    }
    closed[current.index] = 1;
    const point = pointAt(current.index);
    for (const next of hexNeighbors(point.col, point.row)) {
      if (!canTraverse(next, options)) continue;
      const nextIndex = indexOf(next);
      // Integer travel costs: leaving a road costs 100, ordinary ground 110.
      // The 100-per-step heuristic stays admissible even on all-road routes.
      const nextCost = current.cost + 1100000 / terrainMoveSpeedBps(point.col, point.row);
      if (nextCost >= cost[nextIndex]) continue;
      cost[nextIndex] = nextCost;
      previous[nextIndex] = current.index;
      frontier.push({ index: nextIndex, cost: nextCost, estimate: hexDistance(next, target) * 100 });
    }
  }
  return null;
}
