import { describe, expect, it } from 'vitest';
import { advanceCampCombat } from './camp.js';
import { createInitialState, type PlayerState } from './simulation.js';

describe('common jungle camp fixture', () => {
  it('does not attack a jungle camp while retreating', () => {
    const state = createInitialState(43);
    const attacker = { ...state.players[0].units[0], col: state.camps[0].monsters[0].col, row: state.camps[0].monsters[0].row, attackProgressMilli: 1000 };
    const north: PlayerState = { ...state.players[0], units: [attacker], platoons: state.players[0].platoons.map((platoon, index) => index === 0
      ? { ...platoon, stance: 'retreat' as const, unitIds: [attacker.id] } : platoon) };
    const result = advanceCampCombat([north, state.players[1]], state.camps[0], 1, state.rngState);
    expect(result.camp.monsters[0].hp).toBe(state.camps[0].monsters[0].hp);
    expect(result.players[0].units[0].attackProgressMilli).toBe(1000);
  });

  it('keeps mirrored camps and their respawn timers independent', () => {
    const state = createInitialState(46);
    expect(state.camps).toHaveLength(2);
    expect(state.camps[0].id).not.toBe(state.camps[1].id);
    const west = { ...state.camps[0], monsters: state.camps[0].monsters.map((monster) => ({ ...monster, hp: 0 })), respawnAtTick: 410, clearCount: 1 };
    const awaiting = advanceCampCombat(state.players, west, 409, state.rngState);
    expect(awaiting.camp.monsters.every((monster) => monster.hp === 0)).toBe(true);
    const east = advanceCampCombat(awaiting.players, state.camps[1], 409, awaiting.rngState);
    expect(east.camp.monsters.every((monster) => monster.hp === 1300)).toBe(true);
    expect(east.camp.respawnAtTick).toBeNull();
  });

  it('awards last-hit bounty, squad XP and seeded materials, then respawns after 40 seconds', () => {
    const state = createInitialState(44);
    const monsters = state.camps[0].monsters.map((monster) => ({ ...monster, hp: 1 }));
    const north: PlayerState = { ...state.players[0], units: state.players[0].units.map((unit, index) => ({ ...unit, col: monsters[index].col, row: monsters[index].row, attackProgressMilli: 1000 })) };
    const camp = { ...state.camps[0], monsters };
    const killed = advanceCampCombat([north, state.players[1]], camp, 10, state.rngState);
    expect(killed.camp.monsters.every((monster) => monster.hp === 0)).toBe(true);
    expect(killed.camp.clearCount).toBe(1);
    expect(killed.camp.respawnAtTick).toBe(410);
    expect(killed.players[0].goldMilli).toBe(500000);
    expect(killed.players[0].commanderXp).toBe(400);
    expect(killed.players[0].units.every((unit) => unit.xp === 50)).toBe(true);
    expect(killed.players[0].materials['Gilded Ore']).toBeGreaterThanOrEqual(10);
    expect(killed.players[0].materials['Gilded Ore']).toBeLessThanOrEqual(15);
    expect(killed.players[1].goldMilli).toBe(0);
    const tooSoon = advanceCampCombat(killed.players, killed.camp, 409, killed.rngState);
    expect(tooSoon.camp.monsters.every((monster) => monster.hp === 0)).toBe(true);
    const respawned = advanceCampCombat(tooSoon.players, tooSoon.camp, 410, tooSoon.rngState);
    expect(respawned.camp.monsters.every((monster) => monster.hp === 1300)).toBe(true);
    expect(respawned.camp.respawnAtTick).toBeNull();
    expect(advanceCampCombat([north, state.players[1]], camp, 10, state.rngState).rngState).toBe(killed.rngState);
  });

  it('does not award a distant platoon any bounty', () => {
    const state = createInitialState(45);
    const input: [PlayerState, PlayerState] = [
      { ...state.players[0], units: state.players[0].units.map((unit) => ({ ...unit, attackProgressMilli: 1000 })) },
      state.players[1],
    ];
    const result = advanceCampCombat(input, state.camps[0], 10, state.rngState);
    expect(result.players[0].goldMilli).toBe(0);
    expect(result.camp.monsters.every((monster) => monster.hp === 1300)).toBe(true);
  });
});
