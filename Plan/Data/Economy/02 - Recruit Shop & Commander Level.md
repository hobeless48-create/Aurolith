---
tags: [Economy, RecruitShop, CommanderLevel, UnitLeveling, ShopOdds, Interest]
type: Data - Authoritative
---

# 🛒 RECRUIT SHOP, COMMANDER LEVEL & UNIT LEVELING

> **Authoritative spec for the recruit surface and the two level systems.** The shop is the **primary way units enter the board**; the hire price is the Cost Model v2 flat-escalated price (`Data/Economy/01`). Commander level gates shop odds. Unit level is a combat XP progression (max L3). All three were previously referenced but never specified — this file closes the gap.

---

## 1. 🏛️ The Mercenary Guild (Deterministic Recruitment — Zero Gacha)

- **Starting army and gold:** each player chooses **five free starter units** for Platoon 1 before the 0:00 clock starts (`Data/BlessingList/00` §4.5). Starting gold is **0g**; the first paid hire costs 60g and can be afforded after six seconds of the base 10g/s passive income (`Data/Economy/01` §1). This replaces the older one-unit 60g opening.
- **Deterministic Match Pool (40 Champions):** Each match features a curated roster of **40 champions (5 per class)**, eliminating diluted 80-unit randomness and preventing copy-pasted solved metas.
- **Contract Board (By Class):** The Mercenary Guild displays available contracts categorized cleanly by class (**Fighters, Tankers, Marksmen, Mages, Assassins, Supports, Siege, Artisans**).
  - Players can inspect and directly hire the exact champion needed to counter the enemy or complete a platoon synergy.
  - **Zero Duplicate Rolling:** Units are hired **once** per army (strict 1-per-side unique champion rule). You never need to hunt for duplicate copies to level up.
- **Purchase:** Clicking an available champion contract hires that unit **at the current escalated price** (base 60g × escalation, `Data/Economy/01` §2) and places it into an open platoon slot at **Level 1 (Bronze Rim)**.
- **Class Requisition Order (+25g):** If a player needs an emergency tactical pivot (e.g. immediate anti-armor Siege or backline dive Assassin), commissioning a Class Requisition guarantees immediate priority deployment of that specialist.
- **No Bench Bloat:** Units go directly into one of the 4 Platoons (cap 20 units). Existing hire rules (Resign 70% refund + 30s slot lock; 30s Graveyard respawn rule) remain authoritative.


---

## 2. 💱 Interest Economy (no separate shop interest)

> `Data/UnitRoster/08` §7 recommends a "shop with interest economy." **The bank-threshold blessings are that economy** — the shop does not add a second interest mechanic.

- **Interest = minute-boundary gold on your *active* bank**, paid by the bank-threshold blessings: `Copper / Silver / Golden Interest`, `War Bonds`, `Endless Treasury` (`Data/BlessingList/00` §4.11; audit §C at 2,000g bank: 20 → 40 → 40 → 110 → 370 g/min).
- **The shop surface displays projected interest** on the current active bank (which blessings are active, their per-minute payout) so the commander can make live bank-vs-spend decisions — *the shop is the interface; the blessings are the engine.*
- **Interaction with the shop:** buying a unit drops the active bank (losing interest), resigning returns 70% (partial interest recovery). This is the real economy of the shop: **spending now vs. banking for interest**.
- **Vaulted gold** (Golden Vault deposits) is excluded from the active bank and pays no interest (`TextPlan/09` Glossary §1 — bank / active bank).

---

## 3. 🏛️ Deterministic Champion Tier Unlocks by Commander Level

> **Deterministic Guild Access (Zero RNG):** All 40 champions in the match pool are organized by class boards. Commander Level deterministically gates **which champion stat tiers are unlocked for direct recruitment**, completely replacing random rolling odds. Tier still determines stat baselines, never gold cost (all units cost base 60g × 2:30 escalation).

