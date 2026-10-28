import { describe, expect, it } from 'vitest';
import { BOSS_DEFINITIONS, advanceBossCombat, createBossStates, type BossCombatResult } from './bosses.js';
import { BOARD_COLUMNS } from './board.js';
import { findHexPath, hexDistance } from './pathfinding.js';
import { advanceCampCombat } from './camp.js';
import { createInitialState, scheduledEventsAtTick, stepMatch, type PlayerState } from './simulation.js';
import { advanceStructureCombat } from './structures.js';
import { computeVision, projectPlayerView } from './vision.js';

describe('shared jungle bosses', () => {
  it('warns 30 seconds before each unique spawn and spawns one boss per objective', () => {
    expect(BOSS_DEFINITIONS.map((boss) => [boss.col, boss.row, boss.spawnTick])).toEqual([[15, 45, 1200], [135, 45, 4800], [75, 45, 7200]]);
    for (const boss of BOSS_DEFINITIONS) {
      expect(scheduledEventsAtTick(boss.spawnTick - 300).filter((event) => event.type === 'boss-warning').map((event) => event.id)).toEqual([`event:boss-warning:${boss.id}`]);
      expect(scheduledEventsAtTick(boss.spawnTick).filter((event) => event.type === 'boss-spawn').map((event) => event.id)).toEqual([`event:boss-spawn:${boss.id}`]);
    }
    const initial = createInitialState(77);
    const spawned = stepMatch({ ...initial, tick: 1199 });
    expect(spawned.state.bosses[0].hp).toBe(1500);
    expect(spawned.bossEvents.map((event) => event.type)).toEqual(['spawn']);
    expect(stepMatch(spawned.state).state.bosses[0].spawnedAtTick).toBe(1200);
  });

  it('gives the strict majority the unique buff and the executioner only the last-hit gold bonus', () => {
    const initial = createInitialState(78);
    const boss = { ...createBossStates()[0], hp: 1, spawnedAtTick: 1200, damageByPlayer: [1499, 0] as const };
    const south: PlayerState = { ...initial.players[1], units: initial.players[1].units.map((unit, index) => index === 0 ? { ...unit, col: boss.col, row: boss.row, attackProgressMilli: 1000 } : unit) };
    const result = advanceBossCombat([initial.players[0], south], [boss], 1201);
    expect(result.bosses[0]).toMatchObject({ hp: 0, lastHitPlayerId: 'player:south', damageByPlayer: [1499, 1], relic: null });
    expect(result.players[0].bossBuffs.stampedeUntil).toBe(2101);
    expect(result.players[1].bossBuffs.stampedeUntil).toBe(0);
    expect(result.players[0].goldMilli).toBe(149900);
    expect(result.players[1].goldMilli).toBe(30100);
    expect(result.players[0].materials).toEqual({});
    expect(result.players[1].materials).toEqual({});
  });

  it('splits boss gold and XP by capped damage and adds the last-hit gold bonus', () => {
    const initial = createInitialState(781);
    const boss = { ...createBossStates()[0], hp: 1, spawnedAtTick: 1200, damageByPlayer: [7, 3] as const };
    const southUnit = { ...initial.players[1].units[0], col: boss.col, row: boss.row, attackProgressMilli: 1000 };
    const result = advanceBossCombat([initial.players[0], { ...initial.players[1], units: [southUnit] }], [boss], 1201);
    // The final point of HP is credited to South: total credited damage is 11 (7:4).
    expect(result.bosses[0].damageByPlayer).toEqual([7, 4]);
    expect(result.players[0].goldMilli - initial.players[0].goldMilli).toBe(Math.floor(150_000 * 7 / 11));
    expect(result.players[1].goldMilli - initial.players[1].goldMilli).toBe(150_000 - Math.floor(150_000 * 7 / 11) + 30_000);
    expect(result.players[0].commanderXp - initial.players[0].commanderXp).toBe(Math.floor(120 * 7 / 11));
    expect(result.players[1].commanderXp - initial.players[1].commanderXp).toBe(120 - Math.floor(120 * 7 / 11));
    expect(result.players[0].bossBuffs.stampedeUntil).toBe(2101);
    expect(result.players[1].bossBuffs.stampedeUntil).toBe(0);
  });

  it('awards no objective buff on exactly half damage, then requires 30 uninterrupted relic ticks', () => {
    const initial = createInitialState(79);
    const alpha = { ...createBossStates()[1], hp: 1, spawnedAtTick: 4800, damageByPlayer: [1500, 1499] as const };
    const south: PlayerState = { ...initial.players[1], units: initial.players[1].units.map((unit, index) => index === 0 ? { ...unit, col: alpha.col, row: alpha.row, attackProgressMilli: 1000 } : unit) };
    const killed = advanceBossCombat([initial.players[0], south], [alpha], 4801);
    expect(killed.bosses[0].damageByPlayer).toEqual([1500, 1500]);
    expect(killed.players.every((player) => player.bossBuffs.eyesUntil === 0)).toBe(true);
    expect(killed.bosses[0].relic?.claimedBy).toBeNull();
    let current = killed;
    for (let tick = 4802; tick <= 4812; tick++) current = advanceBossCombat(current.players, current.bosses, tick);
    expect(current.players[1].relics).toBe(0);
    const moved: PlayerState = { ...current.players[1], units: current.players[1].units.map((unit, index) => index === 0 ? { ...unit, col: alpha.col + 1 } : unit) };
    current = advanceBossCombat([current.players[0], moved], current.bosses, 4813);
    expect(current.bosses[0].relic?.channelStartTick).toBeNull();
    const returned: PlayerState = { ...current.players[1], units: current.players[1].units.map((unit, index) => index === 0 ? { ...unit, col: alpha.col } : unit) };
    current = advanceBossCombat([current.players[0], returned], current.bosses, 4814);
    for (let tick = 4815; tick <= 4844; tick++) current = advanceBossCombat(current.players, current.bosses, tick);
    expect(current.players[1].relics).toBe(1);
    expect(current.players[1].arsenal['gilded-core-relic']).toBe(1);
    expect(current.bosses[0].relic?.claimedBy).toBe('player:south');
    expect(advanceBossCombat(current.players, current.bosses, 4845).players[1].relics).toBe(1);
  });

  it('publishes warning locations while hiding unseen boss health', () => {
    const initial = createInitialState(80);
    const hidden = { ...initial, tick: 1200, bosses: [{ ...initial.bosses[0], hp: 1500, spawnedAtTick: 1200 }, ...initial.bosses.slice(1)] };
    const mask = computeVision(hidden, 'player:north');
    expect(mask[45 * BOARD_COLUMNS + 15]).toBe(0);
    expect(projectPlayerView(hidden, 'player:north', mask).neutral.visibleBosses).toEqual([]);
    const warning = projectPlayerView({ ...initial, tick: 900 }, 'player:north', mask).neutral.bossWarnings;
    expect(warning).toEqual([{ id: BOSS_DEFINITIONS[0].id, col: 15, row: 45, spawnTick: 1200 }]);
  });

  it('applies objective rewards to farming, enemy courtyard vision and physical siege', () => {
    const initial = createInitialState(81);
    const monsters = initial.camps[0].monsters.map((monster) => ({ ...monster, hp: 1 }));
    const farmer: PlayerState = { ...initial.players[0], units: initial.players[0].units.map((unit, index) => ({ ...unit, col: monsters[index].col, row: monsters[index].row, attackProgressMilli: 1000 })) };
    const camp = { ...initial.camps[0], monsters };
    const normalGold = advanceCampCombat([farmer, initial.players[1]], camp, 1201, initial.rngState).players[0].goldMilli;
    const stamped = { ...farmer, bossBuffs: { ...farmer.bossBuffs, stampedeUntil: 1300 } };
    expect(advanceCampCombat([stamped, initial.players[1]], camp, 1201, initial.rngState).players[0].goldMilli).toBe(Math.round(normalGold * 1.5));

    const eyes = { ...initial, tick: 4801, players: [{ ...initial.players[0], bossBuffs: { ...initial.players[0].bossBuffs, eyesRevealUntil: 5251 } }, initial.players[1]] as const };
    const mask = computeVision(eyes, 'player:north');
    expect(mask[77 * BOARD_COLUMNS + 75]).toBe(2);
    expect(projectPlayerView(eyes, 'player:north', mask).structures.visibleCores.some((core) => core.ownerId === 'player:south')).toBe(true);

    const wall = initial.walls[1];
    const striker = { ...initial.players[0].units[0], col: wall.col, row: wall.row - 1, attackProgressMilli: 1000 };
    const north: PlayerState = { ...initial.players[0], units: [striker] };
    const normal = advanceStructureCombat([north, initial.players[1]], initial.walls, 7201).players[0].wallDamage;
    const emperor: PlayerState = { ...north, bossBuffs: { ...north.bossBuffs, emperorUntil: 8101 } };
    const empowered = advanceStructureCombat([emperor, initial.players[1]], initial.walls, 7201).players[0].wallDamage;
    expect(empowered - normal).toBeGreaterThanOrEqual(100);
    expect(advanceStructureCombat([emperor, initial.players[1]], initial.walls, 8101).players[0].wallDamage).toBe(advanceStructureCombat([north, initial.players[1]], initial.walls, 8101).players[0].wallDamage);
  });

  it('executes Tuskgod charge, slow, knockback and one-time enrage from the health threshold', () => {
    const initial = createInitialState(82);
    const boss = { ...createBossStates()[0], hp: 749, spawnedAtTick: 1200, abilityReadyAtTick: 1201 };
    const unit = { ...initial.players[1].units[0], col: boss.col + 1, row: boss.row, hp: 1000 };
    const south = { ...initial.players[1], units: [unit] };
    const step = advanceBossCombat([initial.players[0], south], [boss], 1201);
    expect(step.bosses[0]).toMatchObject({ enrageUsed: true, enragedUntilTick: 1401 });
    expect(step.events.map((event) => event.ability)).toContain('enrage');
    expect(step.events.map((event) => event.ability)).toContain('tusk-charge');
    expect(step.players[1].units[0].slowUntilTick).toBe(1216);
    expect(step.players[1].units[0]).not.toMatchObject({ col: unit.col, row: unit.row });
    expect(hexDistance(step.players[1].units[0], step.bosses[0])).toBe(1);
    expect(step.bosses[0].abilityReadyAtTick).toBe(1281);
    const beforeCooldown = advanceBossCombat(step.players, step.bosses, 1280);
    expect(beforeCooldown.events.some((event) => event.ability === 'tusk-charge')).toBe(false);
    const cooldownBoundary = advanceBossCombat(beforeCooldown.players, beforeCooldown.bosses, 1281);
    expect(cooldownBoundary.events.some((event) => event.ability === 'tusk-charge')).toBe(true);
  });

  it('applies Stormwing Screech attack-speed slow for three seconds and summons at half health', () => {
    const initial = createInitialState(83);
    const boss = { ...createBossStates()[1], hp: 1499, spawnedAtTick: 4800, secondaryAbilityReadyAtTick: 4801 };
    const unit = { ...initial.players[1].units[0], col: boss.col + 1, row: boss.row };
    const step = advanceBossCombat([initial.players[0], { ...initial.players[1], units: [unit] }], [boss], 4801);
    expect(step.players[1].units[0].attackSlowedUntilTick).toBe(4831);
    expect(step.events.map((event) => event.ability)).toContain('screech');
    expect(step.events.map((event) => event.ability)).toContain('brood-call');
    expect(step.bosses[0].minions).toHaveLength(2);
    expect(step.bosses[0].minions.every((minion) => minion.kind === 'razortail-hawk' && minion.hp === 1300)).toBe(true);
    const hawk = step.bosses[0].minions[0];
    const striker = { ...step.players[1].units[0], col: hawk.col, row: hawk.row, attackProgressMilli: 1000 };
    const fought = advanceBossCombat([step.players[0], { ...step.players[1], units: [striker] }], step.bosses, 4802);
    expect(fought.bosses[0].minions[0].hp).toBeLessThan(1300);
    expect(fought.events.some((event) => event.type === 'minion-hit')).toBe(true);
    const almostDead = { ...fought.bosses[0], minions: fought.bosses[0].minions.map((minion, index) => index === 0 ? { ...minion, hp: 1 } : minion) };
    const defeated = advanceBossCombat([fought.players[0], { ...fought.players[1], units: [{ ...fought.players[1].units[0], attackProgressMilli: 1000 }] }], [almostDead], 4803);
    expect(defeated.bosses[0].minions[0].hp).toBe(0);
    expect(defeated.events.some((event) => event.type === 'minion-death')).toBe(true);
  });

  it('pulls a distant Emperor target toward the altar and roots a nearby target with Titan Slam', () => {
    const initial = createInitialState(84);
    const boss = { ...createBossStates()[2], hp: 3000, spawnedAtTick: 7200, abilityReadyAtTick: 7201, secondaryAbilityReadyAtTick: 7201 };
    const line = findHexPath(boss, { col: boss.col + 2, row: boss.row })!;
    const unit = { ...initial.players[1].units[0], col: line[2].col, row: line[2].row };
    const lineAlly = { ...initial.players[1].units[1], col: line[1].col, row: line[1].row };
    const step = advanceBossCombat([initial.players[0], { ...initial.players[1], units: [unit, lineAlly] }], [boss], 7201);
    expect(step.events.map((event) => event.ability)).toEqual(expect.arrayContaining(['titan-slam', 'magnitude-pull']));
    expect(step.players[1].units[0].rootedUntilTick).toBe(7216);
    expect(step.players[1].units[1].rootedUntilTick).toBe(7216);
    expect(hexDistance(step.players[1].units[0], step.bosses[0])).toBeLessThan(3);
  });

  it('resets a boss dragged five hexes from camp and restores full HP', () => {
    const initial = createInitialState(85);
    const base = createBossStates()[1];
    const dragged = { ...base, spawnedAtTick: 4800, hp: 1400, damageByPlayer: [1600, 0] as const, col: base.col + 5 };
    const state = { ...initial, tick: 5000, bosses: [initial.bosses[0], dragged, initial.bosses[2]] };
    const result = stepMatch(state);
    expect(result.state.bosses[1]).toMatchObject({ col: BOSS_DEFINITIONS[1].col, row: BOSS_DEFINITIONS[1].row, hp: BOSS_DEFINITIONS[1].hp, damageByPlayer: [0, 0] });
    expect(result.bossEvents.some((event) => event.type === 'leash-reset')).toBe(true);
  });

  it('gives a stationary Ancient 25% defense and pursues a repositioned squad to strip it', () => {
    const initial = createInitialState(86);
    const base = { ...createBossStates()[2], hp: 6000, spawnedAtTick: 7200 };
    const striker = { ...initial.players[0].units[0], col: base.col, row: base.row, attackProgressMilli: 1000 };
    const north = { ...initial.players[0], units: [striker] };
    const repositioned = { ...initial.players[0].units[1], col: base.col + 4, row: base.row };
    const waiting = advanceBossCombat([{ ...initial.players[0], units: [striker, repositioned] }, initial.players[1]], [base], 7209);
    const stationary = advanceBossCombat([north, initial.players[1]], [base], 7210);
    const pursuing = advanceBossCombat([ { ...initial.players[0], units: [striker, repositioned] }, initial.players[1]], [base], 7210);
    expect(waiting.bosses[0].col).toBe(base.col);
    expect(stationary.bosses[0].hp).toBeGreaterThan(pursuing.bosses[0].hp);
    expect(pursuing.bosses[0].col).toBe(base.col + 1);
    expect(pursuing.bosses[0].lastMovedAtTick).toBe(7210);
    expect(pursuing.bosses[0].hp).toBeLessThan(stationary.bosses[0].hp);
    const readyToStrike = pursuing.players[0].units.map((unit) => unit.id === striker.id ? { ...unit, attackProgressMilli: 1000 } : unit);
    const afterMove = advanceBossCombat([{ ...pursuing.players[0], units: readyToStrike }, pursuing.players[1]], pursuing.bosses, 7211);
    const stillMoving = advanceBossCombat([{ ...pursuing.players[0], units: readyToStrike }, pursuing.players[1]], [{ ...pursuing.bosses[0], lastMovedAtTick: 7211 }], 7211);
    expect(afterMove.bosses[0].col).toBe(pursuing.bosses[0].col);
    expect(afterMove.bosses[0].hp).toBeGreaterThan(stillMoving.bosses[0].hp);
  });

  it('lets a summoned Hawk attack an adjacent player unit on its fixture cadence', () => {
    const initial = createInitialState(87);
    const boss = { ...createBossStates()[1], hp: 3000, spawnedAtTick: 4800, broodCalled: true, abilityReadyAtTick: 6000, secondaryAbilityReadyAtTick: 6000,
      minions: [{ id: 'boss:alpha-stormwing:minion:1', kind: 'razortail-hawk' as const, col: 136, row: 45, hp: 1300, attackProgressMilli: 0 }] };
    const unit = { ...initial.players[1].units[0], col: 137, row: 45, hp: 1000 };
    let result: BossCombatResult = { players: [initial.players[0], { ...initial.players[1], units: [unit] }], bosses: [boss], events: [] };
    for (let tick = 4801; tick <= 4815; tick++) result = advanceBossCombat(result.players, result.bosses, tick);
    expect(result.players[1].units[0].hp).toBeLessThan(1000);
    expect(result.events.some((event) => event.ownerId === null && event.type === 'minion-hit')).toBe(true);
  });

  it('respects Stormwing and Emperor primary and secondary cooldown boundaries', () => {
    const initial = createInitialState(88);
    const alpha = { ...createBossStates()[1], hp: 3000, spawnedAtTick: 4800, abilityReadyAtTick: 4801, secondaryAbilityReadyAtTick: 4801 };
    const alphaUnit = { ...initial.players[1].units[0], col: alpha.col + 1, row: alpha.row };
    const alphaStart = advanceBossCombat([initial.players[0], { ...initial.players[1], units: [alphaUnit] }], [alpha], 4801);
    expect(alphaStart.bosses[0]).toMatchObject({ abilityReadyAtTick: 4861, secondaryAbilityReadyAtTick: 4921 });
    expect(advanceBossCombat(alphaStart.players, alphaStart.bosses, 4860).events.some((event) => event.ability === 'dive-strike')).toBe(false);
    expect(advanceBossCombat(alphaStart.players, alphaStart.bosses, 4861).events.some((event) => event.ability === 'dive-strike')).toBe(true);
    expect(advanceBossCombat(alphaStart.players, alphaStart.bosses, 4920).events.some((event) => event.ability === 'screech')).toBe(false);
    expect(advanceBossCombat(alphaStart.players, alphaStart.bosses, 4921).events.some((event) => event.ability === 'screech')).toBe(true);

    const emperor = { ...createBossStates()[2], hp: 6000, spawnedAtTick: 7200, abilityReadyAtTick: 7201, secondaryAbilityReadyAtTick: 7201 };
    const emperorUnit = { ...initial.players[1].units[0], col: emperor.col + 1, row: emperor.row };
    const emperorStart = advanceBossCombat([initial.players[0], { ...initial.players[1], units: [emperorUnit] }], [emperor], 7201);
    expect(emperorStart.bosses[0]).toMatchObject({ abilityReadyAtTick: 7291, secondaryAbilityReadyAtTick: 7341 });
    expect(advanceBossCombat(emperorStart.players, emperorStart.bosses, 7290).events.some((event) => event.ability === 'titan-slam')).toBe(false);
    expect(advanceBossCombat(emperorStart.players, emperorStart.bosses, 7291).events.some((event) => event.ability === 'titan-slam')).toBe(true);
    expect(advanceBossCombat(emperorStart.players, emperorStart.bosses, 7340).events.some((event) => event.ability === 'magnitude-pull')).toBe(false);
    expect(advanceBossCombat(emperorStart.players, emperorStart.bosses, 7341).events.some((event) => event.ability === 'magnitude-pull')).toBe(true);
  });
});
