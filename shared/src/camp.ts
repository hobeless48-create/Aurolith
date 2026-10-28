import { hexNeighbors } from './board.js';
import { combatScaleBps, criticalAttack, damageAfterArmor, isUnitTargetable, maxUnitHp, unitLevelForXp } from './combat.js';
import { fixtureCatalog, type FixtureCatalog } from './fixture.js';
import { hexDistance } from './pathfinding.js';
import { nextRandomUint32 } from './rng.js';
import { campBountyBonusBps, hasBlessing } from './blessings.js';
import type { PlayerState, UnitState } from './simulation.js';
import { bastionDamageBps, executionBonusBps, itemAttackBonus } from './items.js';
import { healingMultiplierBps } from './sanctuary.js';

export type MonsterState = Readonly<{ id: string; col: number; row: number; hp: number; attackProgressMilli: number }>;
export type CampState = Readonly<{ id: string; monsters: readonly MonsterState[]; respawnAtTick: number | null; clearCount: number }>;

export function createCampState(catalog: FixtureCatalog = fixtureCatalog, definition: FixtureCatalog['camps'][number] = catalog.camps[0]): CampState {
  const origin = { col: definition.col, row: definition.row };
  const positions = [origin, ...hexNeighbors(origin.col, origin.row)].slice(0, catalog.monster.packSize);
  return { id: definition.id, monsters: positions.map((point, index) => ({ id: `monster:${definition.id}:${index + 1}`, ...point, hp: catalog.monster.hp, attackProgressMilli: 0 })), respawnAtTick: null, clearCount: 0 };
}

export type CampCombatResult = Readonly<{ players: [PlayerState, PlayerState]; camp: CampState; rngState: number }>;

