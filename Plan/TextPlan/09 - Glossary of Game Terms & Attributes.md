---
tags: [Glossary, Terms, Attributes, Definitions, System]
type: System Core
---

# 📖 GLOSSARY OF GAME TERMS & ATTRIBUTES

> **Purpose:** every game term, attribute, or mechanic name that appears anywhere in the plan vault **without a definition in its own file** is collected here. Each entry gives the **canonical definition** (where one exists, with its authoritative source) or a **working definition from usage** plus an explicit **⚠ needs-definition** flag where the vault has never actually specified it.
>
> **Rule of authority:** `Data/BlessingList/00 - Blessing System Overview, Draft Rules & Audit.md` §4 (Term Dictionary & Combat-State Machine) is the contract layer for the 150-blessing verbs. Where this glossary and that §4 both define a term, they agree; where they differ, the BlessingList §4 definition wins.
>
> **Legend:** ✅ = canonically defined somewhere in the vault (source given) · 🟡 = defined by usage but never formally specified (working definition) · ⚠ = mentioned but genuinely undefined — needs a canonical definition before coding.

---

## 1. 🪙 Economy & Resources

| Term | Status | Definition |
| :--- | :--- | :--- |
| **bank / active bank** | 🟡 | The commander's spendable gold pool. **Vaulted gold (Golden Vault deposits) leaves the active bank and cannot be spent until the term matures.** "Bank-threshold" traits/blessings (Copper/Silver/Golden Interest, War Bonds, Endless Treasury) evaluate the *active* bank only. *Sources of usage:* `Data/FacilityList/00` §5, `Data/Economy/00` §4.3, all BlessingList tiers. **Needs a canonical single-line definition (proposal above).** |
| **lump / minute lumps** | ✅ | A whole-block gold payment that lands on a minute boundary (as opposed to a per-second drip). Caravan Post (150/300/500g) and the Golden Vault's matured deposit are lump payments. *Source:* `Data/FacilityList/00` §2-1 (self-described). |
| **tick** | ✅ | Disambiguated (Wave 0, §8.5): **(a) escalation tick** = the 2:30 hire-price/stat escalation (`Data/Economy/01` §2); **(b) blessing tick (minute tick)** = blessing evaluations at the 0:00/1:00/… minute boundary (`Data/BlessingList/00` §4.2); **(c) draw tick** = the 2:30 card-draw cadence (`TextPlan/05`, `TechnicalPlan/04`). Use the prefixed names going forward. |
| **Bazaar / Bazaar pity prices** | ✅ | The item shop lane: pity-purchase prices 150/300/500g (Common/Rare/Epic), stock system, unlimited-with-conditions purchases. *Source:* `Data/BlessingList/00` §4.9; prices in `Data/ItemList/00` §1. |
| **Arsenal** | ✅ | The shared item inventory that holds crafted/found items; items are equipped from it and return to it (lossless). *Source:* `Data/ItemList/00` §1. |
| **material drip** | ✅ | Passive generation of crafting materials (a production-rate-scaled income lane). *Source:* `Data/BlessingList/00` §4.9. |
| **Resign / Resign slot lock** | ✅ | Selling a unit back for **70% of the paid (escalated) price**; the vacated slot is locked for **30s** (15s with Recruit Depot T3). *Source:* `Data/Economy/01` §3, `Data/FacilityList/00` §2-3. |
| **last-hit bounty** | ✅ | The final killing blow on a monster pays **+80 XP | +100 Gold** to the killing player. *Source:* `TechnicalPlan/01`, `Data/Monster/00`, `Data/BlessingList/00` §4.3. |
| **Overtime** | ✅ | The final match phase (15:00–18:00) with ramping economy/free scout; the phase after normal time. *Source:* `TextPlan/01 - Match Timeline & Phases.md`, `TechnicalPlan/06`. |
| **Core Upgrades** | ✅ | Always-available base infrastructure (no slot, no footprint, cannot be sieged): Core Treasury (+5/+7/+10 g/s), Core Crucible (+3/+5/+8 XP/s), Core Barracks (+2 cap/tier → cap 20). *Source:* `TextPlan/03 - Facilities/02 - Core Upgrades (Treasury, Crucible, Barracks).md`. |
| **quality tier** | ✅ | Common → Rare → Epic item/consumable quality ladder (Bazaar pity 150/300/500g). *Source:* `Data/ItemList/00` §1. |
| **Resource Tab** | ✅ | The UI panel showing gold / XP / materials / items. *Source:* `Data/ItemList/00` §1. |
| **bounty bonus cap** | ✅ | Total monster-bounty bonus (facility + traits) is hard-capped at **+150%**. *Source:* `Data/FacilityList/00` §2-2. |
| **gold-income multiplier cap** | ✅ | **DECIDED (Wave 0, §8.9):** total **passive-lane gold-income multiplier cap = ×2.0** (passive gold only; bounty/kill lane has its own +150% cap). See `Data/Economy/00` §7-5. |

