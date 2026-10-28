---
tags: [Items, Equipment, Crafting, Jungle, Materials]
type: Data - Authoritative
---

# 🎒 ITEM LIST — ACQUISITION, EQUIPMENT RULES & CRAFTING TABLE

> **This is the real item list.** Designed against the 80-unit roster in `Data/UnitRoster` (Final files). Equipment is a **jungle-material → craft → equip** pipeline (TFT-style combine), separate from the legacy gold/time **consumable** lane in `§9 of this file` (Healing Flask, Speed Elixir, Damage Tonic, Siege Bomb — which stay as-is and remain the substrate for the 5 Item Traits and the artisan synergy of Quartermaster Sable / Master Enchanter Odette).
>
> **Rule of authority:** this file's **equipment** rules supersede the legacy "1 slot per Platoon Commander" rule for combat equipment (the game is an auto-battler — units equip items, the player is only a commander). On any number conflict, the numbers here win.

---

## 1. ⚔️ Equipment Rules (enforcement)

- **1 item per unit.** Every active army unit (all 80 roster units, incl. Artisans) may equip **exactly 1 item**. No unit may hold a 2nd item.
- **Equipping & Unequipping Location Gate (Dual Logistics Model — Jev Evaluated):**
  1. **Courtyard Safe Zone Baseline:** Instant, zero-cooldown equipping while inside the Castle Core / Inner Keep or an intact Outpost.
  2. **Out-of-Combat Field Channel (8s):** Any unit on the battlefield can equip an item from the Arsenal by standing still and channeling for **8.0 uninterrupted seconds out of combat** (taking or dealing zero damage). Taking damage or issuing an attack instantly cancels the channel.
  3. **Automated Flying Courier Drone (15s Delivery):** The Arsenal features an automated aerial courier drone. When an item is dispatched to a forward unit, the drone flies at 6.0 hex/s (15s average transit). While in transit, the drone is untargetable except by enemy ranged towers/Marksmen with true sight.
  4. **Artisan Instant Armoring:** Platoons accompanied by an active **Artisan** bypass channeling entirely, equipping items instantly on the move.
- **Death & Item Retention (Anti-Combat Recycling & Atomic Locks):** When a unit dies, its equipped item **does NOT return to the Arsenal**. The item **remains equipped on the fallen unit** while it awaits its 30s respawn cooldown in the Graveyard, and respawns equipped on that unit at the Core. Equipping operations utilize atomic transactional mutex locks; a unit dying during an equip channel immediately aborts the equip and leaves the item in the Arsenal, strictly preventing item duplication bugs.
- **Compatibility:** each item lists **1–3 compatible classes** (hard max 3, per the Item Scoring System §6). The system refuses to equip an incompatible item.
- **Effect Cap Rule (no double-application):** a named item effect applies **once per target**, regardless of how many carriers equip that item. Two units carrying the same item share a **single** effect cap (e.g., two Sunderblades shred a target to a **shared cap of 15 armor** — never 30; two Bulwark Cores grant **one** +5% DR aura, not two). If an **Ancient** copy is present, **Ancient priority** applies — the Ancient's effect fully replaces all non-Ancient copies of the same item, and nothing stacks on top of it.
- **Ancient source gate:** the **Ancient** quality tier (§4) can be produced **only** by **Genius-tier or higher** trait sources (quality-upgrade effects, unique-item traits). No Ordinary / Extra / Perfect-tier source may ever create an Ancient item.
- **Divine items:** see **§5.5** — a **non-craftable**, condition-gated tier granted only by explicitly named **Goddess-tier** blessings (randomly). Never obtained from the Jungle, the Bazaar, or crafting.

---

## 2. 🧪 Materials — the 7 Base Components

All materials are **Jungle-only**: each material drops **exclusively** from its corresponding jungle monster family (see `Data/Monster/00 - Jungle Monsters & Material Drops.md`).

