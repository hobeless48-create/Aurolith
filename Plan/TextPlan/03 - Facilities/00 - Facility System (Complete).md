---
tags: [Facilities, Overview, BaseBuilding, HPTiers, DamageRetention, Production, Combat, Buff, VisualDesign, Architecture, TierModels, 3DAssets]
type: [System Core, Facility Category Specification, Facility Specification, Design Specification]
---

# 🏗️ FACILITY SYSTEM (COMPLETE)

> [!IMPORTANT]
> **UNIFIED FACILITY ROSTER (v3.2) — 18 ACTIVE FACILITIES.** The facility build pool consists of **18 active facilities** (6 Production + 6 Combat + 6 Buff).
> - **Demoted Core Upgrades:** Passive economy and population cap structures (**Core Treasury, Core Crucible, Core Barracks**) are permanent, non-slot Core Upgrades that cannot be sieged (see **`02 - Core Upgrades (Treasury, Crucible, Barracks).md`**).
> - **Build Rules:** Each commander commands **6 Inner Wall Slots** (4 in Outer Courtyard, 2 in Inner Keep). Duplicates are allowed under the Duplicate Rule (first copy 100% / subsequent copies 50% potency; max 3 per category per side).
> - **Authoritative Data:** Full mechanical parameters and balance audits live in **`Data/FacilityList/00 - Facility Pool (18 Facilities).md`**.

---

## 1. 📊 System Rules & Engineering Parameters

- **Construction Slots:** 6 fixed 3×3 courtyard building sockets (4 Outer Courtyard, 2 Inner Keep).
- **Footprint:** 3×3 Hexes per facility.
- **Activation Phase:** Production and Buff facilities operate immediately upon construction. Active offensive weapons (Ballista, Catapult) may be built during the Opening Phase (`0:00 – 5:00`), but **do not activate or fire until the Expansion Phase initiates at `5:00`**.

### 1.1 📊 Facility HP Scale & Upgrade Tiers

Standard facilities feature 3 distinct level tiers with scaling HP pools and non-siege resistance:

| Facility Level | HP Pool Baseline | Upgrade Cost | Non-Siege Damage Resistance |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Base)** | **`500 HP`** | `150 Gold` | **-70% Damage Reduction** |
| **Tier 2 (Advanced)** | **`750 HP`** | `250 Gold + 100 XP` | **-70% Damage Reduction** |
| **Tier 3 (Mastery)** | **`1,000 HP`** | `400 Gold + 250 XP` | **-70% Damage Reduction** |

*Special Exception:* The **Golden Vault (Bank)** features a fragile, high-risk profile (**100 / 200 / 400 HP**) with normal -70% resistance to preserve high counterplay risk during term deposits.

### 1.2 🛡️ Mid-Combat Damage Retention During Upgrades

When a commander initiates a facility upgrade while the structure is taking enemy fire:
- **Damage Retention Formula:** Existing damage taken is subtracted from the new Max HP pool; HP does **NOT** reset to full:
  $$\text{New Current HP} = \text{New Tier Max HP} - (\text{Old Tier Max HP} - \text{Old Current HP})$$
- *Example:* A Tier 1 facility (500 max HP) with 200 damage taken (300 current HP) upgraded to Tier 2 (750 max HP) yields `750 - 200 = 550 Current HP`.

### 1.3 💥 Destruction, Rubble & 50% Refund Rule

- **Mid-Upgrade Destruction:** If a structure is destroyed while actively upgrading, the upgrade aborts and **50% of the Gold/XP upgrade cost is refunded**.
- **10-Second Rubble Cooldown:** Destroyed facilities leave a 10-second rubble clearing state before the 3×3 socket can accept a new build order.

### 1.4 ⚖️ Operational Doctrines (v3.2)

1. **Duplicate Rule:** Multiple copies of the same facility may be built across the 6 slots. The highest-tier copy functions at **100% effectiveness**, while each additional copy operates at **50% potency** (1 copy = 100%, 2 copies = 150%, 3 copies = 200%).
2. **Siege Range Doctrine:** All Combat Facilities are defensive fortification emplacements hard-capped at a maximum range of **30 hexes from the owning wall** (standard combat ranges sit between 5–8 hexes). Facilities cannot strike mid-field (~75 hexes) or the enemy fortress.
3. **Targeting Priority:** All automated defensive weapons (Ballista, Catapult) automatically **target the nearest enemy unit/structure first**.
4. **Buff Unique-Effect Doctrine:** Buff Monoliths never grant flat stacking percentage base-stat auras (which break scaling across 20-unit deathballs). Every Buff Monolith provides a distinct mechanical proc or situational trigger.

