import { getHex, tileId } from './board.js';
import { hexDistance, type HexPoint } from './pathfinding.js';

function isOpaque(point: HexPoint, breached: ReadonlySet<string>): boolean {
  const hex = getHex(point.col, point.row);
  return (hex?.terrain === 'wall' && !breached.has(tileId(point.col, point.row))) || hex?.terrain === 'cloud';
}

function cube(point: HexPoint): { x: number; y: number; z: number } {
  const x = point.col - (point.row - (point.row & 1)) / 2;
  return { x, z: point.row, y: -x - point.row };
}

function roundCube(x: number, y: number, z: number): HexPoint {
  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);
  const dx = Math.abs(rx - x);
  const dy = Math.abs(ry - y);
  const dz = Math.abs(rz - z);
  if (dx > dy && dx > dz) rx = -ry - rz;
  else if (dy > dz) ry = -rx - rz;
  else rz = -rx - ry;
  return { col: rx + (rz - (rz & 1)) / 2, row: rz };
}

/** A blocking tile itself is seen; cells behind it are not. */
export function hasLineOfSight(from: HexPoint, target: HexPoint, breached: ReadonlySet<string> = new Set()): boolean {
  const distance = hexDistance(from, target);
  if (distance <= 1) return true;
  const a = cube(from);
  const b = cube(target);
  for (let step = 1; step < distance; step++) {
    const ratio = step / distance;
    const point = roundCube(a.x + (b.x - a.x) * ratio, a.y + (b.y - a.y) * ratio, a.z + (b.z - a.z) * ratio);
    if (isOpaque(point, breached)) return false;
  }
  return true;
}
