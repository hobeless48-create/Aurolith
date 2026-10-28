import { describe, expect, it } from 'vitest';
import { BOARD_COLUMNS } from './board.js';
import { createInitialState, stepMatch, validateMatchState, type CommandEnvelope, type MatchState, type PlayerState } from './simulation.js';
import { advanceTraps, placeLandmine, placeTrap, TRAP_BLAST_RADIUS, TRAP_CARD_KINDS, TRAP_FUSE_TICKS, validTrapHex, validateTraps, type TrapCardId } from './traps.js';
import { hexNeighbors } from './board.js';
import { computeVision, projectPlayerView, projectTrapEvents } from './vision.js';

function putLandmineInHand(state: MatchState): MatchState {
  const player = state.players[0];
  const id = 'card:alchemical-landmine';
  const cards = player.cards;
  if (cards.hand.includes(id)) return state;
  return { ...state, players: [{ ...player, cards: { ...cards, hand: [...cards.hand, id], drawPile: cards.drawPile.filter((card) => card !== id) } }, state.players[1]] };
}

function cast(target: { col: number; row: number }): CommandEnvelope {
  return { tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'play-card', cardId: 'card:alchemical-landmine', target } };
}

describe('Alchemical Landmine fixture', () => {
  it('uses a free card cast on a visible field hex and rejects hidden or castle targets without consuming the card', () => {
    const initial = putLandmineInHand(createInitialState(91));
    const scout: PlayerState = { ...initial.players[0], units: initial.players[0].units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 25 } : unit) };
    const state: MatchState = { ...initial, players: [scout, initial.players[1]] };
    const hidden = stepMatch(state, [cast({ col: 75, row: 45 })]);
    expect(hidden.rejected[0].reason).toContain('active vision');
    expect(hidden.state.players[0].cards.hand).toContain('card:alchemical-landmine');
    const castle = stepMatch(state, [cast({ col: 75, row: 12 })]);
    expect(castle.rejected[0].reason).toContain('battlefield or jungle');
    const placed = stepMatch(state, [cast({ col: 75, row: 26 })]);
    expect(placed.rejected).toEqual([]);
    expect(placed.state.traps).toMatchObject([{ ownerId: 'player:north', col: 75, row: 26, triggeredAtTick: null }]);
    expect(placed.state.players[0].cards.discard).toContain('card:alchemical-landmine');
    expect(placed.trapEvents.map((event) => event.type)).toContain('placed');
    expect(validateMatchState(placed.state)).toEqual([]);
  });

  it('triggers only on enemy entry, holds the trigger unit through a 12-tick fuse, then damages and slows a one-hex area', () => {
    const initial = createInitialState(92);
    const trap = placeLandmine('player:north', 75, 45, 1);
    const beforeSouth: PlayerState = { ...initial.players[1], units: initial.players[1].units.map((unit, index) => index === 0 ? { ...unit, col: 74, row: 45 } : index === 1 ? { ...unit, col: 76, row: 45 } : unit) };
    const afterSouth: PlayerState = { ...beforeSouth, units: beforeSouth.units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 45 } : unit) };
    const friendly = { ...initial.players[0], units: [{ ...initial.players[0].units[0], col: 75, row: 45 }] };
    const idle = advanceTraps([friendly, beforeSouth], [friendly, beforeSouth], [trap], 9);
    expect(idle.traps[0].triggeredAtTick).toBeNull();
    const triggered = advanceTraps([friendly, beforeSouth], [friendly, afterSouth], [trap], 10);
    expect(triggered.traps[0].detonateAtTick).toBe(10 + TRAP_FUSE_TICKS);
    expect(triggered.players[1].units[0].snaredUntilTick).toBe(23);
    expect(triggered.events.map((event) => event.type)).toEqual(['warning']);
    const waiting = advanceTraps(triggered.players, triggered.players, triggered.traps, 21);
    expect(waiting.players[1].units[0].hp).toBe(afterSouth.units[0].hp);
    const blasted = advanceTraps(waiting.players, waiting.players, waiting.traps, 22);
    expect(blasted.traps).toEqual([]);
    expect(blasted.players[1].units[0].hp).toBeLessThan(afterSouth.units[0].hp);
    expect(blasted.players[1].units[1].hp).toBeLessThan(afterSouth.units[1].hp);
    expect(blasted.players[0].units[0].hp).toBe(friendly.units[0].hp);
    expect(blasted.players[1].units[0].slowUntilTick).toBe(72);
    expect(blasted.events.some((event) => event.type === 'detonate')).toBe(true);
    expect(advanceTraps(blasted.players, blasted.players, [], 72).events.some((event) => event.type === 'slow-expired')).toBe(true);
    expect(validateTraps(blasted.traps, 22)).toEqual([]);
  });

  it('keeps an untriggered enemy mine hidden even under sight and projects warning and blast only with sight', () => {
    const initial = createInitialState(93);
    const trap = placeLandmine('player:north', 75, 45, 1);
    const south: PlayerState = { ...initial.players[1], units: [{ ...initial.players[1].units[0], col: 75, row: 45 }] };
    const state: MatchState = { ...initial, tick: 1, players: [initial.players[0], south], traps: [trap] };
    const sight = computeVision(state, 'player:south');
    expect(sight[45 * BOARD_COLUMNS + 75]).toBe(2);
    expect(projectPlayerView(state, 'player:south', sight).traps.visibleEnemy).toEqual([]);
    const warning = { id: 'trap:warning:test', tick: 2, type: 'warning' as const, trapId: trap.id, kind: trap.kind, ownerId: trap.ownerId, col: trap.col, row: trap.row };
    expect(projectTrapEvents([warning], 'player:south', new Uint8Array(sight.length))).toEqual([]);
    expect(projectTrapEvents([warning], 'player:south', sight)).toHaveLength(1);
    const armed: MatchState = { ...state, tick: 2, traps: [{ ...trap, triggeredAtTick: 2, detonateAtTick: 14 }] };
    expect(projectPlayerView(armed, 'player:south', sight).traps.visibleEnemy).toHaveLength(1);
    const placed = { ...warning, type: 'placed' as const };
    expect(projectTrapEvents([placed], 'player:south', sight)).toEqual([]);
    expect(projectTrapEvents([placed], 'player:north', new Uint8Array(sight.length))).toHaveLength(1);
  });
});

