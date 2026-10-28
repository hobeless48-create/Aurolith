import { combatScaleBps, criticalAttack, damageAfterArmor, isUnitTargetable } from './combat.js';
import { getHex, hexNeighbors } from './board.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { findHexPath, hexDistance } from './pathfinding.js';
import type { PlayerId, PlayerState, UnitState } from './simulation.js';
import { bastionDamageBps, executionBonusBps, itemAttackBonus } from './items.js';

export type BossKind = 'elite' | 'alpha' | 'ancient';
const ANCIENT_MOVE_INTERVAL_TICKS = 10;
export type BossMinionKind = 'razortail-hawk' | 'ironclad-golem';
export type BossMinionState = Readonly<{ id: string; kind: BossMinionKind; col: number; row: number; hp: number; attackProgressMilli: number }>;
export type BossDefinition = Readonly<{ id: string; kind: BossKind; name: string; col: number; row: number; spawnTick: number; hp: number; defense: number; magicResist: number; attack: number; attacksPerSecond: number; bountyXp: number; bountyGold: number }>;
export const BOSS_DEFINITIONS: readonly BossDefinition[] = [
  { id: 'boss:elite-tuskgod', kind: 'elite', name: 'Gilded Tuskgod', col: 15, row: 45, spawnTick: 1200, hp: 1500, defense: 12, magicResist: 12, attack: 70, attacksPerSecond: 0.8, bountyXp: 120, bountyGold: 150 },
  { id: 'boss:alpha-stormwing', kind: 'alpha', name: 'Dreadmother Stormwing', col: 135, row: 45, spawnTick: 4800, hp: 3000, defense: 16, magicResist: 16, attack: 90, attacksPerSecond: 0.9, bountyXp: 200, bountyGold: 300 },
  { id: 'boss:ancient-emperor', kind: 'ancient', name: 'Obsidian Emperor', col: 75, row: 45, spawnTick: 7200, hp: 6000, defense: 20, magicResist: 20, attack: 110, attacksPerSecond: 0.7, bountyXp: 350, bountyGold: 500 },
];

export type BossState = Readonly<{ id: string; col: number; row: number; hp: number; spawnedAtTick: number | null; killedAtTick: number | null; attackProgressMilli: number; abilityReadyAtTick: number; secondaryAbilityReadyAtTick: number; lastMovedAtTick: number; lastPosition: Readonly<{ col: number; row: number }>; enrageUsed: boolean; enragedUntilTick: number; broodCalled: boolean; minions: readonly BossMinionState[]; damageByPlayer: readonly [number, number]; lastHitPlayerId: PlayerId | null; relic: null | Readonly<{ claimedBy: PlayerId | null; channelUnitId: string | null; channelStartTick: number | null }> }>;
export type BossCombatEvent = Readonly<{ id: string; tick: number; type: 'spawn' | 'hit' | 'kill' | 'relic-claim' | 'ability' | 'summon' | 'minion-hit' | 'minion-death' | 'leash-reset'; bossId: string; col: number; row: number; ownerId: PlayerId | null; ability?: string }>;
export type BossCombatResult = Readonly<{ players: [PlayerState, PlayerState]; bosses: BossState[]; events: BossCombatEvent[] }>;

export function createBossStates(): BossState[] {
  return BOSS_DEFINITIONS.map((definition) => ({ id: definition.id, col: definition.col, row: definition.row, hp: 0, spawnedAtTick: null, killedAtTick: null, attackProgressMilli: 0, abilityReadyAtTick: definition.spawnTick + (definition.kind === 'elite' ? 80 : definition.kind === 'alpha' ? 60 : 90), secondaryAbilityReadyAtTick: definition.spawnTick + 120, lastMovedAtTick: 0, lastPosition: { col: definition.col, row: definition.row }, enrageUsed: false, enragedUntilTick: 0, broodCalled: false, minions: [], damageByPlayer: [0, 0], lastHitPlayerId: null, relic: null }));
}

