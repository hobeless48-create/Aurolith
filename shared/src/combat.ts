import { fixtureCatalog, type FixtureCatalog, type UnitDefinition } from './fixture.js';
import { getHex, hexNeighbors } from './board.js';
import { canTraverse, hexDistance } from './pathfinding.js';
import type { Focus, PlayerState, UnitState } from './simulation.js';
import { bastionDamageBps, executionBonusBps, itemAttackBonus, itemHpBonus } from './items.js';
import { canDetectBrushOccupant } from './concealment.js';
import { hasLineOfSight } from './line-of-sight.js';
import { healingMultiplierBps } from './sanctuary.js';

const ESCALATION_TICKS = 1500;
const RESPAWN_TICKS = 300;
const LEVEL_XP = [0, 100, 300] as const;

function definitionFor(unit: UnitState, catalog: FixtureCatalog): UnitDefinition {
  const definition = catalog.units.find((entry) => entry.id === unit.definitionId);
  if (!definition) throw new Error(`Missing definition ${unit.definitionId}`);
  return definition;
}

export function unitLevelForXp(xp: number): 1 | 2 | 3 { return xp >= LEVEL_XP[2] ? 3 : xp >= LEVEL_XP[1] ? 2 : 1; }
export function combatScaleBps(tick: number): number { return 10000 + 1000 * Math.min(6, Math.floor(tick / ESCALATION_TICKS)); }
export function maxUnitHp(unit: UnitState, tick: number, catalog: FixtureCatalog = fixtureCatalog): number {
  const levelBps = unit.level === 3 ? 12000 : unit.level === 2 ? 11000 : 10000;
  return Math.round(definitionFor(unit, catalog).hp * combatScaleBps(tick) * levelBps / 100000000) + itemHpBonus(unit);
}
export function damageAfterArmor(attack: number, armor: number): number {
  return Math.max(1, Math.round(attack * 100 / (100 + Math.max(0, armor))));
}
/** Stable per-hit roll. Baseline critical damage is 1.5× (Blessing System Overview §4.6). */
export function criticalAttack(attack: number, unitId: string, tick: number, enabled: boolean): number {
  if (!enabled) return attack;
  let hash = (tick ^ 0x9e3779b9) >>> 0;
  for (const char of unitId) hash = Math.imul(hash ^ char.charCodeAt(0), 0x85ebca6b) >>> 0;
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d) >>> 0;
  hash ^= hash >>> 15;
  return hash % 10000 < 1500 ? Math.round(attack * 1.5) : attack;
}

type Attack = { attacker: UnitState; target: UnitState; damage: number };
export type CombatEvent = Readonly<{ id: string; tick: number; type: 'skill-cast' | 'skill-hit' | 'status-applied' | 'status-expired' | 'channel-start' | 'channel-interrupted'; skillId: 'watery-grave' | 'deadeye' | 'shadow-blink'; sourceId: string; targetId: string; source: Readonly<{ col: number; row: number }>; target: Readonly<{ col: number; row: number }> }>;
export type CombatResult = Readonly<{ players: [PlayerState, PlayerState]; events: readonly CombatEvent[] }>;

export function isUnitTargetable(unit: UnitState, tick: number): boolean { return unit.untargetableUntilTick <= tick; }

function blinkLanding(source: UnitState, target: UnitState, occupied: ReadonlySet<string>, breached: ReadonlySet<string>, ownerId: UnitState['ownerId']): { col: number; row: number } | null {
  return hexNeighbors(target.col, target.row)
    .filter((point) => !occupied.has(`${point.col}:${point.row}`) && canTraverse(point, { breachedWallHexes: breached, travelerId: ownerId }))
    .sort((a, b) => hexDistance(source, b) - hexDistance(source, a) || a.row - b.row || a.col - b.col)[0] ?? null;
}

function cube(unit: Pick<UnitState, 'col' | 'row'>): { x: number; y: number; z: number } {
  const x = unit.col - (unit.row - (unit.row & 1)) / 2;
  return { x, y: -x - unit.row, z: unit.row };
}

