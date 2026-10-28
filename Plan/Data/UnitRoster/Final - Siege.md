---
tags: [Final, Siege, Unit, StructureDamage, GlassCannon]
type: Final Unit List
---

# 🏰 FINAL: SIEGE (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All skills are **off cooldown at combat start**, cooldowns are seconds-based, and activation follows the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`. **Siege structure nukes carry the longest CDs in the game (7–14s) — the highest burst in the game is gated the hardest. Siege units never move while a structure is in range.**
>
> **Siege command behavior (defaults):** `A`/`D` structure skills HIGH; `J` nukes REACTIVE (only vs player units); `R` all offense OFF (they cannot outrun anything — the commander should never `R` a siege unit); `G` skill use OFF. Deviations noted per unit.

---

## 1. Titan Mortar Gus — *"Bombardment"* (T4)

- **Stats (FINAL):** HP 950 | ATK 120 | DEF 15 | MR 15 | Range 6 | Move 0.9 | ASPD 0.4
- **Core Identity:** Long-range structure bombardment with AoE splash.
- **Passive — Heavy Shells (refresh):** +150% damage to structures. **CD 6s.**
- **Ability — Bombardment:** Fires 3 shells at a structure area (2-hex AoE, 90% ATK each); damages units in the splash too. **CD 9s.** Trigger: `A`/`D` = structure in range; `J` = REACTIVE vs units.
- **L3 Paragon Evolution — Cluster Bunker-Buster:** Bombardment shells leave behind incendiary shrapnel craters for 4s; units standing inside suffer a 40% slow and take 30% ATK physical damage per second, and structure damage ignores all facility repair buffs.
- **Unique Twist:** Splash siege — kills both walls and the units behind them.
- **Key Synergies:** Bulwark Aldric (intercept), Bannerlord Cassius (revive), Graviton Olum (cluster), Gunslinger Wren.
- **Counterplay:** Dive before the shells land (carry focus auto-prioritizes him); interrupt; CC — his 0.9 move means he can never escape.

---

## 2. Rammaster Kodo — *"Battering Ram"* (T2)

- **Stats (FINAL):** HP 800 | ATK 85 | DEF 20 | MR 10 | Range 1 | Move 1.3 | ASPD 0.5
- **Core Identity:** Charge-based structure breaker — the fastest siege unit, still slower than everything else.
- **Passive — Momentum (refresh):** +20% move speed while no enemy is adjacent. **CD 4s.**
- **Ability — Battering Ram:** Charges 3 hexes in a line, dealing 200% ATK to units and **400% ATK** to structures; stuns himself 1s afterward. **CD 8s.** Trigger: `A` = structure in line OR clear line to frontline.
- **L3 Paragon Evolution — Unstoppable Juggernaut Ram:** Battering Ram removes self-stun completely and grants CC immunity during the charge; impacting a structure shatters its foundation, reducing its damage output by 50% for 5s.
- **Unique Twist:** High-risk charge — huge structure damage, self-stun, no defense.
- **Key Synergies:** Oracle Vessa (charge immunity), Aegis Bastion, Mender Tulia, Bannerlord Cassius.
- **Counterplay:** Block the charge with a unit; AoE CC interrupts mid-charge; CC during the self-stun (guaranteed window).

---

## 3. Catapult Weyr — *"Siege Toss"* (T3)

- **Stats (FINAL):** HP 900 | ATK 100 | DEF 18 | MR 12 | Range 7 | Move 0.9 | ASPD 0.4
- **Core Identity:** Over-the-wall lobber that bypasses defensive layers entirely.
- **Passive — Arc Shot (refresh):** Ignores walls; +100% damage to structures. **CD 6s.**
- **Ability — Siege Toss:** Lobs a boulder over walls to a target hex: 140% ATK AoE (structures take **250%**). **CD 10s.** Trigger: `A`/`D` = structure or unit cluster in range.
- **L3 Paragon Evolution — Magma Core Catapult:** The lobbed boulder explodes upon landing, scattering 3 magma fragments to adjacent hexes (dealing 70% ATK to units and 150% to structures); units struck are knocked down for 1.2s.
- **Unique Twist:** Wall bypass — cannot be body-blocked by terrain.
- **Key Synergies:** Sylphweaver Auriel (push enemies into the landing zone), Ballista Grun, Sniper Castella, Voidmaw Drenn.
- **Counterplay:** Dive; spread units (reduces AoE value); CC — 900 HP dies to any engage.

---

## 4. Sapper Drox — *"Demolition Charge"* (T1)

