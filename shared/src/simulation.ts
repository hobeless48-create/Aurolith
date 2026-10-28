import { BOARD_COLUMNS, getHex, hexCenter, hexNeighbors, terrainMoveSpeedBps } from './board.js';
import { fixtureCatalog, validateFixture, type FixtureCatalog, type UnitDefinition } from './fixture.js';
import { canTraverse, findHexPath, hexDistance } from './pathfinding.js';
import { advanceUnitCombatWithEvents, isUnitTargetable, maxUnitHp, unitLevelForXp, type CombatEvent } from './combat.js';
import { advanceCampCombat, createCampState, type CampState } from './camp.js';
import { advanceBossCombat, BOSS_DEFINITIONS, createBossStates, type BossCombatEvent, type BossState } from './bosses.js';
import { advanceTraps, isTrapCardId, placeTrap, TRAP_CARD_KINDS, validTrapHex, validateTraps, type TrapEvent, type TrapState } from './traps.js';
import { computeVision, visionRadiusForUnit } from './vision.js';
import { hasLineOfSight } from './line-of-sight.js';
import { canDetectBrushOccupant } from './concealment.js';
import { advanceStructureCombat, breachedWallHexes, corePoint, createCastleWalls, validateCastleWalls, type WallState } from './structures.js';
import { consumeCard, createCardState, drawCards, expireOverflow, extraDrawPriceGold, validateCardState, type CardState } from './cards.js';
import { chooseBlessing, createBlessingSetup, emptyBlessingState, hasBlessing, holyNationBonusBps, openBlessingRite, passiveGoldBonusBps, recruitDiscountBps, rerollBlessingOffer, validateBlessingState, type BlessingState, type BlessingTier } from './blessings.js';
import { advanceBallistaCombat, caravanPaymentMilli, createFacilitySlots, FACILITY_BUILD_TICKS, FACILITY_COSTS, FACILITY_XP_COSTS, facilityCategory, facilityFootprint, occupiedFacilityHexes, progressFacilities, validateFacilitySlots, type FacilityAttackEvent, type FacilityKind, type FacilityState } from './facilities.js';
import { beginCraft, beginEquip, buyMaterial, progressItemChannels, validateItemState, type CraftJob, type EquipJob, type ItemEvent, type ItemId, type MaterialName } from './items.js';
import { healingMultiplierBps } from './sanctuary.js';
export { nextRandomUint32 } from './rng.js';

/** TechnicalPlan/06: 10 fixed simulation ticks per second. No wall clock enters shared rules. */
export const TICKS_PER_SECOND = 10;
export const HIRE_BASE_GOLD = 60;
export const HIRE_ESCALATION_TICKS = 150 * TICKS_PER_SECOND;
export const MATCH_LIMIT_TICKS = 18 * 60 * TICKS_PER_SECOND;
const GOLD_SCALE = 1000;
const STARTER_COLS = [73, 74, 75, 76, 77] as const;

export type PlayerId = 'player:north' | 'player:south';
export type Stance = 'aggressive' | 'defensive' | 'retreat';
export type Focus = 'frontline' | 'backline' | 'siege';
export type PlatoonMacro = 'standard' | 'gather' | 'outrider';
export type Phase = 'opening' | 'expansion' | 'siege' | 'overtime' | 'ended';
export type PlatoonOrder = Readonly<{ col: number; row: number }>;
export type ReconArea = Readonly<{ col: number; row: number; visionUntilTick: number; trapRevealUntilTick: number }>;
export type TrapRevealedUnit = Readonly<{ unitId: string; untilTick: number }>;
export type UnitState = Readonly<{ id: string; definitionId: string; ownerId: PlayerId; platoonId: string; formationRank: 1 | 2 | 3; formationSlot: number; col: number; row: number; hp: number; attackProgressMilli: number; rallyProgressMilli: number; respawnAtTick: number | null; skillReadyAtTick: number; channelCompleteAtTick: number | null; channelTargetId: string | null; stunnedUntilTick: number; snaredUntilTick: number; slowUntilTick: number; rootedUntilTick: number; blindedUntilTick: number; skillsDisabledUntilTick: number; attackSlowedUntilTick: number; untargetableUntilTick: number; shadowBlinkLandedAtTick: number; phantomFlurryReadyAtTick: number; xp: number; level: 1 | 2 | 3; equippedItemId: ItemId | null; lastCombatTick: number; lastAttackTargetId: string | null; lastAttackTick: number; lastStructureAttackTick: number }>;
export type PlatoonState = Readonly<{ id: string; ownerId: PlayerId; unitIds: readonly string[]; stance: Stance; focus: Focus; macro: PlatoonMacro; order: PlatoonOrder | null; anchor: PlatoonOrder; route: readonly PlatoonOrder[]; moveProgressMilli: number; peelTargetId: string | null; peelAllyId: string | null; peelLockUntilTick: number; outriderAlertEnemyId: string | null }>;
export type CardEffects = Readonly<{ phalanxPlatoonId: string | null; phalanxUntil: number; supplyLineUntil: number; alchemicalBoomUntil: number; forcedMarchUntil: number; overtimeSurgeUntil: number }>;
export type BossBuffs = Readonly<{ stampedeUntil: number; eyesUntil: number; eyesRevealUntil: number; emperorUntil: number }>;
export type PlayerState = Readonly<{ id: PlayerId; goldMilli: number; commanderXp: number; commanderXpMilli: number; facilityXpSpent: number; coreHp: number; wallDamage: number; batteryPowerSlotId: string | null; batteryReadyAtTick: number; batteryDisabled: boolean; materials: Readonly<Record<string, number>>; arsenal: Readonly<Record<string, number>>; craftJobs: readonly CraftJob[]; equipJobs: readonly EquipJob[]; relics: number; bossBuffs: BossBuffs; cards: CardState; cardEffects: CardEffects; blessings: BlessingState; reconAreas: readonly ReconArea[]; trapRevealedUnits: readonly TrapRevealedUnit[]; units: readonly UnitState[]; platoons: readonly PlatoonState[]; facilities: readonly FacilityState[] }>;
export type MatchResult = Readonly<{ winnerId: PlayerId | null; reason: 'wall-damage' | 'core-hp' | 'core-collapse' | 'draw' }>;
export type MatchEvent = Readonly<{ id: string; tick: number; type: 'card-draw' | 'rite-open' | 'phase-change' | 'match-limit' | 'boss-warning' | 'boss-spawn' }>;
export type MatchState = Readonly<{
  schemaVersion: 1;
  seed: number;
  rngState: number;
  tick: number;
  phase: Phase;
  players: readonly [PlayerState, PlayerState];
  availableUnitIds: readonly string[];
  camps: readonly CampState[];
  bosses: readonly BossState[];
  traps: readonly TrapState[];
  wallId: string;
  walls: readonly WallState[];
  cardId: string;
  blessingTiers: readonly [BlessingTier, BlessingTier, BlessingTier];
  firstBreachAwarded: boolean;
  events: readonly MatchEvent[];
  result: MatchResult | null;
}>;

export type Command =
  | Readonly<{ type: 'recruit'; unitDefinitionId: string; platoonId: string }>
  | Readonly<{ type: 'train-commander' }>
  | Readonly<{ type: 'train-unit'; unitId: string }>
  | Readonly<{ type: 'build-facility'; slotId: string; kind: FacilityKind }>
  | Readonly<{ type: 'upgrade-facility'; slotId: string }>
  | Readonly<{ type: 'set-stance'; platoonId: string; stance: Stance }>
  | Readonly<{ type: 'set-focus'; platoonId: string; focus: Focus }>
  | Readonly<{ type: 'set-macro'; platoonId: string; macro: PlatoonMacro }>
  | Readonly<{ type: 'set-formation-rank'; unitId: string; rank: 1 | 2 | 3 }>
  | Readonly<{ type: 'set-formation-slot'; unitId: string; slot: number }>
  | Readonly<{ type: 'set-order'; platoonId: string; target: PlatoonOrder }>
  | Readonly<{ type: 'buy-card' }>
  | Readonly<{ type: 'play-card'; cardId: string; platoonId?: string; target?: PlatoonOrder }>
  | Readonly<{ type: 'choose-blessing'; blessingId: string }>
  | Readonly<{ type: 'reroll-blessings' }>
  | Readonly<{ type: 'buy-material'; material: MaterialName }>
  | Readonly<{ type: 'craft-item'; itemId: ItemId; unitId: string }>
  | Readonly<{ type: 'equip-item'; itemId: ItemId; unitId: string }>;
export type CommandEnvelope = Readonly<{ tick: number; sequence: number; playerId: PlayerId; command: Command }>;
export type CardCastEvent = Readonly<{ id: string; tick: number; ownerId: PlayerId; cardId: string; targets: readonly Readonly<{ unitId: string | null; col: number; row: number }>[] }>;
export type EconomyEvent = Readonly<{ tick: number; playerId: PlayerId; source: 'facility-completion' | 'passive-income' | 'auto-blessing' | 'command' | 'combat' | 'camp' | 'boss' | 'structure' | 'item-channel'; commandSequence: number | null; commandType: Command['type'] | null; goldMilliDelta: number; commanderXpDelta: number; materialsDelta: Readonly<Record<string, number>>; arsenalDelta: Readonly<Record<string, number>>; relicsDelta: number }>;
export type OutriderAlertEvent = Readonly<{ id: string; tick: number; ownerId: PlayerId; platoonId: string; scoutId: string; enemyId: string; col: number; row: number }>;
export type StepResult = Readonly<{ state: MatchState; accepted: readonly number[]; rejected: readonly { sequence: number; reason: string }[]; economyEvents: readonly EconomyEvent[]; cardEvents: readonly CardCastEvent[]; combatEvents: readonly CombatEvent[]; facilityEvents: readonly FacilityAttackEvent[]; bossEvents: readonly BossCombatEvent[]; trapEvents: readonly TrapEvent[]; itemEvents: readonly ItemEvent[]; outriderAlerts: readonly OutriderAlertEvent[] }>;

export function phaseAtTick(tick: number): Phase {
  if (tick >= MATCH_LIMIT_TICKS) return 'ended';
  if (tick >= 15 * 60 * TICKS_PER_SECOND) return 'overtime';
  if (tick >= 10 * 60 * TICKS_PER_SECOND) return 'siege';
  if (tick >= 5 * 60 * TICKS_PER_SECOND) return 'expansion';
  return 'opening';
}

export function hirePriceGold(tick: number): number {
  return HIRE_BASE_GOLD + 15 * Math.min(6, Math.floor(tick / HIRE_ESCALATION_TICKS));
}

const COMMANDER_XP_THRESHOLDS = [0, 500, 1200, 2100, 3400, 5200, 7000, 9000, 11500, 14500] as const;
export function commanderLevelForXp(xp: number): number {
  for (let index = COMMANDER_XP_THRESHOLDS.length - 1; index >= 0; index--) if (xp >= COMMANDER_XP_THRESHOLDS[index]) return index + 1;
  return 1;
}
export function maxRecruitTierForLevel(level: number): number {
  if (level >= 8) return 5;
  if (level >= 5) return 4;
  if (level >= 3) return 3;
  if (level >= 2) return 2;
  return 1;
}

