import { describe, expect, it } from 'vitest';
import { CARD_OVERFLOW_TICKS, createCardState, drawCards, expireOverflow, extraDrawPriceGold, validateCardState, type FixtureCardId } from './cards.js';
import { createInitialState, stepMatch, type CommandEnvelope, type MatchState } from './simulation.js';
import { advanceCampCombat } from './camp.js';

function putInHand(state: MatchState, id: FixtureCardId): MatchState {
  const player = state.players[0];
  const cards = player.cards;
  if (cards.hand.includes(id)) return state;
  return { ...state, players: [{ ...player, cards: { ...cards, hand: [...cards.hand, id], drawPile: cards.drawPile.filter((entry) => entry !== id) } }, state.players[1]] };
}

function command(type: CommandEnvelope['command'], sequence = 1): CommandEnvelope {
  return { tick: 1, sequence, playerId: 'player:north', command: type };
}

describe('command cards', () => {
  it('draws three seeded opening cards, enforces six slots and expires overflow after 15 seconds', () => {
    const opening = createCardState(19);
    expect(opening.cards.hand).toHaveLength(3);
    expect(opening.cards.locked).toEqual(['card:overtime-surge']);
    const second = drawCards(opening.cards, 3, 1500, opening.rngState);
    expect(second.cards.hand).toHaveLength(6);
    expect(second.cards.overflow).toHaveLength(0);
    const overtime = drawCards(second.cards, 3, 9000, second.rngState);
    expect(overtime.cards.locked).toHaveLength(0);
    expect(overtime.cards.overflow).toHaveLength(3);
    expect(overtime.cards.drawPile).toContain('card:overtime-surge');
    const finishOvertimeDraw = drawCards(overtime.cards, 4, 9000, overtime.rngState);
    expect(finishOvertimeDraw.cards.overflow).toHaveLength(7);
    expect(finishOvertimeDraw.cards.overflow).toContainEqual({ id: 'card:overtime-surge', expiresAtTick: 9000 + CARD_OVERFLOW_TICKS });
    expect(validateCardState(overtime.cards, 9000)).toEqual([]);
    const expired = expireOverflow(finishOvertimeDraw.cards, 9150);
    expect(expired.overflow).toHaveLength(0);
    expect(expired.discard).toContain('card:overtime-surge');
    expect(validateCardState(expired, 9150)).toEqual([]);
    expect(createCardState(19)).toEqual(opening);
  });

  it('charges increasing prices only when an extra draw exists', () => {
    expect([0, 1, 2, 3, 7].map(extraDrawPriceGold)).toEqual([100, 250, 500, 1000, 1000]);
    const start = createInitialState(31);
    const funded: MatchState = { ...start, players: [{ ...start.players[0], goldMilli: 100000 }, start.players[1]] };
    const bought = stepMatch(funded, [command({ type: 'buy-card' })]);
    expect(bought.rejected).toEqual([]);
    expect(bought.state.players[0].goldMilli).toBe(1000);
    expect(bought.state.players[0].cards.hand).toHaveLength(4);
    expect(bought.state.players[0].cards.extraBuys).toBe(1);
    expect(validateCardState(bought.state.players[0].cards, 1)).toEqual([]);
    const poor = stepMatch(createInitialState(31), [command({ type: 'buy-card' })]);
    expect(poor.rejected[0].reason).toContain('Insufficient gold');
  });

  it('casts a real free card, consumes it, and rejects a missing card', () => {
    const start = putInHand(createInitialState(32), 'card:gold-rush');
    const cast = stepMatch(start, [command({ type: 'play-card', cardId: 'card:gold-rush' })]);
    expect(cast.rejected).toEqual([]);
    expect(cast.state.players[0].goldMilli).toBe(151000);
    expect(cast.state.players[0].cards.discard).toContain('card:gold-rush');
    expect(cast.cardEvents).toEqual([{ id: 'card:cast:1:1', tick: 1, ownerId: 'player:north', cardId: 'card:gold-rush', targets: [{ unitId: null, col: 75, row: 5 }] }]);
    const duplicate = stepMatch(cast.state, [{ ...command({ type: 'play-card', cardId: 'card:gold-rush' }), tick: 2 }]);
    expect(duplicate.rejected[0].reason).toContain('not in hand');
    expect(duplicate.cardEvents).toEqual([]);
  });

  it('requires a friendly platoon for Phalanx and applies its six-second window', () => {
    const start = putInHand(createInitialState(33), 'card:phalanx-formation');
    const invalid = stepMatch(start, [command({ type: 'play-card', cardId: 'card:phalanx-formation', platoonId: 'platoon:south:1' })]);
    expect(invalid.rejected[0].reason).toContain('friendly');
    expect(invalid.cardEvents).toEqual([]);
    const cast = stepMatch(start, [command({ type: 'play-card', cardId: 'card:phalanx-formation', platoonId: 'platoon:north:1' })]);
    expect(cast.rejected).toEqual([]);
    expect(cast.cardEvents).toHaveLength(1);
    expect(cast.cardEvents[0].targets.map((target) => target.unitId)).toEqual(start.players[0].platoons[0].unitIds);
    expect(cast.state.players[0].cardEffects.phalanxUntil).toBe(61);
    expect(cast.state.players[0].cardEffects.phalanxPlatoonId).toBe('platoon:north:1');
  });

  it('changes movement and recruitment during active card windows', () => {
    const start = putInHand(createInitialState(34), 'card:forced-march');
    const order = command({ type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 15 } }, 2);
    const normal = stepMatch(start, [order]);
    const marched = stepMatch(start, [command({ type: 'play-card', cardId: 'card:forced-march' }), order]);
    expect(marched.state.players[0].platoons[0].moveProgressMilli).toBeGreaterThan(normal.state.players[0].platoons[0].moveProgressMilli);
    expect(marched.state.players[0].cardEffects.forcedMarchUntil).toBe(81);

    const funded = putInHand(createInitialState(35), 'card:supply-line-convoy');
    const player = { ...funded.players[0], goldMilli: 60000 };
    const recruitState: MatchState = { ...funded, players: [player, funded.players[1]] };
    const discounted = stepMatch(recruitState, [
      command({ type: 'play-card', cardId: 'card:supply-line-convoy' }),
      command({ type: 'recruit', unitDefinitionId: 'unit-def:jungle-stalker', platoonId: 'platoon:north:2' }, 2),
    ]);
    expect(discounted.rejected).toEqual([]);
    expect(discounted.state.players[0].goldMilli).toBe(19000);
    expect(discounted.state.players[0].cardEffects.supplyLineUntil).toBe(901);
  });

  it('doubles common-camp gold and commander XP while Alchemical Boom is active', () => {
    const start = createInitialState(36);
    const attacker = { ...start.players[0].units[0], col: start.camps[0].monsters[0].col, row: start.camps[0].monsters[0].row, attackProgressMilli: 1000 };
    const north = { ...start.players[0], units: [attacker, ...start.players[0].units.slice(1)], cardEffects: { ...start.players[0].cardEffects, alchemicalBoomUntil: 100 } };
    const camp = { ...start.camps[0], monsters: start.camps[0].monsters.map((monster, index) => index === 0 ? { ...monster, hp: 1 } : monster) };
    const result = advanceCampCombat([north, start.players[1]], camp, 1, start.rngState);
    expect(result.players[0].goldMilli).toBe(200000);
    expect(result.players[0].commanderXp).toBe(160);
  });
});
