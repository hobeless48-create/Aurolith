import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { fixtureCatalog, validateFixture } from './fixture.js';
import { allHexes, BOARD_COLUMNS, getHex, hexNeighbors } from './board.js';
import { hasLineOfSight } from './line-of-sight.js';
import { findHexPath, hexDistance } from './pathfinding.js';
import { maxUnitHp } from './combat.js';
import { computeVision } from './vision.js';
import { ruleInventory } from './rule-inventory.js';
import { createInitialState, hirePriceGold, isCommandEnvelope, MATCH_LIMIT_TICKS, phaseAtTick, stateHash, stepMatch, validateMatchState, type CommandEnvelope, type MatchState } from './simulation.js';

const root = join(import.meta.dirname, '..', '..');

describe('Stage 0 rule inventory and fixture', () => {
  it('gives every Stage 1 task a traceable source or explicit fixture', () => {
    expect(new Set(ruleInventory.map((rule) => rule.id)).size).toBe(ruleInventory.length);
    for (const task of ['S1-1', 'S1-2', 'S1-3', 'S1-4', 'S1-5']) {
      expect(ruleInventory.some((rule) => rule.stageTask === task)).toBe(true);
    }
    for (const rule of ruleInventory) {
      expect(rule.section.length).toBeGreaterThan(0);
      expect(rule.note.length).toBeGreaterThan(0);
      expect(existsSync(join(root, rule.path)), rule.path).toBe(true);
      if (rule.authority === 'fixture') expect(rule.note).toMatch(/provisional|temporary|prototype|fixture|deferred/i);
    }
  });

  it('resolves all fixture IDs and keeps runtime images identical to source art', () => {
    expect(validateFixture(fixtureCatalog)).toEqual([]);
    const referencedPaths = [
      ...fixtureCatalog.units.map((unit) => unit.sourcePath),
      fixtureCatalog.monster.sourcePath,
      fixtureCatalog.card.sourcePath,
    ];
    for (const path of referencedPaths) expect(existsSync(join(root, path)), path).toBe(true);
    for (const asset of fixtureCatalog.assets) {
      const original = readFileSync(join(root, asset.sourcePath));
      const served = readFileSync(join(root, 'client', 'public', asset.publicPath.slice(1)));
      expect(served.equals(original), asset.id).toBe(true);
      if (asset.format === 'png') expect(served.subarray(0, 8).toString('hex'), asset.id).toBe('89504e470d0a1a0a');
      else {
        expect(served.subarray(0, 2).toString('hex'), asset.id).toBe('ffd8');
        expect(served.subarray(-2).toString('hex'), asset.id).toBe('ffd9');
      }
    }
  });

  it('rejects duplicate IDs, missing references and misplaced structures', () => {
    const duplicateAsset = { ...fixtureCatalog.assets[0], publicPath: '/assets/fixture/duplicate.png' };
    expect(validateFixture({ ...fixtureCatalog, assets: [...fixtureCatalog.assets, duplicateAsset] })).toContain('Duplicate fixture ID');
    expect(validateFixture({ ...fixtureCatalog, units: [{ ...fixtureCatalog.units[0], portraitAssetId: 'asset:missing' }, ...fixtureCatalog.units.slice(1)] })).toContain('unit-def:sunder-aegis references missing portrait asset:missing');
    expect(validateFixture({ ...fixtureCatalog, camps: [{ ...fixtureCatalog.camps[0], col: 75 }, fixtureCatalog.camps[1]] })).toContain('Camp must be in west jungle');
  });
});

