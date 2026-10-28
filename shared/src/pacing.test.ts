import { describe, expect, it } from 'vitest';
import { botCommands } from './bot.js';
import { hasBlessing, passiveGoldBonusBps } from './blessings.js';
import { createInitialState, MATCH_LIMIT_TICKS, scheduledEventsAtTick, stepMatch, validateMatchState, type MatchState, type StepResult } from './simulation.js';

function verifyResourceLedger(before: MatchState, step: StepResult): void {
  for (const player of step.state.players) {
    const previous = before.players.find((entry) => entry.id === player.id)!;
    const events = step.economyEvents.filter((event) => event.playerId === player.id);
    const goldDelta = events.reduce((sum, event) => sum + event.goldMilliDelta, 0);
    const xpDelta = events.reduce((sum, event) => sum + event.commanderXpDelta, 0);
    if (goldDelta !== player.goldMilli - previous.goldMilli || xpDelta !== player.commanderXp - previous.commanderXp) {
      throw new Error(`Unexplained resources at tick ${step.state.tick} for ${player.id}: gold ${goldDelta}/${player.goldMilli - previous.goldMilli}, XP ${xpDelta}/${player.commanderXp - previous.commanderXp}`);
    }
    for (const field of ['materials', 'arsenal'] as const) {
      const keys = new Set([...Object.keys(previous[field]), ...Object.keys(player[field]), ...events.flatMap((event) => Object.keys(event[`${field}Delta`]))]);
      for (const key of keys) {
        const delta = events.reduce((sum, event) => sum + (event[`${field}Delta`][key] ?? 0), 0);
        if (delta !== (player[field][key] ?? 0) - (previous[field][key] ?? 0)) throw new Error(`Unexplained ${field}:${key} at tick ${step.state.tick} for ${player.id}`);
      }
    }
    if (events.reduce((sum, event) => sum + event.relicsDelta, 0) !== player.relics - previous.relics) throw new Error(`Unexplained relics at tick ${step.state.tick} for ${player.id}`);
  }
  for (const event of step.economyEvents) {
    if (event.tick !== step.state.tick || event.goldMilliDelta === 0 && event.commanderXpDelta === 0 && !Object.keys(event.materialsDelta).length && !Object.keys(event.arsenalDelta).length && !event.relicsDelta) throw new Error('Invalid economy event');
    if (event.source === 'command' && (event.commandSequence === null || !step.accepted.includes(event.commandSequence) || !event.commandType)) throw new Error('Economy event references an unaccepted command');
  }
}

function snapshot(state: MatchState) {
  return {
    tick: state.tick,
    phase: state.phase,
    players: state.players.map((player) => ({
      gold: player.goldMilli / 1000,
      xp: player.commanderXp,
      army: player.units.length,
      living: player.units.filter((unit) => unit.hp > 0).length,
      facilities: player.facilities.filter((slot) => slot.kind !== null).length,
      coreHp: player.coreHp,
      wallDamage: player.wallDamage,
      hand: player.cards.hand.length,
      blessings: player.blessings.selected.length,
    })),
    clearedCamps: state.camps.map((camp) => camp.clearCount),
    bossesKilled: state.bosses.filter((boss) => boss.killedAtTick !== null).length,
  };
}

describe('match pacing checkpoints', () => {
  it('audits seeded bot matches at each reached checkpoint and ends them legally', () => {
    for (const seed of [1, 2, 42]) {
      let state = createInitialState(seed);
      const checkpoints: ReturnType<typeof snapshot>[] = [];
      while (state.phase !== 'ended') {
        const commands = [...botCommands(state, 'player:north'), ...botCommands(state, 'player:south')];
        const step = stepMatch(state, commands);
        expect(step.rejected).toEqual([]);
        verifyResourceLedger(state, step);
        state = step.state;
        if ([3000, 6000, 9000].includes(state.tick)) {
          expect(validateMatchState(state)).toEqual([]);
          checkpoints.push(snapshot(state));
        }
        if (state.tick > MATCH_LIMIT_TICKS) throw new Error('Match exceeded the limit');
      }
      expect(state.result).not.toBeNull();
      expect(checkpoints.map((entry) => entry.tick)).toEqual([3000, 6000]);
      expect(state.tick).toBeGreaterThan(6000);
      expect(state.tick).toBeLessThan(9000);
      const scheduled = Array.from({ length: state.tick + 1 }, (_, tick) => scheduledEventsAtTick(tick)).flat().map((event) => event.id).sort();
      expect(state.events.map((event) => event.id).sort()).toEqual(scheduled);
      expect(checkpoints[0].players.every((player) => player.wallDamage === 0 && player.blessings === 1)).toBe(true);
      expect(checkpoints[1].players.every((player) => player.wallDamage > 0 && player.blessings === 2)).toBe(true);
      expect(checkpoints.every((entry) => entry.players.every((player) => player.gold >= 0 && player.xp >= entry.tick && player.army === 7))).toBe(true);
    }
  }, 30000);

  it('accounts for passive gold, XP and overtime income through 15:00 and the 18:00 result', () => {
    let state = createInitialState(7);
    for (let tick = 1; tick <= MATCH_LIMIT_TICKS; tick++) {
      const before = state;
      const step = stepMatch(state);
      verifyResourceLedger(state, step);
      state = step.state;
      if ([8999, 9001].includes(tick)) {
        for (const [index, player] of state.players.entries()) {
          const base = tick < 9000 ? 1000 : 1500;
          expect(player.goldMilli - before.players[index].goldMilli).toBe(Math.round(base * (10000 + passiveGoldBonusBps(player.blessings)) / 10000));
        }
      }
      if (![3000, 6000, 9000, MATCH_LIMIT_TICKS].includes(tick)) continue;
      expect(validateMatchState(state)).toEqual([]);
      for (const player of state.players) {
        expect(player.goldMilli).toBeGreaterThan(0);
        expect(player.commanderXp).toBeGreaterThanOrEqual(tick);
      }
    }
    const scheduled = Array.from({ length: MATCH_LIMIT_TICKS + 1 }, (_, tick) => scheduledEventsAtTick(tick)).flat().map((event) => event.id).sort();
    expect(state.events.map((event) => event.id).sort()).toEqual(scheduled);
    expect(state.phase).toBe('ended');
    expect(state.result?.reason).toBe('draw');
  }, 30000);
});
