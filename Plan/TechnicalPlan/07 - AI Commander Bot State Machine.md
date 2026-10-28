---
tags: [TechnicalPlan, AI, Bot, Heuristics, SpellHeatmap, TrapSpacing]
type: Technical Specification
---

# 🤖 07 - AI COMMANDER BOT STATE MACHINE

> Heuristic utility decision tree governing the 1v1 AI Commander Bot for jungle farming, facility placement, wall pushes, spell heatmaps, and card buys.

---

## 1. 🤖 AI Utility State Machine & Heuristics

```typescript
enum AIState {
  ECONOMIC_BUILDUP = 'ECONOMIC_BUILDUP',
  JUNGLE_FARMING   = 'JUNGLE_FARMING',
  WALL_DEFENSE     = 'WALL_DEFENSE',
  WALL_ASSAULT     = 'WALL_ASSAULT'
}
```

- **4-Platoon Role Assignment:**
  - **Platoon 1 (Imperial Amber - Frontline Anchor):** Assigned to Central Mid-Lane. Operates in `[A]` (Aggressive) when pushing, or `[D]` (Defensive Guard) when holding wall breaches. Builds toward 5 distinct roles (+22% stats).
  - **Platoon 2 (Azure Cyan - Objective & Flank):** Roaming squad. Contests neutral camps and maneuvers through Jungle A/B to execute pincer flanks against overextended enemies.
  - **Platoon 3 (Crimson Ruby - Siege Spearhead):** Heavy damage and siege artillery. Deployed during `WALL_ASSAULT` with `[C] Objective Siege` directive.
  - **Platoon 4 (Emerald Jade - Tactical Reserve / Courtyard Guard):** Defends Courtyard facilities, intercepts Assassins, and reinforces whichever lane is breaking.

- **Stance Utility Scoring & Hysteresis Equations:**
  Every 1.0s (10 ticks), the AI evaluates a continuous utility score for each platoon:
  $$U_{\text{Retreat}} = (1.0 - \overline{\text{HP}}_{\text{platoon}}) \times 1.4 + \left(\frac{\text{EnemyCount}_{R \le 6} - \text{AllyCount}_{R \le 6}}{5}\right) \times 0.5$$
  - **Hysteresis Band:** 
    - Trigger `[R] Retreat` if $U_{\text{Retreat}} > 0.75$.
    - Return to `[D] Guard` or `[A] Attack` only when $U_{\text{Retreat}} < 0.35$ ($\Delta = 0.40$ hysteresis gap prevents thrashing).

- **Focus Directive Evaluation:**
  - If opponent fields 3+ Marksmen/Mages: AI switches attacking platoons to `[X] Backline Hunt`.
  - If opponent fields 2+ Tankers: AI switches to `[Z] Frontline Melt` and equips *Breachfang* (+50% shield damage).
  - When within 4 hexes of an intact enemy Wall segment or during Demolition Sapping: AI switches to `[C] Objective Siege`. If Arcane Obelisk is active, AI directs Platoon 2 to eliminate the powering *Arcane Barrier* facility first.

- **Mercenary Guild Recruitment Heuristics:**
  - The AI never gambles; it recruits directly from the Mercenary Guild boards (`60g base`).
  - Prioritizes **Role Diversity Bonuses**:
    - Seeks 3 distinct roles (+5% stats) by 3:00.
    - Seeks 4 distinct roles (+12% stats) by 7:00.
    - Seeks 5 distinct roles (+22% stats + 10 Tenacity) for Platoon 1 by 10:00.
  - Invests surplus gold into **Academy Training** (`100g -> +100 XP`) on its primary carry to reach L3 Paragon Evolution before the 10:00 Siege Rite.

- **Boss Objective Contesting:**
  - At **2:00** (*Gilded Tuskgod*), **8:00** (*Dreadmother Stormwing*), and **12:00** (*Obsidian Emperor*), the AI scouts the pit using *Scout* or *Falcon Recon*.
  - If enemy is engaging the boss and boss HP is $< 50\%$, dispatches Platoon 2 to steal with burst damage to claim the Contested Bounty.

- **Extra Card Buy Cap:** Capped at maximum **1 extra card buy per 5-minute phase**, and only when gold reserves exceed `500 Gold`.
- **3-Hex Trap Spacing:** Enforces a 3-hex minimum distance between active trap placements.
- **Spell Target Density Heatmap:** Evaluates a 3-hex radius density heatmap to pick the target hex encompassing the maximum combined count of enemy units and structures.
- **Surrender Threshold:** Triggers formal surrender if AI Core drops below 500 HP while facing 10+ surviving player units and 0 active AI military units (< 100 Gold).