---

## 2. ⚔️ Combat, Damage & Status

| Term | Status | Definition |
| :--- | :--- | :--- |
| **breach / wall breach** | ✅ | A wall **segment** (6 hexes wide) destroyed when its HP hits 0. Breach events fire blessing triggers (Gilded Taxes +100g, Gilded Monarchy +150g, etc.). *Source:* `Data/BlessingList/00` §4.4; HP model in `TextPlan/01 - Castle & Defensive Layers.md`. |
| **bottleneck / breach mouth** | ✅ | The **6-hex set of tiles adjacent to a breached wall segment** — the only passable entry through that segment (§8.7). Defender funnels attackers here; siege AI prioritizes these hexes. *Sources:* `TechnicalPlan/05`, `TechnicalPlan/01`; canonical: §8.7. |
| **siege damage / siege unit / non-siege** | ✅ | "Siege" is a **target category**, not a damage type: damage to wall segments that bypasses the non-siege penalty. The wall has **70% non-siege damage reduction** (with Demolition Sapping decaying 5%/15s down to 35%) — non-siege attacks deal 30%; siege units (and siege damage bonuses) deal full damage; true damage also bypasses. *Source:* `Data/BlessingList/00` §4.6 + §4.4, `TextPlan/01 - Castle`. |
| **Core / Core Keep** | ✅ | Three meanings disambiguated (§8.6): **Core** (unqualified) = the central keep structure (4,500 HP) in the Inner Keep whose destruction loses the match; **core economy** → use *passive income*; **Core Upgrades** (capitalized) = Treasury / Crucible / Barracks. |
| **wall segment / 6-hex segment** | ✅ | A segment of the Outer Wall (5 segments @ 3,000 HP) or Inner Wall (5 @ 4,500 HP), each 6 hexes wide. *Source:* `TextPlan/01 - Castle & Defensive Layers.md`. |
| **DR (Damage Reduction) / armor formula** | ✅ | `DR = DEF/(DEF+100)` (same for MR). %-DR bonuses stack multiplicatively, hard cap 70%. *Source:* `Data/BlessingList/00` §4.6, `Data/UnitRoster/00` §2.3. |
| **CC / crowd control** | ✅ | Status effects that restrict actions: root, stun, silence, taunt, charm, polymorph, slow. *Source:* `Data/BlessingList/00` §4.7 (CC-DR window & types). |
| **cleanse** | ✅ | §8.4: removes all removable debuffs, DoTs and hard CC (root/stun/silence/taunt/charm/polymorph/slow) on the friendly target; does not remove buffs; does not prevent re-application. |
| **spell shield** | ✅ | §8.4: negates the next enemy **ability** (damage + CC); auto-attacks/wall damage not negated; true-damage abilities are negated; one shield per unit (re-cast refreshes), expires after 1.2s unused. |
| **anti-heal** | ✅ | §8.4: reduces all incoming healing (spells, lifesteal, HoT, facility regen) by **50%** (additive stacking, cap 70%) for its duration. |
| **HoT (Heal over Time)** | ✅ | §8.4: heals X HP/s for its duration; ticks every 1s; same-source refresh, different sources stack; counts toward anti-heal. |
| **DoT (Damage over Time)** | ✅ | Damage over time — burn/oil/poison effects with a per-second rate and duration (unit kits; the legacy facility burns — Mortar oil, Flame Projector — were removed in the Combat-facility rework). |
| **lifesteal** | ✅ | Heals the attacker for a % of post-mitigation physical damage (cap 50% additive). *Source:* `Data/BlessingList/00` §4.6. |
| **crit / critical strike** | ✅ | ×1.5 baseline multiplier; blessings override (×1.8 Precision Aim, ×2.0 Apex Marksman). *Source:* `Data/BlessingList/00` §4.6. |
| **CDR (Cooldown Reduction)** | ✅ | Ability cooldowns complete X% faster; additive, cap 60%. *Source:* `Data/BlessingList/00` §4.6. |
| **execute threshold** | ✅ | A %-HP threshold at which a unit re-targets and can instantly kill (Grendal 25%, Castella 20%, Nightblade <40%, Doomblade <15%). *Sources:* `Data/UnitRoster/07/08`. |
| **true damage** | ✅ | Ignores DEF/MR and the wall's non-siege penalty. *Source:* `Data/BlessingList/00` §4.6. |
| **shred vs halve** | ✅ | Interaction order defined: halve → then shred (never double-applied). *Source:* `Data/BlessingList/00` §4.6 (⟲ correction). |
| **taunt** | ✅ | Forces the taunted unit to attack/engage the taunter (AI-controlled). *Source:* `Data/UnitRoster/08` §1.5. |
| **out of combat (OOC)** | ✅ | Not part of a Running fight; Mess Hall-style regen requires 10s with no damage. *Source:* `Data/BlessingList/00` §4.1. |
| **stealth / stealthed** | ✅ | §8.1 (Assassin Shroud): a stealthed unit is SHROUDED to enemies; attacking/casting breaks stealth; taking damage reveals 0.5s without breaking; true sight/wards reveal fully. |
| **ward** | ✅ | §8.4: placed vision object (Vital Ward / Null Ward, scout cards) — 3-hex radius, **true sight** inside it, 60s duration, 30 HP, occupies a tile. |
| **true sight** | ✅ | Reveals stealthed units and traps inside its radius (the Ward Spire facility that provided it was **removed** in the v3.1 Combat-facility rework; sources now: Silas's Spotter's Blade, Vital/Null Wards, Scout cards). *Source:* `Data/FacilityList/00` §8 (stealth-counter flag). |
| **Shroud / Fortress Shroud / Assassin Shroud / ShroudState** | ✅ | **Canonical (§8.1):** `SHROUDED` = invisible/untargetable fog; `REVEALED_CATEGORY` = category-only intel; `FULLY_REVEALED` = full identity/stats. **Fortress Shroud** = world fog outside vision (default SHROUDED). **Assassin Shroud** = personal stealth that forces SHROUDED even inside vision; true sight/wards defeat it. Reveal priority: vision > stealth > true sight. |
| **FoW / fog of war / hotseat** | ✅ | FoW = the Fortress Shroud system (§8.1) rendered per active perspective; **hotseat** = local same-screen 1v1 where the camera/perspective switches between players and each side sees only its own vision. |
| **trap** | ✅ | Card-laid area hazards, 5 types (LANDMINE / SPIKE_CHOKEPOINT / DECOY_ILLUSION / AMBUSH_NET / GAS_CLOUD), 1.2s arming fuse, detonation AoE per type (canonical trigger/AoE set in `TechnicalPlan/04` §TrapField + `Data` trap cards). *Sources:* `TechnicalPlan/04`, `Structure.md`. |

