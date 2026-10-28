---
tags: [Facilities, Pool18, Expansion, Production, Siege, Buff, BaseBuilding]
type: Data - Authoritative
---

# 🏗️ FACILITY POOL — 18 FACILITIES (v3)

> **Pool = 18 active facilities: 6 Production + 6 Combat + 6 Buff.** Each side constructs into **6 Inner Wall Slots** (4 Outer Courtyard + 2 Inner Keep).
> **This file is the real facility list — full specs for all 18 facilities, superseding the historical specs in `TextPlan/03 - Facilities/00 - Facility System (Complete).md` §3–§4.**
>
> **v3 changes:**
> - **Warp Gate removed → replaced by the Golden Vault (Bank)** — a deposit-and-interest facility.
> - **Siege Range Doctrine (v3 rule)** — all Combat Facilities are range-capped at **30 hexes from the owning wall**; no facility weapon can reach the middle of the field or the enemy's side.
> - **Buff Monoliths rebuilt (new rule)** — each grants **one unique effect**; flat % base-stat auras are removed (a +20% aura × a 20-unit army ≈ +400% effective stat value — that breaks the equal-footing balance).
> - **Duplicate rule (new rule)** — copies are allowed: the highest-tier copy keeps **100%** effect, every other copy runs at **50%** potency. 1 copy = 100% · 2 copies = 150% · 3 copies = 200%.
> - **Combat Facilities rebuilt (v3.1)** — the 6 Siege Installations are replaced by 6 Combat Facilities (Field of Despair, Arcane Barrier, Sanctuary, Ballista, Catapult, Metal Wall). All damage-dealing Combat Facilities **target the nearest enemy from the facility first**. Removed: Imperial Heavy Ballista, Mortar Battery, Flame Projector, Trebuchet Yard, Ward Spire.
> - **Respawn rule (v3.1)** — dead units **respawn after a 30s timer** instead of being lost; **Resign is the only permanent removal**. Sanctum of Restoration (now a respawn-time cut) and the Imperial Gate (now a platoon-to-platoon warp) were rebuilt around it (`Data/Economy/01` §3).
> - **Carried from v2:** the passive facilities (Gold Mint / XP Crucible / Supply Depot) are Core Upgrades (`TextPlan/03 - Facilities/02 - Core Upgrades (Treasury, Crucible, Barracks).md`), not facilities · Caravan Post is the flagship gold facility · the 6/6/6 split holds.

**Pool rules (v3):** duplicates allowed under the Duplicate rule (first copy 100% / rest 50%) · max **3 per category** per side · standard upgrades HP 500/750/1000, costs 150g / 250g+100XP / 400g+250XP — **exception: the Golden Vault is 100/200/400 HP** · damage retention & 50% refund (`TextPlan/03 - Facilities/00` §1) · Combat Facilities build during Opening (0:00–5:00) but the **active weapons (Ballista, Catapult) don't fire until Expansion (5:00)**.

---

## 1. 📊 The 18-Facility Pool (overview)

| # | Category | Facility | Source | Effect line |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Production | Caravan Post | new | **+2.5 / +5.0 / +8.33 g/s** (minute lumps) |
| 2 | Production | Hunter's Lodge | new | +15 / +30 / +50% monster bounties |
| 3 | Production | Recruit Depot | new | −10 / −15 / −20% hire cost |
| 4 | Production | War Foundry | new | craft time −15/−25/−40% · gold −10/−20/−30% |
| 5 | Production | **Golden Vault (Bank)** | new | deposit interest **10–25 / 25–60 / 75–200%** (terms 1/2/4 min, all open at T1) · HP 100/200/400 |
| 6 | Production | Stone Quarry | new | facility cost −10/−15/−20% (+ time / HP riders) |
| 7 | Combat | Field of Despair | new | anti-heal field — enemies in the Fortress heal **−20 / −40 / −60%** |
| 8 | Combat | Arcane Barrier | rebuilt | reflects **20 / 30 / 40%** of wall damage back at attackers |
| 9 | Combat | Sanctuary | new | allies in the Fortress heal **+40 / +60 / +90%** |
| 10 | Combat | Ballista | rebuilt | bolt snipe — **2,000 / 3,000 / 4,000** every 25s · range 5 (nearest first) |
| 11 | Combat | Catapult | rebuilt | AoE shell — **1,200 / 1,800 / 2,500** center + 20% splash · range 8 (nearest first) |
| 12 | Combat | Metal Wall | new | outer & inner walls **+5 / +10 / +15%** damage reduction |
| 13 | Buff | War Banner Shrine | existing → rebuilt | **Battle Cry** — periodic double-damage proc |
| 14 | Buff | Alchemical Transmuter | existing → rebuilt | **OOC regen** — 4 / 6 / 8% Max HP per second |
| 15 | Buff | Windrider Obelisk | existing → rebuilt | **Gust Surge** — periodic speed burst |
| 16 | Buff | War Room | new | **Orders Relay** — periodic cooldown reset |
| 17 | Buff | Training Grounds | new | **Battlefield Lessons** — level-up burst heal |
| 18 | Buff | Sanctum of Restoration | new | **Second Wind** — death refund |