---

## 2. 🏭 Category 1: The 6 Production Facilities

| # | Facility | Type | Primary Role & Effect Summary |
| :--- | :--- | :--- | :--- |
| 1 | **Caravan Post** | Lump Gold | Flagship gold facility: delivers **+150 / +300 / +500 Gold** on the minute boundary (~2.5 / 5.0 / 8.33 g/s). |
| 2 | **Hunter's Lodge** | Jungle Bounty | Increases monster gold/XP bounties by **+15% / +30% / +50%**; T3 grants +50g on first camp clear per minute. |
| 3 | **Recruit Depot** | Tempo / Conscription | Cuts unit hire cost by **-10% / -15% / -20%**; T2/T3 reduces unit respawn time by **-25% / -50%** (30s → 15s). |
| 4 | **War Foundry** | Equipment Pacing | Accelerates item crafting: **-15% / -25% / -40% craft time** and **-10% / -20% / -30% craft gold**; T2/T3 quality upgrade chance. |
| 5 | **Golden Vault (Bank)** | Term Deposit | Commander locks gold for 1, 2, or 4-minute terms to receive **+10–25% / +25–60% / +75–200% interest**. Fragile HP (100/200/400). |
| 6 | **Stone Quarry** | Masonry Supply | Reduces facility construction/upgrade costs by **-10% / -15% / -20%**; T3 grants +100 Max HP to all friendly facilities. |

---

## 3. 🎯 Category 2: The 6 Combat Facilities

| # | Facility | Type | Primary Role & Effect Summary |
| :--- | :--- | :--- | :--- |
| 7 | **Field of Despair** | Anti-Heal Zone | Projects a debilitating aura: enemy units inside the fortress have healing reduced by **-20% / -40% / -60%**. |
| 8 | **Arcane Barrier** | Fortification Shield | Deflection ward: reflects **20% / 30% / 40%** of damage dealt to adjacent wall segments directly back to attackers. |
| 9 | **Sanctuary** | Defensive Bastion | Consecrated ground: friendly units inside the fortress gain **+40% / +60% / +90%** increased healing and health regeneration. |
| 10 | **Ballista** | Precision Defense | Automated bolt sniper: deals **2,000 / 3,000 / 4,000 Physical Damage** every 25s (Range: 5 hexes, targets nearest enemy). |
| 11 | **Catapult** | Area Artillery | Heavy bombardment: launches explosive shell for **1,200 / 1,800 / 2,500 AoE Damage** + 20% splash (Range: 8 hexes, nearest first). |
| 12 | **Metal Wall** | Structural Reinforcement | Plated armoring: grants all Outer & Inner wall segments **+5% / +10% / +15%** additional permanent damage reduction. |

---

## 4. ⚡ Category 3: The 6 Buff Monoliths

| # | Facility | Type | Primary Role & Effect Summary |
| :--- | :--- | :--- | :--- |
| 13 | **War Banner Shrine** | Combat Trigger | **Battle Cry:** Every 30s / 25s / 20s, all friendly units gain a guaranteed double-damage critical proc on their next auto-attack. |
| 14 | **Alchemical Transmuter** | Out-of-Combat Sustain | **Rapid Recovery:** Units out of active combat regenerate **4% / 6% / 8% Max HP per second**. |
| 15 | **Windrider Obelisk** | Tactical Mobility | **Gust Surge:** Every 45s / 35s / 25s, active platoons gain a **+40% Movement Speed burst** for 6s. |
| 16 | **War Room** | Command Acceleration | **Orders Relay:** Every 25s / 20s / 15s, resets remaining cooldown of 1 random allied active skill; T3 resets Commander Active Skill. |
| 17 | **Training Grounds** | Level-Up Surge | **Battlefield Lessons:** Whenever a friendly unit levels up, nearby allies heal for **20% / 30% / 40% Max HP**; T3 grants +1% permanent HP. |
| 18 | **Sanctum of Restoration** | Attrition Mitigation | **Second Wind:** Upon unit death, refunds **20% / 35% / 50% of the unit's recruitment gold** to the treasury. |