describe('remaining Stage 2 trap fixtures', () => {
  function approach(kind: Parameters<typeof placeTrap>[1], enemyDefinitionId?: string) {
    const initial = createInitialState(101);
    const point = { col: 75, row: 45 };
    const adjacent = hexNeighbors(point.col, point.row).slice(0, 3);
    const trap = placeTrap('player:north', kind, point.col, point.row, 1);
    const southBefore: PlayerState = { ...initial.players[1], units: initial.players[1].units.map((unit, index) => index === 0
      ? { ...unit, ...(enemyDefinitionId ? { definitionId: enemyDefinitionId } : {}), col: adjacent[0].col, row: adjacent[0].row }
      : index < 3 ? { ...unit, col: adjacent[index].col, row: adjacent[index].row } : unit) };
    const southAfter: PlayerState = { ...southBefore, units: southBefore.units.map((unit, index) => index === 0 ? { ...unit, col: point.col, row: point.row } : unit) };
    const triggered = advanceTraps([initial.players[0], southBefore], [initial.players[0], southAfter], [trap], 10);
    const detonated = advanceTraps(triggered.players, triggered.players, triggered.traps, 22);
    return { initial, point, adjacent, trap, southBefore, triggered, detonated };
  }

  it('places all five trap cards only on their allowed visible terrain', () => {
    expect(validTrapHex('landmine', 75, 45)).toBe(true);
    expect(validTrapHex('spike-chokepoint', 75, 45)).toBe(true);
    expect(validTrapHex('ambush-net', 75, 45)).toBe(true);
    expect(validTrapHex('explosive-gas-cloud', 75, 45)).toBe(true);
    expect(validTrapHex('decoy-illusion', 75, 12)).toBe(true);
    expect(validTrapHex('landmine', 75, 12)).toBe(false);
    expect(validTrapHex('spike-chokepoint', 75, 12)).toBe(true);
    expect(validTrapHex('ambush-net', 75, 12)).toBe(false);
    expect(validTrapHex('explosive-gas-cloud', 75, 12)).toBe(true);
  });

  it('casts and consumes each of the five trap cards through the match command path', () => {
    for (const cardId of Object.keys(TRAP_CARD_KINDS) as TrapCardId[]) {
      const initial = createInitialState(103);
      const player = initial.players[0];
      const scout = player.units[0];
      const cards = player.cards;
      const inHand: PlayerState['cards'] = { ...cards, drawPile: cards.drawPile.filter((id) => id !== cardId), locked: cards.locked.filter((id) => id !== cardId), hand: [...cards.hand.filter((id) => id !== cardId), cardId], overflow: cards.overflow.filter((entry) => entry.id !== cardId), discard: cards.discard.filter((id) => id !== cardId) };
      const state: MatchState = { ...initial, players: [{ ...player, cards: inHand, units: player.units.map((unit) => unit.id === scout.id ? { ...unit, col: 75, row: 25 } : unit) }, initial.players[1]] };
      const step = stepMatch(state, [{ tick: 1, sequence: 0, playerId: 'player:north', command: { type: 'play-card', cardId, target: { col: 75, row: 26 } } }]);
      expect(step.rejected, cardId).toEqual([]);
      expect(step.state.traps).toMatchObject([{ kind: TRAP_CARD_KINDS[cardId], ownerId: 'player:north', col: 75, row: 26 }]);
      expect(step.state.players[0].cards.hand).not.toContain(cardId);
    }
  });

  it('rejects hidden, off-board, and duplicate trap placements without consuming the card', () => {
    for (const cardId of Object.keys(TRAP_CARD_KINDS) as TrapCardId[]) {
      const initial = createInitialState(104);
      const player = initial.players[0];
      const cards: PlayerState['cards'] = { ...player.cards, drawPile: player.cards.drawPile.filter((id) => id !== cardId), locked: player.cards.locked.filter((id) => id !== cardId), hand: [...player.cards.hand.filter((id) => id !== cardId), cardId], overflow: player.cards.overflow.filter((entry) => entry.id !== cardId), discard: player.cards.discard.filter((id) => id !== cardId) };
      const scout = player.units[0];
      const prepared: MatchState = { ...initial, players: [{ ...player, cards, units: player.units.map((unit) => unit.id === scout.id ? { ...unit, col: 75, row: 25 } : unit) }, initial.players[1]] };
      const hidden = stepMatch(prepared, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'play-card', cardId, target: { col: 75, row: 45 } } }]);
      expect(hidden.rejected[0].reason, cardId).toContain('active vision');
      expect(hidden.state.players[0].cards.hand, cardId).toContain(cardId);
      const offBoard = stepMatch(prepared, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'play-card', cardId, target: { col: -1, row: 45 } } }]);
      expect(offBoard.rejected).toHaveLength(1);
      expect(offBoard.state.players[0].cards.hand, cardId).toContain(cardId);
    }
    const occupied = placeLandmine('player:north', 75, 26, 0);
    const initial = createInitialState(104);
    const player = initial.players[0];
    const cardId = 'card:alchemical-landmine';
    const cards: PlayerState['cards'] = { ...player.cards, drawPile: player.cards.drawPile.filter((id) => id !== cardId), locked: player.cards.locked.filter((id) => id !== cardId), hand: [...player.cards.hand.filter((id) => id !== cardId), cardId], overflow: player.cards.overflow.filter((entry) => entry.id !== cardId), discard: player.cards.discard.filter((id) => id !== cardId) };
    const state: MatchState = { ...initial, traps: [occupied], players: [{ ...player, cards, units: player.units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 25 } : unit) }, initial.players[1]] };
    const duplicate = stepMatch(state, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'play-card', cardId, target: { col: 75, row: 26 } } }]);
    expect(duplicate.rejected[0].reason).toContain('already occupies');
    expect(duplicate.state.players[0].cards.hand).toContain(cardId);
  });

  it('roots and armor-pierces up to three enemies caught by Spike Chokepoint', () => {
    const { detonated, southBefore } = approach('spike-chokepoint');
    for (let index = 0; index < 3; index++) {
      expect(detonated.players[1].units[index].hp).toBeLessThan(southBefore.units[index].hp);
      expect(detonated.players[1].units[index].rootedUntilTick).toBe(62);
    }
    expect(detonated.players[1].units[3].hp).toBe(southBefore.units[3].hp);
    expect(detonated.events.filter((entry) => entry.type === 'root-applied')).toHaveLength(3);
  });

  it('makes Spike Chokepoint rooting block movement until its status expires', () => {
    const initial = createInitialState(105);
    const rooted: MatchState = { ...initial, players: [
      { ...initial.players[0], units: initial.players[0].units.map((unit) => ({ ...unit, rootedUntilTick: 10 })) },
      initial.players[1],
    ] };
    const order: CommandEnvelope = { tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 15 } } };
    const stopped = stepMatch(rooted, [order]).state;
    expect(stopped.players[0].units.map(({ col, row }) => ({ col, row }))).toEqual(rooted.players[0].units.map(({ col, row }) => ({ col, row })));
    expect(stopped.players[0].platoons[0].anchor).toEqual({ col: 75, row: 12 });
    let released = stopped;
    while (released.tick < 40) released = stepMatch(released).state;
    expect(released.players[0].platoons[0].anchor).not.toEqual({ col: 75, row: 12 });
  });

  it('damages and blinds nearby enemies caught by Decoy Illusion', () => {
    const { detonated, southBefore } = approach('decoy-illusion');
    expect(detonated.players[1].units[0].hp).toBeLessThan(southBefore.units[0].hp);
    expect(detonated.players[1].units[0].blindedUntilTick).toBe(62);
    expect(detonated.events.some((entry) => entry.type === 'blind-applied' && entry.targetId === southBefore.units[0].id)).toBe(true);
  });

  it('disables skills on Assassin and Marksman targets caught by Ambush Net', () => {
    const { initial, detonated, southBefore } = approach('ambush-net', 'unit-def:jungle-stalker');
    expect(detonated.players[1].units[0].hp).toBe(southBefore.units[0].hp);
    expect(detonated.players[1].units[0].skillsDisabledUntilTick).toBe(102);
    expect(detonated.players[1].units[1].skillsDisabledUntilTick).toBe(0);
    expect(detonated.events.some((entry) => entry.type === 'skills-disabled' && entry.targetId === southBefore.units[0].id)).toBe(true);
    expect(detonated.players[0].trapRevealedUnits).toContainEqual({ unitId: southBefore.units[0].id, untilTick: 102 });
    const revealedState: MatchState = { ...initial, tick: 22, players: detonated.players, traps: detonated.traps };
    const revealedView = projectPlayerView(revealedState, 'player:north', computeVision(revealedState, 'player:north'));
    expect(revealedView.enemy.visibleUnits.map((unit) => unit.id)).toContain(southBefore.units[0].id);
    const expiredState: MatchState = { ...revealedState, tick: 102 };
    const expiredView = projectPlayerView(expiredState, 'player:north', computeVision(expiredState, 'player:north'));
    expect(expiredView.enemy.visibleUnits.map((unit) => unit.id)).not.toContain(southBefore.units[0].id);
  });

  it('keeps Explosive Gas Cloud active for six seconds and deals damage once per second', () => {
    const { detonated, southBefore, trap } = approach('explosive-gas-cloud');
    expect(detonated.traps[0]).toMatchObject({ kind: 'explosive-gas-cloud', cloudUntilTick: 83 });
    expect(detonated.players[1].units[0].hp).toBe(southBefore.units[0].hp);
    const firstHit = advanceTraps(detonated.players, detonated.players, detonated.traps, 32);
    const afterHitHp = firstHit.players[1].units[0].hp;
    expect(afterHitHp).toBeLessThan(southBefore.units[0].hp);
    expect(firstHit.events.some((entry) => entry.type === 'gas-damage' && entry.trapId === trap.id)).toBe(true);
    const noRepeat = advanceTraps(firstHit.players, firstHit.players, firstHit.traps, 33);
    expect(noRepeat.players[1].units[0].hp).toBe(afterHitHp);
    const finalSecond = advanceTraps(firstHit.players, firstHit.players, firstHit.traps, 82);
    expect(finalSecond.players[1].units[0].hp).toBeLessThan(afterHitHp);
    expect(validateTraps(finalSecond.traps, 82)).toEqual([]);
    expect(advanceTraps(finalSecond.players, finalSecond.players, finalSecond.traps, 83).traps).toEqual([]);
    expect(TRAP_BLAST_RADIUS).toBe(1);
  });
});
