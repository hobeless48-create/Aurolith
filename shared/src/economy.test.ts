import { describe, expect, it } from 'vitest';
import { commanderLevelForXp, createInitialState, guildContracts, maxRecruitTierForLevel, stepMatch, type MatchState } from './simulation.js';
import { fixtureCatalog } from './fixture.js';

describe('commander and Academy economy', () => {
  it('offers the full unlocked Guild pool by class with no seed-based rolling', () => {
    const catalog = { ...fixtureCatalog, units: fixtureCatalog.units.map((unit) => unit.id === 'unit-def:sapper-drox' ? { ...unit, tier: 3 as const } : unit) };
    const low = createInitialState(1, catalog);
    const otherSeed = createInitialState(2, catalog);
    expect(low.availableUnitIds).toEqual(otherSeed.availableUnitIds);
    expect(guildContracts(low, 'player:north', catalog).map((unit) => unit.id)).toEqual(['unit-def:jungle-stalker']);
    const locked = stepMatch(low, [{ tick: 1, sequence: 0, playerId: 'player:north', command: { type: 'recruit', unitDefinitionId: 'unit-def:sapper-drox', platoonId: 'platoon:north:2' } }], catalog);
    expect(locked.rejected[0].reason).toBe('Champion tier is locked by commander level');
    const leveled: MatchState = { ...low, players: [{ ...low.players[0], commanderXp: 1200, goldMilli: 100000 }, low.players[1]] };
    expect(guildContracts(leveled, 'player:north', catalog).map((unit) => unit.id)).toEqual(['unit-def:jungle-stalker', 'unit-def:nightblade', 'unit-def:sapper-drox']);
    const hired = stepMatch(leveled, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'recruit', unitDefinitionId: 'unit-def:sapper-drox', platoonId: 'platoon:north:2' } }], catalog);
    expect(hired.accepted).toEqual([1]);
    expect(guildContracts(hired.state, 'player:north', catalog).map((unit) => unit.id)).toEqual(['unit-def:jungle-stalker', 'unit-def:nightblade']);
  });

  it('uses the canonical level thresholds and tier gates', () => {
    expect(commanderLevelForXp(0)).toBe(1);
    expect(commanderLevelForXp(499)).toBe(1);
    expect(commanderLevelForXp(500)).toBe(2);
    expect(commanderLevelForXp(3400)).toBe(5);
    expect(commanderLevelForXp(9000)).toBe(8);
    expect(commanderLevelForXp(14500)).toBe(10);
    expect(maxRecruitTierForLevel(1)).toBe(1);
    expect(maxRecruitTierForLevel(2)).toBe(2);
    expect(maxRecruitTierForLevel(5)).toBe(4);
    expect(maxRecruitTierForLevel(8)).toBe(5);
  });

  it('spends exactly 100g for 100 commander or unit XP, with insufficient-funds rejection', () => {
    let state = createInitialState(30);
    const early = stepMatch(state, [{ tick: 1, sequence: 0, playerId: 'player:north', command: { type: 'train-commander' } }]);
    expect(early.rejected[0].reason).toBe('Insufficient gold for Academy training');
    state = early.state;
    for (let tick = 2; tick < 100; tick++) state = stepMatch(state).state;
    const trained = stepMatch(state, [{ tick: 100, sequence: 1, playerId: 'player:north', command: { type: 'train-commander' } }]);
    expect(trained.accepted).toEqual([1]);
    expect(trained.state.players[0].goldMilli).toBe(0);
    expect(trained.state.players[0].commanderXp).toBe(200);
    state = trained.state;
    for (let tick = 101; tick < 200; tick++) state = stepMatch(state).state;
    const unitId = state.players[0].units[0].id;
    const trainedUnit = stepMatch(state, [{ tick: 200, sequence: 2, playerId: 'player:north', command: { type: 'train-unit', unitId } }]);
    expect(trainedUnit.accepted).toEqual([2]);
    expect(trainedUnit.state.players[0].goldMilli).toBe(0);
    expect(trainedUnit.state.players[0].units[0]).toMatchObject({ xp: 100, level: 2 });
  });
});