| # | Material | Stat family | Drop source (exclusive) | Bazaar pity price (per copy) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Gilded Ore** | Physical power (+ATK) | Ironhide Boars | 150g |
| 2 | **Arcane Crystal** | Magic power (+AP) | Verdant Wyrms | 150g |
| 3 | **Ironwood Timber** | Durability (+HP) | Ancient Treants | 150g |
| 4 | **Emberbloom Sap** | Sustain (regen / lifesteal) | Emberbloom Insects | 150g |
| 5 | **Stormfeather** | Tempo (ASPD / move speed) | Stormcrest Raptors | 150g |
| 6 | **Voidshard** | Utility (CC-resist / penetration) | Shadowmaw Spiders | 150g |
| 7 | **Sunforge Alloy** | Fortitude (shields / damage reduction) | Sunforged Golems | 150g |

**Material rarity (from monster strength):** every material comes in **Common / Rare / Epic** quality, determined by which monster variant dropped it (Common camps → Common; Rare camps → 55% Rare; Elite lairs → 40% Epic). Rarity never creates new items — it sets the crafted item's **quality tier** (§4).

---

## 3. 🗺️ Item Acquisition Rules (refinement)

1. **Jungle exclusivity:** no material can be obtained anywhere except its monster family's camps in the Jungle biome. Cards, traits, and facilities never generate equipment materials.
2. **Multi-copy drops:** a single monster may drop **multiple copies of the same material** (2–3 on Common camps, 1–2 on Rare/Elite) — this is what makes full-equip-by-10:00 feasible (§7).
3. **Pity / fallback purchase (Jungle Bazaar):** if a player fails to obtain a needed material through drops, they may **buy the material outright** at the Bazaar prices above (per rarity: Common 150g · Rare 300g · Epic 500g).
   - **Price rationale — drops stay primary:** one Common camp cycle (~95s incl. clear, travel & respawn) yields ~12 Common copies for free; buying the same ~12 copies costs **1,800g ≈ 3 minutes of passive income (10g/s)**. A full item bought outright (~4 materials) costs **600g ≈ 60s of income** vs. farming it in ~2 camp cycles. Buying is a **~3× premium** over farming — always available, never the efficient path.
   - **Full items are never sold** — the Bazaar sells materials only; the crafting table is the only way to make items (TFT homage).
4. **Contest window:** jungle camps are contested from **5:00** onward (Expansion Phase, per `TextPlan/01 - Core Rules & Mechanics/Match Timeline & Phases.md`). Farming in the Opening (0–5:00) is uncontested unless your opponent raids early.
5. **Trait-gated tiers (never farmed):** **Ancient** items come only from **Genius+** trait sources (§4 quality-upgrades), and **Divine** items come only from explicitly named **Goddess** blessings under a condition (§5.5). Neither ever drops from monsters, the Bazaar, or a craft action directly.

---

## 4. 🛠️ Crafting (TFT-style combine)

- **Recipe:** a full item = **exactly 2 components**. Pairs may be **two distinct materials** (the standard row) **or** a **same-material pair** — but only the **4 listed "pure" recipes** (Ore+Ore, Crystal+Crystal, Timber+Timber, Sap+Sap) are craftable, and there are **no 3-material recipes**. With 7 materials this pins the table at **C(7,2) = 21 distinct pairs + 4 pure recipes = 25 items**.
- **Craft action:** at the **Resource Tab** (a friendly courtyard hex facility), a **10s stationary channel**, base cost **30g**. Any free unit or Artisan may channel; Quartermaster Sable's **Supply Lines** (alive-gated) cuts craft time −50% / gold −30%; the **Quick Crafting** trait cuts −50% / −25%; combined caps hold at **50% time / 45% gold** (per `Data/UnitRoster/Final - Artisans.md` anti-stack table).
- **Quality ladder:** quality is a single multiplier on the item's **base stats** (the printed stat lines), set at craft by the **highest material rarity** in the recipe (all-Common → **Common**; any Rare → **Rare**; any Epic → **Epic**). One clean ladder, no mixed-rarity rules:

  | Quality | Stat multiplier | Effect multiplier |
  | :--- | :--- | :--- |
  | **Common** | `1.0×` | `1.0×` |
  | **Rare** | `1.2×` | `1.0×` |
  | **Epic** | `1.5×` | `1.0×` |
  | **Ancient** | `2.0×` | `2.0×` — the item's passive **doubles** (all numbers in the effect double) |