---

## 3. 🏰 Structures, Facilities & Board

| Term | Status | Definition |
| :--- | :--- | :--- |
| **Inner Wall Slot / Outer Courtyard / Inner Keep** | ✅ | Each side has **6 facility slots**: 4 in the 10-row Outer Courtyard + 2 in the 8-row Inner Keep, both within the 48-column castle. *Sources:* `TextPlan/01 - Castle & Defensive Layers.md`, `TextPlan/03 - Facilities/00`. |
| **3×3 footprint** | ✅ | Facilities occupy a 3×3 hex footprint (multi-hex structure). *Source:* `Data/FacilityList/00`. |
| **damage retention / 50% refund** | ✅ | A facility under construction retains damage dealt; upgrading mid-construction refunds 50% of paid cost. *Source:* `TextPlan/03 - Facilities/00` §1. |
| **rubble** | 🟡 | The 10-second cleanup phase after a facility/structure is destroyed (blocks the tile). *Source:* `TechnicalPlan/05`. |
| **Duplicate rule** | ✅ | Copies of a facility are allowed: highest-tier copy = 100%, every other copy = 50% potency (cooldowns unchanged); 1/2/3 copies = 100/150/200%. *Source:* `Data/FacilityList/00` §5. |
| **category cap** | ✅ | Max 3 facilities of any one category (Production/Combat/Buff) per side. *Source:* `Data/FacilityList/00` §5. |
| **Siege Range Doctrine (30-hex cap)** | ✅ | No Combat Facility's attack range may exceed 30 hexes from the owning wall; mid-field (~75) is unreachable. *Source:* `Data/FacilityList/00` §3. |
| **mid-line** | ✅ | The board-center column boundary between **c 74 and c 75** (150-col board) — the deep jungle sits past it. Canonical: `TextPlan/01 - Board & Map Grid.md` §2 (added Wave 0). |
| **zone (JUNGLE_A / BATTLEFIELD / JUNGLE_B)** | ✅ | Board = 150 columns (c 0–149) × 90 rows (r 0–89). In rows 20–69, JUNGLE_A = c 0–29, BATTLEFIELD = c 30–119, JUNGLE_B = c 120–149. In castle rows, c 51–98 is the fortress and the sides are cloud. Canonical table: `TextPlan/01 - Board & Map Grid.md` §2. |
| **hex** | ✅ | The map's hexagonal tile; unit of distance (range, move speed in hexes/sec). *Source:* `Data/UnitRoster/00`, `TechnicalPlan/01`. |
| **tether leash / 5-hex leash** | ✅ | Platoons may not wander more than 5 hexes from their commanded position without re-command; the leash also slows. *Source:* `TextPlan/01 - Board & Map Grid.md`, `TechnicalPlan/01`. |
| **camp / neutral camp / Elite-lair boss** | ✅ | A group of neutral jungle monsters (21 monsters, 7 families × 3 tiers); an Elite-lair is the boss variant with an Epic material drop. *Source:* `Data/Monster/00`. |
| **jungle biome** | 🟡 | The jungle regions of the map where camps spawn. Defined by usage only. |
| **soft stacking** | ✅ | Up to 2 units per hex allowed (soft limit) with repulsion force; not a hard occupancy rule. *Source:* `TechnicalPlan/01`. |

