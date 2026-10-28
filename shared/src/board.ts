/** Board authority: Plan/TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md. */
export const BOARD_COLUMNS = 150;
export const BOARD_ROWS = 90;
export const JUNGLE_COLUMNS = 30;
export const NORTH_CASTLE_LAST_ROW = 19;
export const SOUTH_CASTLE_FIRST_ROW = 70;
export const NORTH_INNER_WALL_ROW = 8;
export const SOUTH_INNER_WALL_ROW = 81;
export const CASTLE_FIRST_COLUMN = 51;
export const CASTLE_LAST_COLUMN = 98;
export const CASTLE_GATE_COLUMNS = [59, 75, 91] as const;
export const SOUTH_CASTLE_GATE_COLUMNS = CASTLE_GATE_COLUMNS.map((col) => BOARD_COLUMNS - 1 - col);
export const CASTLE_GATE_HALF_WIDTH = 1;
export const BOARD_TILE_COUNT = BOARD_COLUMNS * BOARD_ROWS;
export const PATH_MOVE_SPEED_BPS = 11000;
export const HEX_SIZE = 20;
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
export const ROW_HEIGHT = 1.5 * HEX_SIZE;
export const BOARD_WIDTH = (BOARD_COLUMNS + 0.5) * HEX_WIDTH;
export const BOARD_HEIGHT = (BOARD_ROWS - 1) * ROW_HEIGHT + 2 * HEX_SIZE;

export type Zone = 'cloud' | 'west-jungle' | 'battlefield' | 'east-jungle' | 'north-castle' | 'south-castle';
export type Terrain = 'cloud' | 'jungle' | 'clearing' | 'field' | 'highway' | 'fortress' | 'wall' | 'gate' | 'altar';
export type SceneryProp = 'boulder' | 'tree' | 'fence' | 'canopy';
export type Hex = Readonly<{ col: number; row: number; id: string; zone: Zone; terrain: Terrain; decoration: SceneryProp | null; isWalkable: boolean; isBrush: boolean }>;
// Mirrored fixed scenery keeps the Stage 2 art fixture inspectable.
const scenerySeeds = [
  { col: 47, row: 38, kind: 'boulder' },
  { col: 58, row: 39, kind: 'tree' },
  { col: 67, row: 42, kind: 'fence' },
  { col: 23, row: 40, kind: 'canopy' },
] as const;
const scenery = new Map<number, SceneryProp>();
for (const { col, row, kind } of scenerySeeds) {
  scenery.set(row * BOARD_COLUMNS + col, kind);
  scenery.set((BOARD_ROWS - 1 - row) * BOARD_COLUMNS + BOARD_COLUMNS - 1 - col, kind);
}

export function isInsideBoard(col: number, row: number): boolean {
  return Number.isInteger(col) && Number.isInteger(row) && col >= 0 && col < BOARD_COLUMNS && row >= 0 && row < BOARD_ROWS;
}

export function tileId(col: number, row: number): string {
  return `hex:${col}:${row}`;
}

export function hexCenter(col: number, row: number): { x: number; y: number } {
  return { x: HEX_WIDTH * (col + 0.5 * (row & 1)) + HEX_WIDTH / 2, y: ROW_HEIGHT * row + HEX_SIZE };
}

function axialToOffset(q: number, r: number): { col: number; row: number } {
  return { col: q + (r - (r & 1)) / 2, row: r };
}

export function hexNeighbors(col: number, row: number): { col: number; row: number }[] {
  if (!isInsideBoard(col, row)) return [];
  const q = col - (row - (row & 1)) / 2;
  return [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]
    .map(([dq, dr]) => axialToOffset(q + dq, row + dr))
    .filter((cell) => isInsideBoard(cell.col, cell.row));
}

/** Front-gate branches stop on the field side of each jungle entrance. */
export const NORTH_JUNGLE_PATHS = [
  { start: { col: 59, row: 20 }, end: { col: 30, row: 29 } },
  { start: { col: 91, row: 20 }, end: { col: 119, row: 29 } },
] as const;
const junglePathHexes = new Set<number>();
for (const { start, end } of NORTH_JUNGLE_PATHS) {
  const steps = Math.abs(end.col - start.col);
  for (let step = 0; step <= steps; step++) {
    const col = Math.round(start.col + (end.col - start.col) * step / steps);
    const row = Math.round(start.row + (end.row - start.row) * step / steps);
    // A one-hex shoulder gives formations a continuous, roughly three-hex-wide path.
    for (const point of [{ col, row }, ...hexNeighbors(col, row)]) {
      if (point.row <= NORTH_CASTLE_LAST_ROW || point.row >= SOUTH_CASTLE_FIRST_ROW) continue;
      // Clip the shoulders too: no path tile extends into either jungle zone.
      if (point.col < JUNGLE_COLUMNS || point.col >= BOARD_COLUMNS - JUNGLE_COLUMNS) continue;
      junglePathHexes.add(point.row * BOARD_COLUMNS + point.col);
      junglePathHexes.add((BOARD_ROWS - 1 - point.row) * BOARD_COLUMNS + BOARD_COLUMNS - 1 - point.col);
    }
  }
}