- **Ancient production (Genius+ gate):** there is **no Ancient material** — Ancient is never craftable from the jungle. It appears **only** via **Genius-tier or higher** trait sources: quality-upgrade effects (Grand Forge's 20% chance, Celestial Forge's 40% chance, Pandora's Genesis's once-per-turn upgrade) roll an Epic item up to **Ancient**; unique-item traits (The Inventor, The Creator) may produce an Ancient directly. A trait below Genius tier can never create Ancient. *Example — Ancient Warblade: +40 ATK · +30 AP, and Runic Edge now deals +120% of ATK as bonus magic damage.*

### Combine Matrix (rows = first component, columns = second)

| | **Ore** | **Crystal** | **Timber** | **Sap** | **Feather** | **Shard** | **Alloy** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ore** | **Executioner's Claw** | **Warblade** | **Bastion Plate** | **Bloodlocket** | **Gale Blade** | **Sunderblade** | **Sunpiercer** |
| **Crystal** | — | **Spellforge Crown** | **Aegis Prism** | **Arcanist's Tonic** | **Storm Rod** | **Null Ward** | **Mantle of Dawn** |
| **Timber** | — | — | **Colossus Heart** | **Grove Barrier** | **Iron Strider** | **Bulwark Core** | **Vanguard Banner** |
| **Sap** | — | — | — | **Undying Bloom** | **Swift Mend** | **Vital Shard** | **Everflame Vial** |
| **Feather** | — | — | — | — | — | **Phantom Step** | **Sunstep** |
| **Shard** | — | — | — | — | — | — | **Nullpiercer** |
| **Alloy** | — | — | — | — | — | — | — |