---

## 4. 🪖 Units, Platoons & Commands

| Term | Status | Definition |
| :--- | :--- | :--- |
| **platoon** | ✅ | A formed group of exactly **5 units**; army cap 20 = **4 platoons × 5 units** (hotkeys `1`–`4`). Formed with classical 5-man role composition (Tank, Bruiser, Mage, Marksman, Support) yielding +5% (3 roles), +12% (4 roles), and +22% all stats + 10 Tenacity (5 distinct roles). *Source:* `Data/BlessingList/00` §4.5, `TextPlan/02 - Commander & Platoon System.md`. |
| **free unit** | ❌ **SUPERSEDED** | Legacy concept of unassigned rovers superseded by strict 4 platoons of 5 units. Every active unit belongs to one of the 4 platoons ($4 \times 5 = 20$). |
| **platoon leader** | ✅ | The unit in the platoon's anchor (lead) hex; set at formation. *Source:* `Data/BlessingList/00` §4.5. |
| **Platoon Commander** | ⚠ | Legacy concept ("1 item slot per Platoon Commander") **superseded** by "1 item per unit". The term must not be used going forward; the legacy lane in `Data/ItemList/00` §9 is archived. |
| **5-start pool** | ✅ | At match start each player freely selects 5 starter units; the core anchor for Commander / Commander of the Five. *Source:* `Data/BlessingList/00` §3. |
| **commander target** | ✅ | The facility/object the commander has set as their build/teleport target (Imperial Gate T2: "fallen units respawn at the Gate instead of the Core"). Canonical: a designated **own-side structure** (Core by default, else the Gate); one target at a time, reassigned by right-clicking the structure. |
| **waypoint / command target** | ✅ | A commanded destination hex for a platoon (vector-drag path painting / "assemble at target hex"). Canonical (§8.3): a waypoint is an **explicit order** — the highest priority in the command queue; platoons move to it and hold until a new order. |
| **command priority (A/R/J/D/G)** | ✅ | The 5-macro system plus the explicit-order layer. Canonical precedence (§8.3): **explicit order > Smart-Tactics reaction > macro posture > idle**. Macros persist until replaced; explicit orders are one-shot. |
| **stance (Aggressive / Defensive / Retreat)** | ✅ | Commander-level tactical postures biasing **platoon AI decision weights only** — no stat changes (`TechnicalPlan/03`, `TextPlan/02`): **[A] Aggressive** = hunt the nearest valid visible enemy within 12 hexes of the platoon anchor, press/dive <25%; **[D] Defensive** = hold leash, kite <60%, prioritize peel when ally <55% HP + counter-assassin; **[R] Retreat** = break combat, route to the Core, and gain +50% movement speed until entering the own Outer Courtyard perimeter (`TextPlan/01` §3). These two HP thresholds remain provisional with unspecified actions and are excluded from Stage 2 S2-2 acceptance per user direction. Paired with Focus Directives (`[Z]` Frontline, `[X]` Backline/Squishy, `[C]` Siege/Structures). |
| **respawn / Graveyard / revive** | ✅ | **(v3.1 — decided)** Dead units enter the **Graveyard** queue and **respawn automatically after a 30s timer** — free, keeps level, holds the army slot. **Resign is the only permanent removal** (70% refund + 30s slot lock). **Revive** = in-fight return (Undying Host, banners, Undying Will card); a revived unit that dies again respawns at **2× (60s cap)** until it survives 30s. *Source:* `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3; facility levers: Sanctum, Recruit Depot, Imperial Gate T2 (`Data/FacilityList/00`). |
| **Scout mission / scout window / intel** | 🟡 | The Intelligence & Scouting card category (10s scout window) and the Assassin scout protocol (returns intel 1 sharpness tier tighter). *Source:* `TextPlan/05 - Command Cards`, `Data/UnitRoster/Final - Assassins`. |
| **sharpness tier** | ✅ | The precision of a scout/intel report (§8.7): **Vague** (category only) → **Precise** (identity + HP band) → **Exact** (full stats + cooldowns). The Assassin scout protocol returns results 1 tier tighter. |
| **dive / dive range** | 🟡 | A unit's capacity to reach and kill a backline/squishy target (backline hunters, Assassin dive priority). Defined by usage only. |
| **banner** | ✅ | Two distinct mechanics, disambiguated: **(a) Battle Banner** = a persistent aura object granting nearby allies +ATK (War Banner Shrine); **(b) Resurrection Banner** = a one-use object that revives one fallen unit (Bannerlord Cassius, Undying Host). Never share effects. |
| **Slayer's Mark** | ✅ | Universal Assassin secondary: ×1.4 damage vs monsters (the monster-hunting multiplier). *Source:* `Data/UnitRoster/Final - Assassins.md`, `Data/Monster/00`. |
| **energy / mana** | ❌ **REMOVED** | The old energy/mana casting resource is **replaced** by seconds-based cooldowns (`Data/UnitRoster/09` §3). All remaining "energy" text has been cleaned from the roster. Do not reintroduce. |

---

## 5. 🎴 Cards, Draft & Turn Structure

| Term | Status | Definition |
| :--- | :--- | :--- |
| **draw ticker / draw cadence** | ✅ | Cards draw every **2:30** (7 ticks in an 18-min match); extra buys cost 100/250/500/1000g escalating. Milestone bonus draws at first jungle clear, wall breach, and 10:00. *Source:* `TextPlan/05 - Command Cards`, `TechnicalPlan/04`. |
| **deck lock** | ✅ | Draws may be locked by conditions (unlock conditions / lock-until time, e.g., Overtime Surge at 15:00). *Source:* `TechnicalPlan/04` (DeckLocks). |
| **overflow slot (15s Action Buffer)** | ✅ | When the hand is full (6 cards) on a draw, the card enters a **15s Action Overflow Buffer**; if not played by timeout, it is auto-discarded. Features an instant-cast targeting reticle. *Source:* `TechnicalPlan/04`, `TextPlan/05`. |
| **tempo cards** | 🟡 | Extra card draws bought with gold ("buy extra tempo cards"). Defined by usage only. |
| **comeback bonus draws** | ✅ | At each **draw tick**, the trailing player (less cumulative damage dealt to enemy walls) receives **+1 bonus draw** (§8.7). If the hand is full, the bonus is banked and granted at the first draw tick with a free slot (max 2 banked). |
| **free cast (0 Gold)** | ✅ | All drawn cards are free to play; gold only buys extra draws. *Source:* `TextPlan/05`. |
| **Scout Vision (20s)** | ✅ | A 20-second temporary vision reveal granted by scout cards. *Source:* `TechnicalPlan/04`. |
| **turn = one game minute** | ✅ | "Per turn" = per minute, resetting at minute boundaries. *Source:* `Data/BlessingList/00` §4.2. |
| **mirrored tier / mirrored draft / anti-repeat / reroll** | ✅ | Both players draft from the same tiers on the same seed; panel lineups are anti-repeated across panels; each panel allows one reroll. *Source:* `Data/BlessingList/00` §2. |
| **cross-tier variants** | ✅ | The same named blessing at multiple tiers with scaled magnitude (Holy Nation +10/+20/+40%); only the highest-tier copy applies. *Source:* `Data/BlessingList/00` §1. |
| **draft panel / Blessing Rites** | ✅ | 3 In-Match Blessing Rites occur at 0:00, 5:00, and 10:00 presenting 3 tailored blessing choices (Smart Tailoring algorithm). *Source:* `Data/BlessingList/00` §2. |

---

## 6. 🕹️ Technical / Engine Attributes

| Term | Status | Definition |
| :--- | :--- | :--- |
| **2.5D Isometric / YSored world container** | ✅ | Y-sorted isometric render container (sort by y-position for depth). *Source:* `TechnicalPlan/08`, `10`. |
| **Flow Field pathfinding** | ✅ | Vector-field pathfinding for platoons + cached A* for singles. *Source:* `TechnicalPlan/02`. |
| **draw ticker scheduling** | ✅ | `DrawTicker.cadenceMs / tickSchedule / drawCountPerTick`. *Source:* `Structure.md`, `TechnicalPlan/04`. |
| **hotseat** | 🟡 | Local same-screen 1v1 with perspective switching. Defined by usage only. |
| **telemetry buffer (10,000 events)** | ✅ | Replay buffer with background Web Worker chunk archiving. *Source:* `TechnicalPlan/10`. |
| **soft-stacking limit** | ✅ | 2 units/hex soft cap with repulsion (see §3 above). *Source:* `TechnicalPlan/01`. |
| **raycast camera (minimap)** | 🟡 | The minimap's "raycast" 180×300 3:5 camera — coordinate transform, not true raycasting. Defined by usage only. |
| **BottleneckManager / breachMouthHexes** | 🟡 | Engine systems for the breach bottleneck hex set (see §2 bottleneck). Defined by usage only. |

---

## 7. ✅ Priority Fixes — RESOLVED (Wave 0)

All previously-flagged terms are now canonically defined in **§8** below. None remain open:

1. ✅ **Shroud / ShroudState / Assassin Shroud vs Fortress Shroud** → §8.1
2. ✅ **Stance (Aggressive / Defensive / Siege Focus)** → §8.2
3. ✅ **Command priority queue** → §8.3
4. ✅ **cleanse / spell shield / anti-heal / ward / HoT / stealth** → §8.4
5. ✅ **tick** (three meanings disambiguated) → §8.5
6. ✅ **Core** (three meanings disambiguated) → §8.6
7. ✅ **sharpness tier / comeback bonus / bottleneck** → §8.7
8. ✅ **Grid dimensions** (150 c × 90 r; zones bound) → §8.8
9. ✅ **gold-income multiplier cap (~×2.0)** — **DECIDED** → §8.9

> **Resolved earlier (v3.1):** respawn / rehire rule → `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3.