---

## 2. 🏭 The 6 Production Facilities

### 1. 🐪 Caravan Post — *"Waystation"*
- **Footprint:** 3×3 · HP 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP.
- **Type:** Production — periodic lump income (the flagship gold facility).
- **T1:** A supply caravan arrives **every minute: +150 gold** (≈ **+2.5 g/s**).
- **T2:** Caravan delivers **+300 gold** per minute (≈ **+5.0 g/s**).
- **T3:** Caravan delivers **+500 gold** per minute (≈ **+8.33 g/s**); **the first caravan after construction arrives instantly**.
- **Unique Twist:** lump-sum gold — payments land as 150/300/500g blocks on the **minute boundary** (same tick as per-minute traits). It is **NOT "passive gold"**: production-rate traits and ×-multipliers do **not** scale it. That is the deliberate trade: it nearly matches the entire passive baseline (10 g/s) raw, but pays in lumps that feed **bank-threshold economy** (Copper/Silver/Golden Interest, War Bonds, Endless Treasury) and big purchases (facility T3s, card extra-buys) instead of a drip.
- **Counterplay:** destroy it between deliveries and you forfeit the next lump — a 500/750/1000 HP 3×3 target with zero self-defense; a dive squad on the Caravan lane is an economy hit.
- **Visual:** T1 brass-cage caravan dock with a covered wagon · T2 stone waystation with twin trade signs · T3 gilded toll-gate courtyard with a permanently arriving merchant train.

### 2. 🏹 Hunter's Lodge — *"Bounty Board"*
- **Footprint:** 3×3 · HP 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP.
- **Type:** Production — jungle bounty amplifier.
- **T1:** Friendly units gain **+15% monster gold bounties**.
- **T2:** Bonus rises to **+30%**.
- **T3:** Bonus rises to **+50%**; your **first camp clear each minute grants +50 gold**.
- **Economy line (audited):** at the standard 1-camp-per-minute farm rate (5 monsters × 100g bounty = 500g/min ≈ 8.33 g/s), T1/T2/T3 add ≈ **+1.25 / +2.5 / +4.17 g/s**; a 2-squad farm doubles those numbers.
- **Unique Twist:** the *farm* facility — its value exists only while your army actually clears jungle, and it stacks with bounty traits (Bounty Trail/Hunter/Cartel/Empire). **Stacking cap: total bounty bonus (facility + traits) hard-capped at +150%.**
- **Counterplay:** contest the jungle — a Lodge with no farm pays zero; it also advertises the farming line to dive squads.
- **Visual:** T1 wooden trophy cabin with a bounty board · T2 stone lodge with mounted trophies and a map table · T3 gilded hunting hall with animated pack-hound pens.