> The 4 same-pair "pure" recipes sit on the diagonal (**Executioner's Claw, Spellforge Crown, Colossus Heart, Undying Bloom**). Remaining same-pairs (Feather+Feather, Shard+Shard, Alloy+Alloy) are deliberately **not** craftable.

---

## 5. 📦 The 25 Full Items

> All effects are **passive / automatic** — nothing requires player input (auto-battler compliance). "Class compat" is the max-3-class eligibility list. Items are listed at **Common** values — quality multiplies stats (and, for Ancient, the effect) per §4.

### Physical hybrids
1. **Warblade** *(Ore + Crystal)* — **Fighter · Mage · Marksman.** +20 ATK · +15 AP. **Runic Edge:** after using an ability, the next basic attack deals +60% of ATK as bonus magic damage. *Hybrid-carry burst for auto-attack/spell weavers (Gunmage Petra, Battlechanter Rory).*
2. **Bastion Plate** *(Ore + Timber)* — **Fighter · Tanker · Assassin.** +20 ATK · +300 HP. **Thick Hide:** +10% damage reduction while above 70% HP. *Frontline sustain for brawlers, the taunt tank (Aegis Bastion), and squish-patch assassins.*
3. **Bloodlocket** *(Ore + Sap)* — **Fighter · Marksman · Siege.** +20 ATK · +12% lifesteal. **Blood Rush:** killing an enemy heals 8% max HP. *Sustain for execute-chainers and slow siege units (Ironclaw Grendal, Ballista Vul).*
4. **Gale Blade** *(Ore + Feather)* — **Fighter · Marksman · Assassin.** +18 ATK · +25% ASPD. **Gale Cut:** attacks slow the target by 15% for 2s. *Kite/engage tempo (Stormdancer Kael, Hawkeye Vale) — and the assassin's jungle tempo pick.*
5. **Sunderblade** *(Ore + Shard)* — **Fighter · Tanker · Assassin.** +20 ATK · 15% armor penetration. **Sunder:** attacks shred 3 armor per hit (max 15, 5s). *Tank-buster — mirrors Vanguard Marrow's shred for the whole front line, and shreds marked monsters on assassin jungle clears.*

### Durability & utility
6. **Aegis Prism** *(Crystal + Timber)* — **Tanker · Mage.** +15 AP · +300 HP. **Prism Shell:** on lethal damage, survive at 20% HP (once per 30s). *The anti-burst safety net (Paladin Luxor, Timewarp Elowen).*
7. **Arcanist's Tonic** *(Crystal + Sap)* — **Mage · Support.** +15 AP · +8 HP/s regen. **Tonic Surge:** each spell cast heals 6% max HP. *Sustain for channel-casters and healers under dive (Astralweaver Orin, Seraph Angelus).*
8. **Storm Rod** *(Crystal + Feather)* — **Mage · Marksman.** +15 AP · +20% ASPD. **Static Overload:** every 3rd attack deals an extra 40% AP magic damage. *Spell-blade rhythm for hybrid DPS (Stormcaller Zeph, Gunmage Petra).*
9. **Null Ward** *(Crystal + Shard)* — **Mage · Support · Siege.** +15 AP · +15% CC-duration resist. **Null Field:** while the carrier is channeling, it gains a 1.2s spell shield (refreshes per 10s). *Channel protection — the perfect pick for Gorm, Kodo, Castella and Olum-class casters.*
10. **Grove Barrier** *(Timber + Sap)* — **Tanker · Support · Artisan.** +300 HP · +10 HP/s regen. **Grove Roots:** below 40% HP, +20% damage reduction. *Low-HP wall for frontline and dive-bait artisans (Stonewright Marble, Goldsmith Aurelia).*
11. **Iron Strider** *(Timber + Feather)* — **Tanker · Fighter · Siege.** +250 HP · +20% move speed. **Sturdy Gait:** immune to slows; 50% reduction vs displacement. *Speed patch for the slowest units — the class tax remover (Colossus Obr, Titan Mortar Gus).*
12. **Bulwark Core** *(Timber + Shard)* — **Tanker · Support · Artisan.** +350 HP · +10% damage reduction. **Bulwark Aura:** adjacent allies gain +5% damage reduction. *Mini-frontline aura (Aegis Bastion, Warden of Oath Galen).*

### Sustain & tempo
13. **Swift Mend** *(Sap + Feather)* — **Support · Fighter · Marksman.** +10 HP/s regen · +20% ASPD. **Swift Mend:** healing received +20%. *Compounds every heal — the healer-protector (Mender Tulia, Warcry Beserka).*
14. **Vital Shard** *(Sap + Shard)* — **Support · Tanker · Mage.** +10 HP/s regen · +10% CC resist. **Vital Ward:** the first time the carrier is disabled in a fight, instantly cleanse it and heal 10% max HP (once per 25s). *The anti-CC-chain safety (Oracle Vessa, Graviton Olum).*
15. **Phantom Step** *(Feather + Shard)* — **Marksman · Fighter · Artisan.** +18% move speed · +15% dodge. **Phantom:** the first basic attack against the carrier in each fight misses. *Kite/escape tempo for carries and site-running artisans (Phantom Dart Nyx, Guild Foreman).*

### The 10 new items (v2.1 — Alloy row + pure combines)

16. **Sunpiercer** *(Ore + Alloy)* — **Fighter · Marksman · Assassin.** +20 ATK · +10 DEF. **Searing Light:** attacks reduce the target's **healing received by 40% for 4s** (refreshed). *The anti-heal answer — counters Bloodlocket/Sanctuary sustain and Support-heal comps.*
17. **Mantle of Dawn** *(Crystal + Alloy)* — **Tanker · Mage · Support.** +15 AP · +300 HP. **Dawn Ward:** every **10s** the carrier gains a shield equal to **15% of its Max HP**. *A rotating shield battery for front-line casters and dive targets.*
18. **Vanguard Banner** *(Timber + Alloy)* — **Tanker · Fighter · Support.** +350 HP · +10% DR. **Banner of the First Line:** allies within **1 hex** gain **+10% ATK**. *A melee-team ATK banner — distinct from Bulwark Core's DR aura.*
19. **Everflame Vial** *(Sap + Alloy)* — **Support · Mage · Fighter.** +8 HP/s regen · +12% AP. **Kindle:** healing an ally grants that ally **+8% damage for 4s**. *Healing that empowers — supports turn heals into burst windows.*
20. **Sunstep** *(Feather + Alloy)* — **Marksman · Assassin · Fighter.** +15% ASPD · +10% move speed. **Critical Cadence:** every **4th attack** is a **guaranteed crit (×1.8)**. *Rhythm crits for carries and assassins — pairs with crit traits.*
21. **Nullpiercer** *(Shard + Alloy)* — **Mage · Assassin · Fighter.** +15 AP · 15% magic penetration. **Void Rift:** attacks and abilities shred the target's **MR by 3 per hit (max 15, 5s)**. *Sunderblade's magic twin — the magic-shred answer to MR-stacked tanks.*
22. **Executioner's Claw** *(Ore + Ore)* — **Fighter · Marksman · Assassin.** +28 ATK. **Bloodguilt:** attacks deal **+20% damage to enemies below 30% HP**. *The execute item — compounds with execute-threshold kits.*
23. **Spellforge Crown** *(Crystal + Crystal)* — **Mage · Support.** +28 AP. **Arcane Surge:** each ability cast grants **+3% AP for 8s** (stacks to **+15%**). *Caster snowball — spell-heavy mages ramp harder the longer they fight.*
24. **Colossus Heart** *(Timber + Timber)* — **Tanker · Fighter · Artisan.** +450 HP. **Gilded Constitution:** each kill grants the carrier **+1% Max HP permanently** (max **+10%**). *A scaling front line — tank-stacking that survives the long game.*
25. **Undying Bloom** *(Sap + Sap)* — **Tanker · Support · Fighter.** +14 HP/s regen. **Second Spring:** below **40% HP**, the carrier heals **3% Max HP per second** and gains **+15% DR**. *The last-stand sustain — the classic low-HP wall.*
26. **Aether Hourglass** *(Crystal + Feather)* — **Mage · Support · Tanker.** +15 AP · +15% Cooldown Reduction. **Chronoshift:** Casting an ability accelerates cooldown ticking by 1s for adjacent platoon allies within 1 hex (4s internal CD). *Tactical ability cycling and cadence accelerator.*
27. **Breachfang** *(Ore + Shard)* — **Fighter · Marksman · Assassin.** +22 ATK · +10% Armor Penetration. **Shieldbreaker:** Attacks deal **+100% bonus damage to temporary shields and barrier pools**. *Direct counterplay against shield-stacking compositions and barrier facilities.*
28. **Spiked Carapace** *(Timber + Alloy)* — **Tanker · Fighter.** +350 HP · +25 Armor. **Retaliatory Thorns:** When struck by physical basic attacks, reflects **20% post-mitigation damage** back to the attacker as physical damage. *Tank punish against rapid-fire physical marksmen.*
29. **Artificer's Lens** *(Crystal + Alloy)* — **Artisan only.** +150 HP · +15 AP. **Tactical Engineering:** Deployable structures (barricades, scaffolds, turrets) erected by the carrier gain **+25% Max HP**, and active construction/repair channel times are **reduced by 20%**. *Artisan signature item.*

---

## 5.5 ✨ The 6 Divine Items (Explicit Goddess Blessing Conditions)

> **Divine items are a separate lane above Ancient** — not a quality multiplier of the craftables. They are signature, game-shaping uniques that are **never crafted, bought, or farmed**.

**Rules:**
- **Only source — Goddess-tier blessings.** A Divine item is **randomly received** (uniform over the 6 below, re-rolled until a compatible carrier exists) when a Goddess blessing's **condition** is met (e.g., destroy the opponent's first wall segment, clear 10 jungle camps, reach 5,000 bank, 6 enemy kills, reach 10:00, 10th craft). See `Data/BlessingList/01 - Goddess Blessing.md` for the condition-gated grants.
- **Never instant:** unlike crafted items, a Divine item is **not received instantly** on picking the trait — it arrives only after its condition is fulfilled. If the condition is never met, the Divine item is never received.
- **Unique by item name (max 1 copy of each Divine item per army):** a Divine item cannot be stacked, duplicated, crafted, salvaged, transformed, or dropped. An army can own multiple **different** Divine items when separate conditions grant them; this preserves the two-item Gilded Chrysalis cashout. If a random grant rolls an already owned Divine item, reroll among eligible unowned items; if none remain, the grant yields no item.
- **No quality ladder:** the printed values are final (no Common/Rare/Epic/Ancient multiplier applies), and the **Effect Cap Rule (§1)** applies as usual.
- **Equip rules unchanged:** 1 item per unit; the carrier must be a compatible class.