const GUILD_ROLE_ORDER = ['fighter', 'tanker', 'marksman', 'mage', 'assassin', 'support', 'siege', 'artisan'] as const;
export function guildContracts(state: MatchState, playerId: PlayerId, catalog: FixtureCatalog = fixtureCatalog): UnitDefinition[] {
  const player = state.players.find((entry) => entry.id === playerId);
  if (!player) throw new Error('Unknown Guild seat');
  const tier = maxRecruitTierForLevel(commanderLevelForXp(player.commanderXp));
  return state.availableUnitIds.flatMap((id) => {
    const definition = catalog.units.find((entry) => entry.id === id);
    return definition && definition.tier <= tier && !player.units.some((unit) => unit.definitionId === id) ? [definition] : [];
  }).sort((a, b) => GUILD_ROLE_ORDER.indexOf(a.role as typeof GUILD_ROLE_ORDER[number]) - GUILD_ROLE_ORDER.indexOf(b.role as typeof GUILD_ROLE_ORDER[number]) || a.tier - b.tier || a.name.localeCompare(b.name));
}

/** The event IDs are stable replay keys. The opening events exist before the first paid tick. */
export function scheduledEventsAtTick(tick: number): MatchEvent[] {
  const events: MatchEvent[] = [];
  if (tick % HIRE_ESCALATION_TICKS === 0 && tick <= 9000) events.push({ id: `event:card-draw:${tick}`, tick, type: 'card-draw' });
  if (tick === 0 || tick === 3000 || tick === 6000) events.push({ id: `event:rite-open:${tick}`, tick, type: 'rite-open' });
  if (tick === 3000 || tick === 6000 || tick === 9000) events.push({ id: `event:phase-change:${tick}`, tick, type: 'phase-change' });
  if (tick === MATCH_LIMIT_TICKS) events.push({ id: `event:match-limit:${tick}`, tick, type: 'match-limit' });
  for (const boss of BOSS_DEFINITIONS) {
    if (tick === boss.spawnTick - 300) events.push({ id: `event:boss-warning:${boss.id}`, tick, type: 'boss-warning' });
    if (tick === boss.spawnTick) events.push({ id: `event:boss-spawn:${boss.id}`, tick, type: 'boss-spawn' });
  }
  return events;
}

function playerId(side: 'north' | 'south'): PlayerId {
  return `player:${side}`;
}

const FORMATION_RANK_CAPACITY = [0, 3, 4, 3] as const;
function defaultFormationRank(role: UnitDefinition['role']): 1 | 2 | 3 {
  return role === 'tanker' ? 1 : role === 'fighter' || role === 'assassin' ? 2 : 3;
}

function makePlayer(side: 'north' | 'south', catalog: FixtureCatalog): PlayerState {
  const ownerId = playerId(side);
  const platoons: PlatoonState[] = [1, 2, 3, 4].map((number) => ({ id: `platoon:${side}:${number}`, ownerId, unitIds: [], stance: 'defensive', focus: 'frontline', macro: 'standard', order: null, anchor: { col: 75, row: side === 'north' ? 12 : 77 }, route: [], moveProgressMilli: 0, peelTargetId: null, peelAllyId: null, peelLockUntilTick: 0, outriderAlertEnemyId: null }));
  const units: UnitState[] = catalog.starterUnitIds.map((definitionId, index) => {
    const definition = catalog.units.find((entry) => entry.id === definitionId)!;
    const formationRank = defaultFormationRank(definition.role);
    const formationSlot = catalog.starterUnitIds.slice(0, index).filter((previousId) => {
      const previous = catalog.units.find((entry) => entry.id === previousId)!;
      return defaultFormationRank(previous.role) === formationRank;
    }).length;
    return { id: `unit:${side}:${index + 1}`, definitionId, ownerId, platoonId: platoons[0].id, formationRank, formationSlot, col: STARTER_COLS[index], row: side === 'north' ? 12 : 77, hp: definition.hp, attackProgressMilli: 0, rallyProgressMilli: 0, respawnAtTick: null, skillReadyAtTick: 0, channelCompleteAtTick: null, channelTargetId: null, snaredUntilTick: 0, stunnedUntilTick: 0, slowUntilTick: 0, rootedUntilTick: 0, blindedUntilTick: 0, skillsDisabledUntilTick: 0, attackSlowedUntilTick: 0, untargetableUntilTick: 0, shadowBlinkLandedAtTick: 0, phantomFlurryReadyAtTick: 0, xp: 0, level: 1, equippedItemId: null, lastCombatTick: 0, lastAttackTargetId: null, lastAttackTick: 0, lastStructureAttackTick: 0 };
  });
  platoons[0] = { ...platoons[0], unitIds: units.map((unit) => unit.id) };
  return { id: ownerId, goldMilli: 0, commanderXp: 0, commanderXpMilli: 0, facilityXpSpent: 0, coreHp: 4500, wallDamage: 0, batteryPowerSlotId: null, batteryReadyAtTick: 0, batteryDisabled: false, materials: {}, arsenal: {}, craftJobs: [], equipJobs: [], relics: 0, bossBuffs: { stampedeUntil: 0, eyesUntil: 0, eyesRevealUntil: 0, emperorUntil: 0 }, cards: { drawPile: [], locked: [], hand: [], overflow: [], discard: [], extraBuys: 0 }, cardEffects: { phalanxPlatoonId: null, phalanxUntil: 0, supplyLineUntil: 0, alchemicalBoomUntil: 0, forcedMarchUntil: 0, overtimeSurgeUntil: 0 }, blessings: emptyBlessingState(), reconAreas: [], trapRevealedUnits: [], units, platoons, facilities: createFacilitySlots(ownerId) };
}

