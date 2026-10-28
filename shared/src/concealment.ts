import { getHex } from './board.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { hexDistance } from './pathfinding.js';
import type { UnitState } from './simulation.js';

/** Brush occupants require an adjacent friendly brush scout or Assassin. */
export function canDetectBrushOccupant(allies: readonly UnitState[], enemy: UnitState, catalog: FixtureCatalog = fixtureCatalog): boolean {
  if (!getHex(enemy.col, enemy.row)?.isBrush) return true;
  return allies.some((ally) => ally.hp > 0 && hexDistance(ally, enemy) <= 1 &&
    (getHex(ally.col, ally.row)?.isBrush || catalog.units.find((entry) => entry.id === ally.definitionId)?.role === 'assassin'));
}