/** One common five-boar camp: last-hit bounties, 2–3 material drops and 40s pack respawn. */
export function advanceCampCombat(input: readonly [PlayerState, PlayerState], previous: CampState, tick: number, rngState: number, catalog: FixtureCatalog = fixtureCatalog): CampCombatResult {
  const definition = catalog.camps.find((camp) => camp.id === previous.id);
  if (!definition) throw new Error(`Unknown camp ${previous.id}`);
  let camp = previous.respawnAtTick !== null && tick >= previous.respawnAtTick
    ? { ...previous, monsters: createCampState(catalog, definition).monsters, respawnAtTick: null }
    : previous;
  if (camp.respawnAtTick !== null) return { players: [...input] as [PlayerState, PlayerState], camp, rngState };
  const players = input.map((player): PlayerState => ({ ...player, units: [...player.units] })) as [PlayerState, PlayerState];
  let monsters = camp.monsters.map((monster) => ({ ...monster }));
  const unitProgress = new Map<string, number>();
  const earnedXp = new Map<string, number>();
  const goldAward = new Map<string, number>();
  const commanderXpAward = new Map<string, number>();
  const materialsAward = new Map<string, number>();
  const actions: { attacker: UnitState; targetId: string; damage: number }[] = [];
  let clearOwner: string | null = null;
  for (const player of players) {
    for (const unit of player.units) {
      const platoon = player.platoons.find((entry) => entry.id === unit.platoonId);
      if (unit.hp <= 0 || platoon?.stance === 'retreat' || unit.attackProgressMilli < 1000) continue;
      const definition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
      const target = monsters.filter((monster) => monster.hp > 0 && hexDistance(unit, monster) <= definition.range)
        .sort((a, b) => hexDistance(unit, a) - hexDistance(unit, b) || a.hp - b.hp || a.id.localeCompare(b.id))[0];
      if (!target) continue;
      const owner = players.find((entry) => entry.id === unit.ownerId)!;
      const scaledAttack = criticalAttack(Math.round((definition.attack + itemAttackBonus(unit)) * combatScaleBps(tick) * (unit.level === 3 ? 11000 : unit.level === 2 ? 10500 : 10000) / 100000000), unit.id, tick, owner.bossBuffs.eyesUntil > tick);
      actions.push({ attacker: unit, targetId: target.id, damage: Math.round(damageAfterArmor(scaledAttack, catalog.monster.defense) * executionBonusBps(unit, target.hp, catalog.monster.hp) / 10000) });
      unitProgress.set(unit.id, 0);
    }
  }
  actions.sort((a, b) => a.attacker.id.localeCompare(b.attacker.id));
  for (const action of actions) {
    const targetIndex = monsters.findIndex((monster) => monster.id === action.targetId);
    const target = monsters[targetIndex];
    if (target.hp <= 0) continue;
    monsters[targetIndex] = { ...target, hp: Math.max(0, target.hp - action.damage) };
    if (monsters[targetIndex].hp > 0) continue;
    const owner = action.attacker.ownerId;
    const winner = players.find((player) => player.id === owner)!;
    const boomBps = winner.cardEffects.alchemicalBoomUntil > tick ? 20000 : 10000;
    const bonusBps = campBountyBonusBps(winner.blessings, tick);
    const stampedeBps = winner.bossBuffs.stampedeUntil > tick ? 15000 : 10000;
    goldAward.set(owner, (goldAward.get(owner) ?? 0) + Math.round(100000 * boomBps * (10000 + bonusBps) * stampedeBps / 1000000000000)
      + (hasBlessing(winner.blessings, 'blessing:grace:scrap-pickers') ? 5000 : 0));
    commanderXpAward.set(owner, (commanderXpAward.get(owner) ?? 0) + Math.round(80 * boomBps * (10000 + bonusBps) / 100000000));
    const draw = nextRandomUint32(rngState);
    rngState = draw.nextState;
    materialsAward.set(owner, (materialsAward.get(owner) ?? 0) + 2 + (draw.value & 1));
    for (const ally of players.find((player) => player.id === owner)!.units) {
      if (ally.platoonId === action.attacker.platoonId) earnedXp.set(ally.id, (earnedXp.get(ally.id) ?? 0) + 10);
    }
    if (monsters.every((monster) => monster.hp === 0)) clearOwner = owner;
  }
  const retaliation = new Map<string, number>();
  monsters = monsters.map((monster) => {
    if (monster.hp <= 0) return monster;
    const progress = Math.min(1000, monster.attackProgressMilli + Math.round(catalog.monster.attacksPerSecond * 1000 / 10));
    if (progress < 1000) return { ...monster, attackProgressMilli: progress };
    const target = players.flatMap((player) => player.units).filter((unit) => unit.hp > 0 && isUnitTargetable(unit, tick) && hexDistance(monster, unit) <= 1)
      .sort((a, b) => hexDistance(monster, a) - hexDistance(monster, b) || a.hp - b.hp || a.id.localeCompare(b.id))[0];
    if (!target) return { ...monster, attackProgressMilli: progress };
    const defense = catalog.units.find((entry) => entry.id === target.definitionId)!.defense;
    const owner = players.find((player) => player.id === target.ownerId)!;
    const guarded = owner.cardEffects.phalanxUntil > tick && owner.cardEffects.phalanxPlatoonId === target.platoonId;
    retaliation.set(target.id, (retaliation.get(target.id) ?? 0) + Math.max(1, Math.round(damageAfterArmor(catalog.monster.attack, defense) * (guarded ? 0.7 : 1) * (owner.bossBuffs.emperorUntil > tick ? 0.85 : 1) * bastionDamageBps(target, tick, catalog) / 10000)));
    return { ...monster, attackProgressMilli: 0 };
  });
  const updatedPlayers = players.map((player): PlayerState => ({
    ...player,
    goldMilli: player.goldMilli + (goldAward.get(player.id) ?? 0)
      + (clearOwner === player.id && hasBlessing(player.blessings, 'blessing:grace:scrap-pickers') ? 15000 : 0)
      + (clearOwner === player.id && hasBlessing(player.blessings, 'blessing:exalted:bounty-hunter') && (player.blessings.campClearsSinceBounty + 1) % 5 === 0 ? 50000 : 0),
    commanderXp: player.commanderXp + (commanderXpAward.get(player.id) ?? 0),
    blessings: clearOwner === player.id && hasBlessing(player.blessings, 'blessing:exalted:bounty-hunter')
      ? { ...player.blessings, campClearsSinceBounty: player.blessings.campClearsSinceBounty + 1 }
      : player.blessings,
    materials: { ...player.materials, [catalog.monster.material]: (player.materials[catalog.monster.material] ?? 0) + (materialsAward.get(player.id) ?? 0) },
    units: player.units.map((unit): UnitState => {
      const xp = unit.xp + (earnedXp.get(unit.id) ?? 0);
      const level = unitLevelForXp(xp);
      const leveled = level > unit.level;
      const damage = retaliation.get(unit.id) ?? 0;
      if (unit.hp > 0 && damage >= unit.hp) return { ...unit, hp: 0, xp, level, respawnAtTick: tick + 300, attackProgressMilli: 0, channelCompleteAtTick: null, channelTargetId: null, lastCombatTick: tick };
      const nextUnit = { ...unit, xp, level };
      const maximum = maxUnitHp(nextUnit, tick, catalog);
      return { ...nextUnit, hp: unit.hp === 0 ? 0 : Math.min(maximum, unit.hp - damage + (leveled ? Math.round(maximum * 0.2 * healingMultiplierBps(player, nextUnit) / 10000) : 0)), attackProgressMilli: unitProgress.get(unit.id) ?? unit.attackProgressMilli, lastCombatTick: damage > 0 || unitProgress.has(unit.id) ? tick : unit.lastCombatTick };
    }),
  })) as [PlayerState, PlayerState];
  camp = { ...camp, monsters, respawnAtTick: monsters.every((monster) => monster.hp === 0) ? tick + 400 : null, clearCount: camp.clearCount + (monsters.every((monster) => monster.hp === 0) ? 1 : 0) };
  return { players: updatedPlayers, camp, rngState };
}