| Commander Lv | Cumulative XP | Unlocked Champion Tiers | Strategic Guild Milestone |
| :--- | :--- | :--- | :--- |
| **1** | 0 XP | **Tier 1 (Common)** | Initial recruits; baseline squad deployment. |
| **2** | 500 XP | **Tier 1 & Tier 2 (Rare)** | First specialists and jungle hunters available. |
| **3** | 1,200 XP | **Tier 1, 2, & 3 (Epic)** | Core mid-game carries and heavy siege unlocked. |
| **4** | 2,100 XP | **Tier 1–3 + Class Requisition -5g** | Discounted tactical pivot orders. |
| **5** | 3,400 XP | **Tier 1–4 (Legendary)** | **Commander Active Skill Unlocked**; late carries available. |
| **6** | 5,200 XP | **Tier 1–4** | Full mid-game roster availability. |
| **7** | 7,000 XP | **Tier 1–4 + Academy Training -15g** | Fast-track L3 Paragon evolutions. |
| **8** | 9,000 XP | **Tier 1–5 (Mythic Apex)** | All 40 champion contracts fully accessible. |
| **9** | 11,500 XP | **Tier 1–5** | Late-game siege reinforcement mastery. |
| **10** | 14,500 XP | **Tier 1–5 (Empire Mastery)** | Free Class Requisition orders + maximum stats. |

- **Zero RNG / Zero Rerolling:** A commander viewing the Mercenary Guild always sees their full unlocked pool. There is no reroll button and no 5g roll tax.
- **Pacing & Power Curves:** Reaching L5 unlocks Legendary tier champions and the Commander Active Skill around ~5:40 on standard income. Reaching L8 unlocks Mythic apex champions around ~15:00 at the start of Overtime.

---

## 4. 📈 Commander Level Curve & Training Valves

> **XP Sources:** (a) passive drip **10 XP/s** (scaled by production-rate and +XP blessings); (b) monster/boss last-hit bounties **+80 XP / +120 / +200 / +350 XP** (`Data/Monster/00` §7); (c) command cards granting tactical XP.

