import { describe, expect, it } from 'vitest';
import { botCommands } from './bot.js';
import { createInitialState, MATCH_LIMIT_TICKS, stateHash, stepMatch, validateMatchState } from './simulation.js';

describe('seeded solo matches', () => {
  it('routes the main platoon to each shared boss during the authored contest windows', () => {
    const cases = [
      { start: 900, end: 2700, index: 0 },
      { start: 4500, end: 5700, index: 1 },
      { start: 6900, end: 8700, index: 2 },
    ];
    const initial = createInitialState(6);
    for (const { start, end, index } of cases) {
      for (const tick of [start, end - 1]) {
        const state = { ...initial, tick };
        const order = botCommands(state, 'player:north').find((envelope) => envelope.command.type === 'set-order' && envelope.command.platoonId === state.players[0].platoons[0].id);
        expect(order?.command).toMatchObject({ type: 'set-order', target: { col: state.bosses[index].col, row: state.bosses[index].row } });
      }
      const atEnd = { ...initial, tick: end };
      const order = botCommands(atEnd, 'player:north').find((envelope) => envelope.command.type === 'set-order' && envelope.command.platoonId === atEnd.players[0].platoons[0].id);
      expect(order?.command).not.toMatchObject({ target: { col: atEnd.bosses[index].col, row: atEnd.bosses[index].row } });
    }
  });

  it('dispatches Platoon 2 to steal a boss below half HP only when the enemy has damaged it', () => {
    const initial = createInitialState(8);
    const boss = initial.bosses[0];
    const scout = initial.players[0].units[0];
    const farmId = initial.players[0].platoons[1].id;
    const north = {
      ...initial.players[0],
      units: initial.players[0].units.map((unit) => unit.id === scout.id ? { ...unit, platoonId: farmId } : unit),
      platoons: initial.players[0].platoons.map((platoon, index) => index === 1 ? { ...platoon, unitIds: [scout.id] } : platoon),
    };
    const orderForFarm = (state: typeof initial) => botCommands(state, 'player:north').find((envelope) =>
      envelope.command.type === 'set-order' && envelope.command.platoonId === state.players[0].platoons[1].id)?.command;
    const contested = { ...initial, tick: 1600, players: [north, initial.players[1]] as const, bosses: [{ ...boss, hp: 700, spawnedAtTick: 1200, damageByPlayer: [200, 600] as const }, ...initial.bosses.slice(1)] };
    expect(orderForFarm(contested)).toMatchObject({ type: 'set-order', target: { col: boss.col, row: boss.row } });

    const exactlyHalf = { ...contested, bosses: [{ ...contested.bosses[0], hp: 750, damageByPlayer: [100, 100] as const }, ...contested.bosses.slice(1)] };
    expect(orderForFarm(exactlyHalf)).not.toMatchObject({ target: { col: boss.col, row: boss.row } });

    const noEnemyDamage = { ...contested, bosses: [{ ...contested.bosses[0], damageByPlayer: [800, 0] as const }, ...contested.bosses.slice(1)] };
    expect(orderForFarm(noEnemyDamage)).not.toMatchObject({ target: { col: boss.col, row: boss.row } });
  });

  it('reaches the 18-minute result and records every scheduled milestone once without an early siege', () => {
    let state = createInitialState(7);
    for (let tick = 1; tick <= MATCH_LIMIT_TICKS; tick++) state = stepMatch(state).state;
    expect(state.tick).toBe(MATCH_LIMIT_TICKS);
    expect(state.phase).toBe('ended');
    expect(state.result?.reason).toBe('draw');
    for (const milestone of [0, 1500, 3000, 4500, 6000, 7500, 9000, 10800]) {
      expect(state.events.some((event) => event.tick === milestone)).toBe(true);
    }
    expect(state.events.filter((event) => event.type === 'rite-open').map((event) => event.tick)).toEqual([0, 3000, 6000]);
    expect(state.events.filter((event) => event.type === 'phase-change').map((event) => event.tick)).toEqual([3000, 6000, 9000]);
    expect(state.events.filter((event) => event.type === 'match-limit').map((event) => event.tick)).toEqual([10800]);
    expect(new Set(state.events.map((event) => event.id)).size).toBe(state.events.length);
    expect(validateMatchState(state)).toEqual([]);
  }, 30000);

  it('uses legal commands and reaches a core collapse or the 18-minute limit', () => {
    const hashes: string[] = [];
    for (const seed of [1, 2, 42]) {
      let state = createInitialState(seed);
      let rejected = 0;
      let facilityShots = 0;
      const builtCaravan = new Set<string>();
      const builtBallista = new Set<string>();
      const builtBarrier = new Set<string>();
      while (state.phase !== 'ended') {
        const commands = [...botCommands(state, 'player:north'), ...botCommands(state, 'player:south')];
        const step = stepMatch(state, commands);
        if (step.rejected.length) throw new Error(`Bot command rejected at tick ${state.tick + 1}: ${JSON.stringify(step.rejected)} from ${JSON.stringify(commands)}`);
        rejected += step.rejected.length;
        facilityShots += step.facilityEvents.length;
        state = step.state;
        for (const player of state.players) {
          if (player.facilities.some((slot) => slot.kind === 'caravan-post' && slot.tier > 0)) builtCaravan.add(player.id);
          if (player.facilities.some((slot) => slot.kind === 'ballista' && slot.tier > 0)) builtBallista.add(player.id);
          if (player.facilities.some((slot) => slot.kind === 'arcane-barrier' && slot.tier > 0)) builtBarrier.add(player.id);
        }
        if (state.tick % 500 === 0) expect(validateMatchState(state)).toEqual([]);
        if (state.tick > MATCH_LIMIT_TICKS) throw new Error('Match exceeded 18 minutes');
      }
      expect(rejected).toBe(0);
      expect(facilityShots).toBeGreaterThan(0);
      expect(state.result).not.toBeNull();
      expect(state.tick).toBeLessThanOrEqual(MATCH_LIMIT_TICKS);
      expect(state.tick).toBeGreaterThanOrEqual(3000);
      expect(new Set(state.events.map((event) => event.id)).size).toBe(state.events.length);
      expect(validateMatchState(state)).toEqual([]);
      expect(state.players[0].wallDamage + state.players[1].wallDamage).toBeGreaterThan(0);
      expect(state.camps.every((camp) => camp.clearCount > 0)).toBe(true);
      expect(state.bosses[0].killedAtTick).not.toBeNull();
      expect(builtCaravan.size).toBe(2);
      expect(builtBallista.size).toBe(2);
      expect(builtBarrier.size).toBe(2);
      if (state.result?.reason === 'core-collapse') {
        const loser = state.result.winnerId === 'player:north' ? 'player:south' : 'player:north';
        expect(state.walls.some((wall) => wall.ownerId === loser && wall.layer === 'outer' && wall.hp === 0)).toBe(true);
        expect(state.walls.some((wall) => wall.ownerId === loser && wall.layer === 'inner' && wall.hp === 0)).toBe(true);
      }
      hashes.push(stateHash(state));
    }
    expect(new Set(hashes).size).toBe(3);
  }, 30000);
});
