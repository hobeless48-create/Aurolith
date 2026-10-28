---
tags: [Units, Legacy, Superseded, Archetypes]
type: Legacy Archive
---

# 🏛️ LEGACY UNIT ARCHETYPES (Superseded by Data/UnitRoster)

> ⚠️ **SUPERSEDED — LEGACY STAT MODEL.** These 4 archetype sketches use the OLD stat model (HP/DPS, gold-cost recruitment, respawn timers, per-unit XP trees) and are **SUPERSEDED** by the modern 80-unit / 8-class roster in `Data/UnitRoster` (Final files — Fighters, Tankers, Marksmen, Siege, Jungle-harvesting classes, etc., with the new ATK/DEF/MR/ASPD model). Kept verbatim for design reference and because they contain unique mechanics.

---

## 🛡️ UNIT: GILDED INFANTRY

*Legacy file metadata: `tags: [Units, Infantry, GoldenBastion, BuffRules]` · `type: Unit Specification`*

> [!NOTE]
> Heavy frontline brawler tank archetype with *Golden Bastion* active skill.

### 1. 🛡️ Golden Bastion Active Skill & Buff Rules
- **Skill Effect:** Reduces incoming damage by **-50% for 4 seconds**.
- **Non-Stacking Buff Rule:** Multiple casts or overlapping Infantry skill triggers do **NOT** stack damage reduction (no invulnerability). Subsequent casts simply **refresh the 4-second duration** of the single -50% buff.

### 2. 📊 Stat Scale & Respawn Timers
- **Recruitment Cost:** `100 Gold`.
- **HP Baseline:** `500 HP` (Level 1) -> `700 HP` (Level 2) -> `900 HP` (Level 3).
- **DPS Baseline:** `25 DPS` (Level 1) -> `35 DPS` (Level 2) -> `45 DPS` (Level 3).
- **Respawn Timers:** Level 1: 20-25s | Level 2: 35-40s | Level 3: 55-60s (**60s Absolute Cap**).
- **Level-Up XP Costs:** Level 1 -> 2: `100 XP` | Level 2 -> 3: `250 XP`.

---

## 🏹 UNIT: ARBALEST MARKSMEN

*Legacy file metadata: `tags: [Units, Marksmen, ArmorPiercing, ShieldRules]` · `type: Unit Specification`*

> [!NOTE]
> Long-range sniper archetype with *Armor-Piercing Bolt* active skill and +1 Hex Wall Elevation Range Bonus.

### 1. 🏹 Armor-Piercing Bolt & Shield Interaction Rules
- **Skill Effect:** Fires a high-velocity bolt dealing `120 Armor-Piercing Damage`.
- **Shield Priority Rule:** *Armor-Piercing Bolt* ignores target base Physical Armor values, but **is absorbed by HP Shields (e.g. Arcane Shield Wall)** before damaging unit HP.

### 2. 🏰 Elevation & Stat Scale
- **Recruitment Cost:** `120 Gold`.
- **Wall Elevation Bonus:** Stationing on intact Wall Segments grants **+1 Hex Range (4 → 5 Hexes)**.
- **HP Baseline:** `300 HP` (Level 1) -> `420 HP` (Level 2) -> `540 HP` (Level 3).
- **DPS Baseline:** `35 DPS` (Level 1) -> `49 DPS` (Level 2) -> `63 DPS` (Level 3).
- **Respawn Timers:** Level 1: 20-25s | Level 2: 30-35s | Level 3: 40-45s (**60s Absolute Cap**).
- **Level-Up XP Costs:** Level 1 -> 2: `100 XP` | Level 2 -> 3: `250 XP`.

---

## 🐆 UNIT: JUNGLE HARVESTERS

*Legacy file metadata: `tags: [Units, Harvesters, CCInterrupt, Leaps]` · `type: Unit Specification`*

> [!NOTE]
> High-mobility jungle beast farmer archetype with *Pounce/Harvest* skill.

### 1. 🐆 Pounce/Harvest Skill & CC Interrupt Rules
- **Skill Effect:** Leaps 2 hexes onto a target, dealing `80 Physical Damage` and harvesting bonus resources if the target dies.
- **Crowd-Control Interrupt Rule:** Crowd-control effects (Root, Stun, Spike Traps) **immediately cancel active leaps or channeling skills**, dropping the unit onto its current hex tile and triggering full cooldown.

