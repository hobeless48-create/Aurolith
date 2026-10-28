---
tags: [TechnicalPlan, InputControls, BrowserShortcuts, MacroCommands, SmartTactics, InputLock]
type: Technical Specification
---

# 🕹️ 03 - COMMAND PRIORITY QUEUE & SMART-TACTICS AI

> Browser keyboard handling, Shift+Click selection, platoon stances/directives, Gather (`G`), six card keys (`Q/W/E/T/Y/U`), and Smart-Tactics auto-cast AI.

---

## 1. 🔒 Player Ownership Input Lock (`ownerId` Filtering)

Mouse click selection is strictly filtered by entity ownership:

```typescript
class PlayerOwnershipInputFilter {
  selectEntity(entity: Entity, activePlayer: CommanderState): boolean {
    if (entity.ownerId === activePlayer.id) {
      activePlayer.setSelectedEntity(entity);
      return true;
    } else {
      if (activePlayer.hasSelection()) {
        activePlayer.issueAttackCommand(entity);
      }
      return false;
    }
  }
}
```

---

## 2. ⌨️ Native Browser Shortcut Prevention (`preventDefault`)

Strategy hotkeys work across the match interface except while focus is in a text, editable, or select field. `Space` remains available to jump to the latest combat alert; `O` pauses/resumes local single-player. `P` toggles the floating keyboard-help panel and does not issue a simulation command. A Rite uses `1–3` and `R` while its offer is active:

```typescript
class KeyboardInputController {
  private registeredKeys: Set<string> = new Set([
    'Digit1', 'Digit2', 'Digit3', 'Digit4', // Platoon selection (1-4)
    'KeyA', 'KeyD', 'KeyR',                 // Macro Stances ([A], [D], [R])
    'KeyZ', 'KeyX', 'KeyC',                 // Focus Directives ([Z], [X], [C])
    'KeyQ', 'KeyW', 'KeyE', 'KeyT', 'KeyY', 'KeyU', // Six hand slots
    'KeyG',                                 // Gather command
    'KeyF',                                 // Academy Training (+100 XP / 100g)
    'KeyO',                                 // Local single-player pause only
    'KeyP',                                 // Toggle floating keyboard help
    'Tab',                                  // Toggle Collapsible Side Panels
    'Space'                                 // Jump to high-priority combat alert
  ]);

  onKeyDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (!gameSurfaceOwnsKeyboardFocus()) return;
    if (this.registeredKeys.has(event.code) || (event.ctrlKey && event.code === 'KeyG')) {
      event.preventDefault();
      event.stopPropagation();
      this.handleGameHotkey(event.code, event.shiftKey, event.ctrlKey);
    }
  }
}
```

---

## 3. 🤖 Smart-Tactics Auto-Skill State Machine (Zero Micro)

Units continuously evaluate local conditions during tick loops:

> **Smart-Tactics is illustrative only.** The `SmartTacticsEvaluator` is a decision hook per evaluation tick; the actual per-platoon order semantics (explicit order > reaction > macro posture > idle) are canonically defined in `TextPlan/09 - Glossary of Game Terms & Attributes.md` §8 (Command Priority Queue).

```typescript
// Illustrative example — a real modern Fighter kit (Vanguard Marrow, `Data/UnitRoster/Final - Fighters.md`).
class FighterSmartTactics implements SmartTacticsEvaluator {
  evaluate(unit: Unit, localEnemies: Unit[], localStructures: Structure[]): boolean {
    if (unit.skillCooldown > 0) return false;
    const enemiesInMelee = localEnemies.filter(e => hexDistance(unit.tile, e.tile) <= 1).length;
    if (enemiesInMelee >= 2 || unit.hpRatio < 0.6) {
      unit.castSkill('CYCLONE_SWEEP'); // 60% ATK/s spin for 3s, 8s CD — see roster kit
      return true;
    }
    return false;
  }
}
```

---

## 4. ⚔️ The 3 Observable Stances & Focus Directives

To provide deep strategic commander agency without micro-management stress, platoons operate under **3 Observable Macro Stances** combined with **3 Focus Directives**:

### A. The 3 Macro Stances
- **`[A]` Aggressive (Flank / Engage):** When no explicit order or higher-priority reaction is active, the platoon autonomously hunts the nearest valid enemy within **12 hexes of its anchor**. A valid target is alive, visible to its owner, detectable if concealed in brush, and reachable by path. Select by anchor-to-enemy hex distance, then unit ID for ties; route to the nearest reachable engagement hex adjacent to the target. Prioritizes forward lane pressure and aggressive encirclement.
- **`[D]` Defensive (Formation Hold & 55% Ally Peel Priority):** Platoon holds its anchor hex and stays in tight formation.
  - **Peel Trigger:** If any enemy unit attacks a friendly ally below **55% Max HP** within 4 hexes, Tankers and Fighters immediately break current targets to body-block, taunt, or stun the diver.
  - **Assassin Reaction:** Instant priority reaction against Assassin backline dives, turning defensive positioning into an active anti-assassination counter.