---

## 5. 🏛️ Facility Visual Architecture & 3D Isometric Design Specification

> Standard 3×3-hex isometric footprint, styled with the Gilded Empire visual identity: Imperial Gold `#D4AF37`, Weathered Stone `#7A7A7A`, and Polished Steel `#E0E0E0`.

### 5.1 🏭 Production Structures
- **Caravan Post:** T1 brass-cage caravan dock with covered wagon · T2 stone waystation with twin trade signs and paved cart court · T3 gilded toll-gate courtyard with an arriving train of gilded wagons.
- **Hunter's Lodge:** T1 timber cabin with bounty board nailed to porch · T2 stone hunting hall with hearth-mounted monster skulls and parchment map table · T3 gilded lodge with animated hunting-hound kennels and silk trophy standards.
- **Recruit Depot:** T1 canvas muster pavilion with furled standard rack · T2 stone garrison drill-yard with weapon racks and bell tower · T3 gilded citadel barracks with marching parade grounds and glowing muster banners.
- **War Foundry:** T1 timber forge with twin charcoal furnaces · T2 stone foundry with water-wheel driven trip-hammer · T3 gilded arsenal with automated assembly lines, cooling aqueducts, and gleaming weapon racks.
- **Golden Vault:** T1 reinforced iron strongbox bolted to stone dais with brass coin slot · T2 gilded counting-house with brass ledger desk · T3 marble exchange hall with a massive rotating sun-dial vault door.
- **Stone Quarry:** T1 open excavation pit with wooden block-crane · T2 terraced quarry with block-cutters working stacked masonry · T3 gilded stone yard with animated masonry golems hauling dressed blocks.

### 5.2 🏹 Combat Facilities
- **Field of Despair:** T1 obsidian rune-marker bleeding dark grey mist · T2 sunken basalt circle with glowing purple siphon veins · T3 towering shadow-spire radiating a heavy anti-heal suppression cloud over courtyard hexes.
- **Arcane Barrier:** T1 single blue crystal pylon emitting light wards · T2 triangular crystal array generating humming forcefield ribbons · T3 gilded sun-crest spire projecting a golden barrier dome with pulsing deflection runes.
- **Sanctuary:** T1 consecrated stone fountain emitting golden vapor · T2 marble basilica basin with glowing sun-relic · T3 cathedral pavilion with radiant solar braziers illuminating friendly units.
- **Ballista:** T1 heavy wooden dual-bow chassis on revolving stone turntable · T2 steel-reinforced frame with incendiary sun-bolts · T3 quad-barrel gilded turret with automated clockwork reloading gear.
- **Catapult:** T1 timber-frame counterweight trebuchet with stone bucket · T2 iron-banded catapult with winch mechanism · T3 motorized golden bombard cannon firing glowing incendiary solar shells.
- **Metal Wall:** T1 iron reinforcement plates riveted across courtyard wall base · T2 interlocking steel bulwark plates with firing slits · T3 gilded adamantine cladding with glowing runic anchor bolts.

### 5.3 🏛️ Buff Monoliths
- **War Banner Shrine:** T1 gilded standard pole with embroidered imperial lion banner · T2 twin standard pavilions with glowing braziers · T3 colossal imperial monument surmounted by a radiant golden war standard that billows with solar fire.
- **Alchemical Transmuter:** T1 copper alembic with bubbling green restorative tincture · T2 dual glass distillation towers with pressurized brass pipes · T3 gilded alchemical apparatus circulating glowing golden ambrosia.
- **Windrider Obelisk:** T1 fluted sandstone pillar with spiraling carved grooves · T2 twin marble needles channeling breeze ribbons · T3 towering white marble spire wrapped in permanent swirling golden gale rings.
- **War Room:** T1 timber command tent with map table and brass compass · T2 stone war office with tactical relief maps and messenger perches · T3 gilded council pavilion with floating holographic hex map.
- **Training Grounds:** T1 wooden combat ring with sparring dummies and weapon stands · T2 paved martial court with ringed dueling pits · T3 gilded amphitheater with bronze victory statues and champion standards.
- **Sanctum of Restoration:** T1 memorial shrine with eternal flame brazier · T2 stone mausoleum with carved hero reliefs · T3 radiant golden cenotaph surrounded by ascending spirit embers.
