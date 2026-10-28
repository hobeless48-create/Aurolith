---
tags: [Rules, Balance, Stats, Numbers, FacilityHPTiers, DamageRetention]
type: System Core
---

# 🔢 NUMERICAL BASELINE & BALANCE SPECIFICATION

> Standardized numerical reference values anchoring structure HP, facility tiers (500/750/1000 HP), non-siege damage resistance (-70%), and card rules.

---

## 1. Structure HP & Non-Siege Resistance (-70% Debuff)

| Structure | Dimensions / Footprint | HP Baseline | Non-Siege Resistance |
| :--- | :--- | :--- | :--- |
| **Outer Wall Segment** | 5 Segments (6 Hexes wide each) | **`3,000 HP` / segment** | **-70% Damage Reduction** |
| **Inner Wall Segment** | 5 Segments (6 Hexes wide each) | **`4,500 HP` / segment** | **-70% Damage Reduction** |
| **Facility Tier 1** | 3×3 Hex Footprint | **`500 HP`** | **-70% Damage Reduction** |
| **Facility Tier 2** | 3×3 Hex Footprint | **`750 HP`** | **-70% Damage Reduction** |
| **Facility Tier 3** | 3×3 Hex Footprint | **`1,000 HP`** | **-70% Damage Reduction** |
| **Castle Core** | Single Core Keep | **`4,500 HP`** | **100% Full Damage** |

> **v3.2 wall-HP rebalance (+50%):** walls scaled up to absorb the power added by the platoon composition bonus (up to +30% basic stats), Ancient (2×) and Divine items, the 10 new items, and the 30s respawn rule (armies fight at full strength every push). Outer 2,000→**3,000** · Inner 3,000→**4,500** · Core 3,000→**4,500**. Keeps the Siege window (10:00–15:00) and Overtime (15:00–18:00) meaningful and makes the 18:00 cumulative-wall-damage tie-breaker a real score. Knob: HP, not the −70% non-siege floor.

---

## 2. 🛡️ Facility Damage Retention Formula

$$\text{Upgraded Current HP} = \text{New Max HP} - (\text{Old Max HP} - \text{Old Current HP})$$
- *Example:* Tier 1 (500 HP max) with 200 damage (300 HP) -> Upgraded to Tier 2 (750 HP max) = `550 Current HP`.

---

## 3. Card Deck System & Hand Mechanics

- **Card Cast Cost:** `0 Gold` (Free from Hand).
- **Steep Extra Card Buy Scaling:** `100 / 250 / 500 / 1,000 Gold`.
- **Comeback Hand Overflow:** Full hands (6 cards) buffer comeback bonus draws in a **15-Second Overflow Slot**.
- **Overflow Discard:** If the 15-second overflow slot is still occupied when the next cadence draw arrives, the oldest overflow card is automatically discarded to the Discard panel.
- **Overtime Surge Unlock:** Locked from draw pool until match timer reaches `15:00`.
- **Overtime Eco Ramp:** Passive income increases by **+50%** during Overtime (`15:00` – `18:00`).

---

## 4. 🪙 Unit Recruitment & Economy Baseline

- **Base Passive Income:** `10 Gold/sec` + `10 XP/sec` generated passively from the start of the match.
- **Unit Recruitment Costs (Level 1):** *superseded by the modern cost model — see `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` (flat 60g base + 2:30 escalation + Resign refund).* Legacy values kept for reference: Gilded Infantry `100 Gold` | Arbalest Marksmen `120 Gold` | Jungle Harvesters `80 Gold` | Siege Operators `150 Gold`.
- **Unit Respawn (modern rule):** a dead unit does **not** disappear permanently — it enters the Graveyard queue and **respawns automatically after a 30-second timer** (free, keeps level, holds its army slot). **Resign is the only permanent removal** (70% refund + 30s slot lock). See `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3. (Supersedes the legacy 40–75s respawn timers.)
- **Recruitment Time:** *superseded by the instant-hire Recruit Shop — see `Data/Economy/02 - Recruit Shop & Commander Level.md` §1 (purchase places the unit immediately).* Legacy values kept for reference: 5s (Infantry) | 6s (Marksmen) | 4s (Harvesters) | 8s (Siege Operators).
- **Base Army Cap:** `14 active units`, expanded by **+2 per Core Barracks tier** (Core Upgrade) → **hard cap `20` active units** (T3 Barracks: 14 → 16 → 18 → 20).
- **Army Structure (hard rules):**
  - **Max 20 active units per side.**
  - **Exactly 4 platoons per side** (hotkeys `1`–`4`); each platoon holds up to **5 units** (platoon size cap = **5 units**).
  - **No unassigned/free units**; every unit is assigned into one of the 4 platoons ($4 \times 5 = 20$).
  - **Full army formation:** 4 platoons of 5 = **20 units**.
- **5-Man Role Diversity Bonus:** a platoon's **basic stats** (HP · ATK/AP · ASPD · DEF/MR) are boosted by the number of **distinct roles** in its 5-man composition:
  - 1–2 roles: +0%
  - 3 roles: **+5% all stats**
  - 4 roles: **+12% all stats**
  - 5 distinct roles: **+22% all stats + 10 Tenacity** (Full MOBA standard: Tank, Bruiser, Mage, Marksman, Support). Full table: `TextPlan/02 - Units & Platoons/Commander & Platoon System.md` §5.
- **Level-Up XP Costs:** *superseded by the modern unit-level spec — see `Data/Economy/02 - Recruit Shop & Commander Level.md` §5 (all units: L1→L2 `100 XP` → L3 `200 XP`; max L3).* Legacy values kept for reference: Infantry / Marksmen / Harvesters `100 XP` (L2) → `250 XP` (L3); Siege Operators `150 XP` (L2) → `350 XP` (L3).

---

## 5. ⚔️ Combat & Movement Stat Baselines

- **Armor Formula:** `Damage Reduction % = Armor / (Armor + 100)`. Armor-Piercing attacks (Armor-Piercing Bolt, Spike Trap) ignore this reduction entirely.
- **Base Movement Speed (hex/sec):** *superseded by per-class movement — see `Data/UnitRoster/00 - Unit Roster Overview & Class Definitions.md` §2.2 (Move Spd column, e.g. Assassin 2.6–2.7 · Fighter 2.0 · Siege 0.7–1.3).* Legacy archetype values kept for reference: Gilded Infantry `1.5` | Arbalest Marksmen `1.8` | Jungle Harvesters `2.2` | Siege Operators `1.3`.
- **Base Attack Speed:** *superseded by per-class ASPD — see `Data/UnitRoster/00` §2.2 (ASPD column, 0.5–1.2 by class).* Legacy baseline `1.0 attacks/sec` kept for reference; % Attack Speed bonuses (Golden Fervor, Bloodlust frenzy, Overtime Surge) apply linearly to the unit's class ASPD.
- **Out-of-Combat Regen:** All units regenerate `2 HP/sec` when not in active combat (Alchemical Transmuter aura overrides this value).
