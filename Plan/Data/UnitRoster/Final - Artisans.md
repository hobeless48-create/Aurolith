---
tags: [Final, Artisan, Unit, Production, Economy]
type: Final Unit List
---

# 🛠️ FINAL: ARTISANS (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All *active* production abilities use the standard seconds-based cooldown system and the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`.
>
> **Production-passive note (the class's one framework exception):** production passives (Foreman's −40%, Venn's −25%, Marble's repair rate, Sable's craft discount, Odette's +50%, Aurelia's +0.2g/s, Rook's +25% refund) are **alive-gated auras, not periodic skills** — no refresh CD, because their only gate is *the artisan staying alive*. That is exactly what makes "kill the Artisan = kill the production" the universal counterplay.
>
> **Artisan command behavior (defaults):** no offensive skills to gate — every ability is *production*. Command determines *where and what* they build: `D` work the highest-value base site · `G` build assigned structure at waypoint · `J` harvest/forward-build · `A` advance and build forward infrastructure · `R` return to base and resume production. Self-preservation: flee to nearest friendly structure when threatened (`08` §1.6). **Every Artisan occupies one of the 20 army-cap slots — a combat unit you no longer field.**

---

## ⚙️ CLASS CONTRACT (read before the units)

### Class Definition & Stat Framework

| # | Class | Core Identity | HP | ATK | DEF | MR | Range | Move | ASPD |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 7 | **Artisan** | Production capability — reduces facility/item cost & time, repairs structures, engineers the map. **Occupies a combat slot as its cost.** | ×0.85 | ×0.40 (**lowest in game**) | low–mid | low–mid | 1–2 | 1.8–2.1 | 0.5–0.7 |

- Artisan ATK ceiling (55, Bodhi) sits **below the Support floor** (58) — the most combat-helpless class, by design.
- No CC, no sustain, no shields, **no structure damage**. Their only defensive tool is the map they build.
- Tier spread is intentionally **T1–T4 only: 1/4/3/2/0** — no T5; production must never be an uninteractive lategame economy race.

### Production Economy Model & Audit Rule

- **Combat Slot Value (CSV):** gold-equivalent contribution of a single combat unit of that tier over an 18-min match (T1 ≈ 250g · T2 ≈ 350g · T3 ≈ 500g · T4 ≈ 650g · T5 ≈ 900g).
- **Total Production Value (TPV):** gold-equivalent value an Artisan generates over a full match.
- **Production Value Ratio (PVR) = TPV ÷ CSV. AUDIT RULE:** a healthy Artisan sits in the **0.7–1.0 band** — production pays back roughly what the sacrificed combat slot was worth, **never more than ~1.0** in winning states, so an artisan comp cannot out-pace a full-combat comp. Full audit: `07` §6.

### Anti-Stack Guardrails (why 3 artisans can't out-pace everything)

| Vector | Cap |
| :--- | :--- |
| Facility build/upgrade **time** discount (Foreman + any card/trait) | **40%** total, additive |
| Facility build/upgrade **gold** discount (Venn + any card/trait) | **40%** total, additive |
| Item craft **time** discount (Sable + Quick Crafting) | **50%** total |
| Item craft **gold** discount (Sable + Quick Crafting) | **45%** total |
| Barricades per side (Bodhi) | **8** |
| Caltrop emplacements per side (Vern) | **6** |
| Snare traps per side (Vern) | **4** |
| Road hexes (Markus) | gold-limited (30g each, 200 HP, destructible) |
| Aurelia's passive gold | stacks to **+0.6g/s max** across all economy artisans |
| Field Kits per side (any artisan) | **3** (1 per alive artisan) |
| Facility / item slots | 6 facilities · 1 equipment slot per unit (2 with Relic Affinity) · 1 tactical satchel per platoon |

### Universal Counterplay (every Artisan)

1. **Dive value-kill:** enemy dive AI auto-prioritizes an Artisan working a production site (`08` §1.1.6). An unguarded Artisan dies in ~2–3s to a standard Fighter.
2. **Kill = production halts instantly.** No effect is banked.
3. **Conditional value is the tax:** Sable/Odette/Rook only pay off if you invest in items/structures — and a comp that *can* be gold-starved gets nothing.
4. **Positional exposure:** site work is a stand-still channel interrupted by any attack/CC.

