---
tags: [Units, Commander, Controls, InputLock, LiveArmyHUD, PlatoonMerge]
type: System Core
---

# ⚔️ COMMANDER CONTROLS, HUD & PLATOON SYSTEM SPECIFICATION

> [!NOTE]
> Commanders use **Shift + Click** selection, hotkey Macro Commands (`A`,`R`,`J`,`D`,`G`), **`Ctrl + G` Platoon Merging**, Player Ownership Input Locks, and the **Live Army & Graveyard HUD Panel**.

---

## 1. 🔒 Player Ownership Input Lock (`ownerId` Filtering)

Mouse click selection is strictly filtered by entity ownership:

- **Friendly Entity Click:** Selects friendly unit/platoon (`ownerId === activePlayer.id`).
- **Enemy Entity Click:** Issues an immediate **ATTACK** target command for the currently selected platoon (prevents commanders from controlling opposing units).

---

## 2. 🖱️ Contextual Mouse Controls & Platoon Vector Painting

- **Left-Click + Drag on Ground (Platoon Box):** Draws a selection box that selects **Platoons only** (cannot micro-select individual frontline units, preserving auto-action AI integrity).
- **In-Platoon Tactical Swap / Emergency Fallback:**
  - Satisfies the "save my dying carry" instinct without breaking the zero-micro platoon invariant:
  - **Right-Clicking a living unit's hex or portrait** in the Roster Panel triggers an immediate **In-Platoon Tactical Swap** (3.0s cooldown per unit):
    1. **EHP Role-Weighted Scoring:** Advancing defender is chosen by $\text{EHP} \times W_{\text{Role}}$ ($W_{\text{Tank}}=1.6, W_{\text{Fighter}}=1.3, W_{\text{Support}}=0.7, W_{\text{Mage/Marksman}}=0.2$), guaranteeing an off-tank or fighter steps up before a fragile squishy.
    2. **0.3s Physical Dash:** Advancing unit dashes forward to lock the frontline hex, while the carry slides back 1 rank with 0.3s aggro immunity.
    3. **Aggro Drop:** Attacking melee enemies immediately drop target lock from the retreating carry and lock onto the newly advanced defender.
    4. The unit strictly remains part of the 5-man platoon.
- **Strict Platoon Assignment (No Loose Units):** All 8 classes operate strictly within designated platoons (up to 5 units each).
- **Shift + Left-Click + Drag:** Paints a **Custom Vector Movement Path** for the currently selected platoon.
- **Right-Click on Hex / Target:** Issues an immediate **Quick Move / Attack Command** for the selected Platoon.
- **Middle-Click / Right-Click Drag on Canvas:** Zero-slip pan navigation across the 90×150 hex board.

---

## 3. 📊 Live Army & Graveyard Status HUD Panel

- **Live Unit Status:** Real-time unit portraits and HP bars for active units.
- **Graveyard Queue:** Displays portraits of fallen units and remaining respawn cooldown timers.
- **Card Target Integration:** Casting *Undying Will* opens direct portrait selection on the Graveyard queue.

---

## 4. ⚔️ Platoon Management, Stances & Macro Hotkeys

- **4-Platoon Structure (Strict 4×5 Invariant):** Exactly **4 Platoons of 5 Units** (Hotkeys `1`, `2`, `3`, `4` select Platoons 1–4; `Shift + 1-4` multi-selects; double-tapping `1`–`4` or pressing `F1`–`F4` snaps camera to that platoon). Total army cap is **20 units**.
- **Platoon March Speed (Anchor Pace):** Platoons march at the speed of their slowest frontline anchor $+3\%$ per skirmisher, maintaining formation shape. Individual sprint speeds unlock during combat and backline dives.
- **Customizable 3-Rank Formation Grid Matrix:**
  - Each platoon features a customizable 3-rank grid template (`<><><>` / `<><><><>` / `<><><>`):
    - **Rank 1 (Vanguard):** 1–3 slots (Solo Tank center, or dual tanks).
    - **Rank 2 (Midline/Flank):** 1–4 slots (Fighters, Assassins on outer wings).
    - **Rank 3 (Rearguard):** 1–3 slots (Mages, Marksmen, Support safely nested behind frontline cover).
  - Visualized on the battlefield by a **subtle translucent white/grey formation frame hull**.
- **Dynamic Accordion Chokepoint Funneling:** In 1-hex and 2-hex breaches, the 3 ranks automatically collapse into a single-file column ordered by initiative (Tank point, Ranged rear), then automatically re-fan into the player's custom 3-rank positions upon clearing.
- **Camera Snapping Hotkeys:**
  - `Spacebar`: Snaps camera to the latest critical combat alert (wall breach or squad ambush).
  - `F1`–`F4`: Snaps camera directly to Platoon 1–4.
  - `H`: Snaps camera to Imperial Castle / Core.
