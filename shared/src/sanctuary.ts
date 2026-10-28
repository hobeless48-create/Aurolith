import { hexDistance } from './pathfinding.js';
import type { PlayerState, UnitState } from './simulation.js';

const HEAL_BONUS_BPS = [0, 4000, 6000, 9000] as const;

/** Sanctuary amplifies healing inside eight hexes of its 3×3 footprint. Duplicate copies have half potency. */
export function healingMultiplierBps(player: PlayerState, unit: UnitState): number {
  const sanctuaries = player.facilities.filter((slot) => slot.kind === 'sanctuary' && slot.tier > 0 && slot.hp > 0)
    .sort((a, b) => b.tier - a.tier || a.id.localeCompare(b.id));
  let bonus = 0;
  for (const [index, slot] of sanctuaries.entries()) {
    let distance = Infinity;
    for (let row = slot.row; row < slot.row + 3; row++) for (let col = slot.col; col < slot.col + 3; col++) {
      distance = Math.min(distance, hexDistance(unit, { col, row }));
    }
    if (distance <= 8) bonus += Math.round(HEAL_BONUS_BPS[slot.tier] * (index === 0 ? 1 : 0.5));
  }
  return 10000 + bonus;
}