- **Stats (FINAL):** HP 550 | ATK 60 | DEF 10 | MR 8 | Range 2 | Move 1.1 | ASPD 0.6
- **Core Identity:** Bomb-planter — cheap, suicidal, devastating to structures.
- **Passive — Set Charge (refresh):** Standing next to a structure plants a ticking charge every 8s (30% ATK structure DoT). **CD 8s.**
- **Ability — Demolition Charge:** Plants a bomb on the nearest structure (2s fuse) dealing **350% ATK true damage** to structures. **CD 8s.** Trigger: `A`/`D` = structure in melee range.
- **L3 Paragon Evolution — Chain-Reaction Dynamite:** Demolition Charge plants a dual-charge that also detonates upon Drox's death; if the target structure is destroyed within 4s of planting, the blast cascades into adjacent enemy structures for 200% ATK true damage.
- **Unique Twist:** The cheapest structure damage in the game — and the most fragile unit in the game.
- **Key Synergies:** Bulwark Aldric (protect), Oracle Vessa, Pixie Trickster Fae (disable nearby), Warden of Oath Galen.
- **Counterplay:** Kill-on-sight — the squishiest unit in the game (550 HP, 10 DEF); any engage removes him; body-block him from structures.

---

## 5. Cannoncer Brik — *"Cannonball"* (T3)

- **Stats (FINAL):** HP 850 | ATK 110 | DEF 16 | MR 10 | Range 5 | Move 0.9 | ASPD 0.35
- **Core Identity:** Single-huge-shot structure deleter.
- **Passive — Solid Shot (refresh):** +125% damage to structures; −50% damage to non-structures. **CD 6s.**
- **Ability — Cannonball:** Massive shot: **400% ATK to structures**, 250% to units in line; 1s reload animation afterward. **CD 11s** (biggest single-shot spike gated). Trigger: `A`/`D` = structure in range.
- **L3 Paragon Evolution — Dreadnought Piercing Shot:** Cannonball punches through the primary target structure to strike any secondary structure or unit directly behind it for 100% full damage; completely removes the 1s reload delay if the shot destroys a structure.
- **Unique Twist:** Everything focused into one shot — the most spike-y structure damage.
- **Key Synergies:** Aegis Bastion, Bannerlord Cassius, Mender Tulia, Voidmaw Drenn.
- **Counterplay:** Dive; CC during the 1s reload (predictable rhythm = punish window); kill before the next shot.

---

## 6. Trebuchet Elder Gorm — *"Cataclysm"* (T5)

- **Stats (FINAL):** HP 1,200 | ATK 150 | DEF 22 | MR 15 | Range 9 | Move 0.7 | ASPD 0.3
- **Core Identity:** Global-range structure threat — the ultimate siege carry.
- **Passive — Ancient Siege (refresh):** +200% damage to structures. **CD 6s.**
- **Ability — Cataclysm:** After a **2.5s channel**, deals **300% ATK** to the target structure and 50% splash to nearby units. **CD 14s** (longest nuke CD — global-range power gated). Trigger: `A`/`D` = structure in range AND no enemy CC ready (channel safety, `08` §1.3).
- **L3 Paragon Evolution — Apocalyptic Comet:** Cataclysm channel time is reduced from 2.5s to 1.5s; the impact disables the targeted defensive tower from firing for 5s and creates a blinding 3-hex dust storm granting 40% projectile evasion to all allied siege units for 5s.
- **Unique Twist:** Longest range + highest structure damage; the longest channel in the game (fully interruptible).
- **Key Synergies:** Oracle Vessa (partial protection), Bannerlord Cassius, Aegis Bastion, Ballista Grun.
- **Counterplay:** Auto-interrupt the channel (any CC — the easiest interrupt in the game); dive; his 0.7 move = zero escape.

---

## 7. Breacher Krag — *"Melt Wall"* (T2)

- **Stats (FINAL):** HP 750 | ATK 75 | DEF 14 | MR 20 | Range 3 | Move 1.0 | ASPD 0.5
- **Core Identity:** Structure DoT melter — slow but unstoppable burn.
- **Passive — Acidic (refresh):** Basic attacks vs structures apply Melt (2% max HP structure damage/sec, stacks 5×). **CD 5s.**
- **Ability — Acid Spray:** Cone AoE: structures take **12% max HP damage over 3s**; units take 80% ATK. **CD 8s.** Trigger: `A`/`D` = structure in range.
- **L3 Paragon Evolution — Caustic Dissolution:** Acid Spray corrodes structures for 20% max HP over 3s and permanently strips 30% Armor/MR from units caught in the cone; corroded structures suffer 25% amplified damage from all allied attacks.
- **Unique Twist:** %max-HP structure burn — walls melt regardless of tier.
- **Key Synergies:** Sapper Drox (stack charges + melt), Titan Mortar Gus, Ballista Vul, Bannerlord Cassius.
- **Counterplay:** Dive; CC; his %-burn is slow — burst comps race him.