function lineDirection(from: UnitState, to: UnitState): string | null {
  const a = cube(from);
  const b = cube(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  if (dx !== 0 && dy !== 0 && dz !== 0) return null;
  const distance = hexDistance(from, to);
  return distance > 0 && distance <= 3 ? `${dx / distance}:${dy / distance}:${dz / distance}` : null;
}

function wateryGraveTargets(caster: UnitState, enemies: readonly UnitState[], allies: readonly UnitState[], stance: string, catalog: FixtureCatalog, breached: ReadonlySet<string>, tick: number): UnitState[] {
  const rays = new Map<string, UnitState[]>();
  for (const enemy of enemies) {
    if (enemy.hp <= 0 || !isUnitTargetable(enemy, tick) || !canDetectBrushOccupant(allies, enemy, catalog) || !hasLineOfSight(caster, enemy, breached)) continue;
    const direction = lineDirection(caster, enemy);
    if (!direction) continue;
    rays.set(direction, [...(rays.get(direction) ?? []), enemy]);
  }
  const lines = [...rays.values()].filter((line) => stance === 'aggressive'
    ? line.length >= 2
    : line.some((enemy) => allies.some((ally) => ally.hp > 0 && ['mage', 'marksman', 'support'].includes(definitionFor(ally, catalog).role) && hexDistance(enemy, ally) <= 1)));
  lines.sort((a, b) => b.length - a.length || hexDistance(caster, b[b.length - 1]) - hexDistance(caster, a[a.length - 1]));
  const line = lines[0];
  if (!line) return [];
  line.sort((a, b) => hexDistance(caster, b) - hexDistance(caster, a) || a.id.localeCompare(b.id));
  return caster.level === 3 ? line : [line[0]];
}
function chooseTarget(attacker: UnitState, enemy: readonly UnitState[], allies: readonly UnitState[], catalog: FixtureCatalog, focus: Focus, tick: number, breached: ReadonlySet<string>, preferredTargetId: string | null): UnitState | null {
  const range = definitionFor(attacker, catalog).range;
  let candidates = enemy.filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick) && hexDistance(attacker, unit) <= range && canDetectBrushOccupant(allies, unit, catalog) && hasLineOfSight(attacker, unit, breached));
  if (candidates.length === 0) return null;
  if (focus === 'siege') {
    const platoonMembers = new Set(allies.filter((ally) => ally.platoonId === attacker.platoonId).map((ally) => ally.id));
    candidates = candidates.filter((unit) => unit.lastAttackTick > 0 && unit.lastAttackTick >= tick - 10 && unit.lastAttackTargetId !== null && platoonMembers.has(unit.lastAttackTargetId));
    if (candidates.length === 0) return null;
  }
  const preferred = candidates.find((unit) => unit.id === preferredTargetId);
  if (preferred) return preferred;
  candidates.sort((a, b) => {
    const aRole = definitionFor(a, catalog).role;
    const bRole = definitionFor(b, catalog).role;
    const aBack = aRole === 'mage' || aRole === 'marksman' || aRole === 'support' ? 0 : 1;
    const bBack = bRole === 'mage' || bRole === 'marksman' || bRole === 'support' ? 0 : 1;
    if (focus === 'backline' && aBack !== bBack) return aBack - bBack;
    const aFront = aRole === 'tanker' || aRole === 'fighter' ? 0 : 1;
    const bFront = bRole === 'tanker' || bRole === 'fighter' ? 0 : 1;
    if (focus === 'frontline' && aFront !== bFront) return aFront - bFront;
    return hexDistance(attacker, a) - hexDistance(attacker, b) || a.hp - b.hp || a.id.localeCompare(b.id);
  });
  return candidates[0];
}