---

## 🎒 ITEM-SYSTEM REWORK — CROSS-UNIT CRAFTING (v1.4, after the Item List)

> The Item List (`Data/ItemList/00 - Item List, Acquisition & Crafting.md`) introduced the **equipment** lane — jungle materials → craft → equip, 1 item per unit. This rework re-bases the Artisan class on it: **Artisans no longer hoard crafting — they share it.** Every Artisan craft ability is a shared, army-wide aura, and Artisans grant the *whole roster* access to the item pipeline.

1. **The Shared Bench (exchange/share with every other unit type):** crafting is already a universal action (any free unit channels at the Resource Tab — ItemList §4). Under this rework, **every Artisan craft bonus applies army-wide to ALL 8 classes** — a Fighter, Tanker, Mage, Marksman, Support, Siege, or Assassin crafting while the artisan is alive receives the exact same discount/enhancement the artisan itself would. The artisan's kit is *lent out*, never hoarded.
2. **Field Kit (combat value — forward crafting):** an Artisan may spend a **2s channel + 10g** to issue a **Crafting Kit** to any non-Artisan unit: a 1-charge attachment letting that unit **channel a craft in the field** — anywhere on the map, no Resource Tab, normal 10s channel. **Cap: 1 kit per alive Artisan, 3 army-wide.** This is the artisan's *combat* contribution: forward resupply keeps the frontline equipped without dragging platoons home.
3. **Field Armoring Perk (Safe-Zone Equip Exception):** Standard units can only equip or swap items while physically standing inside their Castle Courtyard (Safe Zone) or an intact Outpost. **An alive Artisan grants their assigned platoon the Field Armoring perk**, permitting full item equip and swap operations directly in the field, eliminating tempo loss from retreat walks.
4. **Item carriers (combat value — the artisan's own gear):** artisans equip exactly **1 item** like every unit (ItemList §1). Their compatible list includes the survival/utility set (**Grove Barrier**, **Bulwark Core**, **Phantom Step**) plus the dedicated **Artificer's Lens** (+150 HP, +15 AP, +25% deployable structure HP, −20% build time). Item scoring holds at 4 compatible items: enough to survive and amplify fortifications, never enough to carry combat directly.
5. **Progression fit (verified):** Sable's craft discounts and Odette's enhancement directly accelerate the **full-equip-by-10:00** math (ItemList §7) — with an artisan fielded, the 2-squad farming milestone lands earlier; without one the pipeline still works (universal crafting) but pays full price. **Artisans accelerate progression pacing, never combat output** — the PVR audit below still holds unchanged.

---

## 1. Guild Foreman — *"Site Runner"* (T2)

- **Stats (FINAL):** HP 500 | ATK 42 | DEF 18 | MR 20 | Range 1 | Move 2.0 | ASPD 0.6
- **Core Identity:** Construction tempo — facilities come online faster.
- **Passive — Cranes & Scaffold (alive-gated):** While within 3 hexes of a friendly facility being built/upgraded, its **build/upgrade time is −40%** (cap 40%).
- **Ability — Rush Order:** Instantly completes the remaining construction of one friendly facility within 3 hexes. **CD 90s.** Trigger: `D`/`G` = facility under construction in range; `A` = forward facility site in range; `J`/`R` = OFF.
- **L3 Paragon Evolution — Masterworks Overdrive:** Rush Order cooldown is reduced from 90s to 45s; facilities completed via Rush Order permanently operate at +25% efficiency (or yield +25% training speed) and radiate a repair aura restoring 10 HP/s to adjacent allies for 15s.
- **Unique Twist:** The tempo artisan — earlier Core Treasury = earlier gold; earlier Core Barracks = earlier army cap.
- **Key Synergies:** Architect Venn (cost+time double discount, capped), Goldsmith Aurelia (convert saved time into gold), Titan Mortar Gus (forward facilities cover his batteries sooner), Seraph Angelus (keeps the Site Runner alive at the construction line).
- **Counterplay:** Dive him (500 HP dies to any engage); zone him off the site (3-hex aura); kill between Rush Order uses (90s CD) to deny a full tempo cycle.
- **PVR:** ~280g / match → **0.80 band. ✅**

---

## 2. Architect Venn — *"Blueprints"* (T3)

- **Stats (FINAL):** HP 650 | ATK 45 | DEF 20 | MR 22 | Range 2 | Move 1.9 | ASPD 0.6
- **Core Identity:** Construction cost savings + building durability.
- **Passive — Cost Estimation (alive-gated):** Friendly facility build/upgrade **gold cost −25%** (total discount cap 40% with Foreman).
- **Ability — Reinforced Spec:** The next facility built/upgraded within 4 hexes gains **+20% max HP** and retains **20% more current HP on damage**. **CD 30s** per building. Trigger: `D` = facility being built/upgraded in range; `A` = forward fortification point; else OFF.
- **L3 Paragon Evolution — Impregnable Bastion Blueprint:** Reinforced Spec applies to all friendly structures within 5 hexes, boosting their max HP by +35% and granting them an automated retaliatory shock coil that zaps attacking enemies for 50 magic damage per hit.
- **Unique Twist:** Makes the base physically harder to breach — durable, not just faster.
- **Key Synergies:** Guild Foreman (time+gold discount combo), Stonewright Marble (repair keeps reinforced buildings alive), Paladin Luxor (shield stacks on top of reinforced walls), Timekeeper Nora (haste compounds construction).
- **Counterplay:** Dive him; all discounts end on death; Reinforced Spec is single-building and telegraphed — push the un-fortified flank.
- **PVR:** ~420g / match → **0.84 band. ✅**

---

## 3. Stonewright Marble — *"Wall Mender"* (T3)

- **Stats (FINAL):** HP 700 | ATK 40 | DEF 28 | MR 25 | Range 1 | Move 1.8 | ASPD 0.5
- **Core Identity:** Structure repair — the only unit that actively heals walls and the Core.
- **Passive — Masonry (alive-gated):** Repairs friendly walls/facilities/Core at **3× the standard structure regen rate** (2 → 6 HP/s per segment she works); AI auto-prioritizes the most damaged segment within 3 hexes.
- **Ability — Emergency Scaffold:** Grants a wall segment or facility within 3 hexes a **+600 HP temporary barrier for 15s**. **CD 25s.** Trigger: `D` = friendly segment <80% HP in range; `A` = forward segment <50%; `R` = <85% during retreat; `J` = OFF.
- **L3 Paragon Evolution — Adamantine Reconstruction:** Emergency Scaffold grants a +1,200 HP barrier for 20s and reflects 40% of damage taken back onto attackers; if the protected structure survives the barrier duration, it permanently gains +15% maximum HP.
- **Unique Twist:** Anti-siege insurance — the difference between "breached at 5:00" and "breached at 12:00".
- **Key Synergies:** Architect Venn (reinforced segments stay alive longer), Lumberjack Bodhi (barricades + repairs = layered defense), Stoneheart Gol (holds the breach while she patches), Mender Tulia (heal overlap).
- **Counterplay:** Break the wall line to make her position unsafe; spread siege fire across 3+ segments (she patches one at a time); burst through the 600 HP scaffold (25s window); kill her — repairs stop instantly.
- **PVR:** ~450g / match → **0.90 band. ✅**

---

## 4. Quartermaster Sable — *"Rationeering"* (T3)

- **Stats (FINAL):** HP 620 | ATK 38 | DEF 15 | MR 18 | Range 1 | Move 2.0 | ASPD 0.6
- **Core Identity:** Item production — cheaper, faster equipment for the whole army.
- **Passive — Supply Lines (alive-gated):** **Any unit of any class** crafting an item has **craft time −50%, gold cost −30%** (Shared Bench — army-wide aura, not personal; caps with Quick Crafting trait: 50% time / 45% gold).
- **Ability — Emergency Craft:** Instantly crafts one consumable into **any friendly unit's empty item slot** (skips the craft channel). **CD 45s.** Trigger: `D` = slot empty + gold available; `A` = forward platoon with empty slot; `J`/`R` = OFF.
- **L3 Paragon Evolution — Automated Munitions Cache:** Emergency Craft equips the consumable with a bonus duplicate charge (2 uses instead of 1) and automatically restores 20% max HP and 25 Mana to the recipient upon delivery.
- **Unique Twist:** Mid-fight resupply without dragging the platoon back to the courtyard.
- **Key Synergies:** Master Enchanter Odette (cheap + enhanced items), Hawkeye Vale (Healing Flasks keep the sniper alive), Battlechanter Rory (item buffs stack with his chant), Rammaster Kodo (Siege Bomb resupply keeps the ram hitting).
- **Counterplay:** **Conditional value — the tax.** Sable only pays off if you actually craft items; a gold-starved or item-shy comp gets ~nothing. Dive her; 1 item per 45s ceiling.
- **PVR:** ~240–300g / match → **0.48–0.60 conditional. ✅** (below-band when items are sparse — by design, a build-around)

---

## 5. Master Enchanter Odette — *"Gilding Touch"* (T4)

- **Stats (FINAL):** HP 750 | ATK 46 | DEF 18 | MR 30 | Range 2 | Move 1.9 | ASPD 0.6
- **Core Identity:** Item power — enhanced equipment for the whole army.
- **Passive — Gilded Items (alive-gated):** **While Odette is alive, every item the army crafts has +50% effect/stat** (Shared Bench — applies to all 8 classes' crafts, not just hers).
- **Ability — Enchant Relic:** Permanently upgrades one equipped consumable: Healing Flask 150→225 HP · Speed Elixir +30%→+45% move · Damage Tonic +20%→+30% ATK DPS · Siege Bomb 300→400 structure damage. One enchant per item. **CD 30s.** Trigger: `D` = equipped item eligible on any army unit; `A` = forward carry with eligible item; else OFF.
- **L3 Paragon Evolution — Transcendent Infusion:** Enchant Relic can upgrade an item a second time into an Artifact Tier (doubling all stat enhancements and allowing consumables to trigger twice on activation); Odette's active presence grants all equipped allies +10 Magic Resistance and +10 Armor.
- **Unique Twist:** The item spike artisan — turns consumables into pseudo-abilities.
- **Key Synergies:** Quartermaster Sable (cheaper enhanced items), Stormdancer Kael (enhanced Damage Tonic on the dive), Paladin Luxor (enhanced flask shields his bulwark), Seraph Angelus (heal ceiling raised).
- **Counterplay:** **Highest-priority Artisan dive target** — kill the enchant factory before its items are used. Enchants are capped by active satchel count (1 per platoon tactical belt).
- **PVR:** ~420–450g / match → **0.65–0.69 conditional. ✅**

---

## 6. Civil Engineer Markus — *"Roadbuilder"* (T4)

- **Stats (FINAL):** HP 780 | ATK 44 | DEF 22 | MR 24 | Range 2 | Move 2.1 | ASPD 0.6
- **Core Identity:** Map control — a movement-speed road network.
- **Passive — Paved Paths (alive-gated):** Can construct **Road hexes**: **30 gold + 2s** per hex. Friendly units on a Road gain **+40% move speed**. Roads have **200 HP** each and are destroyed by enemy attacks; no hard cap (gold-limited).
- **Ability — Highway Line:** Instantly lays a straight **3-hex Road** toward the target waypoint (90 gold). **CD 30s.** Trigger: `G`/`A` = waypoint/battlefront beyond 3 hexes and 90g available; `D` = rear logistics line; `J` = road into farm; `R` = OFF.
- **L3 Paragon Evolution — Paved Roman Aqueduct:** Highway Line road cost is reduced by 50% (45 gold) and roads grant +60% movement speed (up from 40%); allied units standing or fighting upon Road hexes gain 15% Damage Reduction and +10 HP/s regeneration.
- **Unique Twist:** Army-wide tempo — your whole force marches 40% faster to every objective.
- **Key Synergies:** Lumberjack Bodhi (road + barricade = engineered chokepoints), Gunslinger Wren (roads keep her at kite range), Battlechanter Rory (chant + road speed compounds), Rammaster Kodo (the ram reaches the wall before defenders redeploy).
- **Counterplay:** Roads are **destructible** (200 HP — one Siege volley clears a line) and **gold-limited** — Markus doesn't *generate* value, he redirects gold into tempo. Kill him to stop new roads; push the flank with no roads.
- **PVR:** ~500g / match → **0.77 band. ✅**

---

## 7. Lumberjack Bodhi — *"Timberline"* (T2)

- **Stats (FINAL):** HP 560 | ATK 55 | DEF 24 | MR 16 | Range 1 | Move 2.0 | ASPD 0.7
- **Core Identity:** Terrain engineering — turn jungle trees into permanent obstacles.
- **Passive — Timber Harvest (alive-gated):** Under `J`, auto-fells jungle trees (2s each). Each felled tree grants **1 Barricade charge** (max 4 held).
- **Ability — Barricade:** Spends 1 charge to build a **300 HP barricade** that **blocks movement** on its hex (impassable to all units until destroyed). Build 2s. **Max 8 barricades per side.** Trigger: `G` = commander waypoint / flank approach; `A` = advance and wall a flank; `D` = seal a breach; `J` = harvest first, build after.
- **L3 Paragon Evolution — Ironwood Stockade:** Barricades are reinforced into Ironwood (HP increased from 300 to 600) with thorny spiked exteriors dealing 35 physical damage per second to adjacent enemies attacking them; max barricade cap increased to 12.
- **Unique Twist:** The only permanent map modification in the game — walls the enemy cannot walk through.
- **Key Synergies:** Civil Engineer Markus (road + barricade engineering), Trapsmith Vern (barricade + snare killbox), Frostward Ymir (freeze enemies against a barricade), Sniper Castella (shoots from behind cover).
- **Counterplay:** Barricades are **destructible** — 300 HP is ~3s of Siege fire. Bodhi must stand in the jungle to harvest — jungle camps and flanks threaten him. Once placed, a barricade blocks *everyone*, including his own retreat.
- **PVR:** ~300g / match → **0.86 band. ✅**

---

## 8. Trapsmith Vern — *"Emplacement"* (T2)

- **Stats (FINAL):** HP 540 | ATK 40 | DEF 16 | MR 18 | Range 2 | Move 1.9 | ASPD 0.5
- **Core Identity:** Static area denial — emplacements that force pathing decisions.
- **Passive — Emplacements (alive-gated):** Can construct **Caltrop zones** (30 gold, 2s): a 3×3 hex area that slows enemies **30% for 2s** after entering (no stacking). **Max 6 zones per side.**
- **Ability — Snap Trap:** Constructs a 1-hex **Snare trap** (40 gold): the first enemy stepping on it is **rooted 1.5s**. **Max 4 per side**, 20s CD per trap. Trigger: `D` = chokepoint in range; `G` = waypoint; `A` = forward approach; `J` = OFF.
- **L3 Paragon Evolution — Spring-Razor Calamity:** Snare traps become completely invisible to normal sight; when triggered, the trap roots the victim for 2.5s, inflicts Grievous Wounds for 5s, and discharges razor shrapnel that slows all enemies within 2 hexes by 50% for 3s.
- **Unique Twist:** Pre-battle area denial the enemy must respect in their pathing — or pay for.
- **Key Synergies:** Lumberjack Bodhi (barricade + snare killbox), Aegis Bastion (taunts enemies into the slow field), Gunmage Petra (Hex Rounds land on rooted targets), Pyromancer Cinder (Inferno Field on snared zones).
- **Counterplay:** Emplacements are **visible, single-use, gold-limited**. Dive Vern — zones stop mattering when he dies. Siege splash clears caltrops. A fast flank with no emplacements punishes over-investment.
- **PVR:** ~300g / match → **0.86 band. ✅**

---

## 9. Goldsmith Aurelia — *"Mint"* (T2)

- **Stats (FINAL):** HP 500 | ATK 36 | DEF 14 | MR 20 | Range 1 | Move 2.0 | ASPD 0.5
- **Core Identity:** Pure economy — the only unit that directly prints gold.
- **Passive — Ledger (alive-gated):** **+0.2 gold/sec** passive income (~216g per 18-min match). Stacks with other economy artisans to a hard **+0.6g/s total**.
- **Ability — Tax Tithe:** Collects **12 gold + 2 gold per standing friendly facility (max 5 → 22 gold)**. **CD 90s** (~11 casts ≈ 165g/match). Trigger: always HIGH under `D`/`G` (gold is never wasted); `A` = OFF (she stays home); `R` = REACTIVE.
- **L3 Paragon Evolution — Sovereign Minting Monopoly:** Tax Tithe cooldown is reduced from 90s to 50s and grants an immediate +50 gold bonus if all Core facilities are intact; collecting Tax Tithe showers all allied combat platoons with golden morale, boosting their Attack Speed and Move Speed by 20% for 8s.
- **Unique Twist:** The pure-econ artisan — zero map utility, zero combat, one number going up.
- **Key Synergies:** Guild Foreman (spend the extra gold faster), Architect Venn (discounts compound her income), Trebuchet Elder Gorm (she finances the 4-gold global shot), Seraph Angelus (protects the walking gold mine).
- **Counterplay:** **Kill her and the gold stops the same tick** — no interest, nothing banked. An economy-heavy artisan comp is weakest in the first 6 minutes; out-tempo it before the ledger compounds.
- **PVR:** ~340g / match → **0.97 — top of band, intentionally.** The class's strongest pure value and its weakest defensive profile. ✅

---

## 10. Salvager Rook — *"Scrapwright"* (T1)

- **Stats (FINAL):** HP 460 | ATK 34 | DEF 20 | MR 22 | Range 1 | Move 1.9 | ASPD 0.5
- **Core Identity:** Comeback economy — profits from losses.
- **Passive — Salvage (alive-gated):** Destroyed friendly facilities/walls refund **75%** of build cost instead of the standard **50%**.
- **Ability — Secondhand Deal:** Reduces the next unit recruitment cost by **20%** (single use). **CD 60s.** Trigger: `D`/`G` = HIGH (always beneficial); `A` = OFF; `R` = REACTIVE.
- **L3 Paragon Evolution — Junkyard Titan Reassembly:** Secondhand Deal recruitment discount increases to 40% and immediately refunds 50% of the gold spent if the recruited unit perishes in combat within the first 60s; whenever a friendly facility falls, Rook automatically constructs an unmanned defensive Scrap Turret (500 HP, 40 ATK) on the ruins for 30s.
- **Unique Twist:** Anti-snowball — his value appears exactly when a normal comp is collapsing.
- **Key Synergies:** Stonewright Marble (repair + salvage: lose less, refund more), Architect Venn (cheaper structures, better refunds), Sapper Drox (his charges trade structures; Rook softens the trade), Warden of Oath Galen (link keeps the Scrapwright alive while he works the wreckage).
- **Counterplay:** **He's useless while you're winning** — no structures lost, no salvage, a 1-gold slot doing almost nothing. Kill him to deny the refund entirely. His value is a *losing-game* condition — it can never out-pace the enemy's actual lead.
- **PVR:** 60–360g / match (winning 0.24 · losing 4 structures ~1.44) → **anti-snowball only. ✅**

---

## 📋 CLASS AUDIT SNAPSHOT (full verdict in `07` §6)

| Unit | Tier | Production | TPV | PVR | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Guild Foreman | 2 | Facility time −40% | ~280 | 0.80 | ✅ band |
| Architect Venn | 3 | Facility gold −25% + durability | ~420 | 0.84 | ✅ band |
| Stonewright Marble | 3 | Repairs + scaffold | ~450 | 0.90 | ✅ band |
| Quartermaster Sable | 3 | Item craft time/cost | 240–300 | 0.48–0.60 | ✅ conditional |
| Master Enchanter Odette | 4 | Item enhancement | 420–450 | 0.65–0.69 | ✅ conditional |
| Civil Engineer Markus | 4 | Roads (gold sink) | ~500 | 0.77 | ✅ band |
| Lumberjack Bodhi | 2 | Barricades (cap 8) | ~300 | 0.86 | ✅ band |
| Trapsmith Vern | 2 | Emplacements (caps) | ~300 | 0.86 | ✅ band |
| Goldsmith Aurelia | 2 | Passive gold + tithe | ~340 | 0.97 | ✅ top of band (intentional) |
| Salvager Rook | 1 | Refunds (losing-conditional) | 60–360 | 0.24–1.44 | ✅ anti-snowball only |

> **One-line audit verdict:** every Artisan generates roughly the value of the combat slot it sacrifices (PVR 0.7–1.0), none exceeds ~1.0 in winning states, conditional units self-regulate, all stacking vectors are hard-capped, and every Artisan is a squishy kill-on-sight target. **Production cannot out-pace a full-combat army — it can only trade place with it.**