describe('Stage 0 deterministic match contract', () => {
  it('starts with five free champions per side and a valid state', () => {
    const state = createInitialState(42);
    expect(validateMatchState(state)).toEqual([]);
    for (const player of state.players) {
      expect(player.goldMilli).toBe(0);
      expect(player.units.map((unit) => unit.definitionId)).toEqual(fixtureCatalog.starterUnitIds);
      expect(player.platoons[0].unitIds).toHaveLength(5);
    }
    expect(hirePriceGold(0)).toBe(60);
    expect(hirePriceGold(1500)).toBe(75);
    expect(phaseAtTick(MATCH_LIMIT_TICKS)).toBe('ended');
  });

  it('validates command envelopes at the runtime boundary', () => {
    const valid = { tick: 1, sequence: 0, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 45 } } };
    expect(isCommandEnvelope(valid)).toBe(true);
    expect(isCommandEnvelope({ ...valid, command: { ...valid.command, target: { col: 75.5, row: 45 } } })).toBe(false);
    expect(isCommandEnvelope({ ...valid, playerId: 'player:east' })).toBe(false);
    expect(isCommandEnvelope({ ...valid, tick: 0 })).toBe(false);
  });

  it('replays the same seed and command sequence to the same state hash', () => {
    const run = (seed: number) => {
      let state = createInitialState(seed);
      const log: CommandEnvelope[] = [
        { tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 45 } } },
        { tick: 1, sequence: 0, playerId: 'player:south', command: { type: 'set-stance', platoonId: 'platoon:south:1', stance: 'aggressive' } },
        { tick: 60, sequence: 2, playerId: 'player:north', command: { type: 'recruit', unitDefinitionId: 'unit-def:jungle-stalker', platoonId: 'platoon:north:2' } },
      ];
      for (let tick = 1; tick <= 60; tick++) {
        const step = stepMatch(state, log.filter((entry) => entry.tick === tick));
        expect(step.rejected).toEqual([]);
        state = step.state;
      }
      expect(state.players[0].units).toHaveLength(6);
      expect(state.players[0].goldMilli).toBe(0);
      expect(validateMatchState(state)).toEqual([]);
      return stateHash(state);
    };
    expect(run(42)).toBe(run(42));
    expect(run(42)).not.toBe(run(43));
  });

  it('moves a commanded platoon through the front gate while rejecting blocked orders', () => {
    let state = createInitialState(17);
    const wrong = stepMatch(state, [{ tick: 1, sequence: 0, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 15, row: 12 } } }]);
    expect(wrong.rejected[0].reason).toBe('Target hex is blocked or off board');
    state = wrong.state;
    const order = stepMatch(state, [{ tick: 2, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 45 } } }]);
    expect(order.accepted).toEqual([1]);
    state = order.state;
    const route = state.players[0].platoons[0].route;
    expect(route.some((point) => point.row === 19 && point.col >= 74 && point.col <= 76)).toBe(true);
    for (let tick = 3; tick <= 300; tick++) state = stepMatch(state).state;
    expect(state.players[0].platoons[0].anchor).toEqual({ col: 75, row: 45 });
    expect(state.players[0].platoons[0].route).toEqual([]);
    expect(state.players[0].platoons[0].order).toBeNull();
    expect(validateMatchState(state)).toEqual([]);
  });

  it('treats a waypoint as one-shot and replaces it with a newer explicit order', () => {
    let state = createInitialState(18);
    const sameSpot = stepMatch(state, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 12 } } }]);
    expect(sameSpot.accepted).toEqual([1]);
    expect(sameSpot.state.players[0].platoons[0].order).toBeNull();
    state = sameSpot.state;
    const first = stepMatch(state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 45 } } }]);
    expect(first.state.players[0].platoons[0].order).toEqual({ col: 75, row: 45 });
    const replaced = stepMatch(first.state, [{ tick: 3, sequence: 3, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 16 } } }]);
    expect(replaced.state.players[0].platoons[0].order).toEqual({ col: 75, row: 16 });
    for (let tick = 4; tick <= 50; tick++) state = stepMatch(tick === 4 ? replaced.state : state).state;
    expect(state.players[0].platoons[0].anchor).toEqual({ col: 75, row: 16 });
    expect(state.players[0].platoons[0].order).toBeNull();
    expect(validateMatchState(state)).toEqual([]);
  });

  it('retreats to the home core after an explicit waypoint, and holds when switched to defense', () => {
    const start = createInitialState(21);
    const north = start.players[0];
    let state: MatchState = { ...start, players: [{
      ...north,
      platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 16 } }, ...north.platoons.slice(1)],
      units: north.units.map((unit) => ({ ...unit, col: 75, row: 16 })),
    }, start.players[1]] };
    state = stepMatch(state, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-stance', platoonId: 'platoon:north:1', stance: 'retreat' } }]).state;
    expect(state.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 5 });
    state = stepMatch(state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 17 } } }]).state;
    expect(state.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 17 });
    for (let tick = 3; tick < 100 && state.players[0].platoons[0].order; tick++) state = stepMatch(state).state;
    expect(state.players[0].platoons[0].anchor).toEqual({ col: 75, row: 17 });
    state = stepMatch(state).state;
    expect(state.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 5 });
    state = stepMatch(state, [{ tick: state.tick + 1, sequence: 3, playerId: 'player:north', command: { type: 'set-stance', platoonId: 'platoon:north:1', stance: 'defensive' } }]).state;
    expect(state.players[0].platoons[0].route).toEqual([]);
    expect(validateMatchState(state)).toEqual([]);
  });

  it.each([{ playerIndex: 0, outsidePerimeterRow: 20, insidePerimeterRow: 19 }, { playerIndex: 1, outsidePerimeterRow: 69, insidePerimeterRow: 70 }])('applies Retreat acceleration until side $playerIndex enters its outer courtyard', ({ playerIndex, outsidePerimeterRow, insidePerimeterRow }) => {
    const measureProgress = (row: number) => {
      const initial = createInitialState(97 + playerIndex);
      const player = initial.players[playerIndex];
      const position = { col: 75, row };
      const homePlayer = { ...player, platoons: [{ ...player.platoons[0], stance: 'retreat' as const, anchor: position, order: null, route: [], moveProgressMilli: 0 }, ...player.platoons.slice(1)], units: player.units.map((unit) => ({ ...unit, ...position })) };
      const players: MatchState['players'] = playerIndex === 0 ? [homePlayer, initial.players[1]] : [initial.players[0], homePlayer];
      const positioned: MatchState = { ...initial, tick: 9, players };
      return stepMatch(positioned).state.players[playerIndex].platoons[0].moveProgressMilli;
    };
    expect(measureProgress(outsidePerimeterRow)).toBeGreaterThan(measureProgress(insidePerimeterRow));
  });

  it('pursues only visible nearby enemies when aggressive, below explicit waypoints', () => {
    const start = createInitialState(22);
    const north = start.players[0];
    const south = start.players[1];
    const atMidfield: MatchState = { ...start, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], stance: 'aggressive', anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      { ...south, units: south.units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 49 } : unit) },
    ] };
    const pursued = stepMatch(atMidfield).state;
    expect(pursued.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 48 });
    const ordered = stepMatch(pursued, [{ tick: 11, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 44 } } }]).state;
    expect(ordered.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 44 });
    const held = stepMatch(pursued, [{ tick: 11, sequence: 2, playerId: 'player:north', command: { type: 'set-stance', platoonId: 'platoon:north:1', stance: 'defensive' } }]).state;
    expect(held.players[0].platoons[0].route).toEqual([]);
    const unseen: MatchState = { ...atMidfield, players: [atMidfield.players[0], { ...atMidfield.players[1], units: atMidfield.players[1].units.map((unit, index) => index === 0 ? { ...unit, row: 55 } : unit) }] };
    expect(stepMatch(unseen).state.players[0].platoons[0].route).toEqual([]);
  });

  it('Aggressive waits for brush concealment to be detected before pursuing its occupant', () => {
    const brush = [...allHexes()].find((hex) => hex.isBrush && hex.terrain === 'field' && hex.row >= 35 && hex.row <= 55
      && hexNeighbors(hex.col, hex.row).some((point) => getHex(point.col, point.row)?.isBrush));
    expect(brush).toBeDefined();
    const neighbors = hexNeighbors(brush!.col, brush!.row);
    const anchor = [...allHexes()].find((point) => hexDistance(point, brush!) === 2 && point.terrain === 'field' && point.isWalkable && !point.isBrush
      && neighbors.some((neighbor) => getHex(neighbor.col, neighbor.row)?.isBrush && hexDistance(point, neighbor) <= 2))!;
    const inside = neighbors.find((point) => getHex(point.col, point.row)?.isBrush && hexDistance(anchor, point) <= 2)!;
    expect(anchor).toBeDefined();
    expect(inside).toBeDefined();
    const initial = createInitialState(111);
    const north = initial.players[0];
    const south = initial.players[1];
    const positioned = (scoutEntersBrush: boolean): MatchState => ({ ...initial, tick: 9, players: [
      {
        ...north,
        facilities: [],
        platoons: [{ ...north.platoons[0], stance: 'aggressive', anchor }, ...north.platoons.slice(1)],
        units: north.units.map((unit, index) => ({ ...unit, ...(index === 0 && scoutEntersBrush ? inside : anchor) })),
      },
      { ...south, facilities: [], units: south.units.map((unit, index) => index === 0 ? { ...unit, col: brush!.col, row: brush!.row } : { ...unit, col: 75, row: 80 }) },
    ] });

    const concealed = stepMatch(positioned(false)).state.players[0].platoons[0];
    expect(concealed.route).toEqual([]);
    const detected = stepMatch(positioned(true)).state.players[0].platoons[0];
    expect(detected.route.length).toBeGreaterThan(0);
    expect(hexDistance(detected.route.at(-1)!, brush!)).toBe(1);
  });

  it('Aggressive skips a closer visible target behind intact enemy walls and pursues the next reachable target', () => {
    const initial = createInitialState(112);
    const anchor = { col: 60, row: 65 };
    const unreachable = { col: 60, row: 70 };
    const reachable = { col: 70, row: 68 };
    expect(hexDistance(anchor, unreachable)).toBeLessThan(hexDistance(anchor, reachable));
    expect(findHexPath(anchor, unreachable, { travelerId: 'player:north' })).toBeNull();
    expect(findHexPath(anchor, reachable, { travelerId: 'player:north' })).not.toBeNull();
    const north = initial.players[0];
    const south = initial.players[1];
    const state: MatchState = { ...initial, tick: 9, players: [
      {
        ...north,
        facilities: [],
        platoons: [{ ...north.platoons[0], stance: 'aggressive', anchor }, ...north.platoons.slice(1)],
        // Keep four members with the anchor and use one as the outside sight source.
        units: north.units.map((unit, index) => ({ ...unit, ...(index === 0 ? { col: 69, row: 67 } : anchor) })),
        reconAreas: [{ col: unreachable.col, row: unreachable.row, visionUntilTick: 100, trapRevealUntilTick: 100 }],
      },
      {
        ...south,
        facilities: [],
        units: south.units.map((unit, index) => index === 0 ? { ...unit, ...unreachable } : index === 1 ? { ...unit, ...reachable } : { ...unit, col: 75, row: 80 }),
      },
    ] };
    const vision = computeVision(state, 'player:north');
    expect(vision[unreachable.row * BOARD_COLUMNS + unreachable.col]).toBe(2);
    expect(vision[reachable.row * BOARD_COLUMNS + reachable.col]).toBe(2);

    const platoon = stepMatch(state).state.players[0].platoons[0];
    expect(platoon.route.length).toBeGreaterThan(0);
    expect(platoon.route.at(-1)).not.toEqual(unreachable);
    expect(hexDistance(platoon.route.at(-1)!, reachable)).toBe(1);
  });

  it.each([{ distance: 12, pursues: true }, { distance: 13, pursues: false }])('checks the Aggressive pursuit radius at $distance hexes', ({ distance, pursues }) => {
    const start = createInitialState(221 + distance);
    const north = start.players[0];
    const south = start.players[1];
    const target = { col: 75, row: 45 + distance };
    const spotter = { col: 75, row: target.row - 4 };
    const atBoundary: MatchState = { ...start, tick: 9, players: [
      {
        ...north,
        platoons: [{ ...north.platoons[0], stance: 'aggressive', anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)],
        units: north.units.map((unit, index) => index === 0 ? { ...unit, ...spotter } : { ...unit, col: 75, row: 45 }),
      },
      { ...south, units: south.units.map((unit, index) => index === 0 ? { ...unit, ...target } : { ...unit, col: 75, row: 80 }) },
    ] };

    const platoon = stepMatch(atBoundary).state.players[0].platoons[0];
    if (pursues) expect(platoon.route.at(-1)).toEqual({ col: target.col, row: target.row - 1 });
    else expect(platoon.route).toEqual([]);
  });

  it('breaks equal-distance Aggressive target ties by unit ID, not roster order', () => {
    const start = createInitialState(234);
    const north = start.players[0];
    const south = start.players[1];
    const positioned: MatchState = { ...start, tick: 9, players: [
      {
        ...north,
        platoons: [{ ...north.platoons[0], stance: 'aggressive', anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)],
        units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })),
      },
      {
        ...south,
        // Put the higher-ID target first in the roster; the lower-ID target must still win the tie.
        units: [
          { ...south.units[1], col: 75, row: 41 },
          { ...south.units[0], col: 75, row: 49 },
          ...south.units.slice(2).map((unit) => ({ ...unit, col: 80, row: 80 })),
        ],
      },
    ] };

    const route = stepMatch(positioned).state.players[0].platoons[0].route;
    expect(route.at(-1)).toEqual({ col: 75, row: 48 });
  });

  it('runs Gather as a persistent camp route below an explicit waypoint', () => {
    const start = createInitialState(31);
    const gathered = stepMatch(start, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-macro', platoonId: 'platoon:north:1', macro: 'gather' } }]);
    expect(gathered.accepted).toEqual([1]);
    expect(gathered.state.players[0].platoons[0].macro).toBe('gather');
    expect(fixtureCatalog.camps.some((camp) => gathered.state.players[0].platoons[0].route.at(-1)?.col === camp.col && gathered.state.players[0].platoons[0].route.at(-1)?.row === camp.row)).toBe(true);
    const ordered = stepMatch(gathered.state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 45 } } }]);
    expect(ordered.state.players[0].platoons[0].order).toEqual({ col: 75, row: 45 });
    expect(ordered.state.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 45 });
    const replaced = stepMatch(ordered.state, [{ tick: 3, sequence: 3, playerId: 'player:north', command: { type: 'set-stance', platoonId: 'platoon:north:1', stance: 'defensive' } }]);
    expect(replaced.state.players[0].platoons[0].macro).toBe('gather');
    const cleared = stepMatch(replaced.state, [{ tick: 4, sequence: 4, playerId: 'player:north', command: { type: 'set-macro', platoonId: 'platoon:north:1', macro: 'standard' } }]);
    expect(cleared.state.players[0].platoons[0].macro).toBe('standard');
  });

  it('keeps a standard defensive platoon idle at its anchor without a command or reaction', () => {
    const initial = createInitialState(34);
    const north = initial.players[0];
    const anchor = { col: 75, row: 12 };
    const positioned: MatchState = { ...initial, players: [
      { ...north, platoons: [{ ...north.platoons[0], stance: 'defensive', macro: 'standard', order: null, anchor, route: [] }, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: anchor.col, row: anchor.row })) },
      { ...initial.players[1], units: initial.players[1].units.map((unit) => ({ ...unit, col: 75, row: 77 })) },
    ] };
    const next = stepMatch(positioned).state;
    expect(next.players[0].platoons[0]).toMatchObject({ stance: 'defensive', macro: 'standard', order: null, anchor, route: [] });
    expect(next.players[0].units.filter((unit) => unit.platoonId === 'platoon:north:1').every((unit) => unit.col === anchor.col && unit.row === anchor.row)).toBe(true);
  });

  it('sends an Outrider ahead and rallies it when a visible ambusher approaches', () => {
    const start = createInitialState(32);
    const north = start.players[0];
    const scout = north.units[0];
    let state: MatchState = { ...start, players: [{ ...north, units: north.units.map((unit) => unit.id === scout.id
      ? { ...unit, definitionId: 'unit-def:jungle-stalker', col: 75, row: 12, rallyProgressMilli: 999 }
      : { ...unit, col: 75, row: 12 }) }, start.players[1]] };
    state = stepMatch(state, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-macro', platoonId: 'platoon:north:1', macro: 'outrider' } }]).state;
    const platoon = state.players[0].platoons[0];
    const forwardScout = state.players[0].units.find((unit) => unit.id === scout.id)!;
    expect(hexDistance(forwardScout, platoon.anchor)).toBe(1);
    const enemy = state.players[1].units[0];
    state = { ...state, players: [
      { ...state.players[0], units: state.players[0].units.map((unit) => unit.id === scout.id ? { ...unit, rallyProgressMilli: 999 } : unit) },
      { ...state.players[1], units: state.players[1].units.map((unit) => unit.id === enemy.id ? { ...unit, col: forwardScout.col, row: forwardScout.row } : unit) },
    ] };
    const before = hexDistance(forwardScout, platoon.anchor);
    const ambush = stepMatch(state);
    expect(ambush.outriderAlerts).toMatchObject([{ ownerId: 'player:north', scoutId: scout.id, enemyId: enemy.id }]);
    expect(stepMatch(ambush.state).outriderAlerts).toHaveLength(0);
    state = ambush.state;
    const rallied = state.players[0].units.find((unit) => unit.id === scout.id)!;
    expect(hexDistance(rallied, platoon.anchor)).toBeLessThan(before);
  });

  it('keeps an explicit waypoint above Outrider scouting until the waypoint completes', () => {
    const start = createInitialState(33);
    const north = start.players[0];
    const scout = north.units[0];
    let state: MatchState = { ...start, players: [{
      ...north,
      units: north.units.map((unit) => unit.id === scout.id
        ? { ...unit, definitionId: 'unit-def:jungle-stalker', col: 75, row: 12, rallyProgressMilli: 999 }
        : { ...unit, col: 75, row: 12 }),
    }, start.players[1]] };

    state = stepMatch(state, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-macro', platoonId: 'platoon:north:1', macro: 'outrider' } }]).state;
    const platoon = state.players[0].platoons[0];
    const scoutAfterMacro = state.players[0].units.find((unit) => unit.id === scout.id)!;
    expect(hexDistance(scoutAfterMacro, platoon.anchor)).toBe(1);

    const target = { col: 75, row: 16 };
    const ordered = stepMatch(state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'set-order', platoonId: platoon.id, target } }]);
    expect(ordered.rejected).toEqual([]);
    expect(ordered.state.players[0].platoons[0]).toMatchObject({ macro: 'outrider', order: target });
    expect(ordered.state.players[0].platoons[0].route.at(-1)).toEqual(target);

    const next = stepMatch(ordered.state);
    expect(next.state.players[0].platoons[0].order).toEqual(target);
    expect(next.outriderAlerts).toEqual([]);
    expect(validateMatchState(next.state)).toEqual([]);
  });

  it('locks a visible attacker of a wounded ally for defensive peel and yields to an explicit waypoint', () => {
    const initial = createInitialState(23);
    const north = initial.players[0];
    const south = initial.players[1];
    const allyId = north.units[3].id;
    const enemyId = south.units[0].id;
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], macro: 'gather', anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit, index) => ({ ...unit, col: 75, row: 45, hp: index === 3 ? 200 : unit.hp })) },
      { ...south, units: south.units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 49, lastAttackTargetId: allyId, lastAttackTick: 9 } : unit) },
    ] };
    const peeled = stepMatch(positioned).state;
    expect(peeled.players[0].platoons[0]).toMatchObject({ macro: 'gather', peelTargetId: enemyId, peelAllyId: allyId, peelLockUntilTick: 35, anchor: { col: 75, row: 45 }, route: [] });
    expect(validateMatchState(peeled)).toEqual([]);
    let advanced = peeled;
    for (let tick = 11; tick <= 16; tick++) advanced = stepMatch(advanced).state;
    expect(advanced.players[0].units[0].row).toBeGreaterThan(45);
    expect(advanced.players[0].platoons[0].anchor).toEqual({ col: 75, row: 45 });
    const ordered = stepMatch(peeled, [{ tick: 11, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: { col: 75, row: 44 } } }]).state;
    expect(ordered.players[0].platoons[0].peelTargetId).toBeNull();
    expect(ordered.players[0].platoons[0].route.at(-1)).toEqual({ col: 75, row: 44 });
  });

  it.each(['exactly-at', 'just-below'] as const)('checks the 55% defensive peel threshold %s', (boundary) => {
    const initial = createInitialState(boundary === 'exactly-at' ? 91 : 92);
    const north = initial.players[0];
    const south = initial.players[1];
    const ally = north.units[3];
    const maximum = maxUnitHp(ally, 9, fixtureCatalog);
    const hp = maximum * 0.55 - (boundary === 'just-below' ? 1 : 0);
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit, index) => ({ ...unit, col: 75, row: 45, hp: index === 3 ? hp : unit.hp })) },
      { ...south, units: south.units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 49, lastAttackTargetId: ally.id, lastAttackTick: 9 } : { ...unit, col: 80, row: 48 }) },
    ] };
    const platoon = stepMatch(positioned).state.players[0].platoons[0];
    expect(platoon.peelTargetId).toBe(boundary === 'just-below' ? south.units[0].id : null);
  });

  it.each([{ distance: 4, shouldPeel: true }, { distance: 5, shouldPeel: false }])('checks the ordinary defensive peel radius at $distance hexes', ({ distance, shouldPeel }) => {
    const initial = createInitialState(96 + distance);
    const north = initial.players[0];
    const south = initial.players[1];
    const ally = north.units[3];
    const attacker = { ...south.units[0], col: 75, row: 45 + distance, lastAttackTargetId: ally.id, lastAttackTick: 9 };
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit, index) => ({ ...unit, col: 75, row: 45, hp: index === 3 ? 200 : unit.hp })) },
      { ...south, units: [attacker, ...south.units.slice(1).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const platoon = stepMatch(positioned).state.players[0].platoons[0];
    expect(platoon.peelTargetId).toBe(shouldPeel ? attacker.id : null);
  });

  it('immediately peels a healthy backliner from a visible Assassin dive', () => {
    const initial = createInitialState(26);
    const north = initial.players[0];
    const south = initial.players[1];
    const backliner = north.units[3];
    const assassin = { ...south.units[0], definitionId: 'unit-def:jungle-stalker', col: 75, row: 49, lastAttackTargetId: backliner.id, lastAttackTick: 9 };
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      { ...south, units: [assassin, ...south.units.slice(1).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const reacted = stepMatch(positioned).state;
    expect(reacted.players[0].units.find((unit) => unit.id === backliner.id)!.hp).toBe(backliner.hp);
    expect(reacted.players[0].platoons[0]).toMatchObject({ peelTargetId: assassin.id, peelAllyId: backliner.id });
  });

  it('overrides an active peel lock for a newly critical ally below 20% HP', () => {
    const initial = createInitialState(27);
    const north = initial.players[0];
    const south = initial.players[1];
    const lockedAlly = north.units[3];
    const criticalAlly = north.units[4];
    const lockedEnemy = { ...south.units[0], col: 75, row: 49, lastAttackTargetId: lockedAlly.id, lastAttackTick: 9 };
    const criticalEnemy = { ...south.units[1], col: 76, row: 49, lastAttackTargetId: criticalAlly.id, lastAttackTick: 9 };
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 }, peelTargetId: lockedEnemy.id, peelAllyId: lockedAlly.id, peelLockUntilTick: 34 }, ...north.platoons.slice(1)], units: north.units.map((unit, index) => ({ ...unit, col: 75, row: 45, hp: index === 4 ? 1 : unit.hp })) },
      { ...south, units: [lockedEnemy, criticalEnemy, ...south.units.slice(2).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const reacted = stepMatch(positioned).state;
    expect(reacted.players[0].platoons[0]).toMatchObject({ peelTargetId: criticalEnemy.id, peelAllyId: criticalAlly.id, peelLockUntilTick: 35 });
  });

  it('does not treat an ally at exactly 20% HP as a critical-lock override', () => {
    const initial = createInitialState(28);
    const north = initial.players[0];
    const south = initial.players[1];
    const lockedAlly = north.units[3];
    const boundaryAlly = north.units[4];
    const lockedEnemy = { ...south.units[0], col: 75, row: 49, lastAttackTargetId: lockedAlly.id, lastAttackTick: 9 };
    const boundaryEnemy = { ...south.units[1], col: 76, row: 49, lastAttackTargetId: boundaryAlly.id, lastAttackTick: 9 };
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 }, peelTargetId: lockedEnemy.id, peelAllyId: lockedAlly.id, peelLockUntilTick: 34 }, ...north.platoons.slice(1)], units: north.units.map((unit, index) => ({ ...unit, col: 75, row: 45, hp: index === 4 ? maxUnitHp(unit, 9, fixtureCatalog) / 5 : unit.hp })) },
      { ...south, units: [lockedEnemy, boundaryEnemy, ...south.units.slice(2).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const reacted = stepMatch(positioned).state;
    expect(reacted.players[0].platoons[0]).toMatchObject({ peelTargetId: lockedEnemy.id, peelAllyId: lockedAlly.id, peelLockUntilTick: 34 });
  });

  it('defensive peel prioritizes a visible channeling enemy within three hexes over normal posture', () => {
    const initial = createInitialState(25);
    const north = initial.players[0];
    const south = initial.players[1];
    const target = north.units[3];
    const channeler = { ...south.units[0], definitionId: 'unit-def:sniper-castella', col: 77, row: 45, channelCompleteAtTick: 20, channelTargetId: target.id };
    const positioned: MatchState = { ...initial, players: [
      { ...north, units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      { ...south, units: [channeler, ...south.units.slice(1).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const reacted = stepMatch(positioned).state;
    expect(reacted.players[0].platoons[0]).toMatchObject({ peelTargetId: channeler.id, peelAllyId: target.id });
  });

  it.each([{ distance: 3, shouldPeel: true }, { distance: 4, shouldPeel: false }])('checks the channel-reaction range boundary at $distance hexes', ({ distance, shouldPeel }) => {
    const initial = createInitialState(distance === 3 ? 93 : 94);
    const north = initial.players[0];
    const south = initial.players[1];
    const target = north.units[3];
    const channeler = { ...south.units[0], definitionId: 'unit-def:sniper-castella', col: 75 + distance, row: 45, channelCompleteAtTick: 20, channelTargetId: target.id };
    const positioned: MatchState = { ...initial, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      { ...south, units: [channeler, ...south.units.slice(1).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const platoon = stepMatch(positioned).state.players[0].platoons[0];
    expect(platoon.peelTargetId).toBe(shouldPeel ? channeler.id : null);
  });

  it('keeps an explicit waypoint above a defensive reaction to a channeling enemy', () => {
    const initial = createInitialState(95);
    const north = initial.players[0];
    const south = initial.players[1];
    const protectedAlly = north.units[3];
    const channeler = { ...south.units[0], definitionId: 'unit-def:sniper-castella', col: 77, row: 45, channelCompleteAtTick: 20, channelTargetId: protectedAlly.id };
    const positioned: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], stance: 'defensive', anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      { ...south, units: [channeler, ...south.units.slice(1).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const waypoint = { col: 75, row: 44 };
    const ordered = stepMatch(positioned, [{ tick: 10, sequence: 1, playerId: 'player:north', command: { type: 'set-order', platoonId: 'platoon:north:1', target: waypoint } }]);
    const platoon = ordered.state.players[0].platoons[0];

    expect(ordered.accepted).toEqual([1]);
    expect(platoon.order).toEqual(waypoint);
    expect(platoon.route.at(-1)).toEqual(waypoint);
    expect(platoon.peelTargetId).toBeNull();
    expect(platoon.peelAllyId).toBeNull();
  });

  it('defensive guards intercept a Nightblade telegraph beside a backliner even when the diver is four hexes away', () => {
    const initial = createInitialState(66);
    const north = initial.players[0];
    const south = initial.players[1];
    const target = north.units[3];
    const targetPoint = { col: 75, row: 45 };
    const telegraphPoint = [...allHexes()].find((point) => hexDistance(targetPoint, point) === 4 && getHex(point.col, point.row)!.isWalkable
      && !getHex(point.col, point.row)!.isBrush && hasLineOfSight(targetPoint, point));
    expect(telegraphPoint).toBeDefined();
    const nightblade = { ...south.units[0], definitionId: 'unit-def:nightblade', col: telegraphPoint!.col, row: telegraphPoint!.row, channelCompleteAtTick: 7, channelTargetId: target.id };
    const positioned: MatchState = { ...initial, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) },
      { ...south, units: [nightblade, ...south.units.slice(1).map((unit) => ({ ...unit, col: 80, row: 48 }))] },
    ] };
    const reacted = stepMatch(positioned).state;
    expect(reacted.players[0].platoons[0]).toMatchObject({ peelTargetId: nightblade.id, peelAllyId: target.id });
    expect(reacted.players[0].units.find((unit) => unit.id === target.id)!.hp).toBe(target.hp);
  });

  it('keeps a peel lock through the minimum duration and releases after healing above 65%', () => {
    const initial = createInitialState(24);
    const north = initial.players[0];
    const south = initial.players[1];
    const allyId = north.units[3].id;
    const enemyId = south.units[0].id;
    let state: MatchState = { ...initial, tick: 9, players: [
      { ...north, platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 } }, ...north.platoons.slice(1)], units: north.units.map((unit, index) => ({ ...unit, col: 75, row: 45, hp: index === 3 ? 200 : unit.hp })) },
      { ...south, units: south.units.map((unit, index) => index === 0 ? { ...unit, col: 75, row: 49, lastAttackTargetId: allyId, lastAttackTick: 9 } : unit) },
    ] };
    state = stepMatch(state).state;
    const healed: MatchState = { ...state, players: [{ ...state.players[0], units: state.players[0].units.map((unit) => unit.id === allyId ? { ...unit, hp: 400 } : unit) }, state.players[1]] };
    const stillLocked = stepMatch(healed).state;
    expect(stillLocked.players[0].platoons[0].peelTargetId).toBe(enemyId);
    const allyAtBoundary = stillLocked.players[0].units.find((unit) => unit.id === allyId)!;
    const exactReleaseBoundary: MatchState = { ...stillLocked, tick: 34, players: [
      { ...stillLocked.players[0], units: stillLocked.players[0].units.map((unit) => unit.id === allyId ? { ...unit, hp: maxUnitHp(allyAtBoundary, 34, fixtureCatalog) * 0.65 } : unit) },
      stillLocked.players[1],
    ] };
    expect(stepMatch(exactReleaseBoundary).state.players[0].platoons[0].peelTargetId).toBe(enemyId);
    const expired: MatchState = { ...stillLocked, tick: 34, players: [stillLocked.players[0], { ...stillLocked.players[1], units: stillLocked.players[1].units.map((unit) => unit.id === enemyId ? { ...unit, lastAttackTick: 9 } : unit) }] };
    expect(stepMatch(expired).state.players[0].platoons[0].peelTargetId).toBeNull();
  });

  it('keeps a tank in front and ranged units behind when an open-field platoon advances', () => {
    const initial = createInitialState(20);
    const north = initial.players[0];
    const platoon = { ...north.platoons[0], anchor: { col: 75, row: 45 }, order: { col: 75, row: 46 }, route: [{ col: 75, row: 46 }], moveProgressMilli: 999 };
    const state: MatchState = { ...initial, players: [{ ...north, platoons: [platoon, ...north.platoons.slice(1)], units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })) }, initial.players[1]] };
    const moved = stepMatch(state).state.players[0];
    const tank = moved.units.find((unit) => unit.definitionId === 'unit-def:tidecaller-nami')!;
    const fighter = moved.units.find((unit) => unit.definitionId === 'unit-def:sunder-aegis')!;
    const marksman = moved.units.find((unit) => unit.definitionId === 'unit-def:twinblade-vex')!;
    expect(tank.row).toBeGreaterThanOrEqual(fighter.row);
    expect(fighter.row).toBeGreaterThanOrEqual(marksman.row);
    expect(moved.platoons[0].order).toBeNull();
  });

  it('applies editable formation ranks to marching order and enforces rank capacity', () => {
    let state = createInitialState(25);
    const marksmanId = state.players[0].units[3].id;
    const tankId = state.players[0].units[1].id;
    const fighterId = state.players[0].units[0].id;
    const promote = stepMatch(state, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-formation-rank', unitId: marksmanId, rank: 1 } }]);
    expect(promote.accepted).toEqual([1]);
    state = promote.state;
    const rearguard = stepMatch(state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'set-formation-rank', unitId: tankId, rank: 3 } }]);
    expect(rearguard.accepted).toEqual([2]);
    state = rearguard.state;
    const full = stepMatch(state, [{ tick: 3, sequence: 3, playerId: 'player:north', command: { type: 'set-formation-rank', unitId: fighterId, rank: 3 } }]);
    expect(full.rejected).toEqual([{ sequence: 3, reason: 'Formation rank is full' }]);
    state = full.state;
    const north = state.players[0];
    state = { ...state, players: [{ ...north,
      platoons: [{ ...north.platoons[0], anchor: { col: 75, row: 45 }, order: { col: 75, row: 46 }, route: [{ col: 75, row: 46 }], moveProgressMilli: 999 }, ...north.platoons.slice(1)],
      units: north.units.map((unit) => ({ ...unit, col: 75, row: 45 })),
    }, state.players[1]] };
    const moved = stepMatch(state).state;
    const marksman = moved.players[0].units.find((unit) => unit.id === marksmanId)!;
    const fighter = moved.players[0].units.find((unit) => unit.id === fighterId)!;
    const tank = moved.players[0].units.find((unit) => unit.id === tankId)!;
    expect(marksman.row).toBeGreaterThanOrEqual(fighter.row);
    expect(fighter.row).toBeGreaterThanOrEqual(tank.row);
    expect(validateMatchState(moved)).toEqual([]);
  });

  it('assigns editable, unique formation flank slots within a rank', () => {
    const start = createInitialState(26);
    const marksmanId = start.players[0].units.find((unit) => unit.definitionId === 'unit-def:twinblade-vex')!.id;
    const promoted = stepMatch(start, [{ tick: 1, sequence: 1, playerId: 'player:north', command: { type: 'set-formation-rank', unitId: marksmanId, rank: 1 } }]);
    expect(promoted.accepted).toEqual([1]);
    const occupied = stepMatch(promoted.state, [{ tick: 2, sequence: 2, playerId: 'player:north', command: { type: 'set-formation-slot', unitId: marksmanId, slot: 0 } }]);
    expect(occupied.rejected).toEqual([{ sequence: 2, reason: 'Formation slot is occupied' }]);
    const flank = stepMatch(occupied.state, [{ tick: 3, sequence: 3, playerId: 'player:north', command: { type: 'set-formation-slot', unitId: marksmanId, slot: 2 } }]);
    expect(flank.accepted).toEqual([3]);
    expect(flank.state.players[0].units.find((unit) => unit.id === marksmanId)?.formationSlot).toBe(2);
    expect(validateMatchState(flank.state)).toEqual([]);
  });

  it('rallies a distant unit on foot instead of teleporting into its platoon', () => {
    const start = createInitialState(19);
    const first = start.players[0].units[0];
    const north = { ...start.players[0], units: start.players[0].units.map((unit) => unit.id === first.id ? { ...unit, platoonId: 'platoon:north:2' } : unit), platoons: start.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: platoon.unitIds.filter((id) => id !== first.id) } : index === 1 ? { ...platoon, unitIds: [first.id], anchor: { col: 75, row: 45 } } : platoon) };
    let state: MatchState = { ...start, players: [north, start.players[1]] };
    for (let tick = 1; tick <= 20; tick++) {
      const previous = state.players[0].units[0];
      state = stepMatch(state).state;
      expect(hexDistance(previous, state.players[0].units[0])).toBeLessThanOrEqual(1);
    }
    expect(state.players[0].units[0].row).toBeGreaterThan(12);
    expect(state.players[0].units[0].row).toBeLessThan(45);
    expect(validateMatchState(state)).toEqual([]);
  });

  it('uses core health after equal wall damage and draws exact ties at the limit', () => {
    const start = createInitialState(7);
    const nearlyDone: MatchState = { ...start, tick: MATCH_LIMIT_TICKS - 1, phase: 'overtime', players: [
      { ...start.players[0], wallDamage: 100, coreHp: 4400 },
      { ...start.players[1], wallDamage: 100, coreHp: 4300 },
    ] };
    expect(stepMatch(nearlyDone).state.result).toEqual({ winnerId: 'player:north', reason: 'core-hp' });
    const tied: MatchState = { ...nearlyDone, players: [nearlyDone.players[0], { ...nearlyDone.players[1], coreHp: 4400 }] };
    expect(stepMatch(tied).state.result).toEqual({ winnerId: null, reason: 'draw' });
  });

  it('fires every 18-minute scheduled event exactly once', () => {
    let state = createInitialState(23);
    for (let tick = 1; tick <= MATCH_LIMIT_TICKS; tick++) state = stepMatch(state).state;
    expect(state.phase).toBe('ended');
    expect(state.events.filter((event) => event.type === 'card-draw')).toHaveLength(7);
    expect(state.events.filter((event) => event.type === 'rite-open')).toHaveLength(3);
    expect(state.events.filter((event) => event.type === 'phase-change')).toHaveLength(3);
    expect(state.events.filter((event) => event.type === 'match-limit')).toHaveLength(1);
    expect(new Set(state.events.map((event) => event.id)).size).toBe(state.events.length);
    expect(validateMatchState(state)).toEqual([]);
    expect(stepMatch(state).state).toBe(state);
  }, 30_000);
});
