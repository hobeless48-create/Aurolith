---
tags: [TechnicalPlan, CardEngine, Cadence, Traps, TargetHighlighting, OverflowSlot]
type: Technical Specification
---

# 🃏 04 - CARD SYSTEM, DRAW TICKER & TRAP MANAGER

> 2:30 cadence timer, 6-card hand state, 0-gold free cast execution, 1.2s trap fuses, 15s overflow slots, and 0.3s cast debounce.

---

## 1. ⏱️ 2:30 Cadence Ticker, Milestone Draws & Extra Buy Escalation

- **Free Cadence Draw:** Draws 3 cards every 2:30 (0:00, 2:30, 5:00, 7:30, 10:00, 12:30, 15:00). Drawn cards cost **0 Gold** to cast from hand.
- **Milestone Bonus Draws:** The first outer wall breach grants **both players +1**; a jungle boss slay grants the slaying team **+1**; the 10:00 Siege entry grants **both players +1**. These use the same draw path as cadence and extra-buy cards. See the authoritative `TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md`.
- **Hand and overflow:** The normal hand holds **6 cards**. Each drawn card fills a free hand slot; excess cards each enter a **15-second Action Overflow Buffer** above the dock. The player may cast or swap an overflow card. Expired cards enter the discard pile. Process simultaneous draws in deterministic order; do not silently overwrite a held card. Pause overflow countdowns while a Blessing Rite drawer is open, as specified for Rite overflow protection.
- **Extra Buy Costs:** Escalating gold costs (`100 / 250 / 500 / 1,000 Gold`) to buy one extra card per purchase. Bought cards follow the same hand/overflow rule. There is no separate permanent Crown slot.

---

## 2. 🪤 Simulation-Tick Trap Manager & Grounded Detonation Trigger
 
```typescript
class TrapManager {
  private activeTraps: Map<string, ActiveTrap> = new Map();

  // Triggered on deterministic sim tick (e.g. 10 Hz)
  triggerTrap(trap: ActiveTrap, triggeringUnit: Unit, currentTick: number) {
    trap.isArmed = true;
    createTrapWarningVFX(trap.targetHex); // Audio click + visual flash

    // Apply immediate Grounded / Snare on the triggering unit so it cannot simply walk out of blast
    triggeringUnit.applyDebuff({ type: 'SNARE', slowPercent: 0.40, durationTicks: 12 });

    // Schedule detonation deterministically on the tick timeline (1.2s = 12 ticks at 10 Hz)
    trap.detonationTick = currentTick + 12;
  }

  update(currentTick: number, grid: Map<string, HexTile>) {
    for (const [trapId, trap] of this.activeTraps.entries()) {
      if (trap.isArmed && currentTick >= trap.detonationTick) {
        this.detonateAoETrap(trap, grid);
        trap.targetHex.trapId = null;
        this.activeTraps.delete(trapId);
      }
    }
  }

  revealTrapsTemporarily(scoutArea: HexTile[], currentTick: number) {
    scoutArea.forEach(hex => {
      if (hex.trapId) {
        const trap = this.activeTraps.get(hex.trapId);
        if (trap) {
          trap.isRevealedToEnemy = true;
          trap.revealExpiryTick = currentTick + 200; // 20s = 200 ticks
        }
      }
    });
  }
}
```

---

## 3. 🎯 Card Targeting Scopes, Cast Ranges & Line-of-Sight

To prevent cards from feeling like generic global cheats, all combat and tactical cards evaluate strict targeting scopes:

1. **Platoon-Targeted (`Recall`, `Forced March`, `Phalanx Formation`, 5-man `Shadow Flank`):**
   - Must be cast onto a specific friendly 5-man Platoon (by clicking the on-field Platoon hull or Roster Panel card). Buffs only apply to units in that designated platoon.
2. **Ground Hex AoE (`Catapult Volley`, `Nullifying EMP`, `Landmine`):**
   - **`Catapult Volley`:** 3-hex radius AoE within a 16-hex line-of-fire from any friendly structure/platoon.
   - **`Nullifying EMP`:** 3-hex radius AoE within 12 hexes of active friendly vision. Silences enemies for 3.0s and shatters temporary shields.
   - **`Emergency Barricade`:** Deploys a 600 HP obstacle inside a breached wall hex for 20s within Courtyard perimeter (15 hexes).
   - **Requires Active Vision:** Cannot blind-cast ground AoE strikes into unexplored Fog of War.
3. **Structure-Targeted (`Demolition Charge`, `Arcane Shield Wall`):**
   - Must target an individual 6-hex Wall Segment. *Demolition Charge* requires a friendly unit in melee contact (Range 1).
4. **Target Highlighting & Drag Cancellation:**
   - Valid targets highlight in **Gold (0xFFD700)** with exact hex radius outlines; invalid/out-of-range hexes highlight in **Red (0xFF4444)**.
   - Dragging an active card back into the hand drawer cancels the cast without consuming the card.
   - Enforces a 0.3-second cast debounce cooldown between card cast executions to suppress accidental double clicks.
5. **Scout Board Re-Entry Spatial Search Fallback:**
   - When a unit completes a 10.0s *Scout* reconnaissance mission, the engine attempts to place it back onto its origin tile. If that tile or the primary courtyard rally tile is blocked by obstacles, buildings, or units, the engine executes a deterministic **axial ring spiral search ($R = 1 \dots 3$)** around the origin to locate the nearest walkable unblocked tile, strictly preventing null coordinate exceptions.
