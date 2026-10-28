---
tags: [Final, Mage, Unit, AoE, MagicDamage]
type: Final Unit List
---

# 🔮 FINAL: MAGES (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All skills are **off cooldown at combat start**, cooldowns are seconds-based, and activation follows the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`. **Mage nukes carry the longest damage CDs (7–12s) — high damage is gated against spamming.**
>
> **Mage command behavior (defaults):** `A` nukes/zone HIGH; `J` farm zones HIGH; `D` nukes REACTIVE (enemy in defended range); `R` all offense OFF. Channels follow `08` §1.3 (never start into ready enemy CC). Deviations noted per unit.

---

## 1. Astralweaver Orin — *"Starfall"* (T4)

- **Stats (FINAL):** HP 950 | AP 100 | DEF 25 | MR 40 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Scaling meteor caster whose Starfall grows with every spell he throws.
- **Passive — Star Dust (refresh):** Each spell cast grows Starfall's radius by 1 hex and +10% damage (max +50% / +3 hex). **CD 6s** (cast-growth counter re-applied per cast).
- **Ability — Starfall:** Summons meteors on the enemy cluster for 3s, dealing 60% AP/sec within the radius. **CD 11s.** Trigger: `A` = ≥3 enemies in cluster; `J` = camp cluster.
- **L3 Paragon Evolution — Cosmic Supernova:** When Starfall reaches maximum growth (+50% / +3 hex), the final wave culminates in a blinding Supernova blast dealing 180% AP burst and applying a 1.5s Blind (100% miss chance on basic attacks) to all trapped targets.
- **Unique Twist:** Late-game scaling monster — weak early, devastating by the end of a fight.
- **Key Synergies:** Graviton Olum (cluster setup), Bonecage Maldr (link spreads), Tidecaller Nami (stun holds targets in the rain), Stoneheart Gol (root).
- **Counterplay:** Interrupt-free counter = spread + MR stack; dive him (950 HP); kill before the ramp.

---

## 2. Frostcaller Lyra — *"Crystal Nova"* (T1)

- **Stats (FINAL):** HP 620 | AP 55 | DEF 15 | MR 25 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Chill-to-freeze control mage — the budget CC engine.
- **Passive — Chill (refresh):** Enemies hit are chilled (10% slow, stacks 3×); at 3 stacks they are frozen for 1s. **CD 4s.**
- **Ability — Crystal Nova:** AoE magic damage + applies 2 chill stacks. **CD 7s.** Trigger: `A` = 2+ enemies; `D` = REACTIVE peel vs dive.
- **L3 Paragon Evolution — Absolute Sub-Zero:** Crystal Nova leaves behind a 3-hex Glacial Permafrost sheet for 4s; chilled enemies walking upon the sheet suffer 50% reduced dash/blink distances, and shattering an already frozen target triggers a 75% AP Frost Splinter shrapnel burst to adjacent hexes.
- **Unique Twist:** Cheap control that enables freeze chains.
- **Key Synergies:** Frostward Ymir (freeze chain), Pyromancer Cinder (burned frozen targets), Venomancer Slyth, Stoneheart Gol.
- **Counterplay:** Cleanse; spread (denies 3-stack freeze); dive the 620-HP mage.

---

## 3. Pyromancer Cinder — *"Inferno Field"* (T2)

- **Stats (FINAL):** HP 700 | AP 70 | DEF 18 | MR 30 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Burn DoT spreader that turns kills into chain explosions.
- **Passive — Combust (refresh):** Enemies killed while burning explode, spreading burn to adjacent enemies. **CD 5s.**
- **Ability — Inferno Field:** Creates a burning zone (3 hexes) dealing 45% AP/sec for 4s. **CD 9s.** Trigger: `A` = ≥3 enemies cluster; `J` = camp.
- **L3 Paragon Evolution — Cataclysmic Hellfire:** Inferno Field melts away enemy Magic Resistance by 4% per second (stacking up to 20%); enemies killed inside explode with double the Combust radius (2 hexes) and spawn a secondary mini-Inferno patch under their corpse for 3s.
- **Unique Twist:** Anti-cluster snowball — one kill ignites the whole formation.
- **Key Synergies:** Astralweaver Orin (cluster), Graviton Olum (pull into the fire), Venomancer Slyth (poison + burn), Nyx Oracle Kira.
- **Counterplay:** Spread; cleanse; kill her (700 HP) before the field burns — anti-heal not needed.

---

## 4. Stormcaller Zeph — *"Chain Lightning"* (T3)