### The 6 Divine items

1. **Excavate** *(a golden radiant shovel)* — **Any class** (jungle farmer). **Prospector's Rhythm:** every **10s** the carrier spends **inside the Jungle**, gain **+20 Gold** (≈ 2 g/s while jungling). *Economy accelerator for dedicated farmers.*
2. **Unite** *(a blood-soaked golden medal)* — **Support only.** **Shared Blood:** the carrier's **platoon's health pools combine into one large pool** and all platoon units use that pool instead of their own (the combined pool is **reduced by 20%** at merge). **Healing rules:** a **single-target heal** heals the pool for **base × (platoon size − 1)**; an **area heal** heals the pool for **base × platoon size**. *A radical front-line redesign — one shared health bar that heals scale against.*
3. **Absolute Shield** *(a silver shining shield)* — **Tanker only.** +50 Physical & Magic Defense. **Bulwark of Absolution:** the entire **platoon gains +30% damage reduction**. *The wall-sharer — a platoon-wide DR blanket for the front line.*
4. **Magnifier** *(an old rusted magnifier)* — **Any class** (ranged-leaning). +90 ATK and AP. **Telescopic Focus:** grants **+5 hex range**; for **every hex away from the target**, the carrier deals **+20% damage** (halved for **Fighter / Tank** roles). *The sniper's artifact — punishes distance with range-scaled burst.*
5. **Excalibur** *(a shining golden sword)* — **Any class** (killer). +110 ATK & AP · +10% lifesteal. **Coronation of Blood:** each **opponent unit killed** while carrying this item reduces the carrier's **Max HP by 1%** and increases its **ATK & AP by +2%** (caps: **−40% Max HP** and **+80% ATK/AP** — i.e., 40 participated kills). *The scaling duelist — trades survivability for runaway power.*
6. **Midnight** *(a pitch-black dagger)* — **Assassin only.** +150 ATK & AP. **Shadow's Contract:** every **20s out of combat**, the carrier's **next single-target damage instance is multiplied by ×5**. *The one-shot enabler — assassination on a 20-second clock.*