export function createInitialState(seed: number, catalog: FixtureCatalog = fixtureCatalog): MatchState {
  const errors = validateFixture(catalog);
  if (errors.length) throw new Error(`Invalid fixture: ${errors.join('; ')}`);
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Seed must be an unsigned 32-bit integer');
  let rngState = seed >>> 0;
  const availableUnitIds = catalog.units.map((unit) => unit.id);
  const northCards = createCardState(rngState);
  const southCards = createCardState(northCards.rngState);
  const blessingSetup = createBlessingSetup(southCards.rngState);
  rngState = blessingSetup.rngState;
  const players: [PlayerState, PlayerState] = [
    { ...makePlayer('north', catalog), cards: northCards.cards, blessings: blessingSetup.north },
    { ...makePlayer('south', catalog), cards: southCards.cards, blessings: blessingSetup.south },
  ];
  return { schemaVersion: 1, seed, rngState, tick: 0, phase: 'opening', players, availableUnitIds, camps: catalog.camps.map((camp) => createCampState(catalog, camp)), bosses: createBossStates(), traps: [], wallId: catalog.wall.id, walls: createCastleWalls(catalog), cardId: catalog.card.id, blessingTiers: blessingSetup.tiers, firstBreachAwarded: false, events: scheduledEventsAtTick(0), result: null };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function selectBlessing(player: PlayerState, blessingId: string, tick: number): PlayerState | null {
  const chosen = chooseBlessing(player.blessings, blessingId);
  if (!chosen) return null;
  let goldMilli = player.goldMilli;
  let blessings = chosen;
  if (blessingId === 'blessing:grace:war-chest') goldMilli += 75000;
  if (blessingId === 'blessing:exalted:war-chest') {
    goldMilli += 120000;
    blessings = { ...blessings, warChestChosenAtTick: tick };
  }
  if (blessingId === 'blessing:imperial:royal-treasury') goldMilli += 250000;
  if (blessingId === 'blessing:grace:gilded-ledger') blessings = { ...blessings, ledgerThreshold: Math.floor(goldMilli / 300000) };
  if (blessingId === 'blessing:exalted:gilded-vault') blessings = { ...blessings, vaultThreshold: Math.floor(goldMilli / 500000) };
  return { ...player, blessings, goldMilli };
}

function passiveIncome(player: PlayerState, tick: number, phase: Phase): PlayerState {
  const goldBonusBps = passiveGoldBonusBps(player.blessings);
  const xpBonusBps = holyNationBonusBps(player.blessings);
  let goldMilli = player.goldMilli + Math.round((phase === 'overtime' ? 1500 : 1000) * (10000 + goldBonusBps) / 10000);
  const xpMilli = player.commanderXpMilli + 1000 + Math.round(xpBonusBps / 10);
  const commanderXp = player.commanderXp + Math.floor(xpMilli / 1000);
  let blessings = player.blessings;
  if (tick % 600 === 0) {
    const bankGold = Math.floor(goldMilli / 1000);
    if (hasBlessing(blessings, 'blessing:grace:copper-interest')) goldMilli += Math.min(bankGold >= 1000 ? 60 : 30, Math.floor(bankGold / 100)) * 1000;
    if (hasBlessing(blessings, 'blessing:exalted:silver-interest')) goldMilli += Math.min(50 + Math.floor(bankGold / 1000) * 10, Math.floor(bankGold / 100) * 2) * 1000;
    if (hasBlessing(blessings, 'blessing:imperial:golden-interest')) goldMilli += (Math.min(60, Math.floor(bankGold / 100) * 2) + (bankGold > 1000 ? 30 : 0)) * 1000;
  }
  if (tick % 1200 === 0 && hasBlessing(blessings, 'blessing:grace:courier-contract')) goldMilli += 40000;
  if (hasBlessing(blessings, 'blessing:grace:gilded-ledger')) {
    const threshold = Math.floor(goldMilli / 300000);
    if (threshold > blessings.ledgerThreshold) {
      goldMilli += (threshold - blessings.ledgerThreshold) * 25000;
      blessings = { ...blessings, ledgerThreshold: threshold };
    }
  }
  if (hasBlessing(blessings, 'blessing:exalted:gilded-vault')) {
    const threshold = Math.floor(goldMilli / 500000);
    if (threshold > blessings.vaultThreshold) {
      goldMilli += (threshold - blessings.vaultThreshold) * 50000;
      blessings = { ...blessings, vaultThreshold: threshold };
    }
  }
  return { ...player, goldMilli: goldMilli + caravanPaymentMilli(player.facilities, tick), commanderXp, commanderXpMilli: xpMilli % 1000, blessings };
}

/** Runtime boundary for network, replay and bot commands. */
export function isCommandEnvelope(value: unknown): value is CommandEnvelope {
  if (!isRecord(value) || !Number.isSafeInteger(value.tick) || (value.tick as number) < 1 || !Number.isSafeInteger(value.sequence) || (value.sequence as number) < 0) return false;
  if (value.playerId !== 'player:north' && value.playerId !== 'player:south') return false;
  const command = value.command;
  if (!isRecord(command)) return false;
  if (command.type === 'recruit') return typeof command.unitDefinitionId === 'string' && typeof command.platoonId === 'string';
  if (command.type === 'train-commander') return true;
  if (command.type === 'train-unit') return typeof command.unitId === 'string';
  if (command.type === 'build-facility') return typeof command.slotId === 'string' && ['caravan-post', 'ballista', 'arcane-barrier', 'sanctuary'].includes(String(command.kind));
  if (command.type === 'upgrade-facility') return typeof command.slotId === 'string';
  if (command.type === 'set-stance') return typeof command.platoonId === 'string' && ['aggressive', 'defensive', 'retreat'].includes(String(command.stance));
  if (command.type === 'set-focus') return typeof command.platoonId === 'string' && ['frontline', 'backline', 'siege'].includes(String(command.focus));
  if (command.type === 'set-macro') return typeof command.platoonId === 'string' && ['standard', 'gather', 'outrider'].includes(String(command.macro));
  if (command.type === 'set-formation-rank') return typeof command.unitId === 'string' && [1, 2, 3].includes(Number(command.rank)) && Number.isSafeInteger(command.rank);
  if (command.type === 'set-formation-slot') return typeof command.unitId === 'string' && Number.isSafeInteger(command.slot) && (command.slot as number) >= 0 && (command.slot as number) < 4;
  if (command.type === 'set-order') return typeof command.platoonId === 'string' && isRecord(command.target) && Number.isSafeInteger(command.target.col) && Number.isSafeInteger(command.target.row);
  if (command.type === 'buy-card') return true;
  if (command.type === 'play-card') return typeof command.cardId === 'string' && (command.platoonId === undefined || typeof command.platoonId === 'string') && (command.target === undefined || isRecord(command.target) && Number.isSafeInteger(command.target.col) && Number.isSafeInteger(command.target.row));
  if (command.type === 'choose-blessing') return typeof command.blessingId === 'string';
  if (command.type === 'reroll-blessings') return true;
  if (command.type === 'buy-material') return command.material === 'Gilded Ore' || command.material === 'Ironwood Timber';
  if (command.type === 'craft-item' || command.type === 'equip-item') return typeof command.itemId === 'string' && typeof command.unitId === 'string';
  return false;
}

function applyCommand(player: PlayerState, command: Command, tick: number, walls: readonly WallState[], catalog: FixtureCatalog, allUnits: readonly UnitState[] = player.units, blockedHexes: ReadonlySet<string> = new Set(), availableUnitIds: readonly string[] = catalog.units.map((unit) => unit.id)): { player: PlayerState; error: string | null } {
  if (command.type === 'buy-material' || command.type === 'craft-item' || command.type === 'equip-item') return { player, error: 'Item commands are resolved by the match' };
  if (command.type === 'buy-card') return { player, error: 'Extra draws are resolved with the match RNG' };
  if (command.type === 'choose-blessing' || command.type === 'reroll-blessings') return { player, error: 'Rite commands are resolved with the match RNG' };
  if (command.type === 'play-card') {
    if (command.cardId === 'card:overtime-surge' && tick < 9000) return { player, error: 'Overtime Surge is locked until 15:00' };
    if (command.cardId === 'card:phalanx-formation' && !player.platoons.some((platoon) => platoon.id === command.platoonId && platoon.unitIds.length > 0)) return { player, error: 'Phalanx requires a friendly occupied platoon' };
    const cards = consumeCard(player.cards, command.cardId, tick);
    if (!cards) return { player, error: 'Card is not in hand or active overflow' };
    const effects = { ...player.cardEffects };
    let goldMilli = player.goldMilli;
    let commanderXp = player.commanderXp;
    switch (command.cardId) {
      case 'card:gold-rush': goldMilli += 150000; break;
      case 'card:xp-surge': commanderXp += 200; break;
      case 'card:phalanx-formation': effects.phalanxPlatoonId = command.platoonId!; effects.phalanxUntil = tick + 60; break;
      case 'card:supply-line-convoy': effects.supplyLineUntil = tick + 900; break;
      case 'card:alchemical-boom': effects.alchemicalBoomUntil = tick + 600; break;
      case 'card:forced-march': effects.forcedMarchUntil = tick + catalog.card.durationTicks; break;
      case 'card:overtime-surge': effects.overtimeSurgeUntil = tick + 600; break;
      default: return { player, error: 'Unknown card' };
    }
    return { player: { ...player, cards, cardEffects: effects, goldMilli, commanderXp }, error: null };
  }
  if (command.type === 'train-commander') {
    if (player.goldMilli < 100000) return { player, error: 'Insufficient gold for Academy training' };
    return { player: { ...player, goldMilli: player.goldMilli - 100000, commanderXp: player.commanderXp + 100 }, error: null };
  }
  if (command.type === 'train-unit') {
    const unit = player.units.find((entry) => entry.id === command.unitId);
    if (!unit) return { player, error: 'Unit does not belong to player' };
    if (unit.level === 3) return { player, error: 'Unit is already Paragon level' };
    if (player.goldMilli < 100000) return { player, error: 'Insufficient gold for Academy training' };
    const xp = unit.xp + 100;
    const level = unitLevelForXp(xp);
    const trained = { ...unit, xp, level };
    const hp = unit.hp === 0 ? 0 : Math.min(maxUnitHp(trained, tick, catalog), unit.hp + (level > unit.level ? Math.round(maxUnitHp(trained, tick, catalog) * 0.2 * healingMultiplierBps(player, trained) / 10000) : 0));
    return { player: { ...player, goldMilli: player.goldMilli - 100000, units: player.units.map((entry) => entry.id === unit.id ? { ...trained, hp } : entry) }, error: null };
  }
  if (command.type === 'set-formation-rank') {
    const unit = player.units.find((entry) => entry.id === command.unitId);
    if (!unit) return { player, error: 'Unit does not belong to player' };
    if (player.units.filter((entry) => entry.platoonId === unit.platoonId && entry.id !== unit.id && entry.formationRank === command.rank).length >= FORMATION_RANK_CAPACITY[command.rank]) return { player, error: 'Formation rank is full' };
    const occupied = new Set(player.units.filter((entry) => entry.platoonId === unit.platoonId && entry.id !== unit.id && entry.formationRank === command.rank).map((entry) => entry.formationSlot));
    const formationSlot = Array.from({ length: FORMATION_RANK_CAPACITY[command.rank] }, (_, slot) => slot).find((slot) => !occupied.has(slot))!;
    return { player: { ...player, units: player.units.map((entry) => entry.id === unit.id ? { ...entry, formationRank: command.rank, formationSlot } : entry) }, error: null };
  }
  if (command.type === 'set-formation-slot') {
    const unit = player.units.find((entry) => entry.id === command.unitId);
    if (!unit) return { player, error: 'Unit does not belong to player' };
    if (command.slot >= FORMATION_RANK_CAPACITY[unit.formationRank]) return { player, error: 'Formation slot is outside this rank' };
    if (player.units.some((entry) => entry.id !== unit.id && entry.platoonId === unit.platoonId && entry.formationRank === unit.formationRank && entry.formationSlot === command.slot)) return { player, error: 'Formation slot is occupied' };
    return { player: { ...player, units: player.units.map((entry) => entry.id === unit.id ? { ...entry, formationSlot: command.slot } : entry) }, error: null };
  }
  if (command.type === 'build-facility' || command.type === 'upgrade-facility') {
    const slot = player.facilities.find((entry) => entry.id === command.slotId);
    if (!slot) return { player, error: 'Facility slot does not belong to player' };
    if (command.type === 'build-facility') {
      if (command.kind === 'arcane-barrier' && slot.zone !== 'outer-courtyard') return { player, error: 'Arcane Barrier requires a courtyard slot' };
      if (slot.kind || slot.pendingTier) return { player, error: 'Facility slot is occupied' };
      if (slot.rubbleUntilTick > tick) return { player, error: 'Facility rubble is still clearing' };
      if (player.facilities.filter((entry) => entry.kind && facilityCategory(entry.kind) === facilityCategory(command.kind)).length >= 3) return { player, error: 'Facility category is full' };
      if (facilityFootprint(slot).some((point) => allUnits.some((unit) => unit.hp > 0 && unit.col === point.col && unit.row === point.row)
        || player.platoons.some((platoon) => platoon.anchor.col === point.col && platoon.anchor.row === point.row))) return { player, error: 'Facility footprint is occupied by a unit or platoon anchor' };
      if (player.goldMilli < 150000) return { player, error: 'Insufficient gold for facility' };
      return { player: { ...player, goldMilli: player.goldMilli - 150000, facilities: player.facilities.map((entry) => entry.id === slot.id ? { ...entry, kind: command.kind, tier: 0 as const, pendingTier: 1 as const, readyAtTick: tick + FACILITY_BUILD_TICKS, hp: 500, maxHp: 500, nextAttackTick: 3000, pendingGoldCostMilli: 150000, pendingXpCost: 0 } : entry) }, error: null };
    }
    if (!slot.kind || slot.hp <= 0) return { player, error: 'Facility slot is empty' };
    if (slot.pendingTier) return { player, error: 'Facility upgrade is already underway' };
    if (slot.tier >= 3) return { player, error: 'Facility is already tier 3' };
    const tier = (slot.tier + 1) as 2 | 3;
    const goldCostMilli = FACILITY_COSTS[tier] * 1000;
    const xpCost = FACILITY_XP_COSTS[tier];
    if (player.goldMilli < goldCostMilli) return { player, error: 'Insufficient gold for facility upgrade' };
    if (player.commanderXp - player.facilityXpSpent < xpCost) return { player, error: 'Insufficient unspent commander XP for facility upgrade' };
    return { player: { ...player, goldMilli: player.goldMilli - goldCostMilli, facilityXpSpent: player.facilityXpSpent + xpCost, facilities: player.facilities.map((entry) => entry.id === slot.id ? { ...entry, pendingTier: tier, readyAtTick: tick + FACILITY_BUILD_TICKS, pendingGoldCostMilli: goldCostMilli, pendingXpCost: xpCost } : entry) }, error: null };
  }
  const index = player.platoons.findIndex((platoon) => platoon.id === command.platoonId);
  if (index < 0) return { player, error: 'Platoon does not belong to player' };
  const platoon = player.platoons[index];
  if (command.type === 'set-macro' && command.macro === 'outrider'
    && !player.units.some((unit) => unit.hp > 0 && unit.platoonId === platoon.id && catalog.units.find((entry) => entry.id === unit.definitionId)?.role === 'assassin')) {
    return { player, error: 'Outrider requires a living Assassin or Scout in the platoon' };
  }
  if (command.type === 'recruit') {
    const definition = catalog.units.find((unit) => unit.id === command.unitDefinitionId);
    if (!definition) return { player, error: 'Unknown unit definition' };
    if (!availableUnitIds.includes(definition.id)) return { player, error: 'Champion is not in this match Guild pool' };
    if (definition.tier > maxRecruitTierForLevel(commanderLevelForXp(player.commanderXp))) return { player, error: 'Champion tier is locked by commander level' };
    if (player.units.some((unit) => unit.definitionId === definition.id)) return { player, error: 'Duplicate champion on one side' };
    if (player.units.length >= 20 || platoon.unitIds.length >= 5) return { player, error: 'Army or platoon is full' };
    const recruitNumber = player.units.length - catalog.starterUnitIds.length + 1;
    const blessingDiscountBps = recruitDiscountBps(player.blessings, player.goldMilli, recruitNumber);
    const cardDiscountBps = player.cardEffects.supplyLineUntil > tick ? 3000 : 0;
    const priceMilli = Math.max(0, Math.round(hirePriceGold(tick) * Math.max(0, 10000 - blessingDiscountBps - cardDiscountBps) / 10000)) * GOLD_SCALE;
    if (player.goldMilli < priceMilli) return { player, error: 'Insufficient gold' };
    const serial = player.units.length + 1;
    const side = player.id === 'player:north' ? 'north' : 'south';
    const preferredRank = defaultFormationRank(definition.role);
    const formationRank = ([preferredRank, 2, 1, 3] as const).find((rank) => player.units.filter((entry) => entry.platoonId === platoon.id && entry.formationRank === rank).length < FORMATION_RANK_CAPACITY[rank])!;
    const occupiedSlots = new Set(player.units.filter((entry) => entry.platoonId === platoon.id && entry.formationRank === formationRank).map((entry) => entry.formationSlot));
    const formationSlot = Array.from({ length: FORMATION_RANK_CAPACITY[formationRank] }, (_, slot) => slot).find((slot) => !occupiedSlots.has(slot))!;
    const unit: UnitState = { id: `unit:${side}:${serial}`, definitionId: definition.id, ownerId: player.id, platoonId: platoon.id, formationRank, formationSlot, col: STARTER_COLS[serial % STARTER_COLS.length], row: side === 'north' ? 12 : 77, hp: definition.hp, attackProgressMilli: 0, rallyProgressMilli: 0, respawnAtTick: null, skillReadyAtTick: 0, channelCompleteAtTick: null, channelTargetId: null, stunnedUntilTick: 0, snaredUntilTick: 0, slowUntilTick: 0, rootedUntilTick: 0, blindedUntilTick: 0, skillsDisabledUntilTick: 0, attackSlowedUntilTick: 0, untargetableUntilTick: 0, shadowBlinkLandedAtTick: 0, phantomFlurryReadyAtTick: 0, xp: 0, level: 1, equippedItemId: null, lastCombatTick: 0, lastAttackTargetId: null, lastAttackTick: 0, lastStructureAttackTick: 0 };
    const platoons = player.platoons.map((entry, i) => i === index ? { ...entry, unitIds: [...entry.unitIds, unit.id] } : entry);
    let blessings = player.blessings;
    let goldMilli = player.goldMilli - priceMilli;
    if (hasBlessing(blessings, 'blessing:grace:war-chest') && blessings.recruitsSinceWarChest < 3) {
      goldMilli += 10000;
      blessings = { ...blessings, recruitsSinceWarChest: blessings.recruitsSinceWarChest + 1 };
    }
    if (hasBlessing(blessings, 'blessing:exalted:war-chest') && !blessings.warChestRewarded && blessings.warChestChosenAtTick !== null && tick <= blessings.warChestChosenAtTick + 600) {
      const spent = blessings.warChestSpendMilli + priceMilli;
      goldMilli += spent >= 120000 ? 30000 : 0;
      blessings = { ...blessings, warChestSpendMilli: spent, warChestRewarded: spent >= 120000 };
    }
    return { player: { ...player, goldMilli, blessings, units: [...player.units, unit], platoons }, error: null };
  }
  const routeOptions = { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId: player.id };
  if (command.type === 'set-order' && !canTraverse(command.target, routeOptions)) return { player, error: 'Target hex is blocked or off board' };
  const path = command.type === 'set-order' ? findHexPath(platoon.anchor, command.target, routeOptions) : null;
  if (command.type === 'set-order' && !path) return { player, error: 'No walkable route to target' };
  const platoons = player.platoons.map((entry, i) => i !== index ? entry : {
    ...entry,
    stance: command.type === 'set-stance' ? command.stance : entry.stance,
    focus: command.type === 'set-focus' ? command.focus : entry.focus,
    macro: command.type === 'set-macro' ? command.macro : entry.macro,
    order: command.type === 'set-order' ? path!.length > 1 ? { ...command.target } : null : entry.order,
    route: command.type === 'set-order' ? path!.slice(1) : command.type === 'set-stance' && !entry.order ? [] : entry.route,
    moveProgressMilli: command.type === 'set-order' || command.type === 'set-stance' && !entry.order ? 0 : entry.moveProgressMilli,
    peelTargetId: command.type === 'set-order' || command.type === 'set-stance' && command.stance !== 'defensive' ? null : entry.peelTargetId,
    peelAllyId: command.type === 'set-order' || command.type === 'set-stance' && command.stance !== 'defensive' ? null : entry.peelAllyId,
    peelLockUntilTick: command.type === 'set-order' || command.type === 'set-stance' && command.stance !== 'defensive' ? 0 : entry.peelLockUntilTick,
  });
  return { player: { ...player, platoons }, error: null };
}

function formationCells(anchor: PlatoonOrder, count: number, walls: readonly WallState[], travelerId: PlayerId, blockedHexes: ReadonlySet<string>): PlatoonOrder[] {
  const routeOptions = { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId };
  const cells: PlatoonOrder[] = [];
  const queue: PlatoonOrder[] = [anchor];
  const visited = new Set([`${anchor.col}:${anchor.row}`]);
  for (let index = 0; index < queue.length && cells.length < count; index++) {
    const cell = queue[index];
    if (canTraverse(cell, routeOptions)) cells.push(cell);
    for (const next of hexNeighbors(cell.col, cell.row)) {
      const key = `${next.col}:${next.row}`;
      if (visited.has(key) || !canTraverse(next, routeOptions)) continue;
      visited.add(key);
      queue.push(next);
    }
  }
  return cells;
}

function formationPositions(members: readonly UnitState[], cells: PlatoonOrder[], from: PlatoonOrder, to: PlatoonOrder): Map<string, PlatoonOrder> {
  const start = hexCenter(from.col, from.row);
  const end = hexCenter(to.col, to.row);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const orderedCells = [...cells].sort((a, b) => {
    const ac = hexCenter(a.col, a.row);
    const bc = hexCenter(b.col, b.row);
    return ((bc.x - end.x) * dx + (bc.y - end.y) * dy) - ((ac.x - end.x) * dx + (ac.y - end.y) * dy)
      || hexDistance(a, to) - hexDistance(b, to) || a.row - b.row || a.col - b.col;
  });
  const orderedMembers = [...members].sort((a, b) => a.formationRank - b.formationRank || a.formationSlot - b.formationSlot || a.id.localeCompare(b.id));
  return new Map(orderedMembers.map((unit, index) => [unit.id, orderedCells[index] ?? { col: unit.col, row: unit.row }]));
}

function pointAlongPath(from: PlatoonOrder, to: PlatoonOrder, distance: number, playerId: PlayerId,
  walls: readonly WallState[], blockedHexes: ReadonlySet<string>): PlatoonOrder {
  const options = { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId: playerId };
  let point = from;
  for (let step = 0; step < distance; step++) {
    const next = hexNeighbors(point.col, point.row).filter((candidate) => canTraverse(candidate, options))
      .sort((a, b) => hexDistance(a, to) - hexDistance(b, to) || a.row - b.row || a.col - b.col)[0];
    if (!next || hexDistance(next, to) >= hexDistance(point, to)) break;
    point = next;
  }
  return point;
}

function stepUnit(unit: UnitState, target: PlatoonOrder, speed: number, walls: readonly WallState[],
  playerId: PlayerId, blockedHexes: ReadonlySet<string>): UnitState {
  const progress = unit.rallyProgressMilli + Math.floor(speed * terrainMoveSpeedBps(unit.col, unit.row) / (10 * TICKS_PER_SECOND));
  if (progress < 1000) return { ...unit, rallyProgressMilli: progress };
  const options = { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId: playerId };
  const next = hexNeighbors(unit.col, unit.row).filter((candidate) => canTraverse(candidate, options))
    .sort((a, b) => hexDistance(a, target) - hexDistance(b, target) || a.row - b.row || a.col - b.col)
    .find((candidate) => hexDistance(candidate, target) < hexDistance(unit, target));
  return next ? { ...unit, ...next, rallyProgressMilli: progress - 1000 } : { ...unit, rallyProgressMilli: 0 };
}

function defensivePeel(platoon: PlatoonState, allies: readonly UnitState[], enemies: readonly UnitState[], tick: number, catalog: FixtureCatalog, vision: Uint8Array | null): PlatoonState {
  if (platoon.stance !== 'defensive' || platoon.order) return { ...platoon, peelTargetId: null, peelAllyId: null, peelLockUntilTick: 0 };
  const members = allies.filter((unit) => unit.hp > 0 && unit.platoonId === platoon.id);
  const guards = members.filter((unit) => ['tanker', 'fighter'].includes(catalog.units.find((entry) => entry.id === unit.definitionId)!.role));
  const visible = enemies.filter((enemy) => enemy.hp > 0 && isUnitTargetable(enemy, tick) && vision?.[enemy.row * BOARD_COLUMNS + enemy.col] === 2 && canDetectBrushOccupant(allies, enemy, catalog));
  const channelingEnemy = visible.filter((enemy) => enemy.channelCompleteAtTick !== null && enemy.channelCompleteAtTick >= tick
    && enemy.channelTargetId !== null && guards.some((guard) => {
      if (hexDistance(guard, enemy) <= 3) return true;
      if (enemy.definitionId !== 'unit-def:nightblade') return false;
      const markedAlly = members.find((ally) => ally.id === enemy.channelTargetId);
      return !!markedAlly && hexDistance(guard, markedAlly) <= 3;
    }))
    .sort((a, b) => Math.min(...guards.map((guard) => hexDistance(guard, a))) - Math.min(...guards.map((guard) => hexDistance(guard, b))) || a.id.localeCompare(b.id))[0];
  if (channelingEnemy) {
    const protectedAlly = members.find((ally) => ally.id === channelingEnemy.channelTargetId)
      ?? members.filter((ally) => ['mage', 'marksman', 'support'].includes(catalog.units.find((entry) => entry.id === ally.definitionId)!.role))
        .sort((a, b) => hexDistance(a, channelingEnemy) - hexDistance(b, channelingEnemy) || a.id.localeCompare(b.id))[0] ?? members[0];
    return { ...platoon, peelTargetId: channelingEnemy.id, peelAllyId: protectedAlly?.id ?? null, peelLockUntilTick: Math.max(platoon.peelLockUntilTick, tick + 25) };
  }
  const threats = visible.flatMap((enemy) => {
    const ally = members.find((unit) => unit.id === enemy.lastAttackTargetId);
    if (!ally || enemy.lastAttackTick < tick - 10 || enemy.lastAttackTick <= 0) return [];
    const allyRole = catalog.units.find((entry) => entry.id === ally.definitionId)!.role;
    const enemyRole = catalog.units.find((entry) => entry.id === enemy.definitionId)!.role;
    const assassinDive = enemyRole === 'assassin' && ['mage', 'marksman', 'support'].includes(allyRole);
    if (!assassinDive && ally.hp / maxUnitHp(ally, tick, catalog) >= 0.55) return [];
    if (!guards.some((guard) => hexDistance(guard, enemy) <= 4)) return [];
    return [{ enemy, ally, critical: ally.hp / maxUnitHp(ally, tick, catalog) < 0.2, assassinDive }];
  }).sort((a, b) => Number(b.critical) - Number(a.critical) || Number(b.assassinDive) - Number(a.assassinDive) || a.ally.hp / maxUnitHp(a.ally, tick, catalog) - b.ally.hp / maxUnitHp(b.ally, tick, catalog) || a.enemy.id.localeCompare(b.enemy.id));
  const lockedEnemy = visible.find((enemy) => enemy.id === platoon.peelTargetId);
  const lockedAlly = members.find((ally) => ally.id === platoon.peelAllyId);
  const override = threats.find((threat) => threat.critical && threat.ally.id !== platoon.peelAllyId
    || threat.assassinDive && threat.enemy.id !== platoon.peelTargetId);
  if (override) return { ...platoon, peelTargetId: override.enemy.id, peelAllyId: override.ally.id, peelLockUntilTick: tick + 25 };
  if (lockedEnemy && lockedAlly && (tick < platoon.peelLockUntilTick || lockedAlly.hp / maxUnitHp(lockedAlly, tick, catalog) <= 0.65)) return platoon;
  const threat = threats[0];
  return threat ? { ...platoon, peelTargetId: threat.enemy.id, peelAllyId: threat.ally.id, peelLockUntilTick: tick + 25 }
    : { ...platoon, peelTargetId: null, peelAllyId: null, peelLockUntilTick: 0 };
}

function detectedOutriderEnemy(scout: UnitState, enemies: readonly UnitState[], allies: readonly UnitState[], walls: readonly WallState[], catalog: FixtureCatalog): UnitState | null {
  return enemies.filter((enemy) => enemy.hp > 0 && hexDistance(scout, enemy) <= 4
    && hexDistance(scout, enemy) <= visionRadiusForUnit(scout, walls, catalog)
    && hasLineOfSight(scout, enemy, breachedWallHexes(walls)) && canDetectBrushOccupant(allies, enemy, catalog))
    .sort((a, b) => hexDistance(scout, a) - hexDistance(scout, b) || a.id.localeCompare(b.id))[0] ?? null;
}

function movePlayer(player: PlayerState, enemyUnits: readonly UnitState[], walls: readonly WallState[], camps: readonly CampState[], tick: number, catalog: FixtureCatalog, blockedHexes: ReadonlySet<string>, macroVision: Uint8Array | null): { player: PlayerState; outriderAlerts: OutriderAlertEvent[] } {
  let units = [...player.units];
  const outriderAlerts: OutriderAlertEvent[] = [];
  const platoons = player.platoons.map((platoon): PlatoonState => {
    platoon = defensivePeel(platoon, units, enemyUnits, tick, catalog, macroVision);
    const scout = units.find((unit) => unit.hp > 0 && unit.platoonId === platoon.id && catalog.units.find((definition) => definition.id === unit.definitionId)?.role === 'assassin');
    const ambush = scout && !platoon.order && platoon.stance !== 'retreat' && platoon.peelTargetId === null && platoon.macro === 'outrider'
      ? detectedOutriderEnemy(scout, enemyUnits, units, walls, catalog) : null;
    if (scout && ambush && platoon.outriderAlertEnemyId !== ambush.id) {
      outriderAlerts.push({ id: `outrider-alert:${tick}:${platoon.id}:${ambush.id}`, tick, ownerId: player.id, platoonId: platoon.id, scoutId: scout.id, enemyId: ambush.id, col: ambush.col, row: ambush.row });
    }
    platoon = { ...platoon, outriderAlertEnemyId: ambush?.id ?? null };
    const reactionActive = !platoon.order && platoon.peelTargetId !== null;
    const routeOptions = { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId: player.id };
    const retreating = !platoon.order && platoon.stance === 'retreat' && !reactionActive;
    const gatherCamp = !reactionActive && platoon.macro === 'gather'
      ? camps.flatMap((camp) => {
        const definition = catalog.camps.find((entry) => entry.id === camp.id);
        return definition ? [{ col: definition.col, row: definition.row }] : [];
      }).sort((a, b) => hexDistance(platoon.anchor, a) - hexDistance(platoon.anchor, b) || a.row - b.row || a.col - b.col)[0] ?? null
      : null;
    const destination = retreating ? corePoint(player.id) : platoon.order ?? gatherCamp;
    const plannedRoute = reactionActive ? [] : platoon.route.length && platoon.route.every((point) => canTraverse(point, routeOptions))
      ? platoon.route : destination ? findHexPath(platoon.anchor, destination, routeOptions)?.slice(1) : [];
    let route = retreating && (plannedRoute?.at(-1)?.col !== destination!.col || plannedRoute?.at(-1)?.row !== destination!.row)
      ? findHexPath(platoon.anchor, destination!, routeOptions)?.slice(1) : plannedRoute;
    if (!platoon.order && !gatherCamp && platoon.stance === 'aggressive' && macroVision) {
      route = [];
      const targets = enemyUnits.filter((unit) => unit.hp > 0 && hexDistance(platoon.anchor, unit) <= 12
        && macroVision[unit.row * BOARD_COLUMNS + unit.col] === 2 && canDetectBrushOccupant(player.units, unit, catalog))
        .sort((a, b) => hexDistance(platoon.anchor, a) - hexDistance(platoon.anchor, b) || a.id.localeCompare(b.id));
      for (const target of targets) {
        const path = findHexPath(platoon.anchor, target, routeOptions);
        if (path) { route = path.slice(1, -1); break; }
      }
    }
    if (!route || route.length === 0) return platoon.route.length || platoon.order ? { ...platoon, order: null, route: [], moveProgressMilli: 0 } : platoon;
    const members = units.filter((unit) => platoon.unitIds.includes(unit.id) && unit.hp > 0 && unit.stunnedUntilTick <= tick && unit.snaredUntilTick <= tick && unit.rootedUntilTick <= tick && hexDistance(unit, platoon.anchor) <= 2);
    if (members.length === 0) return platoon;
    const slowest = Math.min(...members.map((unit) => catalog.units.find((entry) => entry.id === unit.definitionId)!.movePerSecond * (unit.slowUntilTick > tick ? 0.5 : 1)));
    const skirmishers = members.filter((unit) => catalog.units.find((entry) => entry.id === unit.definitionId)!.role === 'assassin').length;
    const anchorZone = getHex(platoon.anchor.col, platoon.anchor.row)?.zone;
    const ownCastleZone = player.id === 'player:north' ? 'north-castle' : 'south-castle';
    const retreatAcceleration = retreating && anchorZone !== ownCastleZone;
    const marchBps = Math.round((player.cardEffects.forcedMarchUntil > tick ? catalog.card.speedBps : 10000) * (player.bossBuffs.stampedeUntil > tick ? 1.25 : 1) * (retreatAcceleration ? 1.5 : 1) * terrainMoveSpeedBps(platoon.anchor.col, platoon.anchor.row) / 10000);
    const phalanxBps = player.cardEffects.phalanxUntil > tick && player.cardEffects.phalanxPlatoonId === platoon.id ? 8000 : 10000;
    const nextProgress = platoon.moveProgressMilli + Math.floor(slowest * (1 + 0.03 * skirmishers) * marchBps * phalanxBps / (100000 * TICKS_PER_SECOND));
    if (nextProgress < 1000) return { ...platoon, route, moveProgressMilli: nextProgress };
    const anchor = route[0];
    const remaining = route.slice(1);
    const cells = formationCells(anchor, members.length, walls, player.id, blockedHexes);
    const positions = formationPositions(members, cells, platoon.anchor, anchor);
    units = units.map((unit) => {
      const position = positions.get(unit.id);
      return position ? { ...unit, ...position } : unit;
    });
    return { ...platoon, anchor, order: remaining.length ? platoon.order : null, route: remaining, moveProgressMilli: remaining.length ? nextProgress - 1000 : 0 };
  });
  units = units.map((unit): UnitState => {
    if (unit.hp <= 0 || unit.stunnedUntilTick > tick || unit.snaredUntilTick > tick || unit.rootedUntilTick > tick) return unit;
    const platoon = platoons.find((entry) => entry.id === unit.platoonId)!;
    const definition = catalog.units.find((entry) => entry.id === unit.definitionId)!;
    if (!platoon.order && platoon.stance !== 'retreat' && platoon.peelTargetId === null && platoon.macro === 'outrider' && definition.role === 'assassin') {
      const detectedAmbush = detectedOutriderEnemy(unit, enemyUnits, units, walls, catalog) !== null;
      if (detectedAmbush) return stepUnit(unit, platoon.anchor, definition.movePerSecond * (unit.slowUntilTick > tick ? 0.5 : 1), walls, player.id, blockedHexes);
      const target = { col: 75, row: 45 };
      const ahead = pointAlongPath(platoon.anchor, target, 4, player.id, walls, blockedHexes);
      return stepUnit(unit, ahead, definition.movePerSecond * (unit.slowUntilTick > tick ? 0.5 : 1), walls, player.id, blockedHexes);
    }
    const peelTarget = !platoon.order && ['tanker', 'fighter'].includes(definition.role) ? enemyUnits.find((enemy) => enemy.id === platoon.peelTargetId && enemy.hp > 0) : null;
    if (peelTarget && hexDistance(unit, peelTarget) > definition.range && hexDistance(unit, platoon.anchor) <= 3) {
      const progress = unit.rallyProgressMilli + Math.floor(definition.movePerSecond * (unit.slowUntilTick > tick ? 0.5 : 1) * terrainMoveSpeedBps(unit.col, unit.row) / (10 * TICKS_PER_SECOND));
      if (progress < 1000) return { ...unit, rallyProgressMilli: progress };
      const route = findHexPath(unit, peelTarget, { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId: player.id });
      const next = route?.[1];
      if (next && hexDistance(next, platoon.anchor) <= 3) return { ...unit, ...next, rallyProgressMilli: progress - 1000 };
    }
    if (hexDistance(unit, platoon.anchor) <= 2) return { ...unit, rallyProgressMilli: 0 };
    const marchBps = Math.round((player.cardEffects.forcedMarchUntil > tick ? catalog.card.speedBps : 10000) * (player.bossBuffs.stampedeUntil > tick ? 1.25 : 1) * terrainMoveSpeedBps(unit.col, unit.row) / 10000);
    const phalanxBps = player.cardEffects.phalanxUntil > tick && player.cardEffects.phalanxPlatoonId === unit.platoonId ? 8000 : 10000;
    const progress = unit.rallyProgressMilli + Math.floor(definition.movePerSecond * (unit.slowUntilTick > tick ? 0.5 : 1) * marchBps * phalanxBps / (100000 * TICKS_PER_SECOND));
    if (progress < 1000) return { ...unit, rallyProgressMilli: progress };
    const route = findHexPath(unit, platoon.anchor, { breachedWallHexes: breachedWallHexes(walls), blockedHexes, travelerId: player.id });
    if (!route || route.length < 2) return { ...unit, rallyProgressMilli: 0 };
    return { ...unit, ...route[1], rallyProgressMilli: progress - 1000 };
  });
  return { player: { ...player, units, platoons }, outriderAlerts };
}

function resolveLimit(players: readonly [PlayerState, PlayerState]): MatchResult {
  const [north, south] = players;
  if (north.wallDamage !== south.wallDamage) return { winnerId: north.wallDamage > south.wallDamage ? north.id : south.id, reason: 'wall-damage' };
  if (north.coreHp !== south.coreHp) return { winnerId: north.coreHp > south.coreHp ? north.id : south.id, reason: 'core-hp' };
  return { winnerId: null, reason: 'draw' };
}

function recordEconomyChange(events: EconomyEvent[], before: PlayerState, after: PlayerState, tick: number,
  source: EconomyEvent['source'], commandSequence: number | null = null, commandType: Command['type'] | null = null): void {
  const goldMilliDelta = after.goldMilli - before.goldMilli;
  const commanderXpDelta = after.commanderXp - before.commanderXp;
  const countDelta = (previous: Readonly<Record<string, number>>, current: Readonly<Record<string, number>>) =>
    Object.fromEntries([...new Set([...Object.keys(previous), ...Object.keys(current)])].map((key) => [key, (current[key] ?? 0) - (previous[key] ?? 0)]).filter(([, delta]) => delta !== 0));
  const materialsDelta = countDelta(before.materials, after.materials);
  const arsenalDelta = countDelta(before.arsenal, after.arsenal);
  const relicsDelta = after.relics - before.relics;
  if (goldMilliDelta || commanderXpDelta || Object.keys(materialsDelta).length || Object.keys(arsenalDelta).length || relicsDelta) {
    events.push({ tick, playerId: after.id, source, commandSequence, commandType, goldMilliDelta, commanderXpDelta, materialsDelta, arsenalDelta, relicsDelta });
  }
}

function recordBothEconomies(events: EconomyEvent[], before: readonly [PlayerState, PlayerState], after: readonly [PlayerState, PlayerState],
  tick: number, source: EconomyEvent['source']): void {
  for (let index = 0; index < 2; index++) recordEconomyChange(events, before[index], after[index], tick, source);
}

/** Tick order: scheduled phase/income first, then sequence-sorted commands. Movement and combat are Stage 1. */
export function stepMatch(state: MatchState, inputs: readonly unknown[] = [], catalog: FixtureCatalog = fixtureCatalog): StepResult {
  if (state.phase === 'ended') return { state, accepted: [], rejected: inputs.map((_, sequence) => ({ sequence, reason: 'Match ended' })), economyEvents: [], cardEvents: [], combatEvents: [], facilityEvents: [], bossEvents: [], trapEvents: [], itemEvents: [], outriderAlerts: [] };
  const tick = state.tick + 1;
  const phase = phaseAtTick(tick);
  const newEvents = scheduledEventsAtTick(tick);
  const events = [...state.events, ...newEvents];
  const economyEvents: EconomyEvent[] = [];
  let rngState = state.rngState;
  let players: [PlayerState, PlayerState] = state.players.map((player): PlayerState => {
    const progressed = progressFacilities(player.facilities, tick);
    const ready = { ...player, facilities: progressed.facilities, reconAreas: player.reconAreas.filter((area) => area.trapRevealUntilTick > tick), trapRevealedUnits: player.trapRevealedUnits.filter((entry) => entry.untilTick > tick), goldMilli: player.goldMilli + progressed.instantGoldMilli };
    recordEconomyChange(economyEvents, player, ready, tick, 'facility-completion');
    const paid = passiveIncome(ready, tick, phase === 'ended' ? 'overtime' : phase);
    recordEconomyChange(economyEvents, ready, paid, tick, 'passive-income');
    return paid;
  }) as [PlayerState, PlayerState];
  if (phase === 'ended') {
    players = players.map((player): PlayerState => ({ ...player, cards: expireOverflow(player.cards, tick) })) as [PlayerState, PlayerState];
    const itemEvents: ItemEvent[] = [];
    players = players.map((player): PlayerState => {
      const progressed = progressItemChannels(player, tick);
      itemEvents.push(...progressed.events);
      recordEconomyChange(economyEvents, player, progressed.player, tick, 'item-channel');
      return progressed.player;
    }) as [PlayerState, PlayerState];
    return { state: { ...state, tick, phase, players, events, result: resolveLimit(players) }, accepted: [], rejected: inputs.map((_, sequence) => ({ sequence, reason: 'Match ended before command' })), economyEvents, cardEvents: [], combatEvents: [], facilityEvents: [], bossEvents: [], trapEvents: [], itemEvents, outriderAlerts: [] };
  }
  if (newEvents.some((event) => event.type === 'rite-open')) {
    const rite = tick === 3000 ? 1 : 2;
    players = players.map((player): PlayerState => {
      const opened = openBlessingRite(player.blessings, rite, state.blessingTiers[rite], tick, rngState);
      rngState = opened.rngState;
      return { ...player, blessings: opened.blessings };
    }) as [PlayerState, PlayerState];
  }
  players = players.map((player): PlayerState => ({
    ...player,
    cards: player.blessings.offer
      ? { ...player.cards, overflow: player.cards.overflow.map((entry) => ({ ...entry, expiresAtTick: entry.expiresAtTick + 1 })) }
      : expireOverflow(player.cards, tick),
  })) as [PlayerState, PlayerState];
  players = players.map((player): PlayerState => {
    const offer = player.blessings.offer;
    const selected = offer && offer.expiresAtTick <= tick ? selectBlessing(player, offer.options[0], tick)! : player;
    recordEconomyChange(economyEvents, player, selected, tick, 'auto-blessing');
    return selected;
  }) as [PlayerState, PlayerState];
  if (newEvents.some((event) => event.type === 'card-draw')) {
    players = players.map((player): PlayerState => {
      const draw = drawCards(player.cards, tick === 6000 ? 4 : 3, tick, rngState);
      rngState = draw.rngState;
      return { ...player, cards: draw.cards };
    }) as [PlayerState, PlayerState];
  }
  const accepted: number[] = [];
  const rejected: { sequence: number; reason: string }[] = [];
  const cardEvents: CardCastEvent[] = [];
  const placedTrapEvents: TrapEvent[] = [];
  const itemEvents: ItemEvent[] = [];
  const traps = [...state.traps];
  const valid: CommandEnvelope[] = [];
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    if (!isCommandEnvelope(input)) rejected.push({ sequence: index, reason: 'Malformed command envelope' });
    else valid.push(input);
  }
  valid.sort((a, b) => a.sequence - b.sequence);
  const seen = new Set<number>();
  for (const input of valid) {
    if (input.tick !== tick || seen.has(input.sequence)) {
      rejected.push({ sequence: input.sequence, reason: input.tick !== tick ? 'Wrong tick' : 'Duplicate sequence' });
      continue;
    }
    seen.add(input.sequence);
    const index = players.findIndex((player) => player.id === input.playerId);
    if (input.command.type === 'play-card' && input.command.cardId === 'card:falcon-recon') {
      const target = input.command.target;
      if (!target || !getHex(target.col, target.row)) { rejected.push({ sequence: input.sequence, reason: 'Falcon Recon requires a board hex' }); continue; }
      const cards = consumeCard(players[index].cards, input.command.cardId, tick);
      if (!cards) { rejected.push({ sequence: input.sequence, reason: 'Card is not in hand or active overflow' }); continue; }
      const reconArea = { ...target, visionUntilTick: tick + 150, trapRevealUntilTick: tick + 200 };
      players[index] = { ...players[index], cards, reconAreas: [...players[index].reconAreas.filter((area) => area.trapRevealUntilTick > tick), reconArea] };
      for (let trapIndex = 0; trapIndex < traps.length; trapIndex++) {
        const trap = traps[trapIndex];
        if (trap.ownerId === input.playerId || hexDistance(trap, target) > 12) continue;
        const revealedTo = [...trap.revealedTo.filter((entry) => entry.playerId !== input.playerId), { playerId: input.playerId, untilTick: tick + 200 }];
        traps[trapIndex] = { ...trap, revealedTo };
        placedTrapEvents.push({ id: `trap:revealed:${trap.id}:${tick}:${input.playerId}`, tick, type: 'revealed', trapId: trap.id, kind: trap.kind, ownerId: trap.ownerId, col: trap.col, row: trap.row });
      }
      cardEvents.push({ id: `card:cast:${tick}:${input.sequence}`, tick, ownerId: input.playerId, cardId: input.command.cardId, targets: [{ unitId: null, col: target.col, row: target.row }] });
      accepted.push(input.sequence);
      continue;
    }
    if (input.command.type === 'buy-material' || input.command.type === 'craft-item' || input.command.type === 'equip-item') {
      const command = input.command;
      const applied = command.type === 'buy-material'
        ? { ...buyMaterial(players[index], command.material), event: null }
        : command.type === 'craft-item'
          ? beginCraft(players[index], command.itemId, command.unitId, tick)
          : beginEquip(players[index], command.itemId, command.unitId, tick, catalog);
      if (applied.error) rejected.push({ sequence: input.sequence, reason: applied.error });
      else { recordEconomyChange(economyEvents, players[index], applied.player, tick, 'command', input.sequence, command.type); players[index] = applied.player; accepted.push(input.sequence); if (applied.event) itemEvents.push(applied.event); }
      continue;
    }
    if (input.command.type === 'play-card' && isTrapCardId(input.command.cardId)) {
      const target = input.command.target;
      const kind = TRAP_CARD_KINDS[input.command.cardId];
      if (!target || !validTrapHex(kind, target.col, target.row)) { rejected.push({ sequence: input.sequence, reason: kind === 'landmine' ? 'Landmine requires a battlefield or jungle hex' : `${input.command.cardId} cannot be placed on that terrain` }); continue; }
      const mask = computeVision({ ...state, tick, players }, input.playerId, undefined, catalog);
      if (mask[target.row * BOARD_COLUMNS + target.col] !== 2) { rejected.push({ sequence: input.sequence, reason: 'Trap target needs active vision' }); continue; }
      if (traps.some((trap) => trap.ownerId === input.playerId && trap.col === target.col && trap.row === target.row)) { rejected.push({ sequence: input.sequence, reason: 'A friendly trap already occupies that hex' }); continue; }
      const cards = consumeCard(players[index].cards, input.command.cardId, tick);
      if (!cards) { rejected.push({ sequence: input.sequence, reason: 'Card is not in hand or active overflow' }); continue; }
      players[index] = { ...players[index], cards };
      const trap = placeTrap(input.playerId, kind, target.col, target.row, tick);
      traps.push(trap);
      placedTrapEvents.push({ id: `trap:placed:${trap.id}`, tick, type: 'placed', trapId: trap.id, kind: trap.kind, ownerId: trap.ownerId, col: trap.col, row: trap.row });
      accepted.push(input.sequence);
      continue;
    }
    if (input.command.type === 'choose-blessing') {
      const chosen = selectBlessing(players[index], input.command.blessingId, tick);
      if (!chosen) rejected.push({ sequence: input.sequence, reason: 'Blessing is not in the current Rite offer' });
      else { recordEconomyChange(economyEvents, players[index], chosen, tick, 'command', input.sequence, input.command.type); players[index] = chosen; accepted.push(input.sequence); }
      continue;
    }
    if (input.command.type === 'reroll-blessings') {
      const rerolled = rerollBlessingOffer(players[index].blessings, rngState);
      if (!rerolled) rejected.push({ sequence: input.sequence, reason: 'Rite reroll is unavailable' });
      else { rngState = rerolled.rngState; players[index] = { ...players[index], blessings: rerolled.blessings }; accepted.push(input.sequence); }
      continue;
    }
    if (input.command.type === 'buy-card') {
      const nextBuy = players[index].cards.extraBuys + 1;
      const merchantDiscount = hasBlessing(players[index].blessings, 'blessing:imperial:merchant-discount');
      const priceGold = merchantDiscount && nextBuy % 3 === 0 ? 0 : merchantDiscount ? Math.min(150, extraDrawPriceGold(players[index].cards.extraBuys)) : extraDrawPriceGold(players[index].cards.extraBuys);
      const priceMilli = priceGold * GOLD_SCALE;
      if (players[index].goldMilli < priceMilli) { rejected.push({ sequence: input.sequence, reason: 'Insufficient gold for extra card' }); continue; }
      const draw = drawCards(players[index].cards, 1, tick, rngState);
      if (!draw.drawn.length) { rejected.push({ sequence: input.sequence, reason: 'No drawable cards remain' }); continue; }
      rngState = draw.rngState;
      const bought = { ...players[index], goldMilli: players[index].goldMilli - priceMilli, cards: { ...draw.cards, extraBuys: draw.cards.extraBuys + 1 } };
      recordEconomyChange(economyEvents, players[index], bought, tick, 'command', input.sequence, input.command.type);
      players[index] = bought;
      accepted.push(input.sequence);
      continue;
    }
    const applied = applyCommand(players[index], input.command, tick, state.walls, catalog, players.flatMap((player) => player.units), occupiedFacilityHexes(players, tick), state.availableUnitIds);
    if (applied.error) rejected.push({ sequence: input.sequence, reason: applied.error });
    else {
      recordEconomyChange(economyEvents, players[index], applied.player, tick, 'command', input.sequence, input.command.type);
      players[index] = applied.player;
      accepted.push(input.sequence);
      if (input.command.type === 'play-card') {
        const { cardId, platoonId } = input.command;
        const targets = cardId === 'card:gold-rush' || cardId === 'card:xp-surge'
          ? [{ unitId: null, ...corePoint(input.playerId) }]
          : applied.player.units.filter((unit) => unit.hp > 0 && (cardId !== 'card:phalanx-formation' || unit.platoonId === platoonId))
            .map((unit) => ({ unitId: unit.id, col: unit.col, row: unit.row }));
        cardEvents.push({ id: `card:cast:${tick}:${input.sequence}`, tick, ownerId: input.playerId, cardId, targets });
      }
    }
  }
  const beforeCombatEconomy = [...players] as [PlayerState, PlayerState];
  const blockedHexes = occupiedFacilityHexes(players, tick);
  const beforeMovement = players;
  const macroMasks = players.map((player, index) => {
    const aggressiveScan = tick % TICKS_PER_SECOND === 0 && player.platoons.some((platoon) => !platoon.order && platoon.stance === 'aggressive' && platoon.unitIds.length);
    const lowHealthPeelScan = player.platoons.some((platoon) => !platoon.order && platoon.stance === 'defensive'
      && (platoon.peelTargetId !== null || player.units.some((ally) => ally.hp > 0 && platoon.unitIds.includes(ally.id)
        && ally.hp / maxUnitHp(ally, tick, catalog) < 0.55 && players[1 - index].units.some((enemy) => enemy.hp > 0
          && enemy.lastAttackTargetId === ally.id && enemy.lastAttackTick > 0 && enemy.lastAttackTick >= tick - 10))));
    const assassinPeelScan = player.platoons.some((platoon) => !platoon.order && platoon.stance === 'defensive'
      && player.units.some((ally) => ally.hp > 0 && platoon.unitIds.includes(ally.id)
        && ['mage', 'marksman', 'support'].includes(catalog.units.find((definition) => definition.id === ally.definitionId)!.role)
        && players[1 - index].units.some((enemy) => enemy.hp > 0 && enemy.lastAttackTargetId === ally.id && enemy.lastAttackTick > 0
          && enemy.lastAttackTick >= tick - 10 && catalog.units.find((definition) => definition.id === enemy.definitionId)!.role === 'assassin'
          && player.units.some((guard) => guard.hp > 0 && platoon.unitIds.includes(guard.id)
            && ['tanker', 'fighter'].includes(catalog.units.find((definition) => definition.id === guard.definitionId)!.role)
            && hexDistance(guard, enemy) <= 4))));
    const channelPeelScan = player.units.some((guard) => guard.hp > 0 && catalog.units.some((definition) => definition.id === guard.definitionId && ['tanker', 'fighter'].includes(definition.role))
      && players[1 - index].units.some((enemy) => {
        if (enemy.hp <= 0 || enemy.channelCompleteAtTick === null || enemy.channelCompleteAtTick < tick || enemy.channelTargetId === null) return false;
        if (hexDistance(guard, enemy) <= 3) return true;
        const markedAlly = player.units.find((ally) => ally.id === enemy.channelTargetId && ally.hp > 0);
        return enemy.definitionId === 'unit-def:nightblade' && !!markedAlly && hexDistance(guard, markedAlly) <= 3;
      }));
    const peelScan = lowHealthPeelScan || assassinPeelScan || channelPeelScan;
    return aggressiveScan || peelScan ? computeVision({ ...state, tick, players }, player.id, undefined, catalog) : null;
  });
  const movementResults = players.map((player, index) => movePlayer(player, beforeMovement[1 - index].units, state.walls, state.camps, tick, catalog, blockedHexes, macroMasks[index]));
  players = movementResults.map((result) => result.player) as [PlayerState, PlayerState];
  const outriderAlerts = movementResults.flatMap((result) => result.outriderAlerts);
  const trapAdvance = advanceTraps(beforeMovement, players, traps, tick, catalog);
  players = trapAdvance.players;
  const combat = advanceUnitCombatWithEvents(players, tick, catalog, breachedWallHexes(state.walls));
  players = combat.players;
  recordBothEconomies(economyEvents, beforeCombatEconomy, players, tick, 'combat');
  const beforeCampEconomy = [...players] as [PlayerState, PlayerState];
  const camps: CampState[] = [];
  for (const camp of state.camps) {
    const advanced = advanceCampCombat(players, camp, tick, rngState, catalog);
    players = advanced.players;
    rngState = advanced.rngState;
    camps.push(advanced.camp);
  }
  recordBothEconomies(economyEvents, beforeCampEconomy, players, tick, 'camp');
  const beforeBossEconomy = [...players] as [PlayerState, PlayerState];
  const bossCombat = advanceBossCombat(players, state.bosses, tick, catalog);
  players = bossCombat.players;
  recordBothEconomies(economyEvents, beforeBossEconomy, players, tick, 'boss');
  for (const boss of bossCombat.bosses) {
    if (boss.killedAtTick !== tick || !boss.lastHitPlayerId) continue;
    const side = boss.lastHitPlayerId === 'player:north' ? 0 : 1;
    const draw = drawCards(players[side].cards, 1, tick, rngState);
    rngState = draw.rngState;
    players[side] = { ...players[side], cards: draw.cards };
  }
  const beforeStructureEconomy = [...players] as [PlayerState, PlayerState];
  const facilityCombat = advanceBallistaCombat(players, tick, catalog);
  players = facilityCombat.players;
  const structureResult = advanceStructureCombat(players, state.walls, tick, catalog);
  players = structureResult.players;
  for (const [index, wall] of structureResult.walls.entries()) {
    if (wall.hp !== 0 || state.walls[index].hp === 0) continue;
    const attackerId: PlayerId = wall.ownerId === 'player:north' ? 'player:south' : 'player:north';
    players = players.map((player): PlayerState => player.id === attackerId && hasBlessing(player.blessings, 'blessing:imperial:gilded-taxes')
      ? { ...player, goldMilli: player.goldMilli + 100000, blessings: { ...player.blessings, taxesCampBonusUntil: tick + 200 } }
      : player) as [PlayerState, PlayerState];
  }
  recordBothEconomies(economyEvents, beforeStructureEconomy, players, tick, 'structure');
  const firstBreach = !state.firstBreachAwarded && structureResult.walls.some((wall) => wall.layer === 'outer' && wall.hp === 0);
  if (firstBreach) players = players.map((player): PlayerState => {
    const draw = drawCards(player.cards, 1, tick, rngState);
    rngState = draw.rngState;
    return { ...player, cards: draw.cards };
  }) as [PlayerState, PlayerState];
  players = players.map((player): PlayerState => {
    const progressed = progressItemChannels(player, tick);
    itemEvents.push(...progressed.events);
    recordEconomyChange(economyEvents, player, progressed.player, tick, 'item-channel');
    return progressed.player;
  }) as [PlayerState, PlayerState];
  return { state: { ...state, tick, phase: structureResult.result ? 'ended' : phase, players, camps, bosses: bossCombat.bosses, traps: trapAdvance.traps, walls: structureResult.walls, rngState, firstBreachAwarded: state.firstBreachAwarded || firstBreach, events, result: structureResult.result }, accepted, rejected, economyEvents, cardEvents, combatEvents: combat.events, facilityEvents: [...facilityCombat.events, ...structureResult.batteryEvents], bossEvents: bossCombat.events, trapEvents: [...placedTrapEvents, ...trapAdvance.events], itemEvents, outriderAlerts };
}