### 3. 🪖 Recruit Depot — *"Conscription"*
- **Footprint:** 3×3 · HP 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP.
- **Type:** Production — hire-cost & **respawn-time** reduction (wired to the **Unit Cost Model**, `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3).
- **T1:** **Unit hire cost −10%** (applies to the current escalated price).
- **T2:** Hire cost **−15%**; **respawn time −25%** (30s → 22.5s).
- **T3:** Hire cost **−20%**; **respawn time −50%** (30s → 15s); the **Resign slot lock drops from 30s → 15s**.
- **Economy note:** no g/s — a spend-reducer. At base 60g hire (escalating to 150g), −10/−15/−20% saves 6/9/12g per hire at base, 15/22.5/30g per hire at the 150g cap. The T3 rider is the only thing in the game that softens the Resign 30s lock.
- **Unique Twist:** the *tempo* facility — cheaper hires and **faster respawns** mean a Recruit Depot army bounces back from losses faster, while the 30s respawn timer and the Resign lock keep bounce-back from becoming free army.
- **Counterplay:** the depot's value is entirely loss-side; killing it between fights wastes the discount; its real payoff needs *your units to die*, so it anti-synergizes with a clean-fight comp.
- **Visual:** T1 wooden muster tent with a standards rack · T2 stone drill-yard with weapon racks and a bell tower · T3 gilded garrison with parade ground and instant-muster warp banners.

### 4. 🔨 War Foundry — *"Armory"*
- **Footprint:** 3×3 · HP 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP.
- **Type:** Production — army-wide item-craft amplifier (item lane).
- **T1:** Any unit crafting an item has **craft time −15%, craft gold −10%**.
- **T2:** **−25% time, −20% gold**; crafted items have a **20% chance to upgrade 1 quality** (Common → Rare → Epic).
- **T3:** **−40% time, −30% gold**; crafted items have a **35% quality-upgrade chance**; the **first craft each minute is free** (gold).
- **Unique Twist:** the *gear* facility — it accelerates the full-equip-by-10:00 pipeline (`Data/ItemList/00 - Item List, Acquisition & Crafting.md`) for the whole army. It stacks into the existing craft caps (**time cap 50%** with Sable + Quick Crafting, **gold cap 45%**), so it accelerates pacing without ever making items free.
- **Counterplay:** zero combat value — a pure economy target; the free-first-craft only matters if you keep crafting; a gold-starved or item-shy comp gets ~nothing.
- **Visual:** T1 timber smithy with twin forges · T2 stone foundry with a water-powered hammer · T3 gilded arsenal with animated assembly lines and a cooling channel.

### 5. 💰 Golden Vault — *"Bank"*
- **Footprint:** 3×3 · **HP 100 / 200 / 400** — deliberately fragile, **not** the standard 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP.
- **Type:** Production — deposit & interest (the savings facility).
- **The vault mechanic:** the commander may **deposit gold** into the vault for a fixed **term**. **Deposited gold is locked — it leaves the active bank and cannot be spent, withdrawn, or used until the term matures** (it also does not count toward bank-threshold traits while locked). When the term ends, the deposit returns **with interest** in one lump.
- **Terms (all three open from T1 — the tier raises the interest rate, not the choice):**
  - **Short Term (1 minute):** T1 **+10%** · T2 **+15%** · T3 **+25%**.
  - **Medium Term (2 minutes):** T1 **+25%** · T2 **+40%** · T3 **+60%**.
  - **Long Term (4 minutes):** T1 **+75%** · T2 **+150%** · T3 **+200%**.
  - *Risk trade-off: the longer the term, the higher the rate — but the gold stays locked that long, and the 100/200/400 HP vault keeps its breach-on-destroy forfeit. (Rates are internally consistent: even re-investing short terms back-to-back never beats the longer term — e.g., T3 four 1-min terms = +144% < the 4-min +200%.)*
- **Vault rules:**
  - **One active term per Bank copy** at a time; a new deposit may start once the running term matures.
  - **Deposit cap: 1,000 gold per term** (tuning knob).
  - **The rate is locked at the moment of deposit** — upgrading the Bank mid-term does not change a running term's rate.
  - **No early withdrawal.** The term is the trade-off — the money is gone until it matures.
- **Unique Twist:** the *savings* facility — interest is paid on **your own gold**, so its value scales with how much you bank. It is a deliberate gamble: lock 1,000g at T3 Long (4 minutes) and you make **+2,000g (200%)** — if the vault survives those 4 minutes.
- **Counterplay:** **destroying the Bank breaches the vault — all locked deposits are forfeited.** At 100/200/400 HP it is the most fragile facility in the game; a single dive squad snipes your savings. It also signals intent: a glowing vault tells the enemy you are saving, not spending.
- **Duplicate rule interaction:** a 2nd Bank pays halved interest (10→5% / 75→37.5% / 200→100%); a 3rd also 50%.
- **Visual:** T1 iron strongbox on a stone plinth · T2 gilded counting-house with a brass ledger · T3 marble exchange hall with a rotating golden vault door.

### 6. ⛏️ Stone Quarry — *"Masonry Supply"*
- **Footprint:** 3×3 · HP 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP.
- **Type:** Production — facility build/upgrade discount (structure lane).
- **T1:** Friendly facility **build/upgrade gold cost −10%** (army-wide aura).
- **T2:** Cost discount **−15%**; **build/upgrade time −20%**.
- **T3:** Cost discount **−20%**; **build/upgrade time −30%**; friendly facilities are built with **+10% max HP**.
- **Unique Twist:** the *builder's* facility — compounds with Architect Venn (−25% gold, **cost cap 40% total**) and Guild Foreman (−40% time, **time cap 40% total**) so a Quarry comp reaches T3 facilities faster and cheaper, but never free.
- **Counterplay:** the discounts only matter while you're actually building; a player who already maxed their 6 slots gets ~nothing from it; it is a soft 3×3 target that delays your own defense while it stands.
- **Visual:** T1 open quarry pit with a wooden crane · T2 terraced stone yard with block-cutters · T3 gilded mason's court with animated stone-lifting golems.

---

## 3. ⚔️ The 6 Combat Facilities

> **Combat Facility Doctrine (v3.1):** these 6 slots are the fortress's active defense. **Every damage-dealing Combat Facility (Ballista, Catapult) automatically targets the nearest enemy to the facility first** — no target selection, no manual control; a turret re-targets the nearest valid enemy whenever its 25s cooldown is ready. Non-damage Combat Facilities (Field of Despair, Arcane Barrier, Sanctuary, Metal Wall) are passive auras/reactions with no targeting.
>
> **"The Fortress" zone (Field of Despair / Sanctuary):** the area within **8 hexes of the facility** — the wall segment it defends plus the courtyard approach in front of it. Radius is a tuning knob (see §8).
>
> **Siege Range Doctrine (v3 rule):** Combat Facilities are **defense-in-depth weapons, not long-range artillery**. Every combat-facility range is **hard-capped at 30 hexes from the owning wall** — the current set sits far under it (5–8 hex). The battlefield's mid-line sits ≈75 hexes out — **no facility weapon can ever reach the middle of the field or the enemy's side**; an enemy platoon playing mid-field is permanently out of reach. Any future combat facility inherits the 30-hex cap. (Vision is not attack range.)
>
> **All Combat Facilities** take **−70% damage from non-siege units** and share HP 500/750/1000 / costs 150g / 250g+100XP / 400g+250XP (standard). They build during Opening (0:00–5:00), but the **active weapons (Ballista, Catapult) don't fire until Expansion (5:00)**.

### 1. 🩸 Field of Despair — *"Grave Field"*
- **T1:** Enemy units inside the Fortress (8-hex zone) have **healing received reduced by 20%** — all healing sources (spells, HoTs, lifesteal, out-of-combat regen, facility auras).
- **T2:** Reduction **40%**.
- **T3:** Reduction **60%**.
- **Unique Twist:** the *anti-sustain* field — a hard counter to heal-heavy comps (Mender Tulia, Warcry Beserka, Alchemical Transmuter) and the enemy's own Sanctuary. It has zero damage value; its entire job is making the enemy's recovery inside your walls worthless.
- **Counterplay:** fight outside the 8-hex zone; it does nothing on its own — a burst comp that doesn't need healing walks past it; the facility is a soft 3×3 target behind the line.
- **Visual:** T1 desolate marker stones weeping black mist · T2 withered garden with crows and a brazier · T3 gilded mausoleum whose shadow smothers the courtyard.

### 2. �️ Arcane Barrier — *"Mirror-Wall"* (rebuilt)
- **T1:** **Reflects 20%** of every point of damage dealt to the wall back at the attacker (unit damage only; siege-weapon and DoT-reflected portions are split per hit).
- **T2:** Reflects **30%**.
- **T3:** Reflects **40%**; the barrier also covers the **2 adjacent wall segments**.
- **Unique Twist:** the *wall-as-shield* — the more the enemy commits to breaching, the more they take. It turns your own wall into an attack surface: a full platoon wailing on the wall eats a percentage of its own damage every hit.
- **Counterplay:** don't hit the wall — use long-range siege units or cards that out-range the barrier; kill the Barrier first (500/750/1000 HP, zero self-defense) and the wall returns to normal.
- **Visual:** T1 shimmering golden veil over the wall segment · T2 translucent arcane dome with rune nodes · T3 heavy mirror-steel wall-sheath that flares with every reflected blow.

### 3. ✨ Sanctuary — *"Hallowed Ground"*
- **T1:** Friendly units inside the Fortress (8-hex zone) gain **+40% healing from all sources** (spells, HoTs, lifesteal, regen, facility auras).
- **T2:** Healing **+60%**.
- **T3:** Healing **+90%**.
- **Unique Twist:** the *sustain amplifier* — your home ground becomes a healing well. Pairs with Mender Tulia / Seraph / Transmuter comps; the more sustain you bring, the more the Sanctuary multiplies it.
- **Counterplay:** pull the fight out of the zone (the amp only works inside); the enemy's Field of Despair cancels it inside the contested overlap; it has no offensive value — a burst comp ignores it.
- **Visual:** T1 white marble chapel with a soft golden dome · T2 sanctum ring with floating prayer-lanterns · T3 gilded cathedral whose dome rains healing motes.

### 4. 🎯 Ballista — *"Bolt Turret"* (rebuilt)
- **T1:** Fires a bolt every **25s** at the **nearest enemy within 5 hex of the outer wall**: **2,000 damage** to one unit.
- **T2:** **3,000 damage**.
- **T3:** **4,000 damage**.
- **Targeting:** nearest enemy from the facility first (Combat Doctrine). Single-target, never misses.
- **Unique Twist:** the *delete-button* — one shot, one kill per 25s; it punishes any push that steps into wall range. The 25s cooldown is the whole counter.
- **Counterplay:** it's slow — feed it a tank or a decoy, or dive it (500 HP T1 body, zero self-defense); engage outside its 5-hex reach and it sits silent.
- **Visual:** T1 heavy wooden dual-bow ballista on a stone dais · T2 steel-reinforced frame with incendiary sun-bolts · T3 quad-barrel sun-bolt turret with automated reloading gear.

### 5. 💣 Catapult — *"Bombard"* (rebuilt)
- **T1:** Lobs a shell every **25s** at the **nearest enemy within 8 hex of the outer wall**: **1,200 damage at the center** of a 2-hex radius; hexes in the splash radius take **20% of that damage (240)**.
- **T2:** Center **1,800** · splash **360**.
- **T3:** Center **2,500** · splash **500**.
- **Damage resolution:** all Catapult damage is applied **after the target's DEF/MR reduction and all damage-mitigation modifiers** (per design); the 20% splash is 20% of that post-mitigation center value.
- **Targeting:** nearest enemy from the facility first (Combat Doctrine); the shell lands on that target's hex.
- **Unique Twist:** the *anti-clump* lob — punishes stacked pushes; the center one-shots squishies and the splash clears the flanks. Telegraphed arc, 25s rhythm.
- **Counterplay:** spread >2 hexes apart halves the value; the shell arc is visible — step the platoon between shots; dive the 500 HP catapult.
- **Visual:** T1 single timber catapult in a sandbag yard · T2 twin counterweight machines on stone platforms · T3 gilded siege-works with a revolving shot-stack.

### 6. 🧱 Metal Wall — *"Bulwark"*
- **T1:** **Outer & Inner Wall segments gain an additional +5% damage reduction** (stacks additively on top of the base −70% non-siege resistance → −75%).
- **T2:** **+10%** (−80%).
- **T3:** **+15%** (−85%).
- **Unique Twist:** the *wall-tank* — makes the base the tankiest it can be. No attack, no zone; it is pure structure defense that works the moment it's built.
- **Counterplay:** it does nothing to units — walls still fall to concentrated siege damage (Siege-class units, siege cards/traits); kill the Metal Wall and the walls snap back to −70%.
- **Visual:** T1 iron plating bolted onto the wall · T2 steel-sheathed segments with riveted gilding · T3 solid gilded armor-shell wrapping the whole wall line.

---

## 4. ⚡ The 6 Buff Monoliths

> **Buff Monolith Doctrine (v3 rule):** **no flat % base-stat auras.** A +20% stat aura applied to every unit is ≈ **+400% effective stat value** across a 20-unit army — one monolith would outweigh the entire trait economy and break the equal-footing (MOBA) unit balance. Instead, **each Buff Monolith grants exactly ONE unique effect** (a keyword-style mechanic) that powers up per tier. Total value is capped at *one trick per monolith*. The 3 existing monoliths (War Banner, Transmuter, Windrider) were **rebuilt under this rule** — their old %-aura specs in `TextPlan/03 - Facilities/00` §4 are historical only.
> **All Buff Monoliths** share HP 500/750/1000 / costs 150g / 250g+100XP / 400g+250XP (standard).

### 1. 🚩 War Banner Shrine — *"Golden Standard"* (existing → rebuilt)
- **T1 — Battle Cry:** every **25s** the banners flare: all friendly platoons' **next attack within 5s deals double damage**.
- **T2:** Flare cooldown **20s**; buffed attacks also grant **15% lifesteal for 3s**.
- **T3:** Flare cooldown **15s**; double-damage window **8s**.
- **Unique Twist:** a *timing* offensive tool, not a blanket buff — the value lands only on attacks that land inside the window, so it rewards disciplined engages over passive scaling.
- **Counterplay:** the flare is telegraphed; disengage or dodge during the 5–8s window and the entire effect whiffs; the Shrine is a soft 3×3 target behind the line.
- **Visual:** Towering golden banner pole with an animated silk flag emitting a warm gold aura ring.

### 2. ⚗️ Alchemical Transmuter — *"Elixir Vats"* (existing → rebuilt)
- **T1:** Friendly units **out of combat for 5s regenerate 4% Max HP per second**.
- **T2:** Regen **6% Max HP/s**; entering combat grants a **shield = 15% Max HP**.
- **T3:** Regen **8% Max HP/s**; shield **= 25% Max HP**; the combat-entry shield also grants **+20% damage reduction for 3s**.
- **Unique Twist:** the *recovery* monolith — % Max HP regen rides the unit's own HP curve (it scales with the ×1.6 stat escalation automatically instead of adding a flat number on top), so tanky armies heal for more while squishy backlines stay squishy.
- **Counterplay:** regen only works **out of combat** — keep the enemy army in a fight and the Transmuter pays nothing; its shield is one-shot per combat entry, so burst comps pop it immediately.
- **Visual:** Glass vats of bubbling green elixir connected by brass piping to a central boiler.

### 3. 💨 Windrider Obelisk — *"Airspeed"* (existing → rebuilt)
- **T1 — Gust Surge:** every **20s** a gust sweeps the board: friendly platoons gain **+60% move speed for 3s**.
- **T2:** Gust cooldown **15s**; gusted platoons leave **slipstreams that slow enemies by 30% for 2s**.
- **T3:** Gust cooldown **12s**; gusted platoons are **immune to slows during the surge**.
- **Unique Twist:** a *tempo* tool — an engage/escape button on a cooldown instead of a permanent speed aura; it changes how fights open and close without permanently re-scaling movement.
- **Counterplay:** the gust is periodic and brief — a comp that controls the pace between gusts (slow-heavy) blanks it; the Obelisk itself has no combat value and is diveable.
- **Visual:** Sleek marble spire wrapped in swirling air-gust particle rings.

### 4. 📜 War Room — *"Orders"*
- **T1 — Orders Relay:** every **30s** the **highest-cooldown ability of every friendly unit becomes ready**.
- **T2:** Relay cooldown **20s**.
- **T3:** Relay cooldown **15s**; the relay also refreshes the **commander's active skill cooldown once**.
- **Unique Twist:** the *uptime* monolith — it doesn't make abilities cast more often by percentage; it gives a scheduled burst of ready abilities, so the value is when you *time the fight* to the relay.
- **Counterplay:** the relay is predictable (visible ring on the World Clock); engage after a relay fires and the enemy's biggest cooldowns are spent; a squishy 3×3 target behind the line.
- **Visual:** T1 sand-table command tent with war banners · T2 stone war-chamber with a holographic hex-map · T3 gilded strategy dome with orbiting battle runes and a clockwork table.

### 5. 🥋 Training Grounds — *"Discipline"*
- **T1 — Battlefield Lessons:** when a friendly unit **levels up**, allied units within **6 hexes heal 20% Max HP**.
- **T2:** Heal **30% Max HP** · radius **8 hexes**.
- **T3:** Heal **40% Max HP** · radius **10 hexes**; level-ups also grant the leveling unit **+1% Max HP permanently**.
- **Unique Twist:** the *veteran* monolith — level-ups become a sustain event, so a fighting, surviving army heals itself as it levels; it rewards keeping units alive over massing new ones.
- **Counterplay:** XP only materializes on units that *survive to level*; a Training Grounds army that feeds kills gives its opponent the tempo; kill the carriers, not the building.
- **Visual:** T1 fenced sparring yard with training dummies · T2 stone drill-hall with weights and sparring rings · T3 gilded arena with cheering stands and animated striking dummies.

### 6. 💠 Sanctum of Restoration — *"Second Wind"*
- **T1:** The **first friendly death per 60s** within **8 hexes respawns instantly** (0s timer — bypasses the 30s respawn).
- **T2:** Window **45s** · radius **10 hexes**.
- **T3:** Window **30s**; the instantly-respawned unit's platoon gains **+10% damage for 10s**.
- **Unique Twist:** the *loss-recovery* monolith — under the **respawn rule** (`Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3), death costs tempo (30s off-board), not gold. The Sanctum buys that tempo back for one unit per window. It is **not** a revive (no in-fight return) and **not** the **Sanctuary** Combat facility (heal amp) — it shortens the Graveyard queue.
- **Counterplay:** windows are once-per-30–60s and only inside the base radius — a comp that fights away from home gets nothing; siege pressure faster than the window overrides the rebate.
- **Visual:** T1 white stone chapel with a healing fountain · T2 sanctum with floating golden chalices · T3 gilded cathedral with a radiant dome and orbiting soul-lanterns.