function damageFromUnit(unit: UnitState, boss: BossDefinition, tick: number, critical: boolean, catalog: FixtureCatalog, stationary = false): number {
  const definition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
  const attack = criticalAttack(Math.round((definition.attack + itemAttackBonus(unit)) * combatScaleBps(tick) * (unit.level === 3 ? 11000 : unit.level === 2 ? 10500 : 10000) / 100000000), unit.id, tick, critical);
  return damageAfterArmor(attack, definition.attackType === 'magic' ? boss.magicResist : Math.round(boss.defense * (stationary ? 1.25 : 1)));
}

function splitBounty(total: number, damage: readonly [number, number]): [number, number] {
  const totalDamage = damage[0] + damage[1];
  if (!totalDamage) return [0, 0];
  const north = Math.floor(total * damage[0] / totalDamage);
  return [north, total - north];
}

function advanceBossMinions(input: [PlayerState, PlayerState], minionInput: readonly BossMinionState[], bossId: string, tick: number, catalog: FixtureCatalog): { players: [PlayerState, PlayerState]; minions: BossMinionState[]; events: BossCombatEvent[] } {
  let players = input;
  let minions = minionInput.map((minion) => ({ ...minion }));
  const events: BossCombatEvent[] = [];
  for (const player of [...players]) {
    const side = player.id === 'player:north' ? 0 : 1;
    for (const attacker of players[side].units) {
      if (attacker.hp <= 0 || attacker.attackProgressMilli < 1000 || attacker.stunnedUntilTick > tick) continue;
      const definition = catalog.units.find((entry) => entry.id === attacker.definitionId)!;
      const target = minions.filter((minion) => minion.hp > 0 && hexDistance(attacker, minion) <= definition.range)
        .sort((a, b) => hexDistance(attacker, a) - hexDistance(attacker, b) || a.id.localeCompare(b.id))[0];
      if (!target) continue;
      const levelBps = attacker.level === 3 ? 11000 : attacker.level === 2 ? 10500 : 10000;
      const attack = criticalAttack(Math.round((definition.attack + itemAttackBonus(attacker)) * combatScaleBps(tick) * levelBps / 100000000), attacker.id, tick, players[side].bossBuffs.eyesUntil > tick);
      const defense = target.kind === 'razortail-hawk' ? 6 : 12;
      const damage = damageAfterArmor(attack, definition.attackType === 'magic' ? defense : defense);
      minions = minions.map((minion) => minion.id === target.id ? { ...minion, hp: Math.max(0, minion.hp - damage) } : minion);
      players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id === attacker.id ? { ...unit, attackProgressMilli: 0, lastCombatTick: tick } : unit) };
      const died = minions.find((minion) => minion.id === target.id)!.hp === 0;
      events.push({ id: `boss:minion-${died ? 'death' : 'hit'}:${bossId}:${tick}:${attacker.id}:${target.id}`, tick, type: died ? 'minion-death' : 'minion-hit', bossId, col: target.col, row: target.row, ownerId: attacker.ownerId });
    }
  }
  minions = minions.map((minion) => {
    if (minion.hp <= 0) return minion;
    const attacksPerSecond = minion.kind === 'razortail-hawk' ? 0.7 : 0.8;
    const progress = Math.min(1000, minion.attackProgressMilli + Math.round(attacksPerSecond * 100));
    if (progress < 1000) return { ...minion, attackProgressMilli: progress };
    const target = players.flatMap((player) => player.units).filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick) && hexDistance(unit, minion) <= 1)
      .sort((a, b) => hexDistance(a, minion) - hexDistance(b, minion) || a.hp - b.hp || a.id.localeCompare(b.id))[0];
    if (!target) return { ...minion, attackProgressMilli: progress };
    const side = target.ownerId === 'player:north' ? 0 : 1;
    const armor = catalog.units.find((unit) => unit.id === target.definitionId)!.defense;
    const attack = minion.kind === 'razortail-hawk' ? 22 : 40;
    const damage = Math.max(1, damageAfterArmor(attack, armor));
    players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id === target.id ? damage >= unit.hp
      ? { ...unit, hp: 0, respawnAtTick: tick + 300, attackProgressMilli: 0, lastCombatTick: tick }
      : { ...unit, hp: unit.hp - damage, lastCombatTick: tick } : unit) };
    events.push({ id: `boss:minion-attack:${bossId}:${tick}:${minion.id}:${target.id}`, tick, type: 'minion-hit', bossId, col: target.col, row: target.row, ownerId: null });
    return { ...minion, attackProgressMilli: 0 };
  });
  return { players, minions, events };
}

