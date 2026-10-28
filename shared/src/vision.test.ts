import { describe, expect, it } from 'vitest';
import { allHexes, BOARD_COLUMNS, getHex, hexNeighbors } from './board.js';
import { createInitialState, stepMatch, type CommandEnvelope, type MatchState, type PlayerState } from './simulation.js';
import { placeTrap } from './traps.js';
import type { BossCombatEvent } from './bosses.js';
import { computeVision, hasLineOfSight, projectBossCombatEvents, projectCardCastEvents, projectCombatEvents, projectFacilityAttackEvents, projectOutriderAlertEvents, projectPlayerView, visionRadiusForUnit } from './vision.js';

const at = (col: number, row: number) => row * BOARD_COLUMNS + col;

describe('player-specific fog', () => {
  it('projects boss ability and summon cues only at currently visible event hexes', () => {
    const mask = new Uint8Array(BOARD_COLUMNS * 90);
    const event: BossCombatEvent = { id: 'boss:ability:test:1', tick: 1, type: 'ability', bossId: 'boss:alpha-stormwing', col: 15, row: 45, ownerId: null, ability: 'dive-strike' };
    expect(projectBossCombatEvents([event], mask)).toEqual([]);
    mask[at(event.col, event.row)] = 2;
    expect(projectBossCombatEvents([event], mask)).toEqual([event]);
  });

  it('Falcon Recon reveals its 12-hex area for 15 seconds and enemy traps for 20 seconds', () => {
    const initial = createInitialState(90);
    const north = initial.players[0];
    const cardId = 'card:falcon-recon';
    const cards: PlayerState['cards'] = { ...north.cards, drawPile: north.cards.drawPile.filter((id) => id !== cardId), locked: north.cards.locked.filter((id) => id !== cardId), hand: [...north.cards.hand.filter((id) => id !== cardId), cardId], overflow: north.cards.overflow.filter((entry) => entry.id !== cardId), discard: north.cards.discard.filter((id) => id !== cardId) };
    const scout = { ...north.units[0], col: 75, row: 25 };
    const trap = placeTrap('player:south', 'landmine', 75, 45, 0);
    const prepared: MatchState = { ...initial, traps: [trap], players: [{ ...north, cards, units: north.units.map((unit) => unit.id === scout.id ? scout : unit) }, initial.players[1]] };
    expect(computeVision(prepared, 'player:north')[at(75, 45)]).not.toBe(2);

    const command: CommandEnvelope = { tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'play-card', cardId, target: { col: 75, row: 45 } } };
    const cast = stepMatch(prepared, [command]);
    expect(cast.rejected).toEqual([]);
    expect(cast.state.players[0].reconAreas).toEqual([{ col: 75, row: 45, visionUntilTick: 151, trapRevealUntilTick: 201 }]);
    expect(cast.state.traps[0].revealedTo).toEqual([{ playerId: 'player:north', untilTick: 201 }]);
    expect(computeVision(cast.state, 'player:north')[at(87, 45)]).toBe(2);
    expect(projectPlayerView(cast.state, 'player:north', computeVision(cast.state, 'player:north')).traps.visibleEnemy).toHaveLength(1);

    const visionExpired: MatchState = { ...cast.state, tick: 151 };
    expect(computeVision(visionExpired, 'player:north')[at(75, 45)]).not.toBe(2);
    expect(projectPlayerView(visionExpired, 'player:north', computeVision(visionExpired, 'player:north')).traps.visibleEnemy).toHaveLength(1);
    const detectionExpired: MatchState = { ...cast.state, tick: 201 };
    expect(projectPlayerView(detectionExpired, 'player:north', computeVision(detectionExpired, 'player:north')).traps.visibleEnemy).toEqual([]);
  });

  it('shows a live enemy Decoy Illusion as a fake unit only while its hex is visible', () => {
    const state = createInitialState(92);
    const trap = placeTrap('player:south', 'decoy-illusion', 75, 45, 0);
    const trapped: MatchState = { ...state, traps: [trap] };
    const sight = new Uint8Array(BOARD_COLUMNS * 90);
    sight[at(75, 45)] = 2;
    const visible = projectPlayerView(trapped, 'player:north', sight);
    expect(visible.traps.visibleEnemy).toEqual([]);
    expect(visible.traps.decoys).toEqual([{ col: 75, row: 45 }]);
    expect(projectPlayerView(trapped, 'player:north', new Uint8Array(sight.length)).traps.decoys).toEqual([]);
    const triggered: MatchState = { ...trapped, traps: [{ ...trap, triggeredAtTick: 2, detonateAtTick: 14 }] };
    expect(projectPlayerView(triggered, 'player:north', sight).traps.decoys).toEqual([]);
  });

  it('projects Outrider ambush pings only to the scouting player', () => {
    const state = createInitialState(91);
    const alerts = [{ id: 'outrider-alert:1:platoon:north:1:enemy', tick: 1, ownerId: 'player:north' as const, platoonId: 'platoon:north:1', scoutId: state.players[0].units[0].id, enemyId: state.players[1].units[0].id, col: 75, row: 45 }];
    expect(projectOutriderAlertEvents(alerts, 'player:north')).toEqual([{ id: alerts[0].id, tick: 1, col: 75, row: 45 }]);
    expect(projectOutriderAlertEvents(alerts, 'player:south')).toEqual([]);
  });

  it('gives wall-stationed marksmen elevated sight only while their own rampart stands', () => {
    const state = createInitialState(23);
    const marksman = state.players[0].units.find((unit) => unit.definitionId === 'unit-def:twinblade-vex')!;
    const onRampart = { ...marksman, col: 64, row: 18 };
    expect(visionRadiusForUnit(marksman, state.walls)).toBe(4);
    expect(visionRadiusForUnit(onRampart, state.walls)).toBe(6);
    expect(visionRadiusForUnit({ ...marksman, col: 64, row: 20 }, state.walls)).toBe(4);
    const breached = state.walls.map((wall) => wall.ownerId === 'player:north' && wall.row === 19 && wall.col === 62 ? { ...wall, hp: 0 } : wall);
    expect(visionRadiusForUnit(onRampart, breached)).toBe(4);
    expect(visionRadiusForUnit({ ...marksman, col: 14, row: 45 }, state.walls)).toBe(2);
    expect(visionRadiusForUnit({ ...marksman, definitionId: 'unit-def:jungle-stalker', col: 14, row: 45 }, state.walls)).toBe(4);
  });

  it('extends Outrider sight two hexes forward through canopy', () => {
    const initial = createInitialState(34);
    const north = initial.players[0];
    const scout = north.units[0];
    const state: MatchState = { ...initial, players: [{
      ...north,
      platoons: [{ ...north.platoons[0], macro: 'outrider', anchor: { col: 23, row: 38 } }, ...north.platoons.slice(1)],
      units: north.units.map((unit) => unit.id === scout.id ? { ...unit, definitionId: 'unit-def:jungle-stalker', col: 23, row: 38 } : unit),
    }, initial.players[1]] };
    const sight = computeVision(state, 'player:north');
    expect(sight[at(23, 44)]).toBe(2);
    expect(sight[at(23, 32)]).not.toBe(2);
  });

  it('projects confirmed card casts only onto visible and detectable targets', () => {
    const mask = new Uint8Array(BOARD_COLUMNS * 90);
    const friendly = { id: 'card:cast:1:1', tick: 1, ownerId: 'player:north' as const, cardId: 'card:phalanx-formation', targets: [{ unitId: 'unit:north:1', col: 75, row: 45 }, { unitId: 'unit:north:2', col: 76, row: 45 }] };
    const enemy = { id: 'card:cast:1:2', tick: 1, ownerId: 'player:south' as const, cardId: 'card:forced-march', targets: [{ unitId: 'unit:south:1', col: 75, row: 45 }, { unitId: 'unit:south:2', col: 76, row: 45 }] };
    expect(projectCardCastEvents([friendly, enemy], 'player:north', mask, new Set(['unit:south:1']))).toEqual([]);
    mask[at(75, 45)] = 2;
    expect(projectCardCastEvents([friendly, enemy], 'player:north', mask, new Set(['unit:south:1']))).toEqual([
      { tick: 1, ownerId: 'player:north', cardId: 'card:phalanx-formation', targets: [{ col: 75, row: 45 }] },
      { tick: 1, ownerId: 'player:south', cardId: 'card:forced-march', targets: [{ col: 75, row: 45 }] },
    ]);
    expect(projectCardCastEvents([enemy], 'player:north', mask)).toEqual([]);
  });

  it('keeps each home fortress and its ten-row front visible from the opening', () => {
    const state = createInitialState(4);
    const north = computeVision(state, 'player:north');
    const south = computeVision(state, 'player:south');
    for (const col of [51, 75, 98]) {
      for (const row of [0, 19, 20, 29]) expect(north[at(col, row)]).toBe(2);
      for (const row of [60, 69, 70, 89]) expect(south[at(col, row)]).toBe(2);
    }
    for (const col of [41, 108]) {
      for (const row of [20, 29]) expect(north[at(col, row)]).toBe(2);
      for (const row of [60, 69]) expect(south[at(col, row)]).toBe(2);
    }
    expect(north[at(40, 29)]).toBe(0);
    expect(north[at(109, 29)]).toBe(0);
    expect(south[at(40, 60)]).toBe(0);
    expect(south[at(109, 60)]).toBe(0);
    expect(north[at(51, 30)]).toBe(0);
    expect(north[at(75, 60)]).toBe(0);
    expect(south[at(51, 59)]).toBe(0);
    expect(south[at(75, 29)]).toBe(0);
    expect(north[at(50, 19)]).toBe(0);
    expect(south[at(99, 70)]).toBe(0);
  });

  it('hides combat cues outside vision and removes hidden endpoints', () => {
    const event = { id: 'combat:1', tick: 1, type: 'skill-cast' as const, skillId: 'watery-grave' as const, sourceId: 'unit:north:2', targetId: 'unit:south:1', source: { col: 75, row: 45 }, target: { col: 76, row: 45 } };
    const mask = new Uint8Array(BOARD_COLUMNS * 90);
    const visible = new Set([event.sourceId, event.targetId]);
    expect(projectCombatEvents([event], mask, visible)).toEqual([]);
    mask[at(76, 45)] = 2;
    expect(projectCombatEvents([event], mask, visible)).toEqual([{ tick: 1, type: 'skill-cast', skillId: 'watery-grave', sourceId: null, targetId: event.targetId, source: null, target: event.target }]);
    mask[at(75, 45)] = 2;
    expect(projectCombatEvents([event], mask, visible)[0].source).toEqual(event.source);
    expect(projectCombatEvents([event], mask, new Set([event.sourceId]))).toEqual([{ tick: 1, type: 'skill-cast', skillId: 'watery-grave', sourceId: event.sourceId, targetId: null, source: event.source, target: null }]);
    expect(projectCombatEvents([event], mask, new Set())).toEqual([]);
  });

  it('reveals an attacker in the front side-warning strip but not beyond it', () => {
    const state = createInitialState(10);
    const exposed = { ...state.players[1].units[0], col: 41, row: 25 };
    const hidden = { ...state.players[1].units[1], col: 40, row: 25 };
    const moved: MatchState = { ...state, players: [state.players[0], { ...state.players[1], units: [exposed, hidden] }] };
    const view = projectPlayerView(moved, 'player:north', computeVision(moved, 'player:north'));
    expect(view.enemy.visibleUnits.map((unit) => unit.id)).toEqual([exposed.id]);
  });

  it('conceals a brush occupant from outside and reveals it from adjacent brush or an adjacent assassin', () => {
    const brush = [...allHexes()].find((hex) => hex.isBrush && hex.terrain === 'field' &&
      hexNeighbors(hex.col, hex.row).some((point) => getHex(point.col, point.row)?.isBrush) &&
      hexNeighbors(hex.col, hex.row).some((point) => getHex(point.col, point.row)?.terrain === 'field' && !getHex(point.col, point.row)?.isBrush))!;
    expect(brush).toBeDefined();
    const neighbors = hexNeighbors(brush.col, brush.row);
    const outside = neighbors.find((point) => getHex(point.col, point.row)?.terrain === 'field' && !getHex(point.col, point.row)?.isBrush)!;
    const inside = neighbors.find((point) => getHex(point.col, point.row)?.isBrush)!;
    const initial = createInitialState(11);
    const enemy = { ...initial.players[1].units[0], col: brush.col, row: brush.row };
    const friendly = initial.players[0].units[0];
    const mask = new Uint8Array(BOARD_COLUMNS * 90);
    mask[at(brush.col, brush.row)] = 2;
    mask[at(outside.col, outside.row)] = 2;
    const withScout = (point: { col: number; row: number }, assassin = false): MatchState => ({
      ...initial,
      players: [{ ...initial.players[0], units: [{ ...friendly, definitionId: assassin ? 'unit-def:jungle-stalker' : friendly.definitionId, ...point }] }, { ...initial.players[1], units: [enemy] }],
    });
    expect(projectPlayerView(withScout(outside), 'player:north', mask).enemy.visibleUnits).toEqual([]);
    expect(projectPlayerView(withScout(inside), 'player:north', mask).enemy.visibleUnits.map((unit) => unit.id)).toEqual([enemy.id]);
    expect(projectPlayerView(withScout(outside, true), 'player:north', mask).enemy.visibleUnits.map((unit) => unit.id)).toEqual([enemy.id]);
    const combatEvent = { id: 'combat:brush', tick: 1, type: 'skill-hit' as const, skillId: 'watery-grave' as const, sourceId: friendly.id, targetId: enemy.id, source: outside, target: brush };
    const hiddenView = projectPlayerView(withScout(outside), 'player:north', mask);
    expect(projectCombatEvents([combatEvent], mask, new Set([...hiddenView.own.units, ...hiddenView.enemy.visibleUnits].map((unit) => unit.id)))[0].target).toBeNull();
    const detectedView = projectPlayerView(withScout(inside), 'player:north', mask);
    expect(projectCombatEvents([combatEvent], mask, new Set([...detectedView.own.units, ...detectedView.enemy.visibleUnits].map((unit) => unit.id)))[0].target).toEqual(brush);
  });

  it('reveals enemy facilities and Ballista cues only through current sight', () => {
    const initial = createInitialState(6);
    const slot = { ...initial.players[1].facilities[0], kind: 'ballista' as const, tier: 1 as const, hp: 500, maxHp: 500 };
    const state: MatchState = { ...initial, players: [initial.players[0], { ...initial.players[1], facilities: [slot, ...initial.players[1].facilities.slice(1)] }] };
    expect(projectPlayerView(state, 'player:north', computeVision(state, 'player:north')).structures.visibleEnemyFacilities).toEqual([]);
    const scout = { ...state.players[0].units[0], col: 55, row: 74 };
    const visible: MatchState = { ...state, players: [{ ...state.players[0], units: [scout] }, state.players[1]] };
    const mask = computeVision(visible, 'player:north');
    expect(projectPlayerView(visible, 'player:north', mask).structures.visibleEnemyFacilities.map((entry) => entry.id)).toEqual([slot.id]);
    const shot = { id: 'facility:ballista:3000:1', tick: 3000, source: { col: 56, row: 74 }, target: { col: 75, row: 45 }, damage: 100 };
    expect(projectFacilityAttackEvents([shot], mask)[0]).toMatchObject({ source: shot.source, target: null, damage: null });
    expect(projectFacilityAttackEvents([shot], new Uint8Array(mask.length))).toEqual([]);
  });

  it('keeps unseen enemy units and live enemy state out of a player view', () => {
    const state = createInitialState(5);
    const mask = computeVision(state, 'player:north');
    const view = projectPlayerView(state, 'player:north', mask);
    expect(mask[at(75, 12)]).toBe(2);
    expect(mask[at(75, 77)]).toBe(0);
    expect(view.own.units).toHaveLength(5);
    expect(view.enemy.visibleUnits).toHaveLength(0);
    expect(view.neutral.visibleMonsters).toHaveLength(0);
    expect(view.neutral.visibleCampRespawns).toEqual([]);
    expect(view.structures.visibleEnemyWalls).toHaveLength(0);
    expect('goldMilli' in view.enemy).toBe(false);
    expect('platoons' in view.enemy).toBe(false);
    expect(view.visibleTerrain.some((tile) => tile.col === 75 && tile.row === 77)).toBe(false);
  });

  it('retains static terrain memory but drops live sight after moving away', () => {
    const state = createInitialState(8);
    const scouting: MatchState = { ...state, players: [
      { ...state.players[0], units: state.players[0].units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      state.players[1],
    ] };
    const first = computeVision(scouting, 'player:north');
    const second = computeVision(state, 'player:north', first);
    expect(second[at(75, 12)]).toBe(2);
    expect(second[at(75, 45)]).toBe(1);
    expect(projectPlayerView(state, 'player:north', second).visibleTerrain.find((tile) => tile.col === 75 && tile.row === 45)?.visibility).toBe(1);
  });

  it('shows only the camp currently in sight', () => {
    const state = createInitialState(18);
    const west = state.camps[0].monsters[0];
    const scout = { ...state.players[0].units[0], col: west.col, row: west.row };
    const moved: MatchState = { ...state, players: [
      { ...state.players[0], units: [scout] },
      state.players[1],
    ] };
    const view = projectPlayerView(moved, 'player:north', computeVision(moved, 'player:north'));
    expect(view.neutral.visibleMonsters.length).toBeGreaterThan(0);
    expect(view.neutral.visibleMonsters.every((monster) => monster.id.startsWith(`monster:${state.camps[0].id}:`))).toBe(true);
    expect(view.neutral.visibleCampRespawns.map((camp) => camp.campId)).toEqual([state.camps[0].id]);
  });

  it('blocks sight behind walls and halves standard vision inside jungle', () => {
    expect(hasLineOfSight({ col: 62, row: 20 }, { col: 62, row: 18 })).toBe(false);
    expect(hasLineOfSight({ col: 62, row: 20 }, { col: 62, row: 18 }, new Set(['hex:62:19']))).toBe(true);
    expect(hasLineOfSight({ col: 75, row: 20 }, { col: 75, row: 18 })).toBe(true);
    const state = createInitialState(9);
    const unit = { ...state.players[0].units[0], col: 14, row: 45 };
    const jungle: MatchState = { ...state, players: [{ ...state.players[0], units: [unit] }, state.players[1]] };
    const mask = computeVision(jungle, 'player:north');
    expect(mask[at(14, 45)]).toBe(2);
    expect(mask[at(16, 45)]).toBe(2);
    expect(mask[at(18, 45)]).toBe(0);
  });

  it('keeps sight clear through decorative trees, boulders, canopy and fences', () => {
    expect(hasLineOfSight({ col: 47, row: 36 }, { col: 47, row: 40 })).toBe(true);
    expect(hasLineOfSight({ col: 58, row: 37 }, { col: 58, row: 41 })).toBe(true);
    expect(hasLineOfSight({ col: 23, row: 38 }, { col: 23, row: 42 })).toBe(true);
    expect(hasLineOfSight({ col: 67, row: 40 }, { col: 67, row: 44 })).toBe(true);
  });

  it('reveals an enemy through a decorative boulder when within normal vision range', () => {
    const start = createInitialState(24);
    const enemy = { ...start.players[1].units[0], col: 47, row: 40 };
    const withScout = (col: number, row: number): MatchState => ({ ...start, players: [
      { ...start.players[0], units: start.players[0].units.map((unit, index) => index === 0 ? { ...unit, col, row } : unit) },
      { ...start.players[1], units: [enemy, ...start.players[1].units.slice(1)] },
    ] });
    const behindProp = withScout(47, 36);
    expect(projectPlayerView(behindProp, 'player:north', computeVision(behindProp, 'player:north')).enemy.visibleUnits.map((unit) => unit.id)).toContain(enemy.id);
    const clear = withScout(48, 40);
    expect(projectPlayerView(clear, 'player:north', computeVision(clear, 'player:north')).enemy.visibleUnits.map((unit) => unit.id)).toContain(enemy.id);
  });
});