---

## 5. 📐 Pool Rules & Slot Allocation (v3)

- **Slots (unchanged):** 6 per side — 4 in the Outer Courtyard, 2 in the Inner Keep.
- **Duplicate rule (replaces "no duplicates"):** you may build multiple copies of the same facility. The **highest-tier copy keeps 100% effectiveness**; **every other copy runs at 50% potency at all tiers** (all numeric values halved: damage, %, range, refunds, caps — cooldown timers unchanged). **1 copy = 100% · 2 copies = 150% · 3 copies = 200%.** To double any facility's output you must build **3** copies, not 2.
  - *Example (Caravan Post):* two T3 Caravans = 8.33 + 4.17 ≈ **12.5 g/s** (not 16.67); three T3 Caravans = 8.33 + 4.17 + 4.17 ≈ **16.67 g/s** = double output.
  - *Tier mixing:* a T3 copy + a T1 copy → the T3 keeps 100%, the T1 runs at 50% of its T1 values.
- **Category cap (unchanged):** max **3 of any one category** (Production / Combat / Buff) per side — so at most 3 copies of the same facility fit.
- **Upgrades (unchanged):** HP 500/750/1000 · 150g / 250g+100XP / 400g+250XP · damage retention & 50% mid-upgrade refund (`TextPlan/03 - Facilities/00` §1). **Exception: Golden Vault = 100/200/400 HP** (fragile by design).
- **Siege Range Doctrine:** no Combat Facility's attack range may exceed **30 hexes from the owning wall** — the mid-field (~75) and the enemy's side are permanently unreachable. All current combat ranges (5–8) already sit far under the cap.
- **Buff Monolith Doctrine:** each Buff Monolith grants exactly **one unique effect**; flat % base-stat auras are banned.
- **Combat Facility activation (unchanged):** Combat Facilities build during Opening (0:00–5:00) but the **active weapons (Ballista, Catapult) don't fire until Expansion (5:00)**.
- **Core economy lives elsewhere:** Gold Mint / XP Crucible / Supply Depot are **Core Upgrades** (`TextPlan/03 - Facilities/02 - Core Upgrades (Treasury, Crucible, Barracks).md`) — they no longer consume slots.
- **Economy audit:** every facility's per-second contribution is tabulated in `Data/Economy/00 - Economy Per-Second Audit.md` §3.