---

## 8. Ballista Vul — *"Bolt Volley"* (T1)

- **Stats (FINAL):** HP 600 | ATK 70 | DEF 12 | MR 8 | Range 6 | Move 1.0 | ASPD 0.5
- **Core Identity:** Cheap armor-piercing bolt thrower.
- **Passive — Armor-Piercing (refresh):** Ignores 40% of armor on structures and units. **CD 4s.**
- **Ability — Bolt Volley:** Fires 4 bolts over 2s (45% ATK each, ignoring armor). **CD 7s.** Trigger: `A`/`D` = structure or tank in range; `J` = camp.
- **L3 Paragon Evolution — Ballista Gatling Volley:** Bolt Volley fires 8 rapid-fire bolts over 2s (dealing 40% ATK each, ignoring 60% armor); scoring 4 hits on the same structure or unit triggers an Armor Fracture that stuns for 1s.
- **Unique Twist:** Budget anti-armor — makes walls and tanks bleed equally.
- **Key Synergies:** Breacher Krag (melt + pierce), Sniper Castella, Longshot Bren, Gunmage Petra.
- **Counterplay:** Dive; armor-heavy targets suffer, so spread; CC.

---

## 9. Blastengine Rik — *"Rocket Barrage"* (T4)

- **Stats (FINAL):** HP 1,000 | ATK 125 | DEF 18 | MR 12 | Range 6 | Move 0.9 | ASPD 0.4
- **Core Identity:** Overheating rocket launcher — massive burst windows followed by shutdown.
- **Passive — Overheat (refresh):** After 3 rapid casts, 1.5s overheat (+50% damage during). **CD 5s.**
- **Ability — Rocket Barrage:** Fires 4 rockets at a structure area (100% ATK each, 1-hex AoE splash on units). **CD 9s.** Trigger: `A`/`D` = structure in range.
- **L3 Paragon Evolution — Thermobaric Salvo:** Rocket Barrage fires 6 homing incendiary rockets that track retreating enemy units or the closest structure; during Overheat, Rik gains a 300 HP heat-shield and continuously radiates 20% ATK burn damage per second to adjacent enemies.
- **Unique Twist:** Burst-window design — predict his rhythm, punish the downtime.
- **Key Synergies:** Timewarp Elowen (buy time during overheat), Bannerlord Cassius, Mender Tulia, Aegis Bastion.
- **Counterplay:** Dive during the overheat window (predictable downtime = punish); CC; kill before the barrage.

---

## 10. Colossus Obr — *"Mega Slam"* (T5)

- **Stats (FINAL):** HP 1,600 | ATK 135 | DEF 30 | MR 20 | Range 1 | Move 0.8 | ASPD 0.4
- **Core Identity:** Siege-tank hybrid — the most durable siege unit, still a slow paper tiger to focus fire.
- **Passive — Juggernaut (refresh):** +25% damage reduction vs non-siege damage. **CD 6s.**
- **Ability — Mega Slam:** Deals **300% ATK** to the target structure + stuns nearby units 1.5s (80% ATK AoE). **CD 11s.** Trigger: `A` = structure in melee; `D` = structure adjacent.
- **L3 Paragon Evolution — Continental Faultline:** Mega Slam fractures the earth in a 3-hex shockwave, leaving permanent rubble terrain that slows enemy movement by 50%; targeted structures have their damage resistance nullified to 0 for 6s.
- **Unique Twist:** The tankiest siege unit — but his HP is only mid-tier for a 5-cost and he can never escape.
- **Key Synergies:** Aegis Bastion, Bannerlord Cassius, Seraph Angelus, Warden of Oath Galen.
- **Counterplay:** True damage (bypasses DR); kite forever (0.8 move); CC; focus-fire overwhelms even his 1,600 HP.

---

> **Class Summary (FINAL):** Siege identity is preserved — the slowest move speeds (0.7–1.3 vs 1.4–2.3 for all other classes), the lowest durability (550–1,200 except Obr's tanky hybrid), and structure multipliers ×1.25–×2.0. Structure nukes are gated at 7–14s CDs — the highest burst in the game is also the most predictable and interruptible. Every siege unit is a kill-on-sight dive target. All 10 Siege units feature signature L3 Paragon Evolutions granting game-ending objective-cracking power. ✅