/** Shared one-spawn objectives. All damage and reward arithmetic uses integer simulation ticks. */
export function advanceBossCombat(input: readonly [PlayerState, PlayerState], previous: readonly BossState[], tick: number, catalog: FixtureCatalog = fixtureCatalog): BossCombatResult {
  let players = [...input] as [PlayerState, PlayerState];
  const events: BossCombatEvent[] = [];
  const bosses = previous.map((prior): BossState => {
    const definition = BOSS_DEFINITIONS.find((entry) => entry.id === prior.id)!;
    if (prior.spawnedAtTick === null && tick >= definition.spawnTick) {
      events.push({ id: `boss:spawn:${prior.id}:${tick}`, tick, type: 'spawn', bossId: prior.id, col: prior.col, row: prior.row, ownerId: null });
      return { ...prior, hp: definition.hp, spawnedAtTick: tick };
    }
    return prior;
  }).map((spawned): BossState => {
    if (spawned.hp <= 0) {
      if (!spawned.relic || spawned.relic.claimedBy) return spawned;
      const eligible = players.flatMap((player) => player.units).filter((unit) => unit.hp > 0 && unit.col === spawned.col && unit.row === spawned.row).sort((a, b) => a.id.localeCompare(b.id));
      const channeler = eligible.find((unit) => unit.id === spawned.relic?.channelUnitId) ?? eligible[0];
      if (!channeler) return { ...spawned, relic: { claimedBy: null, channelUnitId: null, channelStartTick: null } };
      const channelStartTick = channeler.id === spawned.relic.channelUnitId ? spawned.relic.channelStartTick! : tick;
      if (tick - channelStartTick < 30) return { ...spawned, relic: { claimedBy: null, channelUnitId: channeler.id, channelStartTick } };
      const side = channeler.ownerId === 'player:north' ? 0 : 1;
      players[side] = { ...players[side], relics: players[side].relics + 1, arsenal: { ...players[side].arsenal, 'gilded-core-relic': (players[side].arsenal['gilded-core-relic'] ?? 0) + 1 } };
      events.push({ id: `boss:relic-claim:${spawned.id}:${tick}:${channeler.id}`, tick, type: 'relic-claim', bossId: spawned.id, col: spawned.col, row: spawned.row, ownerId: channeler.ownerId });
      return { ...spawned, relic: { claimedBy: channeler.ownerId, channelUnitId: null, channelStartTick: null } };
    }
    const definition = BOSS_DEFINITIONS.find((entry) => entry.id === spawned.id)!;
    if (spawned.col !== spawned.lastPosition.col || spawned.row !== spawned.lastPosition.row) spawned = { ...spawned, lastMovedAtTick: tick, lastPosition: { col: spawned.col, row: spawned.row } };
    let justSummoned = false;
    if (spawned.spawnedAtTick !== null && hexDistance(spawned, definition) >= 5) {
      events.push({ id: `boss:leash:${spawned.id}:${tick}`, tick, type: 'leash-reset', bossId: spawned.id, col: definition.col, row: definition.row, ownerId: null });
      return { ...spawned, col: definition.col, row: definition.row, hp: definition.hp, attackProgressMilli: 0, abilityReadyAtTick: tick + 80, secondaryAbilityReadyAtTick: tick + 120, lastMovedAtTick: tick, lastPosition: { col: definition.col, row: definition.row }, damageByPlayer: [0, 0] };
    }
    if (spawned.hp * 2 < definition.hp && definition.kind !== 'elite' && !spawned.broodCalled) {
      events.push({ id: `boss:summon:${spawned.id}:${tick}`, tick, type: 'summon', bossId: spawned.id, col: spawned.col, row: spawned.row, ownerId: null, ability: 'brood-call' });
      const kind: BossMinionKind = definition.kind === 'alpha' ? 'razortail-hawk' : 'ironclad-golem';
      const positions = hexNeighbors(spawned.col, spawned.row).filter((point) => getHex(point.col, point.row)?.isWalkable).slice(0, 2);
      const minions = positions.map((point, index): BossMinionState => ({ id: `${spawned.id}:minion:${index + 1}`, kind, ...point, hp: kind === 'razortail-hawk' ? 1300 : 2200, attackProgressMilli: 0 }));
      spawned = { ...spawned, broodCalled: true, minions };
      justSummoned = true;
    }
    if (spawned.hp * 2 < definition.hp && definition.kind === 'elite' && !spawned.enrageUsed) {
      spawned = { ...spawned, enrageUsed: true, enragedUntilTick: tick + 200 };
      events.push({ id: `boss:ability:${spawned.id}:enrage:${tick}`, tick, type: 'ability', bossId: spawned.id, col: spawned.col, row: spawned.row, ownerId: null, ability: 'enrage' });
    }
    const living = players.flatMap((player) => player.units).filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick));
    // The Ancient's source contract says squad repositioning strips Obsidian Skin.
    // Interpret this as a slow pursuit when a hostile is inside its 4-hex aggro
    // radius but outside its 2-hex attack reach; the move rate is a Stage 2 fixture.
    if (definition.kind === 'ancient' && tick % ANCIENT_MOVE_INTERVAL_TICKS === 0) {
      const approachTarget = living.filter((unit) => {
        const distance = hexDistance(unit, spawned);
        return distance > 2 && distance <= 4;
      }).sort((a, b) => hexDistance(a, spawned) - hexDistance(b, spawned) || a.id.localeCompare(b.id))[0];
      if (approachTarget) {
        const route = findHexPath(spawned, approachTarget);
        const next = route?.[1];
        if (next) spawned = { ...spawned, col: next.col, row: next.row, lastMovedAtTick: tick, lastPosition: next };
      }
    }
    if (tick >= spawned.abilityReadyAtTick) {
      const nearby = living.filter((unit) => hexDistance(unit, spawned) <= (definition.kind === 'elite' ? 2 : definition.kind === 'alpha' ? 3 : 4));
      const target = (definition.kind === 'alpha' || definition.kind === 'ancient' ? nearby.sort((a, b) => hexDistance(b, spawned) - hexDistance(a, spawned) || a.id.localeCompare(b.id)) : nearby.sort((a, b) => hexDistance(a, spawned) - hexDistance(b, spawned) || a.id.localeCompare(b.id)))[0];
      const ability = definition.kind === 'elite' ? 'tusk-charge' : definition.kind === 'alpha' ? 'dive-strike' : 'titan-slam';
      if (target) {
        if (definition.kind === 'elite') {
          const route = findHexPath(spawned, target);
          if (route && route.length > 1) spawned = { ...spawned, col: route[Math.min(2, route.length - 1)].col, row: route[Math.min(2, route.length - 1)].row, lastMovedAtTick: tick, lastPosition: route[Math.min(2, route.length - 1)] };
        }
        const side = target.ownerId === 'player:north' ? 0 : 1;
        const damage = definition.kind === 'elite' ? 70 : definition.kind === 'alpha' ? 90 : 110;
        const slamLine = definition.kind === 'ancient' ? findHexPath(spawned, target)?.slice(1, 3) ?? [] : [];
        players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id !== target.id ? unit : {
          ...unit,
          hp: Math.max(0, unit.hp - damage),
          respawnAtTick: unit.hp <= damage ? tick + 300 : unit.respawnAtTick,
          slowUntilTick: definition.kind === 'elite' ? Math.max(unit.slowUntilTick, tick + 15) : unit.slowUntilTick,
          rootedUntilTick: definition.kind === 'ancient' && slamLine.some((point) => point.col === target.col && point.row === target.row) ? Math.max(unit.rootedUntilTick, tick + 15) : unit.rootedUntilTick,
        }) };
        if (definition.kind === 'elite') {
          const away = hexNeighbors(target.col, target.row).filter((point) => getHex(point.col, point.row)?.isWalkable)
            .sort((a, b) => hexDistance(b, spawned) - hexDistance(a, spawned) || a.row - b.row || a.col - b.col)[0];
          if (away) players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id === target.id ? { ...unit, col: away.col, row: away.row } : unit) };
        }
        if (slamLine.length) {
          players = players.map((player): PlayerState => ({ ...player, units: player.units.map((unit) => slamLine.some((point) => point.col === unit.col && point.row === unit.row)
            ? { ...unit, rootedUntilTick: Math.max(unit.rootedUntilTick, tick + 15) } : unit) })) as [PlayerState, PlayerState];
        }
        events.push({ id: `boss:ability:${spawned.id}:${ability}:${tick}`, tick, type: 'ability', bossId: spawned.id, col: target.col, row: target.row, ownerId: target.ownerId, ability });
      }
      spawned = { ...spawned, abilityReadyAtTick: tick + (definition.kind === 'elite' ? 80 : definition.kind === 'alpha' ? 60 : 90) };
    }
    if (definition.kind === 'alpha' && tick >= spawned.secondaryAbilityReadyAtTick) {
      players = players.map((player): PlayerState => ({ ...player, units: player.units.map((unit) => unit.hp > 0 && hexDistance(unit, spawned) <= 4 ? { ...unit, attackSlowedUntilTick: Math.max(unit.attackSlowedUntilTick, tick + 30) } : unit) })) as [PlayerState, PlayerState];
      events.push({ id: `boss:ability:${spawned.id}:screech:${tick}`, tick, type: 'ability', bossId: spawned.id, col: spawned.col, row: spawned.row, ownerId: null, ability: 'screech' });
      spawned = { ...spawned, secondaryAbilityReadyAtTick: tick + 120 };
    }
    if (definition.kind === 'ancient' && tick >= spawned.secondaryAbilityReadyAtTick) {
      const pullTarget = living.filter((unit) => hexDistance(unit, spawned) <= 4).sort((a, b) => hexDistance(b, spawned) - hexDistance(a, spawned) || a.id.localeCompare(b.id))[0];
      if (pullTarget) {
        const side = pullTarget.ownerId === 'player:north' ? 0 : 1;
        const closer = hexNeighbors(pullTarget.col, pullTarget.row).filter((point) => getHex(point.col, point.row)?.isWalkable)
          .sort((a, b) => hexDistance(a, spawned) - hexDistance(b, spawned) || a.row - b.row || a.col - b.col)[0];
        if (closer && hexDistance(closer, spawned) < hexDistance(pullTarget, spawned)) players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id === pullTarget.id ? { ...unit, col: closer.col, row: closer.row } : unit) };
        events.push({ id: `boss:ability:${spawned.id}:magnitude-pull:${tick}`, tick, type: 'ability', bossId: spawned.id, col: pullTarget.col, row: pullTarget.row, ownerId: pullTarget.ownerId, ability: 'magnitude-pull' });
      }
      spawned = { ...spawned, secondaryAbilityReadyAtTick: tick + 140 };
    }
    if (!justSummoned) {
      const minionStep = advanceBossMinions(players, spawned.minions, spawned.id, tick, catalog);
      players = minionStep.players;
      spawned = { ...spawned, minions: minionStep.minions };
      events.push(...minionStep.events);
    }
    let hp = spawned.hp;
    const damageByPlayer: [number, number] = [...spawned.damageByPlayer];
    let lastHitPlayerId: PlayerId | null = null;
    const attackers = players.flatMap((player) => player.units).filter((unit) => {
      const unitDefinition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
      return unit.hp > 0 && unit.stunnedUntilTick <= tick && unit.attackProgressMilli >= 1000 && hexDistance(unit, spawned) <= unitDefinition.range;
    }).sort((a, b) => a.id.localeCompare(b.id));
    for (const attacker of attackers) {
      if (hp <= 0) break;
      const side = attacker.ownerId === 'player:north' ? 0 : 1;
      const actualDamage = Math.min(hp, Math.round(damageFromUnit(attacker, definition, tick, players[side].bossBuffs.eyesUntil > tick, catalog, definition.kind === 'ancient' && spawned.lastMovedAtTick < tick) * executionBonusBps(attacker, hp, definition.hp) / 10000));
      hp -= actualDamage;
      damageByPlayer[side] += actualDamage;
      players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id === attacker.id ? { ...unit, attackProgressMilli: 0, lastCombatTick: tick } : unit) };
      events.push({ id: `boss:hit:${spawned.id}:${tick}:${attacker.id}`, tick, type: 'hit', bossId: spawned.id, col: spawned.col, row: spawned.row, ownerId: attacker.ownerId });
      if (hp === 0) lastHitPlayerId = attacker.ownerId;
    }
    if (hp === 0) {
      const totalDamage = damageByPlayer[0] + damageByPlayer[1];
      const ownerIndex = damageByPlayer.findIndex((amount) => amount * 2 > totalDamage);
      const goldShares = splitBounty(definition.bountyGold * 1000, damageByPlayer);
      const xpShares = splitBounty(definition.bountyXp, damageByPlayer);
      players = players.map((player, side): PlayerState => {
        const goldBonus = player.id === lastHitPlayerId ? definition.bountyGold * 200 : 0;
        const bossBuffs = { ...player.bossBuffs };
        if (side === ownerIndex) {
          if (definition.kind === 'elite') bossBuffs.stampedeUntil = tick + 900;
          if (definition.kind === 'alpha') { bossBuffs.eyesUntil = tick + 900; bossBuffs.eyesRevealUntil = tick + 450; }
          if (definition.kind === 'ancient') bossBuffs.emperorUntil = tick + 900;
        }
        return { ...player, goldMilli: player.goldMilli + goldShares[side] + goldBonus, commanderXp: player.commanderXp + xpShares[side], bossBuffs };
      }) as [PlayerState, PlayerState];
      events.push({ id: `boss:kill:${spawned.id}:${tick}`, tick, type: 'kill', bossId: spawned.id, col: spawned.col, row: spawned.row, ownerId: ownerIndex >= 0 ? players[ownerIndex].id : null });
      return { ...spawned, hp, damageByPlayer, killedAtTick: tick, lastHitPlayerId, minions: [], relic: definition.kind === 'elite' ? null : { claimedBy: null, channelUnitId: null, channelStartTick: null }, attackProgressMilli: 0 };
    }
    const progress = Math.min(1000, spawned.attackProgressMilli + Math.round(definition.attacksPerSecond * 100));
    if (progress < 1000) return { ...spawned, hp, damageByPlayer, attackProgressMilli: progress };
    const attackRange = definition.kind === 'alpha' ? 3 : definition.kind === 'ancient' ? 2 : 1;
    const targets = players.flatMap((player) => player.units).filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick)
      && hexDistance(unit, spawned) <= attackRange && (definition.kind !== 'ancient' || hexDistance(unit, spawned) <= 2))
      .sort((a, b) => hexDistance(a, spawned) - hexDistance(b, spawned) || a.hp - b.hp || a.id.localeCompare(b.id))[0];
    if (!targets) return { ...spawned, hp, damageByPlayer, attackProgressMilli: progress };
    const affected = definition.kind === 'ancient' ? players.flatMap((player) => player.units).filter((unit) => unit.hp > 0 && hexDistance(unit, spawned) <= 2) : [targets];
    for (const target of affected) {
      const side = target.ownerId === 'player:north' ? 0 : 1;
      const armor = catalog.units.find((unit) => unit.id === target.definitionId)!.defense;
      const attack = Math.round(definition.attack * (spawned.enragedUntilTick > tick ? 1.25 : 1));
      const damage = Math.max(1, Math.round(damageAfterArmor(attack, armor) * (players[side].bossBuffs.emperorUntil > tick ? 0.85 : 1) * bastionDamageBps(target, tick, catalog) / 10000));
      players[side] = { ...players[side], units: players[side].units.map((unit) => unit.id === target.id ? damage >= unit.hp
        ? { ...unit, hp: 0, respawnAtTick: tick + 300, attackProgressMilli: 0, lastCombatTick: tick }
        : { ...unit, hp: unit.hp - damage, lastCombatTick: tick } : unit) };
    }
    return { ...spawned, hp, damageByPlayer, attackProgressMilli: 0 };
  });
  return { players, bosses, events };
}
