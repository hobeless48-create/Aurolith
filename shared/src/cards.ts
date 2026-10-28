import { nextRandomUint32 } from './rng.js';

/** Executable Stage 2 subset of the canonical 25-card master pool. */
export const FIXTURE_CARD_IDS = [
  'card:phalanx-formation',
  'card:gold-rush',
  'card:xp-surge',
  'card:supply-line-convoy',
  'card:alchemical-boom',
  'card:alchemical-landmine',
  'card:spike-chokepoint',
  'card:decoy-illusion',
  'card:ambush-net',
  'card:explosive-gas-cloud',
  'card:falcon-recon',
  'card:forced-march',
  'card:overtime-surge',
] as const;
export type FixtureCardId = typeof FIXTURE_CARD_IDS[number];
export const CARD_HAND_CAP = 6;
export const CARD_OVERFLOW_TICKS = 150;
const EXTRA_DRAW_PRICES = [100, 250, 500, 1000] as const;

export type OverflowCard = Readonly<{ id: FixtureCardId; expiresAtTick: number }>;
export type CardState = Readonly<{
  drawPile: readonly FixtureCardId[];
  locked: readonly FixtureCardId[];
  hand: readonly FixtureCardId[];
  overflow: readonly OverflowCard[];
  discard: readonly FixtureCardId[];
  extraBuys: number;
}>;
export type CardDrawResult = Readonly<{ cards: CardState; rngState: number; drawn: readonly FixtureCardId[] }>;

export function extraDrawPriceGold(extraBuys: number): number {
  return EXTRA_DRAW_PRICES[Math.min(extraBuys, EXTRA_DRAW_PRICES.length - 1)];
}

function shuffle(input: readonly FixtureCardId[], startRngState: number): { pile: FixtureCardId[]; rngState: number } {
  const pile = [...input];
  let rngState = startRngState;
  for (let index = pile.length - 1; index > 0; index--) {
    const draw = nextRandomUint32(rngState);
    rngState = draw.nextState;
    const other = draw.value % (index + 1);
    [pile[index], pile[other]] = [pile[other], pile[index]];
  }
  return { pile, rngState };
}

export function createCardState(rngState: number): CardDrawResult {
  const shuffled = shuffle(FIXTURE_CARD_IDS.filter((id) => id !== 'card:overtime-surge'), rngState);
  const cards: CardState = { drawPile: shuffled.pile, locked: ['card:overtime-surge'], hand: [], overflow: [], discard: [], extraBuys: 0 };
  return { ...drawCards(cards, 3, 0, shuffled.rngState) };
}

export function expireOverflow(cards: CardState, tick: number): CardState {
  const expired = cards.overflow.filter((card) => card.expiresAtTick <= tick);
  if (!expired.length) return cards;
  return { ...cards, overflow: cards.overflow.filter((card) => card.expiresAtTick > tick), discard: [...cards.discard, ...expired.map((card) => card.id)] };
}

export function drawCards(previous: CardState, count: number, tick: number, startRngState: number): CardDrawResult {
  let cards = expireOverflow(previous, tick);
  let rngState = startRngState;
  if (tick >= 9000 && cards.locked.length) {
    cards = { ...cards, drawPile: [...cards.drawPile, ...cards.locked], locked: [] };
  }
  const drawn: FixtureCardId[] = [];
  for (let index = 0; index < count; index++) {
    if (cards.drawPile.length === 0 && cards.discard.length) {
      const shuffled = shuffle(cards.discard, rngState);
      rngState = shuffled.rngState;
      cards = { ...cards, drawPile: shuffled.pile, discard: [] };
    }
    if (cards.drawPile.length === 0) break;
    const id = cards.drawPile[0];
    cards = {
      ...cards,
      drawPile: cards.drawPile.slice(1),
      hand: cards.hand.length < CARD_HAND_CAP ? [...cards.hand, id] : cards.hand,
      overflow: cards.hand.length < CARD_HAND_CAP ? cards.overflow : [...cards.overflow, { id, expiresAtTick: tick + CARD_OVERFLOW_TICKS }],
    };
    drawn.push(id);
  }
  return { cards, rngState, drawn };
}

export function consumeCard(cards: CardState, id: string, tick: number): CardState | null {
  const current = expireOverflow(cards, tick);
  if (current.hand.includes(id as FixtureCardId)) return { ...current, hand: current.hand.filter((entry) => entry !== id), discard: [...current.discard, id as FixtureCardId] };
  if (current.overflow.some((entry) => entry.id === id)) return { ...current, overflow: current.overflow.filter((entry) => entry.id !== id), discard: [...current.discard, id as FixtureCardId] };
  return null;
}

export function validateCardState(cards: CardState, tick: number): string[] {
  const all = [...cards.drawPile, ...cards.locked, ...cards.hand, ...cards.overflow.map((card) => card.id), ...cards.discard];
  const errors: string[] = [];
  if (cards.hand.length > CARD_HAND_CAP || cards.extraBuys < 0 || !Number.isSafeInteger(cards.extraBuys)) errors.push('Invalid card capacity or buy count');
  if (new Set(all).size !== all.length || all.length !== FIXTURE_CARD_IDS.length || all.some((id) => !FIXTURE_CARD_IDS.includes(id))) errors.push('Card pool lost or duplicated a card');
  if (cards.overflow.some((card) => !Number.isSafeInteger(card.expiresAtTick) || card.expiresAtTick <= tick)) errors.push('Expired card remains in overflow');
  if (tick >= 9000 && cards.locked.length) errors.push('Overtime cards did not unlock');
  return errors;
}