---

## 8. 📖 Canonical Definitions — Wave 0 Resolution

> These definitions close every entry above. They are authoritative until superseded by a dedicated spec file. Where a definition sets a concrete number for the first time, the number is a **recorded balance decision** that may be tuned without re-specification.

### 8.1 Shroud / Fortress Shroud / Assassin Shroud / ShroudState
Three visibility states (engine enum, `TechnicalPlan/01`):
- **SHROUDED** — not visible at all: no model renders, no targeting possible; only fog. Default state of enemy entities outside your vision.
- **REVEALED_CATEGORY** — the entity's *category* is visible (e.g. "Fighter", "Facility", "Trap") from scout intel / partial vision; exact identity, stats and cooldowns are hidden.
- **FULLY_REVEALED** — full identity, stats and state visible: friendly units, units inside your vision range, and everything revealed by scout cards (20s), wards, or true sight.
- **Fortress Shroud** = the world fog outside each side's vision — the default application of SHROUDED to enemy positions.
- **Assassin Shroud** = the Assassin's personal stealth. A stealthed unit is treated as **SHROUDED** by enemies even inside their vision. Attacking or casting **breaks** stealth (fully reveals); taking damage reveals it briefly (0.5s) without breaking it. **True sight** and **wards** reveal stealthed units fully and defeat the shroud.
- **Reveal priority:** vision range (FULLY_REVEALED) > Assassin Shroud (forces SHROUDED) > true sight/ward (forces FULLY_REVEALED).