---

## 6. 📐 Item Scoring System (enforcement)

| Rule | Requirement | Result |
| :--- | :--- | :--- |
| **S1 — Coverage** | Every one of the 8 classes has **≥3** equipable items | Fighter 16 · Tanker 11 · Mage 10 · Marksman 9 · Support 11 · Siege 3 · Artisan 4 · Assassin 7 ✅ |
| **S2 — Max scope** | Every item is compatible with **≤3** classes | Max 3 (all 25 verified) ✅ |
| **S3 — Power budget** | Item = 2 stat lines (one per component) + 1 signature passive; total ≈ 10–15% of a unit's power (never a full tier's worth) | Verified against Final stat lines ✅ |
| **S4 — No-bloat** | No two items share a functionally identical passive (>70% overlap → merge or cut) | All 25 passives distinct ✅ |
| **S5 — Combine cap (TFT)** | Full items = exactly 2 components; only the 4 listed same-pair "pure" recipes allowed; no 3-component | C(7,2) = 21 + 4 pure = **25 items** ✅ |
| **S6 — Cognitive-load cap** | Total craftable entries ≤ 32 (7 materials + 25 items); the table fits one page; Divine items live in a separate non-craftable lane (§5.5) | 32 ✅ |
| **S7 — Tier gates** | Ancient only via **Genius+** trait sources; Divine only via explicitly named **Goddess** blessing conditions | §1 + §4 + §5.5 ✅ |
| **S8 — Effect Cap** | Same named effect applies once per target; Ancient copy takes priority | §1 (Effect Cap Rule) ✅ |