- **L8 ≈ 15:00 on pure passive** — matches the economy audit ("L8 by 15:00, L10 reachable with XP traits", `Data/Economy/00` §1).
- **L10 needs ~+34% XP** over passive — reachable with trait stacks (Scholar's Guild +15%, Blessing +25%, Omniscient Academy +50%; Crucible T3 +8 XP/s + 15% level-XP).

### 4.1 Academy Training XP Valve
- **Cost: `100g → +100 XP`** (1 XP/g into Commander Level or designated champion), no cooldown, unlimited.
- **Strategic Function:** An investment valve to fast-track Commander Level breakpoints (e.g. rushing L3 for Tier 3 Epics or L5 for Commander Skill unlock) or power-leveling a carry unit directly toward their L3 Paragon Evolution.

---

## 5. ⚔️ Unit Leveling & Paragon Ascension (max L3)

> **The unit level cap is L3** — canonical (Training Grounds T3's "+1% Max HP per level-up, max +2% per unit" requires it, `Data/FacilityList/00` §5).

### 5.1 Dual XP Progression Engine (Zero-RNG Leveling)

Unit progression from L1 → L2 → L3 is driven entirely by **tactical execution and strategic resource allocation**, with zero gacha or reroll luck:

#### A. Platoon Shared Squad XP Pool (Field Combat & Farming)

| Source | XP to EACH of the 5 Platoon Members |
| :--- | :--- |
| Monster kill (any of the 21 jungle creeps) | **+10 XP** |
| Enemy unit kill | **+20 XP** |
| Jungle Boss kill (Tuskgod, Stormwing, Emperor) | **+40 XP** |

- **Platoon Shared Pool:** When an engaged platoon assists in combat, **all 5 squad members receive 100% of the earned XP equally**.
  - **No Kill-Stealing / Support Parity:** Tanks, Supports, and Artisans level at the exact same pace as damage carries, preserving 5-man role diversity.
  - **Cross-Platoon Assists:** If two platoons coordinate to take down a boss or enemy platoon, both platoons receive full XP credit.
- **No Passive Drip on Inactive Platoons:** Units level strictly through battlefield participation or direct training.

#### B. Commander Academy Training Investment (Targeted Resource Allocation)
- **Direct Training Investment:** Commanders can allocate surplus resources directly into a favored champion in the Roster Panel to fast-track their growth.
  - **Cost:** `100 Gold` grants **+100 XP** directly to the selected champion.
  - **Strategic Macro Trade-off:** *"Do I spend 100g on hiring another unit, crafting Forge equipment, or power-leveling my frontline Tanker or Mage carry to their game-changing L3 Paragon Evolution?"*
  - **Zero Luck:** Both commanders have identical access to Academy Training. Matches are decided by resource prioritization, not reroll odds.


### 5.2 Thresholds, Visual Ascension & L3 Paragon Evolution

| Level | XP Needed | Visual & Audio Identity | Stat & CDR Gains | Gameplay Evolution |
| :--- | :--- | :--- | :--- | :--- |
| **L1: Recruit** | 0 XP | Standard 64px sprite; bronze foot decal. | Baseline attributes. | Base active ability & passive. |
| **L2: Veteran** | 100 XP | **+8% Sprite Scale**; silver-crested HP bar; silver skybeam level-up VFX. | **+10% Max HP**<br>**+5% ATK / AP**<br>**+15% Cooldown Haste** | **Battlefield Lessons:** Restores **+20% Max HP** burst heal upon leveling. |
| **L3: Paragon** | 300 XP (cumul.) | **+15% Sprite Scale**; radiant **Golden Sunburst Crest** halo; gold HP bar + star badge; war horn fanfare. | **+20% Max HP**<br>**+10% ATK / AP**<br>**+25% Cooldown Haste** | **Skill Evolution (Overdrive):** Signature active ability gains a unique mechanical augment (see `Final - <Class>.md`). |

- **Pacing:** A farming squad reaches L2 after ~2 Common camps (~50 XP each), L3 after ~3 more. A PvP squad reaches L2 after ~5 enemy kills.
- **Stacking:** Level bonuses multiply cleanly on top of base stats and the 2:30 escalation stat gain (`Data/Economy/01` §2). Final stat = base × escalation × level.
- **Level-up heal:** +20% Max HP on reaching L2/L3 (can clutch mid-fight turns and feeds Training Grounds).

### 5.3 Death, respawn & resign

- **Level persists through death** — the 30s Graveyard respawn (`Data/Economy/01` §3) brings the veteran unit back at its current level. Losing a fight costs tempo, never XP.
- **Resigning (selling) resets:** a re-hired unit is a new instance at **L1**. The 70% refund + 30s slot lock (`Data/Economy/01` §3) taxes churn, so resetting veterans is naturally expensive.
- **Free-unit grants arrive at L1.**

### 5.4 Interactions (canonical)

- **Training Grounds T3:** every level-up heals allies (20→40% Max HP by tier, radius 6→10) **and** grants the leveling unit +1% Max HP permanently (max **+2%** per unit at L3, `Data/FacilityList/00` §5).
- **War Room T3:** Orders Relay periodically resets the remaining cooldown of the highest-cooldown ability of all friendly units.
- **Hunter's Lodge / bounty blessings** do **not** touch unit XP (gold bounties only).

---

## 6. 🔗 Canonical Sources & Supersessions

- **Supersedes (implicit only):** no prior file specified the shop, commander level, or unit levels — these were the P0 gaps. Tier "Shop Odds" wording in `Data/UnitRoster/00` §2.1 is now quantified by §3 above.
- `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` — hire price, escalation, Resign, respawn (unchanged, referenced).
- `Data/BlessingList/00 - Blessing System Overview, Draft Rules & Audit.md` — XP sources (§4.3), interest traits (§4.11), minute-boundary resolution.
- `Data/FacilityList/00 - Facility Pool (18 Facilities).md` — Training Grounds §5, War Room §4 (Orders Relay).
- `Data/UnitRoster/00 - Unit Roster Overview & Class Definitions.md` — tier baselines & class modifiers (recruit pool).
- `TextPlan/02 - Units & Platoons/Commander & Platoon System.md` §6 — pure command cards and platoon strategy.