### 8.2 Stance (Aggressive / Defensive / Siege Focus)
Commander-level tactical postures (HUD buttons) that change **platoon AI decision weights only** — no stat changes:
- **Aggressive** — when no explicit order or higher-priority reaction is active, hunt the nearest valid enemy within **12 hexes of the platoon anchor**. “Valid” means alive, visible to the platoon's owner, detectable if inside brush, and reachable by a path. Choose by anchor-to-enemy hex distance, breaking ties by unit ID; route to the nearest reachable engagement hex adjacent to the target. Dive threshold HP < 25%. **Default.**
- **Defensive** — hold at the commanded position: retreat/kite at HP < 60%, prioritize peel vs divers, never pursue past the leash.
- **Siege Focus** — prioritize wall/structure targets over enemy units (except units that engage directly); +30% structure damage while active.
The stance applies army-wide until changed; a macro command (`A/R/J/D/G`) does not cancel it — the stance biases how the macro executes.

### 8.3 Command Priority Queue
Per-platoon precedence, evaluated every decision tick (highest → lowest):
1. **Explicit order** — direct right-click target / vector-drag path / waypoint. One-shot: completes on arrival or is cancelled by a newer explicit order.
2. **Smart-Tactics reaction** — automatic combat reactions (dive, peel, execute thresholds, skill auto-cast per unit kits). Overrides the current posture.
3. **Macro posture** — the last issued `A/R/J/D/G` persists as default behavior until replaced.
4. **Idle** — hold position, regen, follow platoon anchor.
A new explicit order preempts lower levels for that platoon; a new macro replaces the previous macro only. *Implemented in `TechnicalPlan/03`; the doc's example is illustrative.*