**Design-space notes (intentional cuts, not gaps):** no 3-material items; the Bazaar never sells full items; only 4 same-pair "pure" recipes exist (Feather+Feather, Shard+Shard, Alloy+Alloy stay dark); Divine items are unique (1/army) and never crafted. Any candidate item that duplicated an existing passive was merged or cut — the list stays lean on purpose despite the wider table.

---

## 7. ⏱️ Pacing Alignment — Full Equip by 10:00

> Goal: **every combat unit a player fields can be fully equipped (1 item each) within 10 minutes.** Verified via the drop math below.

| Match time | Milestone (2 farming squads; a Common camp cycle ≈ 95–100s — 5 monsters × ~8s squad clear) |
| :--- | :--- |
| 2:30 – 4:30 | First jungle squad online; first Common camp cleared → **~12 components banked** |
| 4:30 – 6:30 | 2 camps rotated → **~24 components**; first 3–4 full items crafted & equipped |
| 6:30 – 8:30 | 6–10 units equipped; Rare camps contested for quality upgrades |
| 8:30 – 10:00 | **Standard 10–14 unit army fully equipped (1 item each)**; optional Elite raid for Epic quality |
| 10:00 | Siege Phase opens — every fielded combat unit already equipped ✅ |

**Why it holds:** one Common camp = 5 monsters × ~2.5 copies = ~12 components of one material per ~95s cycle. One full item = 2 components. Two dedicated farming squads bank a 12-unit army's worth (~24 components) in **2–3 camp cycles ≈ 5 minutes of focused jungle time** — comfortably inside the 10:00 budget even after travel, contests, and Bazaar fallbacks. Assassins (15s solo clears, §Monster file) make a focused farmer even faster.

> **Trait-gated tiers are NOT part of this pacing:** Ancient items arrive only from **Genius+** trait effects, and Divine items only from explicitly named **Goddess** blessing conditions — they are quality/condition rewards on top of the 10:00 full-equip baseline, never a farm target.

---

## 8. 🔗 Integration Notes

- **Tactical Alchemy Satchels (Consumables) remain distinct from Equipment:** Healing Flask, Speed Elixir, Damage Tonic, and Siege Bomb are single-use alchemical consumables governed by **§9 Tactical Alchemy Satchel System** below. They do not occupy a unit's permanent equipment slot.
- **Artisan alignment:** Sable's Supply Lines and Odette's Gilded Items apply to both equipment crafting and alchemical satchels; the anti-stack caps (50% time / 45% gold craft) from `Final - Artisans.md` are respected in §4.
- **Auto-battler compliance:** zero items require manual twitch clicks — equipment passives are always active, and tactical consumables trigger via deterministic condition thresholds (or macro order execution).
- **Monster source of truth:** all material drop rates, monster stats, and kill-time calibrations live in `Data/Monster/00 - Jungle Monsters & Material Drops.md`.

---

## 9. 🧪 Tactical Alchemy Satchel System (Consumables Lane)

> **Architectural Resolution:** This section defines the consumable pipeline (Healing Flask, Speed Elixir, Damage Tonic, Siege Bomb) and harmonizes with the 5 Item Traits (`Alchemical Cache`, `Master Smith`, `Elixir Mastery`, `Relic Affinity`, `Quick Crafting`). 
> - **Equipment** (governed by §1–§7) equips to **individual units** (1 slot per unit, locked to Safe Zone equipping, retained through death).
> - **Consumables** are **Tactical Alchemy Satchels** equipped to a **Platoon's Tactical Belt** (1 consumable satchel per platoon; free Assassins/Scouts carry 1 individual satchel).

