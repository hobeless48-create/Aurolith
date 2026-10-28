import { describe, expect, it } from 'vitest';
import { advanceUnitCombat, advanceUnitCombatWithEvents, combatScaleBps, damageAfterArmor, maxUnitHp, unitLevelForXp } from './combat.js';
import { createInitialState, type PlayerState } from './simulation.js';
import { allHexes, getHex, hexNeighbors } from './board.js';
import { hexDistance } from './pathfinding.js';

describe('fixed-tick unit combat', () => {
  it('breaks ordinary basic attacks while a platoon is retreating', () => {
    const state = createInitialState(41);
    const retreating = { ...state.players[0].units[0], col: 75, row: 45, attackProgressMilli: 1000 };
    const enemy = { ...state.players[1].units[0], col: 76, row: 45 };
    const north: PlayerState = { ...state.players[0], units: [retreating], platoons: state.players[0].platoons.map((platoon, index) => index === 0
      ? { ...platoon, stance: 'retreat' as const, unitIds: [retreating.id] } : platoon) };
    const result = advanceUnitCombatWithEvents([north, { ...state.players[1], units: [enemy] }], 1);
    expect(result.players[1].units[0].hp).toBe(enemy.hp);
    expect(result.players[0].units[0].lastAttackTargetId).toBeNull();
  });

  it('makes Decoy Illusion blindness prevent basic attacks during the blind window', () => {
    const state = createInitialState(36);
    const attacker = { ...state.players[0].units[0], col: 75, row: 45, blindedUntilTick: 10, attackProgressMilli: 999 };
    const target = { ...state.players[1].units[0], col: 76, row: 45 };
    const result = advanceUnitCombatWithEvents([{ ...state.players[0], units: [attacker] }, { ...state.players[1], units: [target] }], 1);
    expect(result.players[1].units[0].hp).toBe(target.hp);
    expect(result.players[0].units[0].lastAttackTargetId).toBeNull();
  });

  it('makes Ambush Net skill disable suppress a ready assassin ability', () => {
    const state = createInitialState(35);
    const assassin = { ...state.players[0].units[0], definitionId: 'unit-def:jungle-stalker', col: 75, row: 45, skillsDisabledUntilTick: 10 };
    const target = { ...state.players[1].units[0], col: 76, row: 45 };
    const result = advanceUnitCombatWithEvents([{ ...state.players[0], units: [assassin] }, { ...state.players[1], units: [target] }], 1);
    expect(result.events.some((event) => event.type === 'skill-cast' && event.sourceId === assassin.id)).toBe(false);
    expect(result.players[0].units[0].channelCompleteAtTick).toBeNull();
  });

  it('records the actual attacker target and lets a defensive guard prioritize its peel target', () => {
    const state = createInitialState(39);
    const guard = { ...state.players[0].units[0], col: 75, row: 45, attackProgressMilli: 1000 };
    const ally = { ...state.players[0].units[3], col: 75, row: 45 };
    const nearer = { ...state.players[1].units[0], col: 75, row: 46 };
    const diver = { ...state.players[1].units[1], col: 76, row: 46 };
    const north: PlayerState = { ...state.players[0], units: [guard, ally], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [guard.id, ally.id], peelTargetId: diver.id, peelAllyId: ally.id, peelLockUntilTick: 26 } : platoon) };
    const south: PlayerState = { ...state.players[1], units: [nearer, diver] };
    const result = advanceUnitCombatWithEvents([north, south], 1);
    expect(result.players[1].units[0].hp).toBe(nearer.hp);
    expect(result.players[1].units[1].hp).toBeLessThan(diver.hp);
    expect(result.players[0].units[0]).toMatchObject({ lastAttackTargetId: diver.id, lastAttackTick: 1 });
  });
  it('uses the selected focus and lets siege focus answer only attacks on its platoon', () => {
    const state = createInitialState(40);
    const attacker = { ...state.players[0].units[0], col: 75, row: 45, attackProgressMilli: 1000 };
    const tougher = { ...state.players[1].units[1], col: 76, row: 45 };
    const softer = { ...state.players[1].units[3], col: 74, row: 45 };
    const north: PlayerState = { ...state.players[0], units: [attacker], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [attacker.id], focus: 'frontline' } : platoon) };
    const south: PlayerState = { ...state.players[1], units: [tougher, softer] };
    const frontline = advanceUnitCombatWithEvents([north, south], 1);
    expect(frontline.players[0].units[0].lastAttackTargetId).toBe(tougher.id);

    const backline: PlayerState = { ...north, units: [{ ...attacker, attackProgressMilli: 1000 }], platoons: north.platoons.map((platoon, index) => index === 0 ? { ...platoon, focus: 'backline' as const } : platoon) };
    expect(advanceUnitCombatWithEvents([backline, south], 1).players[0].units[0].lastAttackTargetId).toBe(softer.id);

    const siege: PlayerState = { ...north, units: [{ ...attacker, attackProgressMilli: 1000 }], platoons: north.platoons.map((platoon, index) => index === 0 ? { ...platoon, focus: 'siege' } : platoon) };
    const held = advanceUnitCombatWithEvents([siege, south], 1);
    expect(held.players[0].units[0].lastAttackTargetId).toBeNull();
    const engagedSouth: PlayerState = { ...south, units: [
      { ...tougher, lastAttackTargetId: attacker.id, lastAttackTick: 2 }, softer,
    ] };
    const answered = advanceUnitCombatWithEvents([siege, engagedSouth], 2);
    expect(answered.players[0].units[0].lastAttackTargetId).toBe(tougher.id);
  });
  it('can attack through decorative boulders', () => {
    const state = createInitialState(37);
    const marksman = { ...state.players[0].units[3], col: 47, row: 36, attackProgressMilli: 1000 };
    const enemy = { ...state.players[1].units[0], col: 47, row: 40 };
    const north: PlayerState = { ...state.players[0], units: [marksman] };
    const south: PlayerState = { ...state.players[1], units: [enemy] };
    expect(advanceUnitCombatWithEvents([north, south], 1).players[1].units[0].hp).toBeLessThan(enemy.hp);
    const clear = advanceUnitCombatWithEvents([{ ...north, units: [{ ...marksman, col: 48, row: 40 }] }, south], 1);
    expect(clear.players[1].units[0].hp).toBeLessThan(enemy.hp);
  });

  it('allows a unit attack through a wall only after its segment is breached', () => {
    const state = createInitialState(38);
    const marksman = { ...state.players[0].units[3], col: 62, row: 20, attackProgressMilli: 1000 };
    const enemy = { ...state.players[1].units[0], col: 62, row: 18 };
    const north: PlayerState = { ...state.players[0], units: [marksman] };
    const south: PlayerState = { ...state.players[1], units: [enemy] };
    expect(advanceUnitCombatWithEvents([north, south], 1).players[1].units[0].hp).toBe(enemy.hp);
    expect(advanceUnitCombatWithEvents([north, south], 1, undefined, new Set(['hex:62:19'])).players[1].units[0].hp).toBeLessThan(enemy.hp);
  });

  it('does not target a concealed brush unit until an Assassin spots it', () => {
    const brush = [...allHexes()].find((hex) => hex.isBrush && hex.terrain === 'field' &&
      hexNeighbors(hex.col, hex.row).some((point) => getHex(point.col, point.row)?.terrain === 'field' && !getHex(point.col, point.row)?.isBrush))!;
    const outside = hexNeighbors(brush.col, brush.row).find((point) => getHex(point.col, point.row)?.terrain === 'field' && !getHex(point.col, point.row)?.isBrush)!;
    const state = createInitialState(32);
    const marksman = { ...state.players[0].units[3], ...outside, attackProgressMilli: 1000 };
    const enemy = { ...state.players[1].units[0], col: brush.col, row: brush.row };
    const north: PlayerState = { ...state.players[0], units: [marksman] };
    const south: PlayerState = { ...state.players[1], units: [enemy] };
    expect(advanceUnitCombatWithEvents([north, south], 1).players[1].units[0].hp).toBe(enemy.hp);
    const spotter = { ...state.players[0].units[0], definitionId: 'unit-def:jungle-stalker', ...outside };
    const spotted = advanceUnitCombatWithEvents([{ ...north, units: [marksman, spotter] }, south], 1);
    expect(spotted.players[1].units[0].hp).toBeLessThan(enemy.hp);
  });
  it('casts Watery Grave through an aligned enemy pair, stuns for two seconds and respects cooldown', () => {
    const state = createInitialState(29);
    const nami = { ...state.players[0].units[1], col: 75, row: 45 };
    const near = { ...state.players[1].units[0], col: 75, row: 46 };
    const far = { ...state.players[1].units[3], col: 74, row: 47, attackProgressMilli: 1000 };
    const north: PlayerState = { ...state.players[0], units: [nami], platoons: state.players[0].platoons.map((platoon, index) => ({ ...platoon, stance: index === 0 ? 'aggressive' as const : platoon.stance, unitIds: index === 0 ? [nami.id] : [] })) };
    const south: PlayerState = { ...state.players[1], units: [near, far], platoons: state.players[1].platoons.map((platoon, index) => ({ ...platoon, unitIds: index === 0 ? [near.id, far.id] : [] })) };
    const first = advanceUnitCombatWithEvents([north, south], 1);
    expect(first.events.filter((event) => event.type === 'skill-cast')).toHaveLength(1);
    expect(first.events.filter((event) => event.type === 'skill-hit').map((event) => event.targetId)).toEqual([far.id]);
    expect(first.players[1].units[0].hp).toBe(near.hp);
    expect(first.players[1].units[1].hp).toBeLessThan(far.hp);
    expect(first.players[1].units[1].stunnedUntilTick).toBe(21);
    expect(first.players[0].units[0].skillReadyAtTick).toBe(81);
    const ordered = advanceUnitCombatWithEvents([
      { ...north, platoons: north.platoons.map((platoon, index) => index === 0 ? { ...platoon, order: { col: 76, row: 45 } } : platoon) }, south,
    ], 1);
    expect(ordered.events.some((event) => event.type === 'skill-cast' && event.skillId === 'watery-grave')).toBe(false);
    const stunned = advanceUnitCombatWithEvents(first.players, 2);
    expect(stunned.players[1].units[1].attackProgressMilli).toBe(first.players[1].units[1].attackProgressMilli);
    expect(stunned.events.some((event) => event.type === 'skill-cast')).toBe(false);
    const recovered = advanceUnitCombatWithEvents(stunned.players, 21);
    expect(recovered.events.some((event) => event.type === 'status-expired' && event.targetId === far.id)).toBe(true);
  });

  it('does not cast Watery Grave against one enemy or beyond the three-hex skill fixture range', () => {
    const state = createInitialState(30);
    const nami = { ...state.players[0].units[1], col: 75, row: 45 };
    const enemy = { ...state.players[1].units[0], col: 75, row: 46 };
    const north: PlayerState = { ...state.players[0], units: [nami], platoons: state.players[0].platoons.map((platoon, index) => ({ ...platoon, stance: index === 0 ? 'aggressive' as const : platoon.stance, unitIds: index === 0 ? [nami.id] : [] })) };
    const south: PlayerState = { ...state.players[1], units: [enemy], platoons: state.players[1].platoons.map((platoon, index) => ({ ...platoon, unitIds: index === 0 ? [enemy.id] : [] })) };
    expect(advanceUnitCombatWithEvents([north, south], 1).events).toEqual([]);
    const distant = { ...enemy, col: 73, row: 49 };
    expect(advanceUnitCombatWithEvents([north, { ...south, units: [enemy, distant] }], 1).events).toEqual([]);
  });

  it('channels Deadeye for one second, fires at the selected target, and can be interrupted by a stun', () => {
    const state = createInitialState(49);
    const castella = { ...state.players[0].units[0], definitionId: 'unit-def:sniper-castella', col: 75, row: 45 };
    const target = { ...state.players[1].units[0], col: 75, row: 51 };
    const north: PlayerState = { ...state.players[0], units: [castella], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [castella.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
    const start = advanceUnitCombatWithEvents([north, south], 1);
    expect(start.events.map((event) => event.type)).toContain('channel-start');
    expect(start.players[0].units[0]).toMatchObject({ channelCompleteAtTick: 11, channelTargetId: target.id });
    const interruptedState = advanceUnitCombatWithEvents([
      { ...start.players[0], units: [{ ...start.players[0].units[0], stunnedUntilTick: 5 }] }, start.players[1],
    ], 2);
    expect(interruptedState.events.some((event) => event.type === 'channel-interrupted' && event.sourceId === castella.id)).toBe(true);
    expect(interruptedState.players[0].units[0]).toMatchObject({ channelCompleteAtTick: null, channelTargetId: null });

    const restarted = advanceUnitCombatWithEvents([north, south], 1);
    let players = restarted.players;
    for (let tick = 2; tick <= 10; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
    const impact = advanceUnitCombatWithEvents(players, 11);
    expect(impact.events.some((event) => event.type === 'skill-hit' && event.skillId === 'deadeye')).toBe(true);
    expect(impact.players[1].units[0].hp).toBeLessThan(target.hp);
    expect(impact.players[0].units[0]).toMatchObject({ channelCompleteAtTick: null, channelTargetId: null, skillReadyAtTick: 111 });

    const closeThreat = { ...target, row: 46 };
    const unsafe = advanceUnitCombatWithEvents([north, { ...south, units: [closeThreat] }], 1);
    expect(unsafe.events.some((event) => event.type === 'channel-start' && event.sourceId === castella.id)).toBe(false);
  });

  it('lets an explicit waypoint or retreat stance preempt Deadeye channeling', () => {
    const state = createInitialState(50);
    const castella = { ...state.players[0].units[0], definitionId: 'unit-def:sniper-castella', col: 75, row: 45, channelCompleteAtTick: 11, channelTargetId: state.players[1].units[0].id };
    const target = { ...state.players[1].units[0], col: 75, row: 51 };
    const makeNorth = (stance: 'aggressive' | 'retreat', order: { col: number; row: number } | null): PlayerState => ({
      ...state.players[0], units: [castella], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [castella.id], stance, order } : { ...platoon, unitIds: [] }),
    });
    const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
    const ordered = advanceUnitCombatWithEvents([makeNorth('aggressive', { col: 76, row: 45 }), south], 2);
    expect(ordered.events.some((event) => event.type === 'channel-interrupted' && event.sourceId === castella.id)).toBe(true);
    const notStarted = advanceUnitCombatWithEvents([makeNorth('aggressive', { col: 76, row: 45 }), south], 1);
    expect(notStarted.events.some((event) => event.type === 'channel-start' && event.sourceId === castella.id)).toBe(false);
    const retreat = advanceUnitCombatWithEvents([makeNorth('retreat', null), south], 1);
    expect(retreat.events.some((event) => event.type === 'channel-start' && event.sourceId === castella.id)).toBe(false);
  });

  it('applies Castella Paragon Deadeye range, 30% execute, and cooldown reset', () => {
    const state = createInitialState(51);
    const castella = { ...state.players[0].units[0], definitionId: 'unit-def:sniper-castella', col: 75, row: 45, xp: 300, level: 3 as const };
    const target = { ...state.players[1].units[0], col: 75, row: 62, hp: 100 };
    const north: PlayerState = { ...state.players[0], units: [castella], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [castella.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
    const start = advanceUnitCombatWithEvents([north, south], 1);
    expect(start.events.some((event) => event.type === 'channel-start' && event.sourceId === castella.id)).toBe(true);
    let players = start.players;
    for (let tick = 2; tick <= 11; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
    expect(players[1].units[0]).toMatchObject({ hp: 0 });
    expect(players[0].units[0].skillReadyAtTick).toBe(11);
  });

  it('lets Paragon Watery Grave reach the third hex and stun every enemy in its line', () => {
    const state = createInitialState(31);
    const nami = { ...state.players[0].units[1], col: 75, row: 45, xp: 300, level: 3 as const };
    const enemies = [
      { ...state.players[1].units[0], col: 75, row: 46 },
      { ...state.players[1].units[1], col: 74, row: 47 },
      { ...state.players[1].units[2], col: 74, row: 48 },
    ];
    const north: PlayerState = { ...state.players[0], units: [nami], platoons: state.players[0].platoons.map((platoon, index) => ({ ...platoon, stance: index === 0 ? 'aggressive' as const : platoon.stance, unitIds: index === 0 ? [nami.id] : [] })) };
    const south: PlayerState = { ...state.players[1], units: enemies, platoons: state.players[1].platoons.map((platoon, index) => ({ ...platoon, unitIds: index === 0 ? enemies.map((enemy) => enemy.id) : [] })) };
    const result = advanceUnitCombatWithEvents([north, south], 1);
    expect(result.events.filter((event) => event.type === 'skill-hit')).toHaveLength(3);
    expect(result.players[1].units.every((unit) => unit.stunnedUntilTick === 21)).toBe(true);
  });

  it('telegraphs Shadow Blink for six ticks, picks the lowest-HP target, then lands behind and strikes', () => {
    const state = createInitialState(63);
    const nightblade = { ...state.players[0].units[0], definitionId: 'unit-def:nightblade', col: 75, row: 45 };
    const stronger = { ...state.players[1].units[0], col: 75, row: 48, hp: 300 };
    const lowest = { ...state.players[1].units[1], col: 75, row: 49, hp: 200 };
    const north: PlayerState = { ...state.players[0], units: [nightblade], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [nightblade.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const south: PlayerState = { ...state.players[1], units: [stronger, lowest], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [stronger.id, lowest.id] } : { ...platoon, unitIds: [] }) };
    const start = advanceUnitCombatWithEvents([north, south], 1);
    expect(start.events).toContainEqual(expect.objectContaining({ type: 'channel-start', skillId: 'shadow-blink', targetId: lowest.id }));
    expect(start.players[1].units.map((unit) => unit.hp)).toEqual([300, 200]);
    expect(start.players[0].units[0]).toMatchObject({ channelCompleteAtTick: 7, channelTargetId: lowest.id, skillReadyAtTick: 81 });
    let players = start.players;
    for (let tick = 2; tick <= 6; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
    const impact = advanceUnitCombatWithEvents(players, 7);
    const landed = impact.players[0].units[0];
    expect(impact.events.some((event) => event.type === 'skill-hit' && event.skillId === 'shadow-blink' && event.targetId === lowest.id)).toBe(true);
    expect(landed).toMatchObject({ channelCompleteAtTick: null, channelTargetId: null, skillReadyAtTick: 81 });
    expect(hexDistance(landed, lowest)).toBe(1);
    expect(landed.row !== nightblade.row || landed.col !== nightblade.col).toBe(true);
    expect(impact.players[1].units.find((unit) => unit.id === lowest.id)!.hp).toBeLessThan(lowest.hp);
  });

  it('applies Nightblade Executioner only below 35% HP after the missing-health strike', () => {
    const state = createInitialState(68);
    const nightblade = { ...state.players[0].units[0], definitionId: 'unit-def:nightblade', col: 75, row: 45 };
    const north: PlayerState = { ...state.players[0], units: [nightblade], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [nightblade.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const resolve = (hp: number) => {
      const target = { ...state.players[1].units[1], col: 75, row: 49, hp };
      const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
      let players: [PlayerState, PlayerState] = advanceUnitCombatWithEvents([north, south], 1).players;
      for (let tick = 2; tick <= 7; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
      return players[1].units[0].hp;
    };
    expect(resolve(300)).toBe(80);
    expect(resolve(400)).toBe(232);
  });

  it('cancels Shadow Blink on stun or a new order before its telegraph resolves', () => {
    const state = createInitialState(64);
    const nightblade = { ...state.players[0].units[0], definitionId: 'unit-def:nightblade', col: 75, row: 45 };
    const target = { ...state.players[1].units[0], col: 75, row: 49, hp: 300 };
    const north: PlayerState = { ...state.players[0], units: [nightblade], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [nightblade.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
    const start = advanceUnitCombatWithEvents([north, south], 1);
    const stunnedNorth = { ...start.players[0], units: [{ ...start.players[0].units[0], stunnedUntilTick: 3 }] };
    const interrupted = advanceUnitCombatWithEvents([stunnedNorth, start.players[1]], 2);
    expect(interrupted.events).toContainEqual(expect.objectContaining({ type: 'channel-interrupted', skillId: 'shadow-blink' }));
    expect(interrupted.players[0].units[0]).toMatchObject({ channelCompleteAtTick: null, channelTargetId: null });
    expect(interrupted.players[1].units[0].hp).toBe(target.hp);

    const orderedNorth = { ...start.players[0], platoons: start.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, order: { col: 76, row: 45 } } : platoon) };
    const ordered = advanceUnitCombatWithEvents([orderedNorth, start.players[1]], 2);
    expect(ordered.events).toContainEqual(expect.objectContaining({ type: 'channel-interrupted', skillId: 'shadow-blink' }));
    expect(ordered.players[1].units[0].hp).toBe(target.hp);
  });

  it('uses Phantom Flurry once per four seconds after a Paragon takedown and makes the Nightblade untargetable', () => {
    const state = createInitialState(65);
    const nightblade = { ...state.players[0].units[0], definitionId: 'unit-def:nightblade', col: 75, row: 45, xp: 300, level: 3 as const };
    const target = { ...state.players[1].units[0], col: 75, row: 49, hp: 1 };
    const north: PlayerState = { ...state.players[0], units: [nightblade], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [nightblade.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
    const start = advanceUnitCombatWithEvents([north, south], 1);
    let players = start.players;
    for (let tick = 2; tick <= 7; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
    expect(players[1].units[0].hp).toBe(0);
    expect(players[0].units[0]).toMatchObject({ skillReadyAtTick: 7, untargetableUntilTick: 20, phantomFlurryReadyAtTick: 47 });
    const attacker = { ...players[1].units[0], definitionId: 'unit-def:sunder-aegis', hp: 520, respawnAtTick: null, col: players[0].units[0].col - 1, row: players[0].units[0].row, attackProgressMilli: 1000 };
    const enemy: PlayerState = { ...players[1], units: [attacker], platoons: players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [attacker.id] } : { ...platoon, unitIds: [] }) };
    const protectedResult = advanceUnitCombatWithEvents([players[0], enemy], 8);
    expect(protectedResult.events.some((event) => event.type === 'skill-hit' && event.skillId === 'shadow-blink')).toBe(false);
    expect(protectedResult.players[0].units[0].hp).toBe(players[0].units[0].hp);
  });

  it('triggers Phantom Flurry on a follow-up takedown within two seconds of landing', () => {
    const state = createInitialState(67);
    const nightblade = { ...state.players[0].units[0], definitionId: 'unit-def:nightblade', col: 75, row: 45, xp: 300, level: 3 as const };
    const target = { ...state.players[1].units[0], col: 75, row: 49, hp: 250 };
    const north: PlayerState = { ...state.players[0], units: [nightblade], platoons: state.players[0].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [nightblade.id], stance: 'aggressive' } : { ...platoon, unitIds: [] }) };
    const south: PlayerState = { ...state.players[1], units: [target], platoons: state.players[1].platoons.map((platoon, index) => index === 0 ? { ...platoon, unitIds: [target.id] } : { ...platoon, unitIds: [] }) };
    let players = advanceUnitCombatWithEvents([north, south], 1).players;
    for (let tick = 2; tick <= 7; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
    expect(players[1].units[0].hp).toBeGreaterThan(0);
    expect(players[0].units[0].shadowBlinkLandedAtTick).toBe(7);
    for (let tick = 8; tick <= 27; tick++) players = advanceUnitCombatWithEvents(players, tick).players;
    expect(players[1].units[0].hp).toBe(0);
    expect(players[0].units[0]).toMatchObject({ skillReadyAtTick: 27, untargetableUntilTick: 40, phantomFlurryReadyAtTick: 67 });
  });

  it('applies canonical armor and escalation values', () => {
    expect(damageAfterArmor(100, 25)).toBe(80);
    expect(combatScaleBps(0)).toBe(10000);
    expect(combatScaleBps(1500)).toBe(11000);
    expect(combatScaleBps(9000)).toBe(16000);
    expect(unitLevelForXp(99)).toBe(1);
    expect(unitLevelForXp(100)).toBe(2);
    expect(unitLevelForXp(300)).toBe(3);
  });

  it('deals simultaneous attacks, grants platoon XP and respawns after 30 seconds', () => {
    const state = createInitialState(12);
    const northUnit = { ...state.players[0].units[0], col: 75, row: 45, xp: 90 };
    const southUnit = { ...state.players[1].units[0], col: 76, row: 45, hp: 1 };
    let players: [PlayerState, PlayerState] = [
      { ...state.players[0], units: [northUnit], platoons: state.players[0].platoons.map((platoon, index) => ({ ...platoon, unitIds: index === 0 ? [northUnit.id] : [] })) },
      { ...state.players[1], units: [southUnit], platoons: state.players[1].platoons.map((platoon, index) => ({ ...platoon, unitIds: index === 0 ? [southUnit.id] : [] })) },
    ];
    for (let tick = 1; tick <= 12; tick++) players = advanceUnitCombat(players, tick);
    expect(players[1].units[0].hp).toBe(0);
    expect(players[1].units[0].respawnAtTick).toBe(312);
    expect(players[0].units[0].xp).toBe(110);
    expect(players[0].units[0].level).toBe(2);
    expect(players[0].units[0].hp).toBeLessThanOrEqual(maxUnitHp(players[0].units[0], 12));
    players = advanceUnitCombat(players, 311);
    expect(players[1].units[0].hp).toBe(0);
    players = advanceUnitCombat(players, 312);
    expect(players[1].units[0].hp).toBe(maxUnitHp(players[1].units[0], 312));
    expect(players[1].units[0].row).toBe(77);
  });
});
