# 🏗️ AUROLITH — GAME FILE STRUCTURE (Structure.md)

> Derived from the full Plan corpus (`TechnicalPlan/00–13`, `TextPlan/01–08`, `Data/UnitRoster`, `Data/BlessingList`, `Data/ItemList`, `Data/Monster`).
> Authoritative Game Title: **AUROLITH** (formerly General Gilded).
> Part 1 lists the **file structure organized by every game function** (folder → files).
> Part 2 lists the **Objects and Attributes** created in each file.
> Stack: TypeScript + PixiJS v8 (2.5D Isometric) + Web Audio / Howler.js + Web Workers.
> **Status:** historical exhaustive inventory, not the build checklist. New implementation follows `TechnicalPlan/14 - Implementation Roadmap, Authority & Decision Log.md`: `shared/` owns rules and data, `client/` owns PixiJS/DOM/input, `server/` owns online authority. The flat `src/` tree below records possible modules only; create a file when its behavior is needed and avoid duplicate ownership.

---

# PART 1 — FILE STRUCTURE (BY FUNCTION)

## Project Root
- index.html
- package.json
- tsconfig.json
- vite.config.ts
----------------------------

## public/assets
- sprites/units_atlas.json
- sprites/units_atlas.png
- sprites/structures_atlas.json
- sprites/structures_atlas.png
- sprites/vfx_atlas.json
- sprites/vfx_atlas.png
- ui/ui_frames_atlas.json
- ui/ui_frames_atlas.png
- ui/font/gilded_font.fnt
- ui/font/gilded_font.png
- audio/audio_manifest.json
- audio/voice/*.ogg
----------------------------

## src
- main.ts
- config.ts
----------------------------

## src/core — Boot, Match Loop, Phases, Clock, Events
- Game.ts
- GameLoop.ts
- EventBus.ts
- MatchTimer.ts
- MatchPhase.ts
- PauseEngine.ts
- VictorySequence.ts
----------------------------

## src/grid — Hex Grid, Coordinates, Zones, Stacking, Selection
- HexGrid.ts
- HexTile.ts
- CoordConvert.ts
- ZoneManager.ts
- SoftStacking.ts
- EntityRaycaster.ts
----------------------------

## src/pathfinding — Flow Field, A*, Vector Painting, Formations, Tether
- FlowFieldPathfinder.ts
- AstarPathfinder.ts
- VectorPainter.ts
- FormationEngine.ts
- FormationMatrix.ts
- AccordionFunnelEngine.ts
- TacticalSwapEngine.ts
- MarchSpeedCalculator.ts
- PlatoonManager.ts
- TetherSystem.ts
----------------------------

## src/command — Input, Ownership, Command Queue, Smart-Tactics AI
- CommandQueue.ts
- Command.ts
- KeyboardInput.ts
- MouseInput.ts
- OwnershipFilter.ts
- PlatoonMerge.ts
- SmartTacticsAI.ts
- SkillCaster.ts
- TargetEvaluator.ts
----------------------------

## src/combat — Damage Model, Crit, CC, Fights, Projectiles
- CombatSystem.ts
- DamageResolver.ts
- ArmorFormula.ts
- CritSystem.ts
- LifestealSystem.ts
- CCSystem.ts
- FightStateMachine.ts
- ProjectileSystem.ts
- AoeResolver.ts
----------------------------

## src/economy — Gold, XP, Commander Level, Income Ramp
- EconomySystem.ts
- GoldSystem.ts
- XPSystem.ts
- CommanderLevel.ts
- IncomeRamp.ts
----------------------------

## src/facilities — Facility Slots, Tiers, Production, Combat, Auras
- FacilitySystem.ts
- ConstructionSlot.ts
- Facility.ts
- FacilityUpgrade.ts
- CaravanPost.ts
- HuntersLodge.ts
- RecruitDepot.ts
- WarFoundry.ts
- GoldenVault.ts
- StoneQuarry.ts
- FieldOfDespair.ts
- ArcaneBarrier.ts
- Sanctuary.ts
- Ballista.ts
- Catapult.ts
- MetalWall.ts
- WarBannerShrine.ts
- Transmuter.ts
- Obelisk.ts
- WarRoom.ts
- TrainingGrounds.ts
- SanctumOfRestoration.ts
- RubbleTimer.ts
----------------------------

## src/cards — 25-Card Pool, Draw Ticker, Hand, Casting, Deck Locks
- CardSystem.ts
- Card.ts
- DrawTicker.ts
- HandManager.ts
- CrownMomentumSlot.ts
- DiscardPile.ts
- DeckLocks.ts
- CardCastExecutor.ts
- CardTargeting.ts
- ExtraBuySystem.ts
----------------------------

## src/traps — Hidden Traps, Fuses, Triggers, Scout Vision
- TrapManager.ts
- Trap.ts
- TrapTrigger.ts
- TrapVision.ts
- FuseTimer.ts
----------------------------

## src/structures — Walls, Core, Breach, Bottlenecks, Shroud
- StructureSystem.ts
- WallSegment.ts
- CastleCore.ts
- BreachSystem.ts
- BottleneckManager.ts
- ShroudManager.ts
- ShroudMask.ts
----------------------------

## src/blessings — 150-Blessing Pool, 3 In-Match Blessing Rites, Effect Engine
- BlessingSystem.ts
- Blessing.ts
- BlessingDraft.ts
- BlessingPanel.ts
- BlessingEffectEngine.ts
- TermDictionary.ts
----------------------------

## src/items — Materials, 35 Items (25 Craftables + 6 Divine + 4 Satchels), Arsenal, Crafting, Bazaar
- ItemSystem.ts
- Item.ts
- Material.ts
- Arsenal.ts
- CraftingTable.ts
- QualityMultiplier.ts
- JungleBazaar.ts
- Consumables.ts
----------------------------

## src/monsters — 24 Monsters (21 Regular Camps + 3 Distinct Bosses), Camps, Drops, Respawn, Bosses
- MonsterSystem.ts
- Monster.ts
- MonsterCamp.ts
- RespawnTimer.ts
- LootDrops.ts
- PackAbility.ts
- JungleBoss.ts
----------------------------

## src/ai — AI Commander Bot State Machine
- AICommanderBot.ts
- AIStateMachine.ts
- AIUtilityEvaluator.ts
- SpellHeatmap.ts
- TrapSpacing.ts
- SurrenderEvaluator.ts
----------------------------

## src/audio — Voice Pool, Panning, Preloading, Priority Ducking
- AudioSystem.ts
- VoicePool.ts
- AudioDuckingEngine.ts
- StereoPanner.ts
- AudioPreloader.ts
- SoundManifest.ts
----------------------------

## src/render — PixiJS 2.5D Pipeline, Camera, Culling, VFX, Hex Shaders
- Renderer.ts
- YSortedWorldContainer.ts
- ViewportCuller.ts
- CameraController.ts
- SemanticZoomController.ts
- HexFrameChromaShader.ts
- PlatoonCentroidCrest.ts
- SpriteFactory.ts
- AtlasLoader.ts
- AnimationController.ts
- ParticleSystem.ts
- HealthBarRenderer.ts
- CombatText.ts
- MinimapRenderer.ts
- Letterbox.ts
----------------------------

## src/ui — HUD, Card Drawer, Draft, Shop, Facilities, Menus, Macro Ribbon
- UIManager.ts
- TopBar.ts
- MacroRibbon.ts
- PerimeterThreatChevron.ts
- ConsolidatedRosterPanel.ts
- GraveyardQueue.ts
- SelectedEntityPanel.ts
- StanceToggle.ts
- CardDrawer.ts
- HandCards.ts
- TrashDiscard.ts
- DiscardPanel.ts
- MinimapWidget.ts
- DraftPanel.ts
- ShopPanel.ts
- FacilityMenu.ts
- BazaarPanel.ts
- CraftingPanel.ts
- PauseMenu.ts
- VictoryBanner.ts
- UIStateBinding.ts
- ColorTokens.ts
- FontManager.ts
----------------------------

## src/input — Mouse / Keyboard / Selection / Vector Painting
- InputManager.ts
- MouseController.ts
- KeyboardController.ts
- SelectionBox.ts
- VectorPainting.ts
- HotkeyMap.ts
----------------------------

## src/objects — Runtime Entities
- Unit.ts
- Platoon.ts
- CommanderState.ts
- Projectile.ts
- LootDrop.ts
- FloatingText.ts
- Buff.ts
- StatusEffect.ts
----------------------------

## src/data — Static Data Tables
- UnitData.ts
- CardData.ts
- BlessingData.ts
- ItemData.ts
- MaterialData.ts
- MonsterData.ts
- FacilityData.ts
- BalanceConfig.ts
----------------------------

## src/network — Hotseat / Multiplayer Session
- HotseatManager.ts
- SessionManager.ts
----------------------------

## src/save — Persistence
- SaveManager.ts
- SettingsManager.ts
----------------------------

## src/telemetry — Replay Buffer & Worker Archiving
- TelemetryRecorder.ts
- ReplayBuffer.ts
- WorkerArchiver.ts
- GameEvent.ts
----------------------------

## src/utils — Shared Helpers
- MathUtils.ts
- HexMath.ts
- Random.ts
- Timer.ts
- Logger.ts
----------------------------

## src/types — Shared Type Definitions
- enums.ts
- interfaces.ts
- events.ts
----------------------------

## src/workers — Background Threads
- TelemetryWorker.ts
----------------------------

## tests — Verification
- unit/grid.test.ts
- unit/pathfinding.test.ts
- unit/combat.test.ts
- unit/cards.test.ts
- unit/blessings.test.ts
- unit/items.test.ts
- e2e/match-flow.test.ts
- e2e/ui-flow.test.ts
----------------------------

---

# PART 2 — OBJECTS & ATTRIBUTES PER FILE

## src/main.ts
- bootGame
    - entrypoint
- createApplication
    - resolution
    - autoDensity
    - background
- preloadAssets
    - atlases
    - fonts
    - audio
- startMatch
    - mode
    - seed
----------------------------

## src/config.ts
- GameConfig
    - BOARD_COLS
    - BOARD_ROWS
    - VIRTUAL_WIDTH
    - VIRTUAL_HEIGHT
    - MATCH_DURATION_MS
    - DRAW_CADENCE_MS
    - HAND_CAP
    - PLATOON_MAX_UNITS
    - PLATOON_MAX_COUNT
    - FREE_UNITS_MAX
    - ARMY_CAP
    - CORE_MAX_HP
    - OUTER_WALL_SEGMENT_HP
    - INNER_WALL_SEGMENT_HP
    - FACILITY_TIER_HPS
    - TRAP_FUSE_MS
    - SCOUT_DURATION_MS
    - OVERFLOW_SLOT_MS
    - CAST_DEBOUNCE_MS
    - WALL_NON_SIEGE_PENALTY
    - OVERTIME_INCOME_MULTIPLIER
    - EXTRA_BUY_COSTS
    - COMMANDER_LEVEL_CURVE
----------------------------

## src/core/Game.ts
- Game
    - app
    - grid
    - match
    - commanderA
    - commanderB
    - systems
    - eventBus
    - isRunning
    - start
    - update
    - destroy
- MatchState
    - matchTimeMs
    - phase
    - isPaused
    - pauseMode
    - winner
    - endReason
    - wallDamageTotal
    - startedAt
    - surrenderFlag
----------------------------

## src/core/GameLoop.ts
- GameLoop
    - ticker
    - fixedTimestep
    - accumulator
    - isPaused
    - deltaCap
    - onUpdate
    - start
    - stop
    - pause
    - resume
- DeltaClock
    - lastTimestamp
    - deltaMs
    - now
----------------------------

## src/core/EventBus.ts
- EventBus
    - listeners
    - emit
    - on
    - off
    - once
    - clear
- GameEvent
    - type
    - payload
    - timestamp
----------------------------

## src/core/MatchTimer.ts
- MatchTimer
    - elapsedMs
    - phaseBoundaries
    - drawTickSchedule
    - lastTickIndex
    - performanceClock
    - tick
    - getPhaseAt
    - getNextDrawAt
    - isOvertime
    - onMinuteBoundary
- PhaseBoundary
    - phase
    - timeMs
----------------------------

## src/core/MatchPhase.ts
- MatchPhase (enum)
    - PREP
    - OPENING
    - EXPANSION
    - SIEGE
    - OVERTIME
    - ENDED
- MatchPhaseState
    - current
    - previous
    - enteredAt
    - onPhaseChanged
    - siegeLocked
    - siegeUnlockedAt
----------------------------

## src/core/PauseEngine.ts
- PauseEngine
    - isPaused
    - pauseMode
    - freezeClocks
    - resumeClocks
    - applyMode
- PauseMode (enum)
    - FREEZE_FULL
    - TRANSPARENT_OVERLAY
----------------------------

## src/core/VictorySequence.ts
- VictorySequence
    - banner
    - postMatchStats
    - trigger
    - resolveTieBreaker
- VictoryType (enum)
    - CORE_COLLAPSE
    - SURRENDER
    - TIE_BREAKER
- PostMatchStats
    - wallDamage
    - goldEarned
    - unitsKilled
    - cardsPlayed
----------------------------

## src/grid/HexGrid.ts
- HexGrid
    - tiles
    - cols
    - rows
    - zoneBounds
    - getTile
    - getNeighbors
    - hexDistance
    - lineOfSight
    - getInRadius
    - forEachVisible
- GridCoord
    - q
    - r
    - key
----------------------------

## src/grid/HexTile.ts
- HexTile
    - q
    - r
    - zone
    - isWalkable
    - occupants
    - structureEntity
    - trapId
    - shroudState
    - elevationBonus
    - visionOwner
- Zone (enum)
    - JUNGLE_A
    - BATTLEFIELD
    - JUNGLE_B
    - OUTER_COURTYARD
    - INNER_KEEP
- ShroudState (enum)
    - UNEXPLORED
    - EXPLORED
    - VISIBLE
- isJungleCanopy
- isBrush
----------------------------

## src/grid/CoordConvert.ts
- CoordConvert
    - pixelToHex
    - hexToPixel
    - axialToCube
    - cubeToAxial
    - offsetToAxial
    - axialToOffset
    - clampToBoard
    - worldToScreen
- CubeCoord
    - x
    - y
    - z
----------------------------

## src/grid/ZoneManager.ts
- ZoneManager
    - zones
    - getZoneAt
    - isJungle
    - isBattlefield
    - isCourtyard
    - isInnerKeep
    - jungleCampSlots
- ZoneConfig
    - id
    - bounds
    - walkableDefault
----------------------------

## src/grid/SoftStacking.ts
- SoftStacking
    - maxUnitsPerHex
    - repulsionConstant
    - update
    - spreadOut
    - resolveFunnel
----------------------------

## src/grid/EntityRaycaster.ts
- EntityRaycaster
    - getEntityUnderMouse
    - selectStructure
    - highlightFootprint
    - getHexFromPixel
----------------------------

## src/pathfinding/FlowFieldPathfinder.ts
- FlowFieldPathfinder
    - integrationField
    - flowVectors
    - targetHex
    - generateFlowField
    - getVector
    - isStale
    - cache
----------------------------

## src/pathfinding/AstarPathfinder.ts
- AstarPathfinder
    - openList
    - closedSet
    - cache
    - findPath
    - getHeuristic
    - reconstructPath
- PathNode
    - hex
    - g
    - h
    - f
    - parent
----------------------------

## src/pathfinding/VectorPainter.ts
- VectorPainter
    - isPainting
    - waypoints
    - paintPath
    - clampToBorder
    - colorByCommand
    - commit
- Waypoint
    - hex
    - commandType
    - badgeIcon
----------------------------

## src/pathfinding/FormationEngine.ts
- FormationEngine
    - formationType
    - frontlineSweep
    - stoppingRangeFor
    - arrange
    - firingLineWidth
- FormationType (enum)
    - WALL_SWEEP
    - COLUMN
    - SPREAD
----------------------------

## src/pathfinding/FormationMatrix.ts
- FormationMatrix
    - ranks (Rank 1 Vanguard, Rank 2 Midline, Rank 3 Rearguard)
    - slotOffsets
    - assignSlot(unit, rank, slotIndex)
    - getRelativeOffset(unit)
    - renderFormationHull
----------------------------

## src/pathfinding/AccordionFunnelEngine.ts
- AccordionFunnelEngine
    - corridorWidthThreshold (3 hexes)
    - collapseToColumn
    - roleInitiativeOrder (Tank -> Fighter -> Ranged -> Support)
    - reformLineFormation
    - isBottleneck
----------------------------

## src/pathfinding/TacticalSwapEngine.ts
- TacticalSwapEngine
    - swapCooldownMs (3000ms)
    - executeEmergencySwap(platoon, woundedUnit)
    - shedAggro(attackerList, oldTarget, newTarget)
    - canSwap(unit)
----------------------------

## src/pathfinding/MarchSpeedCalculator.ts
- MarchSpeedCalculator
    - calculateSquadMarchSpeed(platoon)
    - anchorPaceMultiplier
    - skirmisherBonusPerUnit (0.03)
    - isCombatBurstActive
----------------------------

## src/pathfinding/PlatoonManager.ts
- PlatoonManager
    - platoons (exactly 4 platoons)
    - maxPerPlatoon (5 units)
    - armyCap (20 units invariant)
    - assignRecruitToPlatoon
    - handleUnitRespawnAutoRally
    - rebalancePlatoons (Ctrl+G)
    - computeCentroid
    - computeConvexHull
----------------------------

## src/pathfinding/TetherSystem.ts
- TetherSystem
    - leashDistance
    - isOutOfLeash
    - dropAggro
    - returnToCamp
    - healToFull
----------------------------

## src/command/CommandQueue.ts
- CommandQueue
    - queue
    - priorityOrder
    - currentCommand
    - push
    - executeNext
    - clear
    - isBusy
- MacroStance (enum)
    - AGGRESSIVE
    - DEFENSIVE_GUARD
    - RETREAT
- FocusDirective (enum)
    - FRONTLINE_MELT
    - BACKLINE_HUNT
    - OBJECTIVE_SIEGE
- CommandType (enum)
    - VECTOR_MOVE
    - ATTACK_TARGET
    - RETREAT_CORE
    - CAST_CARD
----------------------------

## src/command/Command.ts
- Command
    - type
    - targetHex
    - targetEntityId
    - priority
    - waypoints
    - issuedAt
    - shiftChained
----------------------------

## src/command/KeyboardInput.ts
- KeyboardInput
    - registeredKeys
    - onKeyDown
    - onKeyUp
    - preventDefault
    - isShiftDown
    - isCtrlDown
----------------------------

## src/command/MouseInput.ts
- MouseInput
    - screenX
    - screenY
    - leftDown
    - rightDown
    - shiftHeld
    - isDragging
    - onClick
    - onRightClick
    - onDragStart
    - onDragEnd
----------------------------

## src/command/OwnershipFilter.ts
- OwnershipFilter
    - selectEntity
    - isFriendly
    - issueAttackOnEnemy
    - activePlayerId
----------------------------

## src/command/PlatoonMerge.ts
- PlatoonMerge
    - validateSize
    - validatePlatoonCount
    - mergeSelectedUnits
    - showWarning
    - maxUnits
    - maxPlatoons
----------------------------

## src/command/SmartTacticsAI.ts
- SmartTacticsAI
    - evaluators
    - tick
    - evaluateLocalConditions
    - castSkill
    - priorityHierarchy
    - skillCooldownCheck
----------------------------

## src/command/SkillCaster.ts
- SkillCaster
    - cooldowns
    - cast
    - isOnCooldown
    - priorityCommand
----------------------------

## src/command/TargetEvaluator.ts
- TargetEvaluator
    - evaluateTargets
    - priorityScore
    - rangeCheck
    - inFieldOfView
    - chooseTarget
- DefensivePeelController
    - peelTriggerHp (0.55)
    - peelReleaseHp (0.65)
    - minLockTicks (25 ticks = 2.5s)
    - currentPeelTarget
    - protectedAlly
    - updatePeelState
----------------------------

## src/combat/CombatSystem.ts
- CombatSystem
    - fights
    - registerFight
    - tickFights
    - resolve
    - damageDealtToWalls
    - perFightCounters
- Fight
    - id
    - attackerUnits
    - defenderUnits
    - state
    - startedAt
    - lastDamageAt
----------------------------

## src/combat/DamageResolver.ts
- DamageResolver
    - resolveDamage
    - applyMitigation
    - applyDamageTypes
    - trueDamage
    - structureMultiplier
- DamageType (enum)
    - PHYSICAL
    - MAGIC
    - TRUE
----------------------------

## src/combat/ArmorFormula.ts
- ArmorFormula
    - damageReduction
    - effectiveHP
    - applyDef
    - applyMr
    - siegeMultiplier
----------------------------

## src/combat/CritSystem.ts
- CritSystem
    - baseMultiplier
    - rollCrit
    - guaranteedCrit
    - applyCrit
    - pseudoRandomRoll
----------------------------

## src/combat/LifestealSystem.ts
- LifestealSystem
    - hardCap
    - healOnHit
    - physicalOnly
    - extendToAllDamage
----------------------------

## src/combat/CCSystem.ts
- CCSystem
    - diminishingWindowMs
    - stackReduction
    - applyCC
    - resolveDiminishing
    - cleanse
    - trackStacks
- CCType (enum)
    - STUN
    - ROOT
    - SLOW
    - SILENCE
    - BLIND
    - DISPLACE
----------------------------

## src/combat/FightStateMachine.ts
- FightStateMachine
    - state
    - resolveConditions
    - isWipe
    - isDisengage
    - isRecall
    - lastDamageTick
    - counters
- FightState (enum)
    - RUNNING
    - RESOLVED
----------------------------

## src/combat/ProjectileSystem.ts
- ProjectileSystem
    - projectiles
    - spawn
    - update
    - impact
    - collisionCheck
- ProjectileData
    - speed
    - damage
    - type
    - sourceId
    - targetId
----------------------------

## src/combat/AoeResolver.ts
- AoeResolver
    - resolveRadius
    - radius
    - platoonMaxHpStrike
    - splitEvenly
    - noFalloff
    - targetHexesInRadius
----------------------------

## src/economy/EconomySystem.ts
- EconomySystem
    - goldSystem
    - xpSystem
    - incomeMultipliers
    - productionBoost
    - tick
----------------------------

## src/economy/GoldSystem.ts
- GoldSystem
    - gold
    - passiveRate
    - overtimeMultiplier
    - addGold
    - removeGold
    - canAfford
    - onGoldChanged
    - mintBonuses
----------------------------

## src/economy/XPSystem.ts
- XPSystem
    - xp
    - passiveRate
    - addXp
    - monsterBounties
    - onXpChanged
    - crucibleBonuses
----------------------------

## src/economy/CommanderLevel.ts
- CommanderLevel
    - level
    - maxLevel
    - xpToNext
    - overflowCarry
    - damageBonusPerLevel
    - levelUp
    - onLevelUp
----------------------------

## src/economy/IncomeRamp.ts
- IncomeRamp
    - overtimeBonus
    - phaseMultipliers
    - productionModifiers
    - bazaarPityPrices
    - calculateRate
----------------------------

## src/economy/MercenaryGuild.ts
- MercenaryGuild
    - classBoards (8 classes, 40-unit match pool)
    - baseHireCost (60g)
    - costEscalation
    - uniqueChampionLocks
    - hireChampion
----------------------------

## src/economy/AcademyTraining.ts
- AcademyTraining
    - trainingCost (100g)
    - xpAwarded (100 XP)
    - investTraining
    - targetChampion
----------------------------

## src/economy/ShutdownBounty.ts
- ShutdownBounty
    - streakThreshold (3+ kills)
    - wallBreachBounty (+300g, +200 XP)
    - awardBounty
----------------------------

## src/facilities/FacilitySystem.ts
- FacilitySystem
    - slots
    - facilities
    - build
    - upgrade
    - destroy
    - refundOnMidUpgrade
    - getFacilityAt
    - tierHpTable
- FacilityBuildOrder
    - type
    - slotId
    - cost
    - xpCost
----------------------------

## src/facilities/ConstructionSlot.ts
- ConstructionSlot
    - id
    - hexes
    - area
    - occupiedBy
    - rubbleCooldown
    - isAvailable
- FacilityArea (enum)
    - OUTER_COURTYARD
    - INNER_KEEP
----------------------------

## src/facilities/Facility.ts
- Facility
    - id
    - type
    - ownerId
    - tier
    - currentHp
    - maxHp
    - hexes
    - isUpgrading
    - upgradeProgress
    - isDestroyed
    - state
- FacilityType (enum)
    - CARAVAN_POST
    - HUNTERS_LODGE
    - RECRUIT_DEPOT
    - WAR_FOUNDRY
    - GOLDEN_VAULT
    - STONE_QUARRY
    - FIELD_OF_DESPAIR
    - ARCANE_BARRIER
    - SANCTUARY
    - BALLISTA
    - CATAPULT
    - METAL_WALL
    - WAR_BANNER_SHRINE
    - TRANSMUTER
    - OBELISK
    - WAR_ROOM
    - TRAINING_GROUNDS
    - SANCTUM_OF_RESTORATION
- FacilityState (enum)
    - IDLE
    - BUILDING
    - UPGRADING
    - RUBBLE
    - DESTROYED
----------------------------

## src/facilities/FacilityUpgrade.ts
- FacilityUpgrade
    - tierHpScale
    - upgradeCosts
    - xpCosts
    - damageRetention
    - refund50
    - cancel
    - nonSiegeResistance
----------------------------

## src/facilities/CaravanPost.ts
- CaravanPost
    - caravanInterval
    - lumpGoldPerTier
    - dispatchCaravan
    - tieredLump
----------------------------

## src/facilities/HuntersLodge.ts
- HuntersLodge
    - bountyPercent
    - tier2Bonus
    - tier3Bonus
    - firstClearBonus
    - applyBounty
----------------------------

## src/facilities/RecruitDepot.ts
- RecruitDepot
    - hireCostReduction
    - applyHireCost
----------------------------

## src/facilities/WarFoundry.ts
- WarFoundry
    - craftTimeReduction
    - goldReduction
    - applyCraftCosts
----------------------------

## src/facilities/GoldenVault.ts
- GoldenVault
    - depositTerms
    - interestRates
    - vaultHp
    - applyInterest
    - termLocks
----------------------------

## src/facilities/StoneQuarry.ts
- StoneQuarry
    - facilityCostReduction
    - timeRider
    - hpRider
    - applyFacilityCosts
----------------------------

## src/facilities/FieldOfDespair.ts
- FieldOfDespair
    - antiHealPercent
    - radius
    - applyAura
----------------------------

## src/facilities/ArcaneBarrier.ts
- ArcaneBarrier
    - reflectPercent
    - applyReflect
----------------------------

## src/facilities/Sanctuary.ts
- Sanctuary
    - allyHealBonus
    - radius
    - applyAura
----------------------------

## src/facilities/Ballista.ts
- Ballista
    - fireInterval
    - damage
    - range
    - targetSelection
    - nearestFirst
----------------------------

## src/facilities/Catapult.ts
- Catapult
    - fireInterval
    - areaDamage
    - radius
    - splashPercent
    - range
    - targetSelection
----------------------------

## src/facilities/MetalWall.ts
- MetalWall
    - wallDamageReduction
    - applyWallBuff
----------------------------

## src/facilities/WarBannerShrine.ts
- WarBannerShrine
    - battleCryInterval
    - doubleDamageWindow
    - procOnAllies
    - applyBattleCry
----------------------------

## src/facilities/Transmuter.ts
- Transmuter
    - outOfCombatRegenPercent
    - applyRegen
----------------------------

## src/facilities/Obelisk.ts
- Obelisk
    - gustInterval
    - speedBurstPercent
    - duration
    - applyBurst
----------------------------

## src/facilities/WarRoom.ts
- WarRoom
    - ordersRelayInterval
    - resetCooldowns
    - applyOrders
----------------------------

## src/facilities/TrainingGrounds.ts
- TrainingGrounds
    - levelUpHealPercent
    - applyLevelHeal
----------------------------

## src/facilities/SanctumOfRestoration.ts
- SanctumOfRestoration
    - deathRefundPercent
    - applyDeathRefund
----------------------------

## src/facilities/RubbleTimer.ts
- RubbleTimer
    - durationMs
    - remainingMs
    - start
    - update
    - isDone
----------------------------

## src/cards/CardSystem.ts
- CardSystem
    - masterPool
    - hand
    - discardPile
    - crownMomentumSlot
    - drawTicker
    - extraBuys
    - deckLocks
    - drawCards
    - castCard
    - discardCard
    - reshuffleIfEmpty
----------------------------

## src/cards/Card.ts
- Card
    - id
    - name
    - category
    - castCost
    - effect
    - targetType
    - deckLockTime
    - isLocked
    - description
- TargetType (enum)
    - NONE
    - HEX
    - UNIT
    - PLATOON
    - WALL_SEGMENT
    - HAND_CARD
----------------------------

## src/cards/DrawTicker.ts
- DrawTicker
    - cadenceMs
    - tickSchedule
    - drawCountPerTick
    - nextTickAt
    - tick
    - onDrawTick
----------------------------

## src/cards/HandManager.ts
- HandManager
    - cards
    - maxCap
    - addCard
    - removeCard
    - noDuplicates
    - contains
----------------------------

## src/cards/CrownMomentumSlot.ts
- CrownMomentumSlot
    - eventCard
    - isOccupied
    - bankCard
    - castCard
    - clear
    - card
    - durationMs
    - remainingMs
    - isOccupied
    - autoDiscard
    - update
----------------------------

## src/cards/DiscardPile.ts
- DiscardPile
    - cards
    - add
    - drawFrom
    - reshuffle
    - isEmpty
----------------------------

## src/cards/DeckLocks.ts
- DeckLocks
    - lockedCards
    - unlockConditions
    - isUnlocked
    - lockUntilTime
----------------------------

## src/cards/CardCastExecutor.ts
- CardCastExecutor
    - debounceMs
    - lastCastAt
    - execute
    - canCast
    - applyCardEffect
----------------------------

## src/cards/CardTargeting.ts
- CardTargeting
    - validTargets
    - invalidTargets
    - highlightColor
    - validateTarget
    - dragCancel
    - trashDiscard
----------------------------

## src/cards/ExtraBuySystem.ts
- ExtraBuySystem
    - costs
    - buyCount
    - maxBuysPerPhase
    - buyCard
    - costForNext
----------------------------

## src/traps/TrapManager.ts
- TrapManager
    - activeTraps
    - armTrap
    - detonate
    - revealTraps
    - removeTrap
    - getTrapAt
----------------------------

## src/traps/Trap.ts
- Trap
    - id
    - type
    - ownerId
    - targetHex
    - isArmed
    - isRevealedToEnemy
    - fuseMs
    - effect
- TrapType (enum)
    - LANDMINE
    - SPIKE_CHOKEPOINT
    - DECOY_ILLUSION
    - AMBUSH_NET
    - GAS_CLOUD
----------------------------

## src/traps/TrapTrigger.ts
- TrapTrigger
    - onUnitStep
    - checkTriggers
    - stealthedUnitsStillTrigger
    - triggerCondition
----------------------------

## src/traps/TrapVision.ts
- TrapVision
    - isVisibleTo
    - tempRevealDurationMs
    - revealUntil
    - hide
----------------------------

## src/traps/FuseTimer.ts
- FuseTimer
    - remainingMs
    - warningVFX
    - audioClick
    - detonate
    - update
----------------------------

## src/structures/StructureSystem.ts
- StructureSystem
    - wallSegments
    - core
    - breachEvents
    - registerBreach
    - getSegmentAt
    - wallDamageTotal
----------------------------

## src/structures/WallSegment.ts
- WallSegment
    - id
    - ownerId
    - layer
    - hexes
    - currentHp
    - maxHp
    - isIntact
    - isBreached
    - stationedUnits
    - elevationRangeBonus
- WallLayer (enum)
    - OUTER
    - INNER
----------------------------

## src/structures/CastleCore.ts
- CastleCore
    - ownerId
    - currentHp
    - maxHp
    - isDestroyed
    - surrenderTriggered
----------------------------

## src/structures/BreachSystem.ts
- BreachSystem
    - onSegmentDestroyed
    - breachTriggers
    - onBreach
    - bottleneckHexes
    - damagedTotal
----------------------------

## src/structures/BottleneckManager.ts
- BottleneckManager
    - breachMouthHexes
    - maxUnitsPerHex
    - funnelUnits
    - repulsionForces
----------------------------

## src/structures/ShroudManager.ts
- ShroudManager
    - maskedHexes
    - visionRanges
    - activeCommanderId
    - reveal
    - hide
    - setPerspective
    - visionExtensionForWalls
- VisionRange
    - hex
    - radius
    - sourceId
----------------------------

## src/structures/ShroudMask.ts
- ShroudMask
    - alpha
    - fadeSpeed
    - fade
    - removeOnZero
    - tickerCallback
----------------------------

## src/blessings/BlessingSystem.ts
- BlessingSystem
    - selectedBlessings (3 active)
    - activeEffects
    - blessingRites (0:00, 5:00, 10:00)
    - applyBlessing
    - stackingRules
    - highestTierWins
----------------------------

## src/blessings/Blessing.ts
- Blessing
    - id
    - name
    - tier
    - type
    - effectLine
    - trigger
    - payoff
    - uniqueItem
- BlessingTier (enum)
    - GODDESS
    - TRANSCENDENCE
    - IMPERIAL
    - EXALTED
    - GRACE
- BlessingType (enum)
    - COMBAT
    - ECONOMY
    - ITEM
    - GAMBLE
----------------------------

## src/blessings/BlessingDraft.ts
- BlessingDraft
    - riteTimestamps (0, 300, 600)
    - tierPools
    - offeredBlessings (4 options)
    - smartTailoring
    - augmentRerollsAllowed (1)
    - timeoutSeconds (30s)
    - pickBlessing
    - rerollOptions
----------------------------

## src/blessings/BlessingPanel.ts
- BlessingPanel
    - options
    - augmentRerollAvailable
    - countdownTimer
    - pick
    - reroll
    - riteIndex
----------------------------

## src/blessings/BlessingEffectEngine.ts
- BlessingEffectEngine
    - applyEffect
    - riteMilestoneTriggers
    - combatCounters
    - gamblePayoffTimers
    - resolveTerm
    - conditionalChecks
----------------------------

## src/blessings/TermDictionary.ts
- TermDictionary
    - definitions
    - resolveTerm
    - fightStateTerms
    - clockTerms
    - damageTerms
----------------------------

## src/items/ItemSystem.ts
- ItemSystem
    - arsenal
    - equip
    - unequip
    - craft
    - validateCompatibility
    - oneItemPerUnit
    - unequipGate
----------------------------

## src/items/Item.ts
- Item
    - id
    - name
    - components
    - statLines
    - passive
    - compatibleClasses
    - quality
    - isEquipped
    - holderUnitId
- ItemQuality (enum)
    - COMMON
    - RARE
    - EPIC
    - ANCIENT
    - DIVINE
----------------------------

## src/items/Material.ts
- Material
    - id
    - name
    - statFamily
    - dropSource
    - rarity
    - bazaarPrice
- MaterialId (enum)
    - GILDED_ORE
    - ARCANE_CRYSTAL
    - IRONWOOD_TIMBER
    - EMBERBLOOM_SAP
    - STORMFEATHER
    - VOIDSHARD
    - SUNFORGE_ALLOY
----------------------------

## src/items/Arsenal.ts
- Arsenal
    - items
    - addItem
    - removeItem
    - returnOnDeath
    - itemCount
----------------------------

## src/items/CraftingTable.ts
- CraftingTable
    - channelTimeMs
    - baseCost
    - combine
    - distinctComponents
    - recipes
    - channel
    - completeCraft
----------------------------

## src/items/QualityMultiplier.ts
- QualityMultiplier
    - rareBonus
    - epicBonus
    - highestRarityInRecipe
    - applyMultiplier
----------------------------

## src/items/JungleBazaar.ts
- JungleBazaar
    - pityPrices
    - buy
    - materialsOnly
    - noFullItems
----------------------------

## src/items/Consumables.ts
- Consumables
    - healingFlask
    - speedElixir
    - damageTonic
    - siegeBomb
    - use
----------------------------

## src/monsters/MonsterSystem.ts
- MonsterSystem
    - camps
    - spawn
    - respawn
    - tetherCheck
    - lastHitTracker
    - killBounty
    - bossSpawns
----------------------------

## src/monsters/Monster.ts
- Monster
    - id
    - family
    - variant
    - hp
    - def
    - mr
    - atk
    - aspd
    - groupSize
    - dropMaterial
    - dropCopies
    - isDead
    - campId
    - spawnHex
    - aggroState
    - packAbility
----------------------------

## src/monsters/MonsterCamp.ts
- MonsterCamp
    - id
    - family
    - variant
    - spawnHexes
    - respawnMs
    - isCleared
    - isContested
    - monsterList
- MonsterVariant (enum)
    - COMMON
    - RARE
    - ELITE
----------------------------

## src/monsters/RespawnTimer.ts
- RespawnTimer
    - remainingMs
    - tick
    - onRespawn
    - isReady
----------------------------

## src/monsters/LootDrops.ts
- LootDrops
    - lastHitRewards
    - materialCopies
    - bossBuffs
    - dropMaterial
    - awardLastHit
    - applyBossBuff
----------------------------

## src/monsters/PackAbility.ts
- PackAbility
    - charge
    - root
    - slow
    - dot
    - webPull
    - triggerRules
    - cooldown
----------------------------

## src/monsters/JungleBoss.ts
- JungleBoss
    - tier
    - hp
    - spawnTime
    - bounty
    - teamBuff
    - buffDurationMs
    - buffNonStacking
- BossTier (enum)
    - ELITE
    - ALPHA
    - ANCIENT
----------------------------

## src/ai/AICommanderBot.ts
- AICommanderBot
    - stateMachine
    - decisionInterval
    - strategy
    - update
    - issueOrders
    - chooseState
----------------------------

## src/ai/AIStateMachine.ts
- AIStateMachine
    - currentState
    - transitions
    - siegeOperatorCheck
    - forceEconomyIfNoSiege
- AIState (enum)
    - ECONOMIC_BUILDUP
    - JUNGLE_FARMING
    - WALL_DEFENSE
    - WALL_ASSAULT
----------------------------

## src/ai/AIUtilityEvaluator.ts
- AIUtilityEvaluator
    - scoreActions
    - chooseAction
    - weights
    - goldReserves
----------------------------

## src/ai/SpellHeatmap.ts
- SpellHeatmap
    - radius
    - densityMap
    - evaluateRadius
    - bestTargetHex
    - unitAndStructureCount
----------------------------

## src/ai/TrapSpacing.ts
- TrapSpacing
    - minDistance
    - validatePlacement
    - enforceSpacing
----------------------------

## src/ai/SurrenderEvaluator.ts
- SurrenderEvaluator
    - coreHpThreshold
    - enemyUnitThreshold
    - goldThreshold
    - shouldSurrender
----------------------------

## src/audio/AudioSystem.ts
- AudioSystem
    - howler
    - voicePool
    - play
    - stop
    - setVolume
    - preload
    - audioManifest
----------------------------

## src/audio/VoicePool.ts
- VoicePool
    - maxChannels
    - activeVoices
    - priorityQueue
    - play
    - stopLowestPriority
    - isAvailable
- VoicePriority (enum)
    - DEMOLITION
    - CARD_PLAY
    - SKILL
    - FOOTSTEP
----------------------------

## src/audio/AudioDuckingEngine.ts
- AudioDuckingEngine
    - tier1CoreBreach (prio 100, -6dB ducking)
    - tier2Milestone (prio 75)
    - tier3CombatFX (prio 50)
    - tier4AmbientUI (prio 25)
    - triggerDucking
    - restoreVolumes
----------------------------

## src/audio/StereoPanner.ts
- StereoPanner
    - pan
    - gain
    - cameraCenterHexX
    - viewportWidthHexes
    - calculatePan
----------------------------

## src/audio/AudioPreloader.ts
- AudioPreloader
    - progress
    - preload
    - loadingBar
    - onProgress
    - onComplete
----------------------------

## src/audio/SoundManifest.ts
- SoundManifest
    - keyToFile
    - priorities
    - loopFlags
    - volumeDefaults
----------------------------

## src/render/Renderer.ts
- Renderer
    - app
    - stage
    - worldContainer
    - uiLayer
    - camera
    - resolution
    - autoDensity
    - render
    - resize
----------------------------

## src/render/YSortedWorldContainer.ts
- YSortedWorldContainer
    - children
    - sortByY
    - addEntity
    - removeEntity
    - updateSort
----------------------------

## src/render/ViewportCuller.ts
- ViewportCuller
    - bufferHexes
    - drawCallBudget
    - visibleHexes
    - cull
    - isInViewport
    - drawCallCount
----------------------------

## src/render/CameraController.ts
- CameraController
    - centerHex
    - zoom
    - clampBounds
    - moveTo
    - pan
    - worldToScreen
    - screenToWorld
----------------------------

## src/render/SemanticZoomController.ts
- SemanticZoomController
    - microThreshold (0.6)
    - macroThreshold (0.25)
    - currentScale
    - isMacroView
    - snapToAlert
    - snapToPlatoon
    - snapToCastle
----------------------------

## src/render/SpriteFactory.ts
- SpriteFactory
    - createUnitSprite
    - createStructureSprite
    - createVfxSprite
    - frameFromAtlas
    - tint
----------------------------

## src/render/AtlasLoader.ts
- AtlasLoader
    - unitsAtlas
    - structuresAtlas
    - vfxAtlas
    - uiFramesAtlas
    - load
    - getFrame
    - onLoaded
----------------------------

## src/render/AnimationController.ts
- AnimationController
    - states
    - directions
    - play
    - currentState
    - currentDirection
    - update
    - onComplete
- AnimState (enum)
    - IDLE
    - MARCH
    - ATTACK
    - ABILITY
    - HIT
    - CAST_CHANNEL
    - DEATH
    - REVIVE
----------------------------

## src/render/ParticleSystem.ts
- ParticleSystem
    - pool
    - maxParticles
    - spawn
    - update
    - recycle
    - activeCount
- ParticleType (enum)
    - FIRE
    - SMOKE
    - SPELL_CIRCLE
    - EXPLOSION
    - FUSE_FLASH
----------------------------

## src/render/HealthBarRenderer.ts
- HealthBarRenderer
    - colorThresholds
    - damageFlashMs
    - update
    - setColor
    - flash
- HealthColor (enum)
    - HIGH
    - MID
    - LOW
----------------------------

## src/render/HexFrameChromaShader.ts
- HexFrameChromaShader
    - greenChroma (0x00E676)
    - yellowChroma (0xFFD600)
    - redChroma (0xFF1744)
    - deadChroma (0x37474F)
    - pulseFrequencyHz (2.0)
    - bindUnitHealth
    - updateShader
----------------------------

## src/render/PlatoonCentroidCrest.ts
- PlatoonCentroidCrest
    - centroidTarget
    - soldierPips (x5)
    - aggregateHPBar
    - barrierOverlay
    - updateCentroid
    - renderPips
----------------------------

## src/render/CombatText.ts
- CombatText
    - bitmapFont
    - spawnFloatingText
    - damageColor
    - lootColor
    - riseSpeed
    - lifetime
----------------------------

## src/render/MinimapRenderer.ts
- MinimapRenderer
    - width
    - height
    - aspectRatio
    - draw
    - raycastCamera
    - renderUnits
    - renderWalls
    - renderShroud
----------------------------

## src/render/Letterbox.ts
- Letterbox
    - virtualWidth
    - virtualHeight
    - scale
    - offsetX
    - offsetY
    - update
    - letterboxBars
----------------------------

## src/ui/UIManager.ts
- UIManager
    - layer
    - components
    - show
    - hide
    - bindState
    - update
    - onResize
----------------------------

## src/ui/TopBar.ts
- TopBar
    - goldText
    - xpText
    - timerText
    - phaseBadge
    - pauseButton
    - optionsButton
    - update
----------------------------

## src/ui/MacroRibbon.ts
- MacroRibbon
    - fortressUpgradeButton
    - neutralBossTimers (Gorgon, Hydra, Tuskgod)
    - mercenaryRefreshTicker
    - onUpgradeClick
    - onBossPingClick
    - updateTimers
----------------------------

## src/ui/PerimeterThreatChevron.ts
- PerimeterThreatChevron
    - threatVectors
    - yellowContested
    - redCombat
    - crimsonBreach
    - calculatePerimeterPosition
    - renderChevrons
----------------------------

## src/ui/ConsolidatedRosterPanel.ts
- ConsolidatedRosterPanel
    - platoonCards (×4, hotkeys 1-4)
    - stanceToggles ([A], [D], [R])
    - directiveBadges ([Z], [X], [C])
    - roleSynergyReadout (3, 4, 5 roles)
    - unitRows (×5 per platoon)
    - monochromePortraits (full color when ready, grayscale on CD, dark silhouette when dead)
    - cooldownArcs
    - targetThumbnails (16px badge)
    - hpShieldBars
    - graveyardQueue (30s countdowns, card targetable)
----------------------------

## src/ui/GraveyardQueue.ts
- GraveyardQueue
    - fallenPortraits
    - respawnTimers
    - selectForRevive
    - update
    - reviveSelection
----------------------------

## src/ui/SelectedEntityPanel.ts
- SelectedEntityPanel
    - detailWidget
    - stanceToggle
    - displayEntity
    - updateDetail
----------------------------

## src/ui/StanceToggle.ts
- StanceToggle
    - modes
    - currentMode
    - onStanceChanged
    - setMode
- StanceMode (enum)
    - AGGRESSIVE
    - DEFENSIVE
    - SIEGE_FOCUS
----------------------------

## src/ui/CardDrawer.ts
- CardDrawer
    - handCards
    - crownMomentumSlot
    - trashDiscard
    - castDebounce
    - dragState
    - render
    - onCardDrag
    - onCardDrop
    - onCardDiscard
----------------------------

## src/ui/HandCards.ts
- HandCards
    - slots
    - maxCap
    - displayCard
    - update
    - getSlotAt
    - removeAt
----------------------------

## src/ui/TrashDiscard.ts
- TrashDiscard
    - dropZone
    - onDiscard
    - highlight
----------------------------

## src/ui/DiscardPanel.ts
- DiscardPanel
    - cards
    - isVisible
    - toggle
    - render
----------------------------

## src/ui/MinimapWidget.ts
- MinimapWidget
    - container
    - cameraMapping
    - render
    - onClick
----------------------------

## src/ui/DraftPanel.ts
- DraftPanel
    - options
    - rerollButton
    - pick
    - reroll
    - render
    - mirroredSeedDisplay
----------------------------

## src/ui/MercenaryGuildPanel.ts
- MercenaryGuildPanel
    - classBoards (8 classes from 40-unit match pool)
    - championCards (60g base cost)
    - recruitTargetPlatoon (1-4)
    - academyTrainingButton (100g -> +100 XP)
    - uniqueChampionLocks
    - render
    - onHire
----------------------------

## src/ui/FacilityMenu.ts
- FacilityMenu
    - buildOptions
    - upgradeButton
    - costsDisplay
    - build
    - upgrade
    - selectSlot
----------------------------

## src/ui/BazaarPanel.ts
- BazaarPanel
    - materialOffers
    - prices
    - buy
    - render
----------------------------

## src/ui/CraftingPanel.ts
- CraftingPanel
    - recipeGrid
    - channelProgress
    - combine
    - render
    - selectComponents
----------------------------

## src/ui/PauseMenu.ts
- PauseMenu
    - resume
    - settings
    - surrender
    - open
    - close
----------------------------

## src/ui/VictoryBanner.ts
- VictoryBanner
    - cinematic
    - stats
    - show
    - render
----------------------------

## src/ui/UIStateBinding.ts
- UIStateBinding
    - subscriptions
    - bindWidget
    - unbind
    - pulseAnimations
    - update
----------------------------

## src/ui/ColorTokens.ts
- ColorTokens
    - imperialGold
    - sunburstOrange
    - obsidianDark
    - arcaneCyan
    - crimsonRed
    - emeraldGreen
    - darkViolet
----------------------------

## src/ui/FontManager.ts
- FontManager
    - titleFont
    - bodyFont
    - bitmapFont
    - load
    - getFont
----------------------------

## src/input/InputManager.ts
- InputManager
    - mouse
    - keyboard
    - activePlayerId
    - dispatch
    - registerHotkeys
    - update
----------------------------

## src/input/MouseController.ts
- MouseController
    - screenX
    - screenY
    - buttons
    - dragStart
    - dragEnd
    - isDragging
    - onMove
    - onClick
    - onRightClick
----------------------------

## src/input/KeyboardController.ts
- KeyboardController
    - hotkeys
    - onKeyDown
    - onKeyUp
    - preventDefaults
----------------------------

## src/input/SelectionBox.ts
- SelectionBox
    - rect
    - selectUnits
    - clearSelection
    - drawBox
    - onDrag
----------------------------

## src/input/VectorPainting.ts
- VectorPainting
    - isPainting
    - pathPoints
    - commit
    - clampToBorder
    - drawPath
----------------------------

## src/input/HotkeyMap.ts
- HotkeyMap
    - KeyA
    - KeyR
    - KeyJ
    - KeyD
    - KeyG
    - CtrlG
    - KeyV
    - Escape
    - ShiftModifier
----------------------------

## src/objects/Unit.ts
- Unit
    - id
    - ownerId
    - unitDataId
    - classType
    - tier
    - positionHex
    - platoonId
    - currentHp
    - maxHp
    - atk
    - ap
    - def
    - mr
    - moveSpeed
    - aspd
    - range
    - skillCooldowns
    - state
    - equippedItemId
    - isOnWall
    - buffs
    - statusEffects
    - fightCounters
    - lastDamageAt
    - alive
    - isStationed
- UnitState (enum)
    - IDLE
    - MOVING
    - ATTACKING
    - CASTING
    - CHANNELING
    - DEAD
    - SCOUTING
----------------------------

## src/objects/Platoon.ts
- Platoon
    - id
    - ownerId
    - units
    - leaderId
    - formation
    - commandQueue
    - currentOrder
    - waypoints
    - stance
    - isStealthed
    - isChanneling
----------------------------

## src/objects/CommanderState.ts
- CommanderState
    - id
    - gold
    - xp
    - level
    - selectedUnits
    - platoons
    - army
    - graveyard
    - facilities
    - hand
    - discardPile
    - crownMomentumSlot
    - traits
    - arsenal
    - trapCount
    - stats
    - starterPool
    - isAI
----------------------------

## src/objects/Projectile.ts
- Projectile
    - id
    - sourceId
    - targetId
    - position
    - targetHex
    - speed
    - damage
    - damageType
    - isHoming
----------------------------

## src/objects/LootDrop.ts
- LootDrop
    - id
    - hex
    - materialId
    - copies
    - ownerId
    - isCollected
----------------------------

## src/objects/FloatingText.ts
- FloatingText
    - text
    - hex
    - color
    - lifetime
    - riseSpeed
    - bitmapText
----------------------------

## src/objects/Buff.ts
- Buff
    - id
    - source
    - statModifiers
    - durationMs
    - remainingMs
    - stacks
    - stackCap
    - tick
    - expire
----------------------------

## src/objects/StatusEffect.ts
- StatusEffect
    - type
    - durationMs
    - remainingMs
    - diminishingGroup
    - tick
    - cleanse
    - canBeReduced
----------------------------

## src/data/UnitData.ts
- UnitData
    - id
    - name
    - classId
    - tier
    - hp
    - atk
    - ap
    - def
    - mr
    - range
    - moveSpeed
    - aspd
    - abilities
    - skillCooldowns
    - priorityCommand
    - slayersMark
- ClassId (enum)
    - FIGHTER
    - TANKER
    - MAGE
    - MARKSMAN
    - SUPPORT
    - SIEGE
    - ARTISAN
    - ASSASSIN
----------------------------

## src/data/CardData.ts
- CardData (25 entries, 5 categories)
    - id
    - name
    - category
    - effectParams
    - targetType
    - deckLockTime
    - description
- CardCategory (enum)
    - INTEL_SCOUTING
    - ECONOMY_PRODUCTION
    - MOVEMENT_TACTICS
    - SIEGE_COMBAT
    - TRAPS_AMBUSH
----------------------------

## src/data/BlessingData.ts
- BlessingData (150 entries: 5 tiers: Goddess, Transcendence, Imperial, Exalted, Grace)
    - id
    - name
    - tier
    - type
    - effectLine
    - trigger
    - payoff
    - uniqueItem
    - variantOf
----------------------------

## src/data/ItemData.ts
- ItemData (25 entries)
    - id
    - name
    - components
    - statLines
    - passive
    - compatibleClasses
    - qualityBonus
----------------------------

## src/data/MaterialData.ts
- MaterialData (7 entries)
    - id
    - name
    - statFamily
    - dropFamily
    - bazaarPrice
----------------------------

## src/data/MonsterData.ts
- MonsterData (21 entries)
    - id
    - family
    - variant
    - hp
    - def
    - mr
    - atk
    - aspd
    - groupSize
    - dropMaterial
    - dropCopies
    - packAbility
    - respawnMs
- MonsterFamily (enum)
    - IRONHIDE_BOAR
    - VERDANT_WYRM
    - ANCIENT_TREANT
    - EMBERBLOOM_INSECT
    - STORMCREST_RAPTOR
    - SHADOWMAW_SPIDER
    - SUNFORGED_GOLEM
----------------------------

## src/data/FacilityData.ts
- FacilityData (18 entries)
    - id
    - type
    - tierHps
    - upgradeCosts
    - xpCosts
    - footprint
    - slotArea
    - effects
----------------------------

## src/data/BalanceConfig.ts
- BalanceConfig
    - baseGoldRate
    - baseXpRate
    - commanderLevelCurve
    - damageFormula
    - critMultiplier
    - lifestealCap
    - ccdrWindowMs
    - wallHps
    - facilityTierHps
    - monsterStats
    - bossStats
    - bazaarPrices
    - extraBuyCosts
    - cardCadenceMs
    - scoutProtocol
    - trapFuseMs
    - reviveParams
    - overtimeMultiplier
    - siegeMultipliers
----------------------------

## src/network/HotseatManager.ts
- HotseatManager
    - activeCommanderId
    - switchPerspective
    - shroudToggle
    - passTurn
    - onPerspectiveChanged
----------------------------

## src/network/SessionManager.ts
- SessionManager
    - mode
    - matchId
    - seed
    - startMatch
    - endMatch
    - syncState
- GameMode (enum)
    - SOLO_VS_AI
    - HOTSEAT_1V1
    - ONLINE_1V1
----------------------------

## src/save/SaveManager.ts
- SaveManager
    - save
    - load
    - storage
    - serialize
    - deserialize
----------------------------

## src/save/SettingsManager.ts
- SettingsManager
    - volume
    - resolution
    - hotkeyMap
    - save
    - load
----------------------------

## src/telemetry/TelemetryRecorder.ts
- TelemetryRecorder
    - buffer
    - bufferCap
    - record
    - flush
    - archive
    - onOverflow
----------------------------

## src/telemetry/ReplayBuffer.ts
- ReplayBuffer
    - events
    - chunk
    - serialize
    - chunkSize
    - push
----------------------------

## src/telemetry/WorkerArchiver.ts
- WorkerArchiver
    - worker
    - archive
    - onArchived
    - postMessage
----------------------------

## src/telemetry/GameEvent.ts
- GameEvent
    - type
    - timestamp
    - data
    - eventId
    - matchId
- EventType (enum)
    - UNIT_KILLED
    - CARD_PLAYED
    - FACILITY_BUILT
    - WALL_BREACHED
    - MONSTER_LAST_HIT
    - PHASE_CHANGED
    - TRAP_TRIGGERED
    - MATCH_ENDED
----------------------------

## src/utils/MathUtils.ts
- MathUtils
    - clamp
    - lerp
    - distance
    - angleTo
    - smoothstep
----------------------------

## src/utils/HexMath.ts
- HexMath
    - hexDistance
    - getNeighbors
    - inRadius
    - lineOfSight
    - hexKey
----------------------------

## src/utils/Random.ts
- Random
    - seeded
    - range
    - chance
    - shuffle
    - next
----------------------------

## src/utils/Timer.ts
- Timer
    - durationMs
    - remainingMs
    - tick
    - isDone
    - reset
----------------------------

## src/utils/Logger.ts
- Logger
    - log
    - info
    - warn
    - error
    - levels
----------------------------

## src/types/enums.ts
- All shared enums (MatchPhase, Zone, ShroudState, DamageType, FacilityType, CardCategory, BlessingTier, BlessingType, ItemQuality, MonsterVariant, BossTier, AIState, StanceMode, VoicePriority, ClassId, etc.)
----------------------------

## src/types/interfaces.ts
- All shared interfaces (Entity, Positioned, Damageable, Ownable, Selectable, Observable, etc.)
----------------------------

## src/types/events.ts
- All shared event type constants and payload types
----------------------------

## src/workers/TelemetryWorker.ts
- onmessage
    - archive chunk
- archiving
    - chunk queue
    - write
----------------------------

## public/assets/sprites/units_atlas.json
- AtlasMeta
    - frames
    - meta
    - unitFrames
    - directions
    - animStates
----------------------------

## public/assets/sprites/structures_atlas.json
- AtlasMeta
    - frames
    - structureFrames
    - tierVariants
----------------------------

## public/assets/sprites/vfx_atlas.json
- AtlasMeta
    - frames
    - vfxFrames
    - animationLoops
----------------------------

## public/assets/ui/ui_frames_atlas.json
- AtlasMeta
    - frames
    - panelFrames
    - cardFrames
    - iconFrames
----------------------------

## public/assets/ui/font/gilded_font.fnt
- FontDescriptor
    - glyphs
    - kerning
    - lineHeight
    - baseline
----------------------------

## public/assets/audio/audio_manifest.json
- SoundManifestData
    - keys
    - files
    - priorities
    - loopFlags
----------------------------

## tests/unit/grid.test.ts
- TestGrid
    - coordConversion
    - distance
    - neighbors
    - zoneBounds
----------------------------

## tests/unit/pathfinding.test.ts
- TestPathfinding
    - flowField
    - astar
    - tether
    - platoonMerge
----------------------------

## tests/unit/combat.test.ts
- TestCombat
    - armorFormula
    - crit
    - lifesteal
    - ccDiminishing
    - wallDamage
----------------------------

## tests/unit/cards.test.ts
- TestCards
    - drawCadence
    - noDuplicates
    - crownMomentumSlot
    - deckLocks
    - extraBuys
----------------------------

## tests/unit/blessings.test.ts
- TestBlessings
    - mirroredDraft
    - antiRepeat
    - tierPower
    - perMinuteTicks
----------------------------

## tests/unit/items.test.ts
- TestItems
    - combineMatrix
    - qualityMultiplier
    - arsenalReturn
    - compatibility
----------------------------

## tests/e2e/match-flow.test.ts
- TestMatchFlow
    - fullMatchTimeline
    - phaseTransitions
    - overtime
    - tieBreaker
----------------------------

## tests/e2e/ui-flow.test.ts
- TestUIFlow
    - HUD
    - cardDrawer
    - draftPanels
    - hotkeys
----------------------------

---

# PART 3 — AUDIT (CROSS-CHECK vs. PLAN CORPUS)

> Every system named in the plan documents was mapped to its file(s) above. Nothing from the authoritative docs was left out.

| Plan Document | Systems Covered | Verified Files |
| :--- | :--- | :--- |
| `TechnicalPlan/01 - Hex Grid` | Axial/Cube coords, 90×150 grid, HexTile zones, multi-hex raycasting, soft stacking (2/hex), tether leash, last-hit loot | `grid/*`, `pathfinding/TetherSystem.ts`, `monsters/LootDrops.ts` |
| `TechnicalPlan/02 - Pathfinding & Movement` | Flow Field, drag-vector painting, wall-sweep formation, independent stop ranges, exact 5 units/platoon (4 platoons / 20 cap), vector chevrons & convex hulls | `pathfinding/*`, `input/VectorPainting.ts` |
| `TechnicalPlan/03 - Command & Smart-Tactics` | `ownerId` filter, `preventDefault`, 4-platoon hotkeys (`1–4`), Stances (`A`,`D`,`R`), Focus Directives (`Z`,`X`,`C`), 55% Ally HP Peel | `command/*`, `input/HotkeyMap.ts` |
| `TechnicalPlan/04 - Card & Trap Engine` | 2:30 cadence, extra buys 100/250/500/1000, 6-card hand, 1.2s fuse, 20s scout reveal, 0.3s debounce, drag-cancel, 15s action overflow buffer, explicit scopes | `cards/*`, `traps/*`, `ui/CardDrawer.ts` |
| `TechnicalPlan/05 - Structures & Shroud` | 3000/4500 HP segments, 500/750/1000 tiers, damage retention, 50% refund, 10s rubble, leak-free shroud fade, hotseat perspective, Demolition Sapping (-70% decays 5%/15s), Desperation Battery | `structures/*`, `facilities/FacilityUpgrade.ts`, `RubbleTimer.ts`, `network/HotseatManager.ts` |
| `TechnicalPlan/06 - Match Game Loop` | `performance.now()` clock, phase enum, mode pause, victory sequence, 3 In-Match Blessing Rites (0:00, 5:00, 10:00), 10k telemetry cap | `core/*`, `telemetry/*` |
| `TechnicalPlan/07 - AI Commander Bot` | Utility FSM, extra-buy cap, 3-hex trap spacing, spell heatmap, surrender threshold | `ai/*`, `cards/ExtraBuySystem.ts` |
| `TechnicalPlan/08 - Audio & Render` | Y-sort, Retina scaling, 2-hex culling, HP bar colors, 3:5 minimap, 150-particle pool, BitmapText, 16-voice pool, panning, preload bar | `render/*`, `audio/*` |
| `TechnicalPlan/09 - UI & Atlases` | 3 atlases + ui frames + gilded font, UI component tree, state binding, TacticalWorldOverlayLayer | `ui/*`, `public/assets/*`, `AtlasLoader.ts` |
| `TextPlan - Castle & Defensive Layers` | Outer 5×6 @ 3000, Inner 5×6 @ 4500, Core 4500, 10-row courtyard / 8-row keep in 48-column castle, +1 wall range bonus, Demolition Sapping, Castle Core Arcane Obelisk tethered to Arcane Barrier/Sanctuary | `structures/*`, `BalanceConfig.ts` |
| `TextPlan - Match Timeline & Phases` | 18-min cap, Opening→Expansion→Siege→Overtime (3 Blessing Rites at 0:00, 5:00, 10:00), 7 draw ticks, 15s action overflow buffer, +50% income, guaranteed Intel, tie-breaker = cumulative wall damage | `core/*`, `cards/*`, `structures/BreachSystem.ts` |
| `TextPlan - Board & Map Grid` | 30×50 jungle A/B, 90×50 central battlefield, centered 48×20 north/south castles, four blocked cloud corners, 5-hex leash, last-hit +80 XP/+100g, 3 Boss Objectives (2:00 Tuskgod, 8:00 Stormwing, 12:00 Obsidian Emperor) with >50% damage contest rule | `grid/ZoneManager.ts`, `monsters/JungleBoss.ts` |
| `TextPlan - Commander & Platoons` | 4 Platoons of 5 units (20 cap), Hotkeys 1–4, Stances (A/D/R), Focus (Z/X/C), Role Diversity Bonus, consolidated roster + graveyard HUD | `command/*`, `ui/ConsolidatedRosterPanel.ts`, `GraveyardQueue.ts` |
| `TextPlan - Facility System` | 6 Inner Wall Slots (4 outer / 2 inner), 3×3, **18 facilities (6 Production + 6 Combat + 6 Buff)**, 3 tiers, 30-hex combat range cap, duplicate rule (100%/50%), 50% refund, 30s respawn | `facilities/*`, `data/FacilityData.ts` |
| `TextPlan - Card System (25 Cards)` | 5 categories × 5, free cast, no-duplicates, discard reshuffle, deck locks, Scout 10s protocol, trap invisibility, explicit targeting scopes | `cards/*`, `data/CardData.ts` |
| `TextPlan - UI HUD & Colors` | Top bar, 4-platoon consolidated roster (monochrome skill-readiness), graveyard, selected panel, stances, minimap 180×300, card drawer, trash, color tokens, fonts | `ui/*` |
| `Data/UnitRoster (80 units)` | 8 classes, stat framework, armor formula, seconds-based cooldowns (no energy), CC DR 6s, structure multipliers, Slayer's Mark, 4×5 platoon synergy | `data/UnitData.ts`, `objects/Unit.ts`, `combat/*` |
| `Data/ItemList (35 items)` | 7 materials, 25 craftables + 6 Divine + 4 Satchels = 35 total, 1 item/unit (Grand Armory unlocks 2nd slot for Leader), Arsenal lossless, 15s facility craft, Safe-Zone equip baseline | `items/*`, `data/ItemData.ts` |
| `Data/BlessingList (150 blessings)` | 5 tiers × 30, 3 In-Match Blessing Rites (0:00, 5:00, 10:00), 4 choices, smart tailoring, risk/gamble augments, term dictionary | `blessings/*`, `data/BlessingData.ts` |
| `Data/Monster (21 monsters)` | 7 families × 3 variants, 40/55/90s respawn, drop copies/rarity, pack abilities, kill-time standards | `monsters/*`, `data/MonsterData.ts` |
| `TextPlan - Numerical Baseline` | Structure HP table, damage retention formula, card costs, overtime ramp | `config.ts`, `BalanceConfig.ts` |
| `TextPlan - Unit Model Art Direction` | 8-directional isometric sprite states (IDLE/MARCH/ATTACK/ABILITY/HIT/CAST_CHANNEL/DEATH/REVIVE) | `render/AnimationController.ts`, `assets/units_atlas.json` |

**Audit verdict: PASS (revised) — every current system maps to files above. Legacy references (energy system, Supply-Depot-era facilities, 6-family materials, 15-item data, 5-state animations) were purged from this document as superseded. Known gaps from the full-vault scrutiny (e.g. TP/08 minimap 3:5 portrait vs 5:3 board, TP/10 stale index) are tracked separately and do not live in this file.**

---

*End of Structure.md — Aurolith Game File Structure*