---

## 6. 🆕 New Methods Introduced (implementation glossary)

These mechanics are new and must be specified before coding:

1. **Deposit Term / Vault (Golden Vault).** A lock-in investment timer: gold leaves the active bank → sits in a per-copy vault → returns with interest at maturity. Requires: vault state per Bank copy, term timers, **locked-gold exclusion** (spendable bank and bank-threshold traits ignore vaulted gold), and **breach-on-destroy** (vaulted gold is forfeited).
2. **Duplicate Rule (facility stacking).** A potency engine: the highest-tier copy of each facility = ×1.0, every other copy = ×0.5 on all numeric values (cooldowns unchanged). Applies to every category, including proc-based Buff Monoliths (potency halves, timer does not).
3. **Siege Range Doctrine.** A global range gate: every Combat Facility's attack range is capped at **30 hexes from the owning wall**; mid-field (~75) is out of reach. New combat facilities inherit the cap by rule, not by recall.
4. **Unique Effect (Buff Monolith).** Keyword-style facility effects (Battle Cry, OOC Regen, Gust Surge, Orders Relay, Battlefield Lessons, Second Wind). The **no-%aura rule** replaces flat stat auras and is enforced for all future buff facilities.
5. **% Max HP scaling.** Regen/heal/shield values that scale with a unit's current Max HP (Transmuter 4–8%, Training Grounds 20–40%, Bank-fragility exceptions). These ride the ×1.6 stat escalation curve automatically instead of adding flat numbers on top.