- **`[R]` Retreat (Disengage to Core):** The platoon stops attacking enemy units, camps and structures, cancels active skill channels, and routes to its Castle Core. Friendly units gain **+50% movement speed during the return march until entering their own Outer Courtyard perimeter**, matching `TextPlan/01 - Core Rules & Mechanics/Castle & Defensive Layers.md` §3. The Retreat stance remains responsible for disengagement even when a waypoint overrides its return route.

### B. The 3 Focus Directives
- **`[Z] Frontline Melt:`** Focus fire down the closest enemy frontline Tankers / Fighters.
- **`[X] Backline Hunt:`** Prioritize highest-DPS backline Marksmen / Mages.
- **`[C] Objective Siege:`** Prioritize Wall segments, Courtyard Facilities, and the enemy Core.

### C. Hotkey Architecture
- `1`, `2`, `3`, `4`: Select Platoon 1, 2, 3, or 4.
- `A`, `D`, `R`: Switch selected platoon's Stance.
- `Z`, `X`, `C`: Switch selected platoon's Focus Directive.

---

## 5. 🎛️ Schmitt-Trigger Peel Hysteresis State Machine

To prevent high-frequency "target thrashing" (where Tankers oscillate every tick between peeling a diver and attacking their previous frontline target as an ally's HP fluctuates around 55%), the Defensive Guard peel logic incorporates a **Dual-Threshold Schmitt-Trigger Hysteresis Band** with a minimum lock duration:

```typescript
class DefensivePeelController {
  private static readonly PEEL_TRIGGER_HP   = 0.55; // Enter peel state
  private static readonly PEEL_RELEASE_HP   = 0.65; // Exit peel state (Hysteresis Band Δ = 10%)
  private static readonly CRITICAL_HP_OVERRIDE = 0.20; // Lethal threat immediately breaks minimum lock
  private static readonly MIN_LOCK_TICKS     = 25;   // 2.5s standard minimum lock at 10 Hz

  private currentPeelTarget: Unit | null = null;
  private protectedAlly: Unit | null = null;
  private lockTimerTicks: number = 0;

  updatePeelState(tanker: Unit, platoonAllies: Unit[], localEnemies: Unit[], currentTick: number) {
    // 1. Dynamic Priority Override Check (ADR-003, Jev Confirmed 49%):
    // Check if another ally is under lethal burst (< 20% HP) or an enemy is channeling an ultimate
    const criticalAlly = platoonAllies.find(a => !a.isDead && a !== tanker && (a.hp / a.maxHp) < DefensivePeelController.CRITICAL_HP_OVERRIDE);
    const channelingEnemy = localEnemies.find(e => !e.isDead && e.isChanneling && hexDistance(tanker.tile, e.tile) <= 3);

    // 2. If currently locked onto a peel target, evaluate release and override conditions
    if (this.currentPeelTarget && this.protectedAlly) {
      this.lockTimerTicks--;

      const allyDied = this.protectedAlly.isDead;
      const diverDied = this.currentPeelTarget.isDead || !this.currentPeelTarget.isTargetable;
      const allyRecovered = (this.protectedAlly.hp / this.protectedAlly.maxHp) > DefensivePeelController.PEEL_RELEASE_HP;
      const lockExpired = this.lockTimerTicks <= 0;
      const shouldOverride = (criticalAlly && criticalAlly !== this.protectedAlly) || channelingEnemy;

      if (allyDied || diverDied || (allyRecovered && lockExpired) || shouldOverride) {
        // Release peel lock
        this.currentPeelTarget = null;
        this.protectedAlly = null;
      } else {
        // Maintain sticky target lock
        tanker.target = this.currentPeelTarget;
        return;
      }
    }

    // 3. Priority Evaluation: High-threat overrides take immediate priority
    if (channelingEnemy) {
      this.currentPeelTarget = channelingEnemy;
      this.lockTimerTicks = DefensivePeelController.MIN_LOCK_TICKS;
      tanker.target = channelingEnemy;
      return;
    }

    // 4. Standard threshold evaluation
    const targetAllyPool = criticalAlly ? [criticalAlly] : platoonAllies;
    for (const ally of targetAllyPool) {
      if (ally === tanker || ally.isDead) continue;

      const hpRatio = ally.hp / ally.maxHp;
      if (hpRatio < DefensivePeelController.PEEL_TRIGGER_HP) {
        // Find enemy unit currently attacking this wounded ally within 4 hexes
        const diver = localEnemies.find(e => e.target === ally && e.isTargetable && hexDistance(tanker.tile, e.tile) <= 4);
        if (diver) {
          // Trigger peel lock
          this.currentPeelTarget = diver;
          this.protectedAlly = ally;
          this.lockTimerTicks = DefensivePeelController.MIN_LOCK_TICKS;
          tanker.target = diver;
          createAggroLaserLeash(tanker, diver, 0x06B6D4); // Cyan protective leash
          break;
        }
      }
    }
  }
}
```

### Mathematical Guarantee
- **Limit Cycle Suppression:** The $\Delta = 10\%$ HP gap between entry ($55\%$) and exit ($65\%$) ensures incoming healing over time (HoT) or small damage ticks cannot trigger repeated state transitions within the control loop ($\text{Frequency} < 0.4\text{ Hz}$).
- **Guaranteed Peel Utility:** The 2.5-second lock timer guarantees that CC spells (taunts, stuns) and body-blocking collisions execute fully to protect backline Marksmen/Mages.