/** Simultaneous basic attacks. Damage, death, XP and respawn resolve on integer ticks. */
export function advanceUnitCombatWithEvents(input: readonly [PlayerState, PlayerState], tick: number, catalog: FixtureCatalog = fixtureCatalog, breached: ReadonlySet<string> = new Set()): CombatResult {
  const players = input.map((player): PlayerState => ({ ...player, units: player.units.map((unit): UnitState => {
    if (unit.hp === 0 && unit.respawnAtTick !== null && tick >= unit.respawnAtTick) {
      return { ...unit, hp: maxUnitHp(unit, tick, catalog), respawnAtTick: null, attackProgressMilli: 0, rallyProgressMilli: 0, stunnedUntilTick: 0, snaredUntilTick: 0, slowUntilTick: 0, rootedUntilTick: 0, blindedUntilTick: 0, skillsDisabledUntilTick: 0, attackSlowedUntilTick: 0, untargetableUntilTick: 0, shadowBlinkLandedAtTick: 0, channelCompleteAtTick: null, channelTargetId: null, lastAttackTargetId: null, lastAttackTick: 0, lastStructureAttackTick: 0, col: 75, row: player.id === 'player:north' ? 12 : 77 };
    }
    if (unit.hp === 0) return unit;
    const previousMax = maxUnitHp(unit, tick - 1, catalog);
    const nextMax = maxUnitHp(unit, tick, catalog);
    return nextMax > previousMax ? { ...unit, hp: Math.min(nextMax, unit.hp + nextMax - previousMax) } : unit;
  }) })) as [PlayerState, PlayerState];
  const progress = new Map<string, number>();
  const attacks: Attack[] = [];
  const events: CombatEvent[] = [];
  const skillReady = new Map<string, number>();
  const stunUntil = new Map<string, number>();
  const positionUpdates = new Map<string, { col: number; row: number }>();
  const shadowBlinkLandings = new Set<string>();
  const channel = new Map<string, { completeAtTick: number | null; targetId: string | null }>();
  for (const [side, player] of players.entries()) {
    const opponent = players[1 - side];
    for (const unit of player.units) {
      if (unit.hp <= 0) continue;
      if (unit.stunnedUntilTick === tick) events.push({ id: `combat:stun-expired:${tick}:${unit.id}`, tick, type: 'status-expired', skillId: 'watery-grave', sourceId: unit.id, targetId: unit.id, source: { col: unit.col, row: unit.row }, target: { col: unit.col, row: unit.row } });
      if (unit.stunnedUntilTick > tick) {
        if (unit.channelCompleteAtTick !== null && unit.channelTargetId) {
          const target = opponent.units.find((entry) => entry.id === unit.channelTargetId);
          if (target) {
            const skillId = unit.definitionId === 'unit-def:nightblade' ? 'shadow-blink' : 'deadeye';
            events.push({ id: `combat:${skillId}:interrupted:${tick}:${unit.id}`, tick, type: 'channel-interrupted', skillId, sourceId: unit.id, targetId: target.id, source: { col: unit.col, row: unit.row }, target: { col: target.col, row: target.row } });
          }
          channel.set(unit.id, { completeAtTick: null, targetId: null });
        }
        continue;
      }
      const definition = definitionFor(unit, catalog);
      const surgeBps = player.cardEffects.overtimeSurgeUntil > tick ? 12500 : 10000;
      const attackSlowBps = unit.attackSlowedUntilTick > tick ? 8500 : 10000;
      const next = Math.min(1000, unit.attackProgressMilli + Math.round(definition.attacksPerSecond * surgeBps * attackSlowBps / 1000000));
      const platoon = player.platoons.find((entry) => entry.id === unit.platoonId)!;
      if (unit.skillsDisabledUntilTick > tick && unit.channelCompleteAtTick !== null && unit.channelTargetId) {
        const target = opponent.units.find((entry) => entry.id === unit.channelTargetId);
        if (target) events.push({ id: `combat:skill-disabled:${tick}:${unit.id}`, tick, type: 'channel-interrupted', skillId: definition.id === 'unit-def:nightblade' ? 'shadow-blink' : 'deadeye', sourceId: unit.id, targetId: target.id, source: { col: unit.col, row: unit.row }, target: { col: target.col, row: target.row } });
        channel.set(unit.id, { completeAtTick: null, targetId: null });
        continue;
      }
      if (definition.id === 'unit-def:nightblade') {
        if (unit.channelCompleteAtTick !== null && unit.channelTargetId) {
          const target = opponent.units.find((entry) => entry.id === unit.channelTargetId && entry.hp > 0
            && isUnitTargetable(entry, tick) && canDetectBrushOccupant(player.units, entry, catalog) && hasLineOfSight(unit, entry, breached));
          if (platoon.order || platoon.stance === 'retreat' || !target) {
            const visibleTarget = opponent.units.find((entry) => entry.id === unit.channelTargetId);
            if (visibleTarget) events.push({ id: `combat:shadow-blink:interrupted:${tick}:${unit.id}`, tick, type: 'channel-interrupted', skillId: 'shadow-blink', sourceId: unit.id, targetId: visibleTarget.id, source: { col: unit.col, row: unit.row }, target: { col: visibleTarget.col, row: visibleTarget.row } });
            channel.set(unit.id, { completeAtTick: null, targetId: null });
            continue;
          }
          if (tick < unit.channelCompleteAtTick) continue;
          const occupied = new Set(players.flatMap((entry) => entry.units).filter((entry) => entry.hp > 0 && entry.id !== unit.id && entry.id !== target.id).map((entry) => `${entry.col}:${entry.row}`));
          const landing = blinkLanding(unit, target, occupied, breached, player.id);
          if (landing) {
            const targetMax = maxUnitHp(target, tick, catalog);
            const raw = Math.round((definition.attack + itemAttackBonus(unit)) * combatScaleBps(tick) * 13000 / 100000000)
              + Math.round((targetMax - target.hp) * 2000 / 10000);
            const armor = Math.round(definitionFor(target, catalog).defense * combatScaleBps(tick) / 10000);
            const executeBonus = target.hp / targetMax < 0.35 ? 12000 : 10000;
            const damage = Math.max(1, Math.round(damageAfterArmor(raw, armor) * executionBonusBps(unit, target.hp, targetMax) * executeBonus / 100000000));
            attacks.push({ attacker: unit, target, damage });
            positionUpdates.set(unit.id, landing);
            shadowBlinkLandings.add(unit.id);
            events.push({ id: `combat:shadow-blink:cast:${tick}:${unit.id}`, tick, type: 'skill-cast', skillId: 'shadow-blink', sourceId: unit.id, targetId: target.id, source: landing, target: { col: target.col, row: target.row } });
            events.push({ id: `combat:shadow-blink:hit:${tick}:${unit.id}:${target.id}`, tick, type: 'skill-hit', skillId: 'shadow-blink', sourceId: unit.id, targetId: target.id, source: landing, target: { col: target.col, row: target.row } });
          }
          channel.set(unit.id, { completeAtTick: null, targetId: null });
          continue;
        }
        const candidates = opponent.units.filter((entry) => entry.hp > 0 && isUnitTargetable(entry, tick)
          && hexDistance(unit, entry) <= 4 && canDetectBrushOccupant(player.units, entry, catalog) && hasLineOfSight(unit, entry, breached));
        candidates.sort((a, b) => a.hp - b.hp || a.id.localeCompare(b.id));
        if (!platoon.order && platoon.stance !== 'retreat' && unit.skillsDisabledUntilTick <= tick && unit.skillReadyAtTick <= tick && candidates.length) {
          const target = candidates[0];
          channel.set(unit.id, { completeAtTick: tick + 6, targetId: target.id });
          skillReady.set(unit.id, tick + 80);
          events.push({ id: `combat:shadow-blink:telegraph:${tick}:${unit.id}`, tick, type: 'channel-start', skillId: 'shadow-blink', sourceId: unit.id, targetId: target.id, source: { col: unit.col, row: unit.row }, target: { col: target.col, row: target.row } });
          continue;
        }
      }
      if (definition.id === 'unit-def:sniper-castella') {
        if (unit.channelCompleteAtTick !== null && unit.channelTargetId) {
        if (platoon.order || platoon.stance === 'retreat') {
            const target = opponent.units.find((entry) => entry.id === unit.channelTargetId);
            if (target) events.push({ id: `combat:deadeye:interrupted:${tick}:${unit.id}`, tick, type: 'channel-interrupted', skillId: 'deadeye', sourceId: unit.id, targetId: target.id, source: { col: unit.col, row: unit.row }, target: { col: target.col, row: target.row } });
            channel.set(unit.id, { completeAtTick: null, targetId: null });
            continue;
          }
          if (tick < unit.channelCompleteAtTick) continue;
          const target = opponent.units.find((entry) => entry.id === unit.channelTargetId && entry.hp > 0
            && isUnitTargetable(entry, tick) && canDetectBrushOccupant(player.units, entry, catalog) && hasLineOfSight(unit, entry, breached));
          let executed = false;
          if (target) {
            const targetMax = maxUnitHp(target, tick, catalog);
            const targetPoint = { col: target.col, row: target.row };
            const source = { col: unit.col, row: unit.row };
            executed = target.hp / targetMax < (unit.level === 3 ? 0.3 : 0.2);
            const damage = executed ? target.hp : damageAfterArmor(Math.round(definition.attack * combatScaleBps(tick) * 2.5 / 10000), Math.round(definitionFor(target, catalog).defense * combatScaleBps(tick) / 10000));
            attacks.push({ attacker: unit, target, damage });
            events.push({ id: `combat:deadeye:cast:${tick}:${unit.id}`, tick, type: 'skill-cast', skillId: 'deadeye', sourceId: unit.id, targetId: target.id, source, target: targetPoint });
            events.push({ id: `combat:deadeye:hit:${tick}:${unit.id}:${target.id}`, tick, type: 'skill-hit', skillId: 'deadeye', sourceId: unit.id, targetId: target.id, source, target: targetPoint });
          }
          skillReady.set(unit.id, executed && unit.level === 3 ? tick : tick + 100);
          channel.set(unit.id, { completeAtTick: null, targetId: null });
          continue;
        }
        const range = unit.level === 3 ? Number.MAX_SAFE_INTEGER : definition.range;
        const enemies = opponent.units.filter((entry) => entry.hp > 0 && isUnitTargetable(entry, tick) && hexDistance(unit, entry) <= range
          && canDetectBrushOccupant(player.units, entry, catalog) && hasLineOfSight(unit, entry, breached));
        const candidates = enemies.filter((entry) => platoon.stance === 'aggressive'
          ? !opponent.units.some((enemy) => enemy.hp > 0 && hexDistance(unit, enemy) <= 2)
          : entry.lastAttackTick >= tick - 10 && entry.lastAttackTick > 0);
        candidates.sort((a, b) => hexDistance(unit, b) - hexDistance(unit, a) || a.id.localeCompare(b.id));
        if (!platoon.order && platoon.stance !== 'retreat' && unit.skillsDisabledUntilTick <= tick && unit.skillReadyAtTick <= tick && candidates.length) {
          const target = candidates[0];
          channel.set(unit.id, { completeAtTick: tick + 10, targetId: target.id });
          skillReady.set(unit.id, tick + 100);
          events.push({ id: `combat:deadeye:channel:${tick}:${unit.id}`, tick, type: 'channel-start', skillId: 'deadeye', sourceId: unit.id, targetId: target.id, source: { col: unit.col, row: unit.row }, target: { col: target.col, row: target.row } });
          continue;
        }
      }
      if (definition.id === 'unit-def:tidecaller-nami' && !platoon.order && unit.skillReadyAtTick <= tick && unit.skillsDisabledUntilTick <= tick && platoon.stance !== 'retreat') {
        const targets = wateryGraveTargets(unit, opponent.units, player.units, platoon.stance, catalog, breached, tick);
        if (targets.length) {
          const primary = targets[0];
          const source = { col: unit.col, row: unit.row };
          events.push({ id: `combat:watery-grave:cast:${tick}:${unit.id}`, tick, type: 'skill-cast', skillId: 'watery-grave', sourceId: unit.id, targetId: primary.id, source, target: { col: primary.col, row: primary.row } });
          for (const victim of targets) {
            const victimDefinition = definitionFor(victim, catalog);
            const attack = Math.round((definition.attack + itemAttackBonus(unit)) * combatScaleBps(tick) * 0.6 / 10000);
            const armor = Math.round(victimDefinition.magicResist * combatScaleBps(tick) / 10000);
            attacks.push({ attacker: unit, target: victim, damage: damageAfterArmor(attack, armor) });
            stunUntil.set(victim.id, tick + 20);
            events.push({ id: `combat:watery-grave:hit:${tick}:${unit.id}:${victim.id}`, tick, type: 'skill-hit', skillId: 'watery-grave', sourceId: unit.id, targetId: victim.id, source, target: { col: victim.col, row: victim.row } });
            events.push({ id: `combat:stun-applied:${tick}:${unit.id}:${victim.id}`, tick, type: 'status-applied', skillId: 'watery-grave', sourceId: unit.id, targetId: victim.id, source, target: { col: victim.col, row: victim.row } });
          }
          skillReady.set(unit.id, tick + 80);
          progress.set(unit.id, unit.attackProgressMilli);
          continue;
        }
      }
      if (unit.blindedUntilTick > tick) { progress.set(unit.id, next); continue; }
      if (platoon.stance === 'retreat') {
        progress.set(unit.id, 0);
        continue;
      }
      const preferred = platoon.stance === 'defensive' && !platoon.order && ['tanker', 'fighter'].includes(definition.role) ? platoon.peelTargetId : null;
      const target = chooseTarget(unit, opponent.units, player.units, catalog, platoon.focus, tick, breached, preferred);
      if (next >= 1000 && target) {
        const attack = criticalAttack(Math.round((definition.attack + itemAttackBonus(unit)) * combatScaleBps(tick) * (unit.level === 3 ? 11000 : unit.level === 2 ? 10500 : 10000) / 100000000), unit.id, tick, player.bossBuffs.eyesUntil > tick);
        const targetDefinition = definitionFor(target, catalog);
        const armor = Math.round((definition.attackType === 'magic' ? targetDefinition.magicResist : targetDefinition.defense) * combatScaleBps(tick) / 10000);
        const guarded = opponent.cardEffects.phalanxUntil > tick && opponent.cardEffects.phalanxPlatoonId === target.platoonId;
        const emperorGuard = opponent.bossBuffs.emperorUntil > tick ? 0.85 : 1;
        attacks.push({ attacker: unit, target, damage: Math.max(1, Math.round(damageAfterArmor(attack, armor) * (guarded ? 0.7 : 1) * emperorGuard * executionBonusBps(unit, target.hp, maxUnitHp(target, tick, catalog)) / 10000 * bastionDamageBps(target, tick, catalog) / 10000)) });
        progress.set(unit.id, next - 1000);
      } else progress.set(unit.id, next);
    }
  }
  const damage = new Map<string, number>();
  const attackTargets = new Map<string, string>();
  const contributors = new Map<string, Set<string>>();
  for (const attack of attacks) {
    attackTargets.set(attack.attacker.id, attack.target.id);
    damage.set(attack.target.id, (damage.get(attack.target.id) ?? 0) + attack.damage);
    const set = contributors.get(attack.target.id) ?? new Set<string>();
    set.add(attack.attacker.platoonId);
    contributors.set(attack.target.id, set);
  }
  const engaged = new Set(attacks.flatMap((attack) => [attack.attacker.id, attack.target.id]));
  const earnedXp = new Map<string, number>();
  for (const player of players) {
    for (const unit of player.units) {
      if (unit.hp <= 0 || (damage.get(unit.id) ?? 0) < unit.hp) continue;
      for (const platoonId of contributors.get(unit.id) ?? []) {
        const owner = players.find((entry) => entry.platoons.some((platoon) => platoon.id === platoonId))!;
        for (const ally of owner.units) if (ally.platoonId === platoonId) earnedXp.set(ally.id, (earnedXp.get(ally.id) ?? 0) + 20);
      }
    }
  }
  const playerUnitById = new Map(players.flatMap((player) => player.units.map((unit) => [unit.id, unit] as const)));
  const updated = players.map((player): PlayerState => ({ ...player, units: player.units.map((unit): UnitState => {
    const xp = unit.xp + (earnedXp.get(unit.id) ?? 0);
    const level = unitLevelForXp(xp);
    const pendingDamage = damage.get(unit.id) ?? 0;
    if (unit.hp > 0 && pendingDamage >= unit.hp) return { ...unit, hp: 0, respawnAtTick: tick + RESPAWN_TICKS, attackProgressMilli: 0, stunnedUntilTick: 0, rootedUntilTick: 0, blindedUntilTick: 0, skillsDisabledUntilTick: 0, channelCompleteAtTick: null, channelTargetId: null, skillReadyAtTick: skillReady.get(unit.id) ?? unit.skillReadyAtTick, xp, level, lastCombatTick: tick, lastAttackTargetId: null, lastAttackTick: 0 };
    const attackTargetId = attackTargets.get(unit.id);
    const attackTarget = attackTargetId ? playerUnitById.get(attackTargetId) : null;
    const blinkLandedAtTick = shadowBlinkLandings.has(unit.id) ? tick : unit.shadowBlinkLandedAtTick;
    const phantomFlurry = unit.level === 3 && !!attackTarget && (damage.get(attackTarget.id) ?? 0) >= attackTarget.hp
      && blinkLandedAtTick > 0 && tick <= blinkLandedAtTick + 20 && unit.phantomFlurryReadyAtTick <= tick;
    const leveled = level > unit.level;
    const nextUnit = {
      ...unit,
      ...positionUpdates.get(unit.id),
      xp,
      level,
      shadowBlinkLandedAtTick: blinkLandedAtTick,
      skillReadyAtTick: phantomFlurry ? tick : skillReady.get(unit.id) ?? unit.skillReadyAtTick,
      untargetableUntilTick: phantomFlurry ? tick + 13 : unit.untargetableUntilTick,
      phantomFlurryReadyAtTick: phantomFlurry ? tick + 40 : unit.phantomFlurryReadyAtTick,
    };
    const maximum = maxUnitHp(nextUnit, tick, catalog);
    const channelState = channel.get(unit.id);
    return { ...nextUnit, hp: unit.hp === 0 ? 0 : Math.min(maximum, unit.hp - pendingDamage + (leveled ? Math.round(maximum * 0.2 * healingMultiplierBps(player, nextUnit) / 10000) : 0)), attackProgressMilli: progress.get(unit.id) ?? unit.attackProgressMilli, channelCompleteAtTick: channelState ? channelState.completeAtTick : unit.channelCompleteAtTick, channelTargetId: channelState ? channelState.targetId : unit.channelTargetId, stunnedUntilTick: stunUntil.has(unit.id) ? Math.max(unit.stunnedUntilTick, stunUntil.get(unit.id)!) : unit.stunnedUntilTick, lastCombatTick: engaged.has(unit.id) ? tick : unit.lastCombatTick, lastAttackTargetId: attackTargets.get(unit.id) ?? unit.lastAttackTargetId, lastAttackTick: attackTargets.has(unit.id) ? tick : unit.lastAttackTick };
  }) })) as [PlayerState, PlayerState];
  return { players: updated, events };
}

export function advanceUnitCombat(input: readonly [PlayerState, PlayerState], tick: number, catalog: FixtureCatalog = fixtureCatalog, breached: ReadonlySet<string> = new Set()): [PlayerState, PlayerState] {
  return advanceUnitCombatWithEvents(input, tick, catalog, breached).players;
}
