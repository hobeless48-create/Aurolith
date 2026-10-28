---
tags: [Roster, Overview, Classes, Tactics, UnitDesign]
type: Master Index
---

# ⚔️ UNIT ROSTER — OVERVIEW & CLASS DEFINITIONS

> **Aurolith Roster v1.4** — 80 unique playable units (10 per class × 8 classes) for the Gilded Empire **auto-battler** set in the high-empire guild-fantasy world of *Aurolith* (formerly General Gilded). The 7th class, **Artisan**, is the production role (`Final - Artisans.md`); the **8th class, Assassin**, is the jungle/scouting burst role (`Final - Assassins.md`).
>
> **🎮 GAME FORMAT: AUTO-BATTLER.** The player is **only a commander**. Units are never directly controlled — every unit moves, targets, and casts **fully autonomously** via deterministic AI rules (see `08 - Auto-Battler Integration & Full Re-Audit.md`). The commander's agency is limited to pre-battle formation placement, shop/economy, and an optional commander active skill. All unit abilities below are designed to be executed by AI, not by player input.
>
> **🛠️ TUNING: v1.3 applies the full Balance Audit & Tuning Implementation Plan** (`09`–`16`): seconds-based cooldowns replace mana, all units enter combat with skills off cooldown, skills activate by the 5-command priority hierarchy (A/R/J/D/G), the Tank Skill Timing Fix guarantees persistent defensive skill availability, and Artisans use alive-gated production auras (documented in `Final - Artisans.md`).

---

## 1. 🎯 The 8 Core Role Definitions

| # | Class | Core Identity |
| :--- | :--- | :--- |
| 1 | **Fighter** | Direct, frontline head-on combat with high burst and sustained melee damage. |
| 2 | **Tanker** | High durability, massive health pools, defensive scaling, and crowd control / debuff abilities to protect allied units. |
| 3 | **Mage** | Area-of-effect (AoE) magic damage to clear grouped enemy units. |
| 4 | **Marksman** | Long-range rear-line kiting, consistent sustained damage that relies on positioning to avoid engagement. |
| 5 | **Support** | Healing, buffing allied units, and enabling team survivability. |
| 6 | **Siege** | Unmatched raw damage output for structure / high-health target elimination — extremely slow movement and low durability, vulnerable if engaged. |
| 7 | **Artisan** | Production capability — reduces facility/item cost & time, repairs structures, and engineers the map (roads, barricades, emplacements). Near-zero combat; **occupies a combat slot as its cost**. |
| 8 | **Assassin** | Jungle play — strong scouting + high burst single-target damage. Fastest class; fragile; carries the universal **Slayer's Mark** monster-hunting secondary. |

---

## 2. 📊 Stat Framework (Shared Reference)

### 2.1 Tier Baselines

> **COST MODEL v2 (supersedes the Gold Cost column):** all 80 units now cost **one flat base price — 60g** — with a 2:30 escalation (+25%/tick, cap +150%) and a Resign refund (70%, 30s slot lock). Tier still gates **stats and shop odds only, never cost**. See `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md`.

| Tier | HP | ATK | Shop Odds |
| :--- | :--- | :--- | :--- |
| 1 (Common) | 450 – 550 | 45 – 55 | highest |
| 2 (Rare) | 600 – 750 | 55 – 70 | high |
| 3 (Epic) | 800 – 1,000 | 70 – 90 | mid |
| 4 (Legendary) | 1,050 – 1,300 | 90 – 115 | low |
| 5 (Mythic) | 1,350 – 1,600 | 115 – 140 | lowest |

> **How to read the baseline table (reconciliation note):** the HP/ATK bands above are the **reference band for the median class (Fighter: ×1.0 HP / ×1.2 ATK)** — Fighter units land inside their tier band by design (e.g. Marrow 700/T2, Grendal 950/T3, Kael 1,200/T4). Each other class shifts the band via its §2.2 modifier (e.g. Tanker HP ×1.8 → T1 target 810–990 … T5 2,430–2,880). **The Final per-class files are the final authority**; where a unit deliberately deviates from its class-adjusted band (Tanker HP was tuned to the "highest HP pools in the game" target, 950–2,100, rather than the formula), the deviation is flagged in that unit's file and accepted — the table guides design, the Final files define the game.

### 2.2 Class Stat Modifiers