- **Stats (FINAL):** HP 800 | AP 85 | DEF 20 | MR 35 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Bounce-damage mage that punishes dense formations.
- **Passive — Static (refresh):** Enemies struck by Chain Lightning take +5% magic damage per bounce history (stacking). **CD 5s.**
- **Ability — Chain Lightning:** Deals 130% AP to the target, bouncing to 4 nearby enemies at 70% damage each. **CD 8s.** Trigger: `A` = 3+ enemies in bounce range; else REACTIVE.
- **L3 Paragon Evolution — Overcharged Arc Storm:** Chain Lightning bounce cap increases from 4 to 7 bounces, can now bounce back to previous targets if separated by at least 1 intermediary jump, and targets struck ≥2 times in a single cast are Stunned for 1.25s.
- **Unique Twist:** Amazing vs clumps, useless vs spread.
- **Key Synergies:** Bonecage Maldr (density), Astralweaver Orin, Graviton Olum, Hexkeeper Mira (amplify).
- **Counterplay:** Spread (kills the bounce); MR stack; dive.

---

## 5. Voidmaw Drenn — *"Reality Rift"* (T5)

- **Stats (FINAL):** HP 1,100 | AP 120 | DEF 22 | MR 45 | Range 4 | Move 1.7 | ASPD 0.65
- **Core Identity:** %max-HP zone damage that melts even the fattest tanks.
- **Passive — Void Burns (refresh):** Rift damage ignores 30% of MR. **CD 5s** (MR-pierce re-applied per tick).
- **Ability — Reality Rift:** Opens a rift (2-hex radius) for 5s dealing 8% max HP magic damage/sec to enemies inside. **CD 12s** (longest mage nuke — tank-melting power gated). Trigger: `A` = 2+ enemies OR a Tanker in range; `D` = REACTIVE.
- **L3 Paragon Evolution — Singularity Event Horizon:** Reality Rift pulses a gravitational pull every 1.5s that drags all enemies within 3 hexes toward the epicenter; enemies remaining inside for the full 5s duration have their maximum HP suppressed by 15% for the rest of the battle.
- **Unique Twist:** Tank-killer zone — the ultimate anti-Tanker tool.
- **Key Synergies:** Stoneheart Gol (root holds them in the rift), Graviton Olum (pull), Frostward Ymir (freeze in rift), Colossus Obr (tank line pressure).
- **Counterplay:** Walk out of the static zone; CC him; spread so the rift hits ≤1 unit; dive (1,100 HP).

---

## 6. Timewarp Elowen — *"Chrono Lock"* (T4)

- **Stats (FINAL):** HP 900 | AP 90 | DEF 20 | MR 40 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Defensive tempo mage that rewind-damages allies and delays enemy burst.
- **Passive — Time Dilation (refresh):** Allies within 2 hexes gain +10% ASPD. **CD 4s.**
- **Ability — Chrono Lock:** Marks a 3-hex area for 3s: enemy damage dealt inside is 40% delayed; ally damage received inside is 40% reverted as healing. **CD 10s.** Trigger: `D` = ally cluster under threat; `A` = REACTIVE.
- **L3 Paragon Evolution — Temporal Stasis Paradox:** Allies inside Chrono Lock gain complete immunity to hard crowd control (Stuns, Knocks, Roots); when Chrono Lock expires, all delayed enemy damage erupts outward as a Chrono-Burst shockwave dealing 50% of the absorbed damage back to surrounding enemies.
- **Unique Twist:** A mage that protects instead of nukes — tempo control.
- **Key Synergies:** Phoenixblade Sera (buy the reset window), Warcry Beserka (extend berserk), Mender Tulia, Aegis Bastion.
- **Counterplay:** Force fights outside the zone (the zone is static); dive her; pull allies out (Rhuk).

---

## 7. Hexkeeper Mira — *"Hex Curse"* (T2)

- **Stats (FINAL):** HP 680 | AP 65 | DEF 16 | MR 28 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Focus-fire amplifier that makes one enemy the whole team's target.
- **Passive — Malice (refresh):** Hexed enemies take +25% magic damage. **CD 4s.**
- **Ability — Hex Curse:** Marks an enemy for 8s: +25% damage taken from all sources; if the marked enemy dies, the curse spreads to the nearest enemy. **CD 7s.** Trigger: `A` = focus target alive; `D` = REACTIVE.
- **L3 Paragon Evolution — Pandemic Hexweave:** Hex Curse now simultaneously marks the primary target AND the highest-current-HP enemy within 4 hexes; when any cursed target perishes, both the damage amplification spread and a 3-second 40% healing reduction miasma transfer to the two closest living enemies.
- **Unique Twist:** Single-target amplifier with spreading curse.
- **Key Synergies:** Stormcaller Zeph (bounce hits the cursed), Gunmage Petra, Sniper Castella, Stormdancer Kael.
- **Counterplay:** Cleanse the curse; keep distance from a cursed ally (spread death); dive the 680-HP mage.