export function validateMatchState(state: MatchState, catalog: FixtureCatalog = fixtureCatalog): string[] {
  const errors: string[] = [];
  const blockedHexes = occupiedFacilityHexes(state.players, state.tick);
  const earlyCoreEnd = state.phase === 'ended' && (state.result?.reason === 'core-collapse' || (state.result?.reason === 'draw' && state.players.every((player) => player.coreHp === 0)));
  if (state.schemaVersion !== 1 || !Number.isSafeInteger(state.tick) || state.tick < 0 || (state.phase !== phaseAtTick(state.tick) && !earlyCoreEnd)) errors.push('Invalid state header');
  if (state.players.length !== 2 || state.players[0].id !== 'player:north' || state.players[1].id !== 'player:south') errors.push('Invalid player set');
  if (state.blessingTiers.length !== 3 || new Set(state.blessingTiers).size !== 3 || state.blessingTiers.some((tier) => !['grace', 'exalted', 'imperial'].includes(tier))) errors.push('Invalid mirrored Rite tier schedule');
  for (const player of state.players) {
    if (!Number.isSafeInteger(player.goldMilli) || player.goldMilli < 0 || !Number.isSafeInteger(player.commanderXpMilli) || player.commanderXpMilli < 0 || player.commanderXpMilli >= 1000 || player.units.length > 20 || player.platoons.length !== 4) errors.push(`Invalid player economy or army: ${player.id}`);
    if (!Number.isSafeInteger(player.batteryReadyAtTick) || player.batteryReadyAtTick < 0 || typeof player.batteryDisabled !== 'boolean' || (player.batteryDisabled && player.batteryPowerSlotId === null) || (player.batteryPowerSlotId !== null && !player.facilities.some((slot) => slot.id === player.batteryPowerSlotId))) errors.push(`Invalid core battery: ${player.id}`);
    if (Object.values(player.materials).some((count) => !Number.isSafeInteger(count) || count < 0)) errors.push(`Invalid materials: ${player.id}`);
    if (player.trapRevealedUnits.some((entry) => !state.players.some((other) => other.id !== player.id && other.units.some((unit) => unit.id === entry.unitId)) || !Number.isSafeInteger(entry.untilTick) || entry.untilTick <= state.tick)) errors.push(`Invalid trap-revealed unit: ${player.id}`);
    if (!Number.isSafeInteger(player.relics) || player.relics < 0 || Object.values(player.bossBuffs).some((until) => !Number.isSafeInteger(until) || until < 0)) errors.push(`Invalid boss rewards: ${player.id}`);
    errors.push(...validateFacilitySlots(player).map((error) => `${player.id}: ${error}`));
    errors.push(...validateCardState(player.cards, state.tick).map((error) => `${player.id}: ${error}`));
    errors.push(...validateBlessingState(player.blessings, state.tick).map((error) => `${player.id}: ${error}`));
    errors.push(...validateItemState(player, state.tick, catalog).map((error) => `${player.id}: ${error}`));
    if (Object.entries(player.cardEffects).some(([key, until]) => key !== 'phalanxPlatoonId' && (!Number.isSafeInteger(until) || (until as number) < 0)) || (player.cardEffects.phalanxPlatoonId !== null && !player.platoons.some((platoon) => platoon.id === player.cardEffects.phalanxPlatoonId))) errors.push(`Invalid card effect timer: ${player.id}`);
    if (player.reconAreas.some((area) => !getHex(area.col, area.row) || !Number.isSafeInteger(area.visionUntilTick) || area.visionUntilTick <= 0 || !Number.isSafeInteger(area.trapRevealUntilTick) || area.trapRevealUntilTick <= state.tick || area.trapRevealUntilTick < area.visionUntilTick)) errors.push(`Invalid reconnaissance area: ${player.id}`);
    const unitIds = new Set(player.units.map((unit) => unit.id));
    if (unitIds.size !== player.units.length) errors.push(`Duplicate unit instance: ${player.id}`);
    for (const platoon of player.platoons) {
      if (platoon.ownerId !== player.id || platoon.unitIds.length > 5 || new Set(platoon.unitIds).size !== platoon.unitIds.length) errors.push(`Invalid platoon: ${platoon.id}`);
      if (!['standard', 'gather', 'outrider'].includes(platoon.macro)) errors.push(`Invalid platoon macro: ${platoon.id}`);
      for (const rank of [1, 2, 3] as const) {
        const members = player.units.filter((unit) => unit.platoonId === platoon.id && unit.formationRank === rank);
        if (members.length > FORMATION_RANK_CAPACITY[rank]) errors.push(`Formation rank ${rank} is full: ${platoon.id}`);
        if (members.some((unit) => !Number.isSafeInteger(unit.formationSlot) || unit.formationSlot < 0 || unit.formationSlot >= FORMATION_RANK_CAPACITY[rank])
          || new Set(members.map((unit) => unit.formationSlot)).size !== members.length) errors.push(`Formation slots are invalid: ${platoon.id} rank ${rank}`);
      }
      if (!Number.isSafeInteger(platoon.peelLockUntilTick) || platoon.peelLockUntilTick < 0 || (platoon.peelTargetId === null) !== (platoon.peelAllyId === null) || (platoon.peelAllyId !== null && !platoon.unitIds.includes(platoon.peelAllyId)) || (platoon.peelTargetId !== null && !state.players.some((other) => other.id !== player.id && other.units.some((unit) => unit.id === platoon.peelTargetId)))) errors.push(`Invalid peel state: ${platoon.id}`);
      if (!canTraverse(platoon.anchor, { breachedWallHexes: breachedWallHexes(state.walls), blockedHexes, travelerId: player.id }) || platoon.route.some((point) => !canTraverse(point, { breachedWallHexes: breachedWallHexes(state.walls), blockedHexes, travelerId: player.id })) || !Number.isSafeInteger(platoon.moveProgressMilli) || platoon.moveProgressMilli < 0 || platoon.moveProgressMilli >= 1000) errors.push(`Invalid route: ${platoon.id}`);
      for (const id of platoon.unitIds) if (!unitIds.has(id)) errors.push(`Missing unit ${id}`);
    }
    for (const unit of player.units) {
      const definition = catalog.units.find((entry) => entry.id === unit.definitionId);
      if (!definition || unit.ownerId !== player.id || ![1, 2, 3].includes(unit.formationRank) || !Number.isSafeInteger(unit.formationSlot) || !player.platoons.some((platoon) => platoon.id === unit.platoonId && platoon.unitIds.includes(unit.id)) || !canTraverse(unit, { breachedWallHexes: breachedWallHexes(state.walls), blockedHexes, travelerId: player.id }) || unit.hp < 0 || unit.hp > (definition ? maxUnitHp(unit, state.tick, catalog) : 0) || (unit.hp === 0) !== (unit.respawnAtTick !== null) || unit.attackProgressMilli < 0 || unit.attackProgressMilli > 1000 || unit.rallyProgressMilli < 0 || unit.rallyProgressMilli >= 1000 || !Number.isSafeInteger(unit.skillReadyAtTick) || unit.skillReadyAtTick < 0 || !Number.isSafeInteger(unit.stunnedUntilTick) || unit.stunnedUntilTick < 0 || !Number.isSafeInteger(unit.snaredUntilTick) || unit.snaredUntilTick < 0 || !Number.isSafeInteger(unit.slowUntilTick) || unit.slowUntilTick < 0 || !Number.isSafeInteger(unit.rootedUntilTick) || unit.rootedUntilTick < 0 || !Number.isSafeInteger(unit.blindedUntilTick) || unit.blindedUntilTick < 0 || !Number.isSafeInteger(unit.skillsDisabledUntilTick) || unit.skillsDisabledUntilTick < 0 || !Number.isSafeInteger(unit.attackSlowedUntilTick) || unit.attackSlowedUntilTick < 0 || !Number.isSafeInteger(unit.untargetableUntilTick) || unit.untargetableUntilTick < 0 || !Number.isSafeInteger(unit.shadowBlinkLandedAtTick) || unit.shadowBlinkLandedAtTick < 0 || unit.shadowBlinkLandedAtTick > state.tick || !Number.isSafeInteger(unit.phantomFlurryReadyAtTick) || unit.phantomFlurryReadyAtTick < 0 || !Number.isSafeInteger(unit.lastCombatTick) || unit.lastCombatTick < 0 || unit.lastCombatTick > state.tick || !Number.isSafeInteger(unit.lastAttackTick) || unit.lastAttackTick < 0 || unit.lastAttackTick > state.tick || !Number.isSafeInteger(unit.lastStructureAttackTick) || unit.lastStructureAttackTick < 0 || unit.lastStructureAttackTick > state.tick || (unit.lastAttackTargetId !== null && !state.players.some((other) => other.id !== player.id && other.units.some((enemy) => enemy.id === unit.lastAttackTargetId))) || unit.xp < 0 || unit.level !== (unit.xp >= 300 ? 3 : unit.xp >= 100 ? 2 : 1)) errors.push(`Invalid unit ${unit.id}`);
      if ((unit.channelCompleteAtTick === null) !== (unit.channelTargetId === null) || unit.channelCompleteAtTick !== null
        && (!Number.isSafeInteger(unit.channelCompleteAtTick) || unit.channelCompleteAtTick <= state.tick || unit.hp === 0
          || !state.players.some((other) => other.id !== player.id && other.units.some((enemy) => enemy.id === unit.channelTargetId)))) errors.push(`Invalid channel state: ${unit.id}`);
    }
  }
  if (state.wallId !== catalog.wall.id || state.cardId !== catalog.card.id) errors.push('Invalid fixture references');
  if (new Set(state.availableUnitIds).size !== state.availableUnitIds.length || state.availableUnitIds.some((id) => !catalog.units.some((unit) => unit.id === id)) || catalog.starterUnitIds.some((id) => !state.availableUnitIds.includes(id))) errors.push('Invalid Guild match pool');
  if (typeof state.firstBreachAwarded !== 'boolean' || (state.walls.some((wall) => wall.layer === 'outer' && wall.hp === 0) && !state.firstBreachAwarded && state.tick > 0)) errors.push('Missing first-breach card award');
  errors.push(...validateCastleWalls(state.walls, catalog));
  if (state.camps.length !== catalog.camps.length) errors.push('Invalid camp count');
  for (const [index, camp] of state.camps.entries()) {
    if (camp.id !== catalog.camps[index]?.id || camp.monsters.length !== catalog.monster.packSize || camp.monsters.some((monster) => monster.hp < 0 || monster.hp > catalog.monster.hp || !Number.isSafeInteger(monster.hp) || monster.attackProgressMilli < 0 || monster.attackProgressMilli > 1000) || (camp.respawnAtTick !== null) !== camp.monsters.every((monster) => monster.hp === 0)) errors.push(`Invalid camp state: ${camp.id}`);
  }
  if (state.bosses.length !== BOSS_DEFINITIONS.length) errors.push('Invalid boss count');
  for (const [index, boss] of state.bosses.entries()) {
    const definition = BOSS_DEFINITIONS[index];
    if (!definition || boss.id !== definition.id || hexDistance(boss, definition) >= 5 || !Number.isSafeInteger(boss.abilityReadyAtTick) || boss.abilityReadyAtTick < 0 || !Number.isSafeInteger(boss.secondaryAbilityReadyAtTick) || boss.secondaryAbilityReadyAtTick < 0 || !Number.isSafeInteger(boss.enragedUntilTick) || boss.enragedUntilTick < 0 || !Number.isSafeInteger(boss.lastMovedAtTick) || boss.lastMovedAtTick < 0 || boss.lastMovedAtTick > state.tick || !Number.isSafeInteger(boss.lastPosition.col) || !Number.isSafeInteger(boss.lastPosition.row) || !Array.isArray(boss.minions) || boss.minions.length > 2 || boss.minions.some((minion) => !['razortail-hawk', 'ironclad-golem'].includes(minion.kind) || (definition.kind === 'alpha' && minion.kind !== 'razortail-hawk') || (definition.kind === 'ancient' && minion.kind !== 'ironclad-golem') || definition.kind === 'elite' || !getHex(minion.col, minion.row)?.isWalkable || !Number.isSafeInteger(minion.hp) || minion.hp < 0 || minion.hp > (minion.kind === 'razortail-hawk' ? 1300 : 2200) || !Number.isSafeInteger(minion.attackProgressMilli) || minion.attackProgressMilli < 0 || minion.attackProgressMilli > 1000) || !Number.isSafeInteger(boss.hp) || boss.hp < 0 || boss.hp > definition.hp || boss.damageByPlayer.length !== 2 || boss.damageByPlayer.some((damage) => !Number.isSafeInteger(damage) || damage < 0) || boss.damageByPlayer[0] + boss.damageByPlayer[1] !== definition.hp - boss.hp && boss.spawnedAtTick !== null || boss.spawnedAtTick === null && boss.hp !== 0 || boss.killedAtTick !== null && boss.hp !== 0) errors.push(`Invalid boss state: ${boss.id}`);
  }
  errors.push(...validateTraps(state.traps, state.tick));
  const eventTicks = new Set<number>([0, MATCH_LIMIT_TICKS]);
  for (let milestone = HIRE_ESCALATION_TICKS; milestone <= state.tick; milestone += HIRE_ESCALATION_TICKS) eventTicks.add(milestone);
  for (const boss of BOSS_DEFINITIONS) { eventTicks.add(boss.spawnTick - 300); eventTicks.add(boss.spawnTick); }
  const expectedEvents = [...eventTicks].filter((eventTick) => eventTick <= state.tick).sort((a, b) => a - b).flatMap(scheduledEventsAtTick);
  if (state.events.length !== expectedEvents.length || state.events.some((event, index) => event.id !== expectedEvents[index]?.id)) errors.push('Scheduled events missing, duplicated or out of order');
  return errors;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

/** Stable FNV-1a 64-bit fingerprint for deterministic checks, not a security hash. */
export function stateHash(state: MatchState): string {
  let hash = 0xcbf29ce484222325n;
  for (const char of stableStringify(state)) {
    hash ^= BigInt(char.codePointAt(0)!);
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return hash.toString(16).padStart(16, '0');
}