### 2. 📊 Stat Scale & Respawn Timers
- **Recruitment Cost:** `80 Gold`.
- **HP Baseline:** `250 HP` (Level 1) -> `350 HP` (Level 2) -> `450 HP` (Level 3).
- **DPS Baseline:** `30 DPS` (Level 1) -> `42 DPS` (Level 2) -> `54 DPS` (Level 3).
- **Respawn Timers:** Level 1: 20-25s | Level 2: 30-35s | Level 3: 40-45s (**60s Absolute Cap**).
- **Level-Up XP Costs:** Level 1 -> 2: `100 XP` | Level 2 -> 3: `250 XP`.

---

## 💣 UNIT SPECIFICATION: SIEGE OPERATORS

*Legacy file metadata: `tags: [Units, Siege, Artillery, XP, RespawnPenalty, SmartTactics]` · `type: Unit Archetype`*

> [!NOTE]
> Heavy mechanical siege specialists wielding explosive mortars and battering rams to breach enemy walls and demolish structures.

### 📊 Core Statistics & Scaling Respawn Penalty

- **Archetype:** Siege Engine / Demolition
- **Recruitment Cost:** `150 Gold`.
- **Base Stats (Lvl 1):** `300 HP` | `50 Siege DPS` | **`40s Respawn`**
- **Enhanced (Lvl 2):** `420 HP` (+40%) | `70 Siege DPS` (+40%) | **`55s Respawn`** *(Penalty)*
- **Mastery (Lvl 3):** `540 HP` (+80%) | `90 Siege DPS` (+80%) | **`60s Respawn`** *(HIGH RISK PENALTY — capped at the 60s absolute max)*

### 🤖 Smart-Tactics Auto-Skill Behavior

- **Skill:** *Demolition Charge*
- **Auto-Trigger Logic:** Automatically plants explosive charge the moment unit reaches 1-hex range of an intact enemy 6-tile Wall Segment or Inner Wall structure.
- **Commander Stance Interaction:**
  - *Demolition Push Stance:* Ignores enemy troops completely, targeting closest Wall Segment.
  - *Cautious Artillery Stance:* Maintains max 5-hex distance, planting Demolition Charge only when escorted by 2+ Infantry units.

### 🌟 XP Skill & Level Progression

| Skill Level | XP Cost | Skill Effect Upgrade | Respawn Timer | Risk Dynamic |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | `0 XP` | **Demolition Charge:** Plants explosive dealing `250 Siege Damage` to 6-tile wall segment (25s CD). | `40 seconds` | Standard Low Risk |
| **Level 2** | `150 XP` | Cooldown reduced to `18s`. Demolition damage increased to `400 Siege Damage`. | `55 seconds` | Moderate Penalty |
| **Level 3** | `350 XP` | **Mastery Effect:** Explosive charge detonates instantly on contact and destroys nearby traps/mines. | `75 seconds` | **HIGH RISK PENALTY** |

---

## 🗺️ Modern Mapping (to Data/UnitRoster)

> Mapping based solely on class definitions in `Data/UnitRoster/00 - Unit Roster Overview & Class Definitions.md`. Every legacy archetype maps to a class that is explicitly named in that overview.

| Legacy Archetype | Modern Roster Mapping |
| :--- | :--- |
| **Gilded Infantry** | **Fighter / Tanker** classes — Fighter: "Direct, frontline head-on combat with high burst and sustained melee damage"; Tanker: "High durability, massive health pools, defensive scaling, and crowd control / debuff abilities to protect allied units." |
| **Arbalest Marksmen** | **Marksman** — "Long-range rear-line kiting, consistent sustained damage that relies on positioning to avoid engagement" (Range 4–7). |
| **Jungle Harvesters** | **Assassin** — the 8th class, Assassin, "is the jungle/scouting burst role"; "Jungle play — strong scouting + high burst single-target damage. Fastest class; fragile; carries the universal **Slayer's Mark** monster-hunting secondary." |
| **Siege Operators** | **Siege** — "Unmatched raw damage output for structure / high-health target elimination — extremely slow movement and low durability, vulnerable if engaged." |
