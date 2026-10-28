import { describe, expect, it } from 'vitest';
import { advanceBallistaCombat, caravanPaymentMilli, createFacilitySlots, damageFacility, occupiedFacilityHexes, progressFacilities } from './facilities.js';
import { canTraverse } from './pathfinding.js';
import { createInitialState, stepMatch, validateMatchState, type MatchState } from './simulation.js';
import { healingMultiplierBps } from './sanctuary.js';
import { advanceUnitCombatWithEvents } from './combat.js';

function ordered(state: MatchState, sequence: number, command: object) {
  return { tick: state.tick + 1, sequence, playerId: 'player:north', command };
}

describe('six-slot fortress facility fixture', () => {
  it('amplifies local healing by Sanctuary tier and halves duplicate potency', () => {
    const initial = createInitialState(88);
    const unit = { ...initial.players[0].units[0], col: 61, row: 18 };
    const slots = initial.players[0].facilities;
    const first = { ...slots[0], kind: 'sanctuary' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const player = { ...initial.players[0], facilities: [first, ...slots.slice(1)] };
    expect(healingMultiplierBps(player, unit)).toBe(14000);
    expect(healingMultiplierBps(player, { ...unit, col: 75, row: 45 })).toBe(10000);
    const second = { ...slots[1], kind: 'sanctuary' as const, tier: 3 as const, hp: 1000, maxHp: 1000 };
    expect(healingMultiplierBps({ ...player, facilities: [first, second, ...slots.slice(2)] }, unit)).toBe(21000);
    expect(healingMultiplierBps({ ...player, facilities: [first, { ...second, hp: 0 }, ...slots.slice(2)] }, unit)).toBe(14000);
  });

  it('applies Sanctuary healing to a combat level-up and Academy training', () => {
    const initial = createInitialState(89);
    const slot = { ...initial.players[0].facilities[0], kind: 'sanctuary' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const fighter = { ...initial.players[0].units[0], col: 61, row: 18, hp: 100, xp: 90, attackProgressMilli: 1000 };
    const enemy = { ...initial.players[1].units[0], col: 62, row: 18, hp: 1 };
    const north = { ...initial.players[0], units: [fighter], facilities: [slot, ...initial.players[0].facilities.slice(1)] };
    const combat = advanceUnitCombatWithEvents([north, { ...initial.players[1], units: [enemy] }], 1);
    expect(combat.players[0].units[0]).toMatchObject({ xp: 110, level: 2, hp: 260 });
    const trainingStart: MatchState = { ...initial, players: [{ ...north, goldMilli: 100000, units: [{ ...fighter, xp: 0, attackProgressMilli: 0 }] }, initial.players[1]] };
    const trained = stepMatch(trainingStart, [ordered(trainingStart, 1, { type: 'train-unit', unitId: fighter.id })]);
    expect(trained.accepted).toEqual([1]);
    expect(trained.state.players[0].units[0]).toMatchObject({ xp: 100, level: 2, hp: 260 });
  });
  it('builds only in owned empty slots, caps a category at three and blocks its footprint', () => {
    const initial = createInitialState(83);
    const funded: MatchState = { ...initial, players: [{ ...initial.players[0], goldMilli: 1000000 }, initial.players[1]] };
    const commands = [0, 1, 2, 3].map((index) => ordered(funded, index, { type: 'build-facility', slotId: funded.players[0].facilities[index].id, kind: 'caravan-post' }));
    const built = stepMatch(funded, commands);
    expect(built.accepted).toEqual([0, 1, 2]);
    expect(built.rejected.map((entry) => entry.reason)).toEqual(['Facility category is full']);
    expect(built.state.players[0].facilities.filter((slot) => slot.kind)).toHaveLength(3);
    expect(built.state.players[0].facilities[0]).toMatchObject({ tier: 0, pendingTier: 1, readyAtTick: 51, hp: 500 });
    const blocked = occupiedFacilityHexes(built.state.players, built.state.tick);
    expect(canTraverse({ col: 56, row: 15 }, { blockedHexes: blocked, travelerId: 'player:north' })).toBe(false);
    expect(validateMatchState(built.state)).toEqual([]);
    const wrongOwner = stepMatch(built.state, [ordered(built.state, 4, { type: 'upgrade-facility', slotId: 'facility-slot:south:1' })]);
    expect(wrongOwner.rejected[0].reason).toBe('Facility slot does not belong to player');
  });

  it('pays caravan gold on the minute boundary with duplicate potency', () => {
    const initial = createInitialState(84);
    let state: MatchState = { ...initial, players: [{ ...initial.players[0], goldMilli: 600000 }, initial.players[1]] };
    state = stepMatch(state, [0, 1].map((index) => ordered(state, index, { type: 'build-facility', slotId: state.players[0].facilities[index].id, kind: 'caravan-post' }))).state;
    while (state.tick < 599) state = stepMatch(state).state;
    expect(state.players[0].facilities.every((slot) => slot.pendingTier === null)).toBe(true);
    expect(caravanPaymentMilli(state.players[0].facilities, 599)).toBe(0);
    expect(caravanPaymentMilli(state.players[0].facilities, 600)).toBe(225000);
    const before = state.players[0].goldMilli;
    const baseline: MatchState = { ...state, players: [{ ...state.players[0], facilities: createFacilitySlots('player:north') }, state.players[1]] };
    const baselineNext = stepMatch(baseline).state;
    state = stepMatch(state).state;
    expect(state.players[0].goldMilli - before).toBe(baselineNext.players[0].goldMilli - baseline.players[0].goldMilli + 225000);
    expect(validateMatchState(state)).toEqual([]);
  });

  it('spends unspent XP for upgrades without lowering commander level and retains damage', () => {
    const initial = createInitialState(85);
    let state: MatchState = { ...initial, players: [{ ...initial.players[0], goldMilli: 1000000, commanderXp: 1000 }, initial.players[1]] };
    const slotId = state.players[0].facilities[0].id;
    state = stepMatch(state, [ordered(state, 0, { type: 'build-facility', slotId, kind: 'caravan-post' })]).state;
    while (state.tick < 51) state = stepMatch(state).state;
    expect(state.players[0].facilities[0].tier).toBe(1);
    const upgraded = stepMatch(state, [ordered(state, 1, { type: 'upgrade-facility', slotId })]);
    expect(upgraded.accepted).toEqual([1]);
    expect(upgraded.state.players[0].facilityXpSpent).toBe(100);
    expect(upgraded.state.players[0].commanderXp).toBeGreaterThan(1000);
    const damaged = damageFacility(upgraded.state.players[0], slotId, 200, 53);
    const finished = progressFacilities(damaged.facilities, 102);
    expect(finished.facilities[0]).toMatchObject({ tier: 2, hp: 550, maxHp: 750, pendingTier: null });
    const destroyed = damageFacility(upgraded.state.players[0], slotId, 999, 53);
    expect(destroyed.facilityXpSpent).toBe(50);
    expect(destroyed.goldMilli - upgraded.state.players[0].goldMilli).toBe(125000);
    expect(destroyed.facilities[0]).toMatchObject({ kind: null, rubbleUntilTick: 153 });
    expect(occupiedFacilityHexes([destroyed], 152).has('hex:56:15')).toBe(true);
    expect(occupiedFacilityHexes([destroyed], 153).has('hex:56:15')).toBe(false);
    const noXp: MatchState = { ...state, players: [{ ...state.players[0], commanderXp: 0, facilityXpSpent: 0 }, state.players[1]] };
    expect(stepMatch(noXp, [ordered(noXp, 2, { type: 'upgrade-facility', slotId })]).rejected[0].reason).toBe('Insufficient unspent commander XP for facility upgrade');
  });

  it('keeps the highest-tier Caravan at full potency and grants its first tier-3 delivery immediately', () => {
    const slots = createFacilitySlots('player:north');
    const highest = { ...slots[0], kind: 'caravan-post' as const, tier: 2 as const, pendingTier: 3 as const, readyAtTick: 100, hp: 600, maxHp: 750 };
    const duplicate = { ...slots[1], kind: 'caravan-post' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const result = progressFacilities([highest, duplicate, ...slots.slice(2)], 100);
    expect(result.facilities[0]).toMatchObject({ tier: 3, hp: 850, maxHp: 1000 });
    expect(result.instantGoldMilli).toBe(500000);
    expect(caravanPaymentMilli(result.facilities, 600)).toBe(575000);
  });

  it('holds Ballista fire until 5:00, targets the nearest unit and enforces 25-second cooldown', () => {
    const initial = createInitialState(86);
    const slot = { ...createFacilitySlots('player:north')[0], kind: 'ballista' as const, tier: 1 as const, hp: 500, maxHp: 500, nextAttackTick: 3000 };
    const north = { ...initial.players[0], facilities: [slot, ...initial.players[0].facilities.slice(1)] };
    const near = { ...initial.players[1].units[0], col: 56, row: 20 };
    const far = { ...initial.players[1].units[1], col: 56, row: 21 };
    const south = { ...initial.players[1], units: [near, far] };
    expect(advanceBallistaCombat([north, south], 2999).events).toEqual([]);
    const fired = advanceBallistaCombat([north, south], 3000);
    expect(fired.events).toHaveLength(1);
    expect(fired.events[0].target).toEqual({ col: near.col, row: near.row });
    expect(fired.players[1].units[0].hp).toBe(0);
    expect(fired.players[0].facilities[0].nextAttackTick).toBe(3250);
    expect(advanceBallistaCombat(fired.players, 3001).events).toEqual([]);
  });

  it('resolves opposing Ballista shots on the same tick', () => {
    const initial = createInitialState(87);
    const northSlot = { ...initial.players[0].facilities[0], kind: 'ballista' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const southSlot = { ...initial.players[1].facilities[0], kind: 'ballista' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const north = { ...initial.players[0], facilities: [northSlot, ...initial.players[0].facilities.slice(1)], units: [{ ...initial.players[0].units[0], col: 56, row: 69 }] };
    const south = { ...initial.players[1], facilities: [southSlot, ...initial.players[1].facilities.slice(1)], units: [{ ...initial.players[1].units[0], col: 56, row: 20 }] };
    const result = advanceBallistaCombat([north, south], 3000);
    expect(result.events).toHaveLength(2);
    expect(result.players[0].units[0].hp).toBe(0);
    expect(result.players[1].units[0].hp).toBe(0);
  });
});
