---
tags: [Rules, Timeline, Phases, Overtime, PauseEngine, VictorySequence]
type: System Core
---

# ⏱️ MATCH TIMELINE & PHASE PROGRESSION

> [!NOTE]
> Matches are capped at a strict 18-minute maximum duration (excluding the untimed Prep Phase). Card draws occur on a precise 2:30 cadence across 7 ticks.

---

## 1. Timeline Overview

```
[ Prep Phase ] (Untimed ~60s) --> 5-Start Pool Pick, Initial Platoon Setup
     |
0:00 +---------------------------------------------------------+
     | OPENING PHASE (0:00 - 5:00) | Draws: 0:00, 2:30          |
     | 🎴 BLESSING RITE 1: OPENING (0:00 - 3 Tailored Choices)   |
     | Eco setup, Jungle farming. Siege activation locked.      |
5:00 +---------------------------------------------------------+
     | EXPANSION PHASE (5:00 - 10:00) | Draws: 5:00, 7:30       |
     | 🎴 BLESSING RITE 2: EXPANSION (5:00 - 3 Tailored Choices)|
     | Contest Jungle, Wall Skirmishes, Siege Online.           |
10:00+---------------------------------------------------------+
     | SIEGE PHASE (10:00 - 15:00) | Draws: 10:00, 12:30        |
     | 🎴 BLESSING RITE 3: SIEGE (10:00 - 3 Tailored Choices)   |
     | Primary Combat Window, Outer & Inner Wall Breaches.       |
15:00+---------------------------------------------------------+
     | OVERTIME PHASE (15:00 - 18:00) | Draw: 15:00            |
     | Eco Ramp (+50% income), No Castle Regen, Guaranteed Intel.|
18:00+---------------------------------------------------------+
     | TIE-BREAKER: Cumulative Wall Damage Comparison          |
```

---

## 2. 🎴 15-Second Action Overflow Buffer & Card Cadence

- **2:30 Cadence Draw:** 3 cards drawn free every 2:30 (0:00, 2:30, 5:00, 7:30, 10:00, 12:30, 15:00). Hand capacity is 6 cards max.
- **Milestone Bonus Draws:** +1 Card drawn on First Outer Wall Breach, Jungle Boss Slay, and 10:00 Siege Phase entry.
- **15-Second Action Overflow Buffer (Q4 Confirmed):** When cards are drawn while holding a full hand (6 cards), excess cards float in a **15-Second Action Overflow Buffer** above the dock. The commander can cast it immediately via floating reticle or swap it into hand without interrupting high-intensity micro or popping disruptive modal windows.
- **Buffer Discard:** If the 15s timer expires without casting, the card safely discards to the Discard pile.
- **Overtime Eco Ramp:** During Overtime (15:00 – 18:00), passive income is increased by **+50%**.
- **Guaranteed Intel Draws:** Every Overtime cadence draw guarantees at least **1 Intelligence & Scouting card** (the "Free Scout Cards" bonus).

---

## 3. ⏸️ Mode-Specific Pause Engine

- **Single-Player vs. AI Mode:** Opening the Pause Menu **completely freezes** the match clock, 2:30 card tickers, unit movement, and AI loops.
- **1v1 Multiplayer / Hotseat Mode:** Opening the Pause Menu displays a **transparent overlay** while the match clock, tickers, and unit combat continue running in the background (preventing pause-abuse).

---

## 4. 🏆 Victory / Defeat Sequence & Surrender

- **Core Collapse / Surrender:** Core HP (4,500 HP) reaching 0 or clicking "Surrender" immediately pauses match loops, triggers a **Victory/Defeat Cinematic Banner**, and displays post-match statistics.

---

## 5. ⚖️ Tie-Breaker (At 18:00 Boundary)

> [!WARNING]
> If 18:00 is reached with both Castle Cores still standing, the winner is decided by **Cumulative Wall-Layer Damage Dealt** across the entire match.

If cumulative wall-layer damage is exactly equal, compare **remaining Castle Core HP**; the player with more remaining core HP wins. If core HP is also equal, the match is a **draw**. This keeps the 18:00 limit deterministic without adding sudden death.