- **`Ctrl + G` (Platoon Consolidate):** Rebalances fallen or wounded platoons to restore full 5-unit squads.
- **Observable Platoon Stances:**
  - **`A` (Aggressive / Push Stance):** Units march along vector or toward enemy structures, prioritize structures and low-HP carries, skills trigger aggressively.
  - **`D` (Defensive / Peel Stance):** Units tether tightly within 3 hexes of platoon anchor, trigger **55% Ally HP Peel** against enemy assassins/divers, hold chokepoints and castle walls.
  - **`R` (Retreat / Regroup Stance):** Break engagement, stop attacks against units, camps and structures, and fall back along the reverse vector to the inner courtyard or designated rally hex. Brush concealment still applies while regrouping.
- **Focus Directives (Instant Retargeting & Scouting):**
  - **`Z` (Frontline Sweep):** Focus nearest enemy melee/tanks.
  - **`X` (Backline Dive):** Focus enemy marksmen/mages (Assassins break formation at full sprint).
  - **`C` (Siege Target):** Prioritize wall segments, gates, and facilities.
  - **`J` (Outrider / Jungle Scout):** Platoon scout/assassin advances 3–4 hexes ahead to project +2 vision cone through canopy, vaulting back if ambushed.
- **Flexible Solo Platoon Option:** Players can place 1 solo Assassin in Platoon 4 (`[4]`) to create a dedicated high-speed river roamer with 0 HUD bloat.

---

## 5. 🧬 Platoon Composition Bonus (5-Man Role Diversity)

> **Basic stats** = Health · Attack power / Magic power · Attack speed · Physical / Magic defense. The composition bonus multiplies all of them for **every unit in the platoon** (multiplicative with other buffs).

A platoon's bonus scales with the number of **distinct roles** (Tank, Bruiser/Fighter, Mage, Marksman, Support/Artisan):

| Distinct Roles in Platoon | Composition Archetype | Bonus to Basic Stats & Tenacity |
| :---: | :--- | :--- |
| **1–2** | Single-class blob / Duo | **+0%** (Baseline) |
| **3** | Skirmish Core (e.g., 2 Tank, 2 Marksman, 1 Mage) | **+5% All Stats** |
| **4** | Balanced Lineup (e.g., 2 Tank, 1 Fighter, 1 Marksman, 1 Support) | **+12% All Stats** |
| **5** | **Rainbow Archetype (Full MOBA 5-Man)** | **+22% All Stats + 10 Tenacity** |

**Rules:**
- **Role** = one of the 8 classes (Fighter, Tanker, Mage, Marksman, Support, Siege, Artisan, Assassin). The bonus counts **distinct roles only**.
- Applies to **every unit in the 5-man platoon**.
- **Unique Champion Limit:** Max 1 copy of any named champion across the entire 20-unit army.
- **Anti-meta intent:** Rewards diverse MOBA-style compositions and heavily taxes homogeneous deathballs.
- Canonical definition: `Data/BlessingList/00` §4.5.

---

## 6. 🎖️ The Commander's Role: Pure Cards & Platoon Strategy

> **Core Philosophy:** The commander is an off-board grand strategist, not an on-board combat avatar or god-power button. All tactical intervention flows strictly through:
> 1. **Command Cards:** The 25 free-to-cast tactical cards drawn into the 5-card hand + **Dedicated Crown / Momentum Slot** (Hotkey `G`).
> 2. **Platoon Strategic Directives:** Vector waypoint path painting for the 4 platoons (`1`–`4`), 3 Observable Stances (`[A]`, `[D]`, `[R]`), and 3 Focus Directives (`[Z]`, `[X]`, `[C]`).
> 3. **Mercenary Guild & Academy Training:** Deterministic champion recruitment across class boards (zero duplicate rolling) and strategic direct investment (`100g → +100 XP` via `[F]`) to power-level priority anchors or carries to Level 2 and Level 3 Paragon status.
> 4. **Imperial Blessings & Facilities:** Drafting upgrades across the 3 In-Match Rites and building Courtyard facilities.
>
> **No Hero Avatar / No Active God-Power:** There is no separate "Commander Active Skill" cooldown button on the HUD. This keeps the interface clean, eliminates redundant ability clutter, and focuses all player APM on platoon maneuvering, engagement angles, card timing, and macro resource allocation. Full economy and guild spec: `Data/Economy/02 - Recruit Shop & Commander Level.md`.