---

## 8. Sylphweaver Auriel — *"Arcane Gust"* (T3)

- **Stats (FINAL):** HP 780 | AP 80 | DEF 18 | MR 32 | Range 3 | Move 1.9 | ASPD 0.7
- **Core Identity:** Displacement disruptor that reshapes the battlefield.
- **Passive — Zephyr (refresh):** +10% dodge chance. **CD 4s.**
- **Ability — Arcane Gust:** Knocks enemies in a line back 2 hexes (90% AP); enemies pushed into a wall/edge are stunned 1.5s. **CD 8s.** Trigger: `A` = 2+ enemies in line OR enemy near wall; `D` = peel.
- **L3 Paragon Evolution — Gale Force Vortex:** Arcane Gust width expands into a 3-lane hurricane blast; enemies slammed into terrain or obstacles have their Armor/MR shattered by 30% for 4s, while allies caught in the tailwind gain a 40% movement speed boost and a 15% AP spell-shield for 3s.
- **Unique Twist:** Positional utility — pushes enemies into rifts, fires, or siege lines.
- **Key Synergies:** Voidmaw Drenn (push into rift), Pyromancer Cinder (push into fire), Graviton Olum (displacement combo), Ballista Grun (push into the siege line).
- **Counterplay:** Heavy frontline resists knockback; CC her; avoid wall edges (positioning counter).

---

## 9. Venomancer Slyth — *"Poison Cloud"* (T1)

- **Stats (FINAL):** HP 600 | AP 52 | DEF 14 | MR 24 | Range 3 | Move 1.8 | ASPD 0.7
- **Core Identity:** Poison DoT spreader that shreds enemy armor over time.
- **Passive — Venom (refresh):** Poison ticks reduce the target's armor by 2% per stack (max 10 stacks). **CD 4s** (DoT ticks re-applied).
- **Ability — Poison Cloud:** Zone (3 hexes) applying 4 poison stacks; enemies inside take 30% AP/sec. **CD 8s.** Trigger: `A` = 2+ enemies; `J` = camp; `D` = REACTIVE.
- **L3 Paragon Evolution — Neurotoxic Corrosion:** Poison Cloud persists for an additional 2s and inflicts Grievous Wounds (50% healing and shield reduction); targets reaching maximum 10 Venom stacks suffer Neurotoxic Tremors, reducing their attack range by 1 hex (minimum 1) and taking 10% self-damage on basic attacks.
- **Unique Twist:** Cheap anti-armor setup for physical teams.
- **Key Synergies:** Ironclaw Grendal (execute after shred), Vanguard Marrow (double shred), Longshot Bren, Sapper Drox.
- **Counterplay:** Cleanse; range poke her (600 HP); heal through the DoT; MR stack.

---

## 10. Echo Sage Vermos — *"Resonance"* (T5)

- **Stats (FINAL):** HP 1,000 | AP 115 | DEF 20 | MR 45 | Range 4 | Move 1.7 | ASPD 0.65
- **Core Identity:** Spell-echo chaos agent that copies the last friendly ability.
- **Passive — Echo Bolt (refresh):** Basic attacks are arcane bolts dealing 60% AP. **CD 4s.**
- **Ability — Resonance:** Copies the last ability cast by a friendly unit and recasts it on the enemy cluster at 60% effectiveness (healing abilities echo as heals on allies). **CD 10s.** Trigger: `A` = any ally cast a damage ult in last 4s; `D` = REACTIVE echo of protection.
- **L3 Paragon Evolution — Perfect Harmonic Echo:** Resonance casting effectiveness increases from 60% to 85%, and casting Resonance grants Vermos and the copied ally 30 Mana / 20% instant cooldown refund on their next ability cast.
- **Unique Twist:** Unpredictable mirror — doubles whatever your team is doing.
- **Key Synergies:** Astralweaver Orin (double meteor), Battlechanter Rory (echo the buff), Bard of Echoes Lim (CDR), Timewarp Elowen.
- **Counterplay:** Kill him first (carry focus auto-targets); spell shield the echo; his chaos is comp-dependent — silence (Kira) nullifies him.

---

> **Class Summary (FINAL):** Mage identity is preserved — all are fragile mid-rangers (600–1,100 HP) with AoE/magic damage. None have meaningful armor, none can frontline, and none deal structure damage. Their power is conditional on enemy clustering; nukes are gated at 7–12s CDs, and every AoE is countered by spread formations. All 10 Mages feature signature L3 Paragon Evolutions adding tactical utility and combo depth. ✅