### 8.4 Status Verbs
- **cleanse** — removes all removable debuffs, DoTs and hard CC (root/stun/silence/taunt/charm/polymorph/slow) on the friendly target; does not remove buffs; does not prevent re-application.
- **spell shield** — negates the next enemy **ability** (damage and any CC) that would hit the unit; auto-attacks and wall damage are not negated; true-damage abilities are negated. One shield per unit (re-cast refreshes); expires after 1.2s unused.
- **anti-heal** — reduces all incoming healing (spells, lifesteal, HoT, facility regen) by **50%** (additive stacking, cap **70%**) for its duration.
- **ward** — a placed vision object (Vital Ward / Null Ward items, scout cards): reveals a **3-hex radius**, provides **true sight** inside it, lasts **60s**, 30 HP, occupies a tile.
- **HoT** — heals X HP **per second** for its duration; ticks every 1s; same-source HoTs refresh, different sources stack; counts toward anti-heal.
- **stealth** — see §8.1 (Assassin Shroud).

### 8.5 tick — disambiguation
Use the prefixed names going forward:
- **escalation tick** — the 2:30 hire-price (+25%) / stat (+10%) escalation (`Data/Economy/01` §2).
- **blessing tick (minute tick)** — blessing evaluations at the 0:00/1:00/… minute boundary (`Data/BlessingList/00` §4.2).
- **draw tick** — the 2:30 card-draw cadence (`TextPlan/05`, `TechnicalPlan/04`).