| Class | HP | ATK | DEF | MR | Range | Move Spd | ASPD | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Fighter | ×1.0 | ×1.2 | mid | low–mid | 1 | 2.0 | 0.85–1.1 | Melee burst/sustain |
| Tanker | ×1.8 | ×0.75 | high | high | 1 | 1.4–1.7 | 0.5–0.6 | CC + debuff |
| Mage | ×0.85 | ×1.2 (AP) | low | mid | 3–4 | 1.7–1.9 | 0.6–0.8 | AoE, fragile |
| Marksman | ×0.8 | ×1.0 | low | low | 4–7 | 1.8–2.1 | 0.7–1.1 | Positioning DPS |
| Support | ×0.9 | ×0.55 | low–mid | high | 2–3 | 1.8–2.0 | 0.6 | Enabler |
| Siege | ×0.8 | ×1.4 | low | low | 2–9 | 0.7–1.3 | 0.3–0.6 | Structure killer, fragile |
| Artisan | ×0.85 | ×0.40 | low–mid | low–mid | 1–2 | 1.8–2.1 | 0.5–0.7 | **Lowest ATK in game** — production, not combat |
| Assassin | ×0.8 | ×1.25 | low | low | 1 | 2.6–2.7 | 1.0–1.2 | Fastest class — jungle burst + scouting |

### 2.3 Combat Rules

- **Armor Formula:** `Damage Reduction % = Armor / (Armor + 100)` (mirrors Aurolith baseline).
- **Damage Types:** Physical (ATK) / Magic (AP) / True (ignores all resistances).
- **Structure Damage:** Siege units deal bonus damage to structures (multiplier per unit, e.g. ×1.25–×2.0). Non-siege units deal reduced structure damage.
- **Skill Casting (seconds-based):** skills are activated by **command priority + trigger condition** — there is **no energy/mana resource** (the old energy system is replaced, per `09 - Tuning Framework.md` §3). All units enter combat with skills available; cooldowns are role-tuned (defensive 3–6s, nukes 8–15s). Cooldown starts when the skill resolves.
- **Move Speed:** hexes/sec. **ASPD:** attacks/sec.
- **CC Diminishing Returns:** consecutive crowd-control on the same target within 6s is reduced 50% (prevents perma-CC chains).

---

## 3. 🧩 Research Influences (Mechanic Sourcing)

Unique mechanics were adapted (not copied) from a wide range of tactical auto-battlers and MOBAs:

- **TFT / Golden Spatula:** mode-switching ults (Sona), execute thresholds (Judicator), transformations (Mecha), damage-link / blessing transfer (Dragonsoul), black-hole pulls (Dark Star), scaling spell growth (Aurelion Sol star dust), revive/guardian banners, trait-based positioning buffs (K/DA hex lights).
- **Magic Chess Go Go:** commander active skills (battle cry damage aura, heal sustain, burst, XP/econ), synergy depth, item effects (Immortality revive, reflect, regen), transform-enemy-to-critter CC.
- **MLBB / AoV / LoL / HoK:** zone control (Framed Moment), water-zone enhanced basics (Kalea), tether pulls (hooks), phase/untargetable kiting, execute ults, chain lightning, polymorph, silence fields, banner resurrections, %max-HP true damage, thorns reflect, adaptive plating, siege-stance turrets.

> Design rule: **no unit is a straight clone** — each combines 2–3 sourced mechanics into a new package with a unique twist.

---

## 4. 📁 Roster Index

| File | Class | Units |
| :--- | :--- | :--- |
| `Final - Fighters.md` | Fighter | 10 |
| `Final - Tankers.md` | Tanker | 10 |
| `Final - Mages.md` | Mage | 10 |
| `Final - Marksmen.md` | Marksman | 10 |
| `Final - Supports.md` | Support | 10 |
| `Final - Siege.md` | Siege | 10 |
| `Final - Artisans.md` | Artisan | 10 production units + Production Economy Model (CSV / TPV / PVR) + class contract |
| `Final - Assassins.md` | Assassin | 10 jungle/scout burst units + class contract + universal Slayer's Mark |
| `07 - Balance Audit & Synergy Matrix.md` | — | Full audit |
| `08 - Auto-Battler Integration & Full Re-Audit.md` | — | AI framework + re-audit under auto-action |
| `09 - Tuning Framework.md` | — | 5-command system, cooldown overhaul, tank fix, counterplay mandate |
| `16 - Playtest Validation.md` | — | Cross-scenario checklists (tank fix / cooldowns / counterplay / artisan) |