/** Inverse of pointy-top, odd-row offset layout; rounding uses cube coordinates. */
export function worldToHex(x: number, y: number): { col: number; row: number } | null {
  const px = x - HEX_WIDTH / 2;
  const py = y - HEX_SIZE;
  const q = (Math.sqrt(3) / 3 * px - py / 3) / HEX_SIZE;
  const r = (2 / 3 * py) / HEX_SIZE;
  let cq = Math.round(q);
  let cr = Math.round(r);
  const cs = Math.round(-q - r);
  const dq = Math.abs(cq - q);
  const dr = Math.abs(cr - r);
  const ds = Math.abs(cs + q + r);
  if (dq > dr && dq > ds) cq = -cr - cs;
  else if (dr > ds) cr = -cq - cs;
  const cell = axialToOffset(cq, cr);
  return isInsideBoard(cell.col, cell.row) ? cell : null;
}

function noise(col: number, row: number): number {
  let n = (Math.imul(col + 781, 374761393) + Math.imul(row + 631, 668265263)) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export function getHex(col: number, row: number): Hex | null {
  if (!isInsideBoard(col, row)) return null;
  const isCastleSide = col < CASTLE_FIRST_COLUMN || col > CASTLE_LAST_COLUMN;
  const isNorth = row <= NORTH_CASTLE_LAST_ROW;
  const isSouth = row >= SOUTH_CASTLE_FIRST_ROW;
  const zone: Zone = isCastleSide && (isNorth || isSouth) ? 'cloud'
    : col < JUNGLE_COLUMNS ? 'west-jungle'
    : col >= BOARD_COLUMNS - JUNGLE_COLUMNS ? 'east-jungle'
    : isNorth ? 'north-castle'
    : isSouth ? 'south-castle' : 'battlefield';
  let terrain: Terrain;
  if (zone === 'cloud') terrain = 'cloud';
  else if (zone === 'west-jungle' || zone === 'east-jungle') terrain = noise(col, row) > 0.84 ? 'clearing' : 'jungle';
  else if (zone === 'north-castle' || zone === 'south-castle') {
    const frontRow = isNorth ? NORTH_CASTLE_LAST_ROW : SOUTH_CASTLE_FIRST_ROW;
    const isFront = row === frontRow;
    const isInner = row === (isNorth ? NORTH_INNER_WALL_ROW : SOUTH_INNER_WALL_ROW);
    const isPerimeter = col === CASTLE_FIRST_COLUMN || col === CASTLE_LAST_COLUMN || row === 0 || row === BOARD_ROWS - 1 || isFront || isInner;
    const gateColumns = isNorth ? CASTLE_GATE_COLUMNS : SOUTH_CASTLE_GATE_COLUMNS;
    const isGate = (isFront || isInner) && gateColumns.some((gateCol) => Math.abs(col - gateCol) <= CASTLE_GATE_HALF_WIDTH);
    terrain = isGate ? 'gate' : isPerimeter ? 'wall' : 'fortress';
  } else if (col === 75 && row === 45) terrain = 'altar';
  else if (col >= 73 && col <= 76) terrain = 'highway';
  else terrain = 'field';
  if (junglePathHexes.has(row * BOARD_COLUMNS + col)
    && (terrain === 'field' || terrain === 'jungle' || terrain === 'clearing')) terrain = 'highway';
  // Stable 3×3 patches are fixture placement for the field brush and jungle fern decals.
  const decoration = scenery.get(row * BOARD_COLUMNS + col) ?? null;
  const isBrush = decoration === null && (terrain === 'field' || terrain === 'jungle') && noise(Math.floor(col / 3), Math.floor(row / 3)) > 0.86;
  // Tree, canopy, fence and boulder sprites are cosmetic; only castle terrain blocks movement.
  return { col, row, id: tileId(col, row), zone, terrain, decoration, isWalkable: terrain !== 'cloud' && terrain !== 'wall', isBrush };
}

/** Terrain speed is shared by routing and all unit/platoon movement. */
export function terrainMoveSpeedBps(col: number, row: number): number {
  return getHex(col, row)?.terrain === 'highway' ? PATH_MOVE_SPEED_BPS : 10000;
}

export function* allHexes(): Generator<Hex> {
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLUMNS; col++) yield getHex(col, row)!;
  }
}