### 8.6 Core — disambiguation
- **Core** (unqualified) = the game object: the central keep structure (4,500 HP) in the Inner Keep; its destruction loses the match.
- **core economy** → use **passive income**.
- **Core Upgrades** (capitalized) = the always-available base trio: Treasury / Crucible / Barracks.

### 8.7 sharpness tier / comeback bonus / bottleneck
- **sharpness tier** — precision of a scout/intel report: **Vague** (category only) → **Precise** (identity + HP band) → **Exact** (full stats + cooldowns). The Assassin scout protocol returns results 1 tier tighter.
- **comeback bonus draws** — at each **draw tick**, the trailing player (less cumulative damage dealt to enemy walls) receives **+1 bonus draw**; if the hand is full, the bonus is banked and granted at the first draw tick with a free slot (max 2 banked).
- **bottleneck / breach mouth** — the 6-hex set of tiles adjacent to a breached wall segment; the only passable entry through that segment. Defender funnels attackers here; siege AI prioritizes these hexes.

### 8.8 Grid dimensions (reconciled)
Board = **150 columns (c 0–149) × 90 rows (r 0–89)** = "90×150". In rows 20–69: JUNGLE_A = c 0–29, BATTLEFIELD = c 30–119, JUNGLE_B = c 120–149. In rows 0–19 and 70–89: castles = c 51–98 and sides are impassable cloud. Mid-line = the c 74/75 boundary. Canonical table: `TextPlan/01 - Board & Map Grid.md` §2.

### 8.9 gold-income multiplier cap
**DECIDED (Wave 0):** total **passive-lane gold-income multiplier cap = ×2.0** — applied to passive gold income only (sum of flats, then ×-multipliers, clamped to 2× scene baseline). The bounty/kill-gold lane has its own +150% cap and is exempt. See `Data/Economy/00` §7-5.