---

## 7. 🏛️ The 19th Facility — Imperial Gate (trait-gated unique)

> **Not in the pool.** The **Royal Charter** blessing (`Data/BlessingList/02 - Transcendence Blessing.md`, Economy §8) grants a player the right to construct **one Imperial Gate** in one of their 6 Inner Wall Slots. It is a unique facility — **no other player can build it, and it cannot be duplicated** (the Duplicate rule does not apply to it). It counts against the slot total and the category cap (it is its own category: **Unique**).
> *Design rationale: the old Warp Gate teleport was too strong as an open pool option — it was cut from the 18. Royal Charter brings it back as the trait-gated landmark: you pay a trait slot to gain the only army in the game that can be in two places at once.*

### 🌀 Imperial Gate
- **Footprint:** 3×3 · HP 500/750/1000 · costs 150g / 250g+100XP / 400g+250XP · **one copy per player, only with Royal Charter**.
- **Type:** Unique — platoon mobility (the warp landmark).
- **T1 — Platoon Warp:** the commander selects **one friendly platoon and another friendly platoon**; the first **instantly warps to the second's position**. Cooldown **60s**. (No Core involved — warp is platoon-to-platoon.)
- **T2:** Cooldown **45s**; **fallen units respawn at the Gate** instead of the Core (wired to the **respawn rule**, `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3).
- **T3:** Cooldown **30s**; warped platoons gain **+20% damage for 5s** after arrival.
- **Unique Twist:** *force concentration* — merge two fronts into one in an instant: a defending platoon warps onto a pushing platoon, or a jungle platoon jumps to the breach lane. The 30–60s CD is the whole counter: the Gate is strongest exactly once per cooldown.
- **Counterplay:** kill the Gate (500/750/1000 HP, zero self-defense) and the trait is a dead pick for the rest of the match; the warp commits — platoons that jump in can't jump back.
- **Visual:** T1 ring of standing rune stones · T2 twin rings with a swirling blue portal lens · T3 gilded triple-arch nexus with orbiting warp shards.

---

## 8. ⚖️ Balance Audit (v3) — flags & proposals

> Method: every facility checked against (a) the 10 g/s passive baseline, (b) the slot opportunity cost (only 6 slots), (c) the 30-hex Siege Range Doctrine, and (d) the Duplicate rule math. **Verdicts below — issues that need a decision are marked 🔧, accepted trade-offs are marked ✓.**

1. **✓ Resolved — the Trebuchet T3 decision is void.** The Trebuchet Yard was replaced by the Catapult (anti-unit AoE); there is no structure-damaging turret in the pool and no forward facility sites are planned, so the "dead structure damage" rider no longer exists.
2. **✓ Caravan Post T3 (+8.33 g/s) vs free Core Treasury T3 (+10 g/s).** Near-parity with the passive is exactly the target — Caravan's differentiator is the **lump payment** that feeds bank-threshold traits (Interest / War Bonds) and big purchases, not raw drip. No change; if playtest shows it under-drafted, the knob is T3 → +600g/min (= 10 g/s).
3. **✓ Golden Vault rates.** T1 10/25/75 → T2 15/40/150 → T3 25/60/200 are **internally monotonic** (re-investing shorter terms never beats the longer term — verified in the terms note). T3 Long (200%) is the highest single-facility payout in the game and the deliberate high-variance pick: 400 HP, 4-min lock, forfeit on destroy. The **1,000g/term cap and one-term-per-copy are the tuning knobs** — flagged, not changed.
4. **Watch — 3 Banks under the Duplicate rule** (100/50/50): three T3 Long vaults can lock 3,000g → **+4,000g** if all survive. Same risk gate as #3 (fragile, locked, forfeitable) — watch at playtest before touching the cap.
5. **🔧 Ballista / Catapult one-shot curve.** Ballista (2,000/3,000/4,000) and Catapult center (1,200/1,800/2,500) outpace base unit HP (520–1,450) — a T1 bolt deletes any T1–T3 unit. At the ×1.6 stat cap, T5 units (≈2,320 HP) survive a T1 bolt (2,000) but not T2/T3. The **25s cooldown and the ≤5–8 hex reach are the only limiters**. *Flagged for playtest:* if towers delete pushes too hard, the knob is damage, not range/cooldown.
6. **🔧 Fortress-zone radius = 8 hex (tuning knob).** Field of Despair / Sanctuary share the 8-hex zone (one wall segment + courtyard approach). If the auras over- or under-perform, the knob is the radius, not the %.
7. **✓ Field of Despair (−60% heal) vs Sanctuary (+90% heal) mirror.** They cancel in the overlap — enemy Field over your Sanctuary ≈ net zero in the contested zone. Both are slot investments the enemy can answer; accepted.
8. **✓ Metal Wall (+15% → −85% non-siege).** Additive on the −70% floor; walls stay breachable because Siege-class damage ignores non-siege resistance. Accepted.
9. **⚠ Stealth/trap counter removed with Ward Spire.** True sight now comes only from unit/item/scout sources (Silas's Spotter's Blade, Vital/Null Wards, Scout cards). Flagged: if Penumbra Shroud / trap lines over-perform without a facility counter, reintroduce a true-sight effect (e.g., Arcane Barrier T3).
10. **✓ No facility damages walls anymore (Mortar removed).** Wall pressure is now exclusively Siege-class units + siege cards/traits. Deliberate shift; watch that sieges slow down without a wall-burn turret.
11. **✓ Respawn-rule economy.** Free 30s respawn removes the rehire tax; a loss costs tempo (30s off-board), not gold. The 2:30 escalation still gates army *building*; Resign (70% + 30s lock) gates churn. Sanctum T3 (instant respawn) + Recruit Depot T3 (halved respawn) are the strongest recovery loop — watch at playtest.
12. **✓ Ballista / Catapult / Field of Despair / Arcane Barrier / Sanctuary / Metal Wall** — all inside the 30-hex cap and the Duplicate rule (2nd copy halves potency, not the 25s cooldown; 3 Catapults = 200% damage, capped by the 3-per-category rule).
13. **✓ Training Grounds T3 permanent +1% Max HP per level-up** — capped by the unit level curve (max L3 = **+2% per unit**). Verified safe.
14. **✓ Sanctum T3 (instant respawn / 30s window) + Recruit Depot T3 (15s respawn, 15s lock)** — the strongest loss-recovery loop; respawn is free by rule, so the loop only buys tempo, never army. Accepted.