---

### 9.1 🧴 Platoon Tactical Belt & Trigger Conditions

- **Platoon Belt Capacity:** Each formed platoon features **1 Tactical Belt Slot** dedicated to single-use alchemical satchels.
- **Crafting & Stowing:** Consumables are crafted from the Resource Tab (or forward-crafted via Artisan Field Kits). Once crafted, a consumable is assigned to any platoon's Tactical Belt.
- **Deterministic Auto-Trigger:** Because *Aurolith* is an auto-battler RTS hybrid, satchels trigger automatically based on battlefield conditions:
  - **Healing Flask:** Automatically triggers when any unit in the platoon drops below **40% HP**, restoring `150 HP` to all units in the platoon.
  - **Speed Elixir:** Automatically triggers when the platoon receives a macro **`A` (Attack)**, **`R` (Retreat)**, or **`J` (Jungling)** command, granting **+30% Movement Speed** for 20s.
  - **Damage Tonic:** Automatically triggers when the platoon enters active combat with enemy champions or boss camps, granting **+20% Attack DPS** for 20s.
  - **Siege Bomb:** Automatically thrown when the platoon enters within 2 hexes of an intact enemy wall segment, dealing **`300 Direct Siege Damage`**.
- **Post-Use State:** Upon activation, the consumable charge is consumed and the platoon's Tactical Belt slot empties.
- **Death & Persistence:** Satchels stowed on a platoon's belt persist until triggered. If all units in a platoon are wiped before triggering the satchel, the satchel remains safely stowed on the platoon's banner and is available when the platoon reforms at the Core.

---

### 9.2 🧪 Craftable Alchemical Satchels

| Consumable Satchel | Type | Effect | Craft Time | Cost | Auto-Trigger Condition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Healing Flask** | Sustain | Restores `150 HP` to all platoon members | 15s | 50 Gold | Platoon member falls below 40% HP |
| **Speed Elixir** | Mobility | Grants **+30% Movement Speed** for 20s | 15s | 50 Gold | Platoon receives `A`, `R`, or `J` order |
| **Damage Tonic** | Combat Power | Grants **+20% Attack DPS** for 20s | 15s | 50 Gold | Platoon enters champion/boss combat |
| **Siege Bomb** | Demolition | Deals `300 Direct Siege Damage` to wall | 25s | 100 Gold | Platoon reaches within 2 hexes of wall |

**Trait & Artisan Interactions:**
- **Elixir Mastery:** Doubles the duration of Speed Elixirs and Damage Tonics (40s) and grants +5% lifesteal.
- **Master Smith:** Increases all stat boosts granted by equipped items and satchels by **+35%**.
- **Quick Crafting:** Cuts craft time by **-50%** and Gold cost by **-25%**.
- **Alchemical Cache:** Delivers **3 free Healing Flasks + 1 free Siege Bomb** directly to the Arsenal at match start.
- **Relic Affinity:** Unlocks a **2nd permanent Equipment Slot** for all units in one designated platoon (does not affect satchel slots).
- **Master Enchanter Odette (Enchant Relic):** Permanently empowers a crafted satchel prior to deployment (Flask 150→225 HP · Elixir +30%→+45% · Tonic +20%→+30% · Bomb 300→400 damage).

---

### 9.3 ⚖️ Balance Guardrails

- **One Satchel Per Platoon:** A platoon cannot hoard multiple consumables; only 1 satchel may occupy a Tactical Belt at any time.
- **Stationary Channel:** Crafting at the Resource Tab requires a 10s stationary channel (reduced by Artisan synergies).
- **Refresh Over Stacking:** Consumable buffs follow the universal rule: identical buffs refresh their duration rather than stacking stat magnitude.
