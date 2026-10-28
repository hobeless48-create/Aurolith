import { describe, expect, it } from 'vitest';
import { advanceCampCombat } from './camp.js';
import { createBlessingSetup, hasBlessing, holyNationBonusBps, rerollBlessingOffer, validateBlessingState } from './blessings.js';
import { createInitialState, stepMatch, validateMatchState, type CommandEnvelope, type MatchState } from './simulation.js';

function command(tick: number, sequence: number, command: CommandEnvelope['command']): CommandEnvelope {
  return { tick, sequence, playerId: 'player:north', command };
}

describe('three in-match blessing Rites', () => {
  it('mirrors tier rolls, offers three choices and spends one reroll on fresh options', () => {
    const setup = createBlessingSetup(71);
    expect(setup.tiers).toHaveLength(3);
    expect(new Set(setup.tiers).size).toBe(3);
    expect(setup.north.offer?.tier).toBe(setup.south.offer?.tier);
    expect(setup.north.offer?.options).toHaveLength(3);
    const rerolled = rerollBlessingOffer(setup.north, setup.rngState)!;
    expect(rerolled.blessings.rerollsRemaining).toBe(0);
    expect(rerolled.blessings.offer?.options).toHaveLength(3);
    expect(rerolled.blessings.offer?.options.some((id) => setup.north.offer!.options.includes(id))).toBe(false);
    expect(rerollBlessingOffer(rerolled.blessings, rerolled.rngState)).toBeNull();
    expect(validateBlessingState(rerolled.blessings, 0)).toEqual([]);
  });

  it('rejects an unoffered pick, accepts the current offer and auto-picks at the deadline', () => {
    const start = createInitialState(72);
    const invalid = stepMatch(start, [command(1, 1, { type: 'choose-blessing', blessingId: 'blessing:imperial:royal-treasury' })]);
    expect(invalid.rejected[0].reason).toContain('not in the current Rite offer');
    const selected = stepMatch(start, [command(1, 1, { type: 'choose-blessing', blessingId: start.players[0].blessings.offer!.options[1] })]);
    expect(selected.rejected).toEqual([]);
    expect(selected.state.players[0].blessings.offer).toBeNull();
    expect(selected.state.players[0].blessings.selected).toContain(start.players[0].blessings.offer!.options[1]);
    let state = start;
    for (let tick = 1; tick <= 270; tick++) state = stepMatch(state).state;
    expect(state.players[0].blessings.offer).toBeNull();
    expect(state.players[0].blessings.selected).toEqual([start.players[0].blessings.offer!.options[0]]);
    expect(validateMatchState(state)).toEqual([]);
  });

  it('opens the expansion and siege Rites exactly on their event ticks', () => {
    let state = createInitialState(73);
    for (let tick = 1; tick <= 6000; tick++) {
      state = stepMatch(state).state;
      if (tick === 3000 || tick === 6000) {
        const rite = tick === 3000 ? 1 : 2;
        expect(state.players[0].blessings.offer?.rite).toBe(rite);
        expect(state.players[1].blessings.offer?.tier).toBe(state.players[0].blessings.offer?.tier);
        expect(state.events.filter((event) => event.id === `event:rite-open:${tick}`)).toHaveLength(1);
      }
    }
    expect(state.players[0].blessings.selected).toHaveLength(2);
    expect(new Set(state.players[0].blessings.seen).size).toBe(state.players[0].blessings.seen.length);
    expect(validateMatchState(state)).toEqual([]);
  }, 30000);

  it('applies only the strongest Holy Nation rate and pays a War Chest recruit refund', () => {
    const start = createInitialState(74);
    const holy = { ...start.players[0].blessings, selected: ['blessing:grace:holy-nation', 'blessing:exalted:holy-nation', 'blessing:imperial:holy-nation'], seen: ['blessing:grace:holy-nation', 'blessing:exalted:holy-nation', 'blessing:imperial:holy-nation'], offer: null };
    expect(holyNationBonusBps(holy)).toBe(4000);
    const state: MatchState = { ...start, players: [{ ...start.players[0], blessings: holy }, start.players[1]] };
    const step = stepMatch(state);
    expect(step.state.players[0].goldMilli).toBe(1400);
    expect(step.state.players[0].commanderXpMilli).toBe(400);

    const warChest = { ...start.players[0].blessings, selected: ['blessing:grace:war-chest'], seen: ['blessing:grace:war-chest'], offer: null };
    const funded: MatchState = { ...start, players: [{ ...start.players[0], blessings: warChest, goldMilli: 60000 }, start.players[1]] };
    const hire = stepMatch(funded, [command(1, 1, { type: 'recruit', unitDefinitionId: 'unit-def:jungle-stalker', platoonId: 'platoon:north:2' })]);
    expect(hire.rejected).toEqual([]);
    expect(hire.state.players[0].goldMilli).toBe(11000);
    expect(hire.state.players[0].blessings.recruitsSinceWarChest).toBe(1);
  });

  it('pays Scrap Pickers on a monster kill and a five-monster camp clear', () => {
    const start = createInitialState(75);
    const blessings = { ...start.players[0].blessings, selected: ['blessing:grace:scrap-pickers'], seen: ['blessing:grace:scrap-pickers'], offer: null };
    const target = start.camps[0].monsters[4];
    const attacker = { ...start.players[0].units[0], col: target.col, row: target.row, attackProgressMilli: 1000 };
    const north = { ...start.players[0], blessings, units: [attacker, ...start.players[0].units.slice(1)] };
    const camp = { ...start.camps[0], monsters: start.camps[0].monsters.map((monster, index) => ({ ...monster, hp: index === 4 ? 1 : 0 })) };
    const result = advanceCampCombat([north, start.players[1]], camp, 1, start.rngState);
    expect(result.camp.clearCount).toBe(1);
    expect(result.players[0].goldMilli).toBe(120000);
    expect(hasBlessing(result.players[0].blessings, 'blessing:grace:scrap-pickers')).toBe(true);
  });
});