> The 8 **`Final - <Class>.md`** files are the **single authoritative character list** — each merges the class's design identity with its tuning numbers (stats, CDs, command behavior). On any conflict, the tuning numbers win. All other files in this folder are supporting design/audit documents.

---

## 5. 🎨 Thematic Note

All units are flavored around the **Gilded Empire** aesthetic: imperial gold (`#D4AF37`), obsidian (`#111116`), arcane cyan, crimson red, and emerald green — matching the Aurolith color palette. Lore hooks reference the empire's legions, academies, and siege foundries.

---

## 6. 🎮 Game Format: Auto-Battler & Commander Role

- **The player is a commander, not a controller.** During a match the player has **no direct control over any unit**. All movement, targeting, ability casting, and ability interrupts are executed by deterministic unit AI.
- **Commander agency (the complete list of player inputs):**
  1. **Pre-battle formation placement** on the board grid (positioning is the primary combat foundation).
  2. **Shop & economy** — recruiting units, buying level-ups, interest management.
  3. **Command Cards & Platoon Directives** — casting the 25 tactical cards free from hand, vector waypoint path painting for the 4 platoons, 3 Observable Stances (`[A]`, `[D]`, `[R]`), and 3 Focus Directives (`[Z]`, `[X]`, `[C]`). The commander has no separate combat avatar or active god-power button.
  4. **Imperial Blessings & Facilities** — drafting blessings across the 3 In-Match Rites and building Courtyard facilities.
- **Unit autonomy rule:** every ability listed in this vault must be executable without player input. Where a kit reads like it needs a player decision (target pick, recast timing, channel cancel, stance toggle), the deterministic AI rule is defined in `08 - Auto-Battler Integration & Full Re-Audit.md`.
- **No manual micro, no pause mid-combat:** rounds resolve automatically to completion.
- **Army Cap (20 Units = 4 Platoons × 5 Units):** Each side fields **at most 20 active units** organized into **exactly 4 Platoons of 5 Units** (Hotkeys `1`, `2`, `3`, `4`). There are no loose unassigned units; every unit operates within a cohesive 5-man squad.
- **Unique Champion Limit:** A player may only field **1 copy of any named champion/unit** at a time across their entire 20-unit army (no duplicate hero stacking).
- **5-Man MOBA Role Diversity Synergy:** Platoons are incentivized to draft balanced compositions (Tank, Bruiser, Mage, Marksman, Support/Artisan):
  - 1–2 Distinct Roles: +0%
  - 3 Distinct Roles: +5% All Stats
  - 4 Distinct Roles: +12% All Stats
  - 5 Distinct Roles: **+22% All Stats + 10 Tenacity** (CC duration reduction).
- **Artisan Production Autonomy:** Artisans interpret the tactical stances and commands (e.g. Defend stance prompts defensive structure repair and barricade erection; Gather prompts resource extraction), occupying a combat slot as a strategic production investment.

---

## 7. 🌟 3-Tier Unit Leveling & L3 Paragon Evolution (Strategy-First, Zero-RNG)

Units enter the board via the **Deterministic Mercenary Guild** (hired once at 60g base escalated price; zero duplicate rolling gacha). Progression from L1 to L3 is driven entirely by **tactical execution and strategic resource allocation**:

- **Dual XP Progression Engine:**
  1. **Platoon Shared Squad XP:** All XP earned from monster kills (+10), enemy unit kills (+20), and jungle bosses (+40) is divided 100% equally across all 5 platoon members (no kill-stealing; supports and tanks level in sync with carries).
  2. **Commander Academy Training Investment:** In the Courtyard/Barracks, commanders can directly spend surplus resources (`100g → +100 XP`) into a chosen champion to fast-track them to Level 2 and Level 3 without relying on shop roll luck.

### 3-Tier Ascension Milestones:
1. **L1: Recruit (Baseline):** Standard 64px sprite, bronze circular foot decal. Base active ability and passive.
2. **L2: Veteran (100 XP):** **+8% Sprite Scale**, silver health bar border, silver level-up skybeam. Gains **+10% Max HP**, **+5% ATK/AP**, **+15% Cooldown Haste**, and restores **+20% Max HP** instantly upon leveling.
3. **L3: Paragon (300 XP Total):** **+15% Sprite Scale**, radiant **Golden Sunburst Crest** halo, gold health bar + star badge, war horn fanfare. Gains **+20% Max HP**, **+10% ATK/AP**, **+25% Cooldown Haste**, and unlocks an authoritative **L3 Paragon Skill Evolution** (documented in each class file).

