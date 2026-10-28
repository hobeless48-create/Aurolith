---
tags: [Final, Tanker, Unit, Durability, CC]
type: Final Unit List
---

# 🛡️ FINAL: TANKERS (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All skills are **off cooldown at combat start**, cooldowns are seconds-based, and activation follows the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`.
>
> **Tanker command behavior (defaults):** `D`/`R` defensive skills HIGH (full trigger sensitivity: ally <85% HP, enemy in range, self focused); `A` defensive REACTIVE (ally <40%, self CC'd, or focused by 2+). **Defensive skills run the persistent retrigger loop — never a one-time cast on range acquisition** (Tank Skill Timing Fix, `09` §4).

---

## 1. Aegis Bastion — *"Fortress"* (T3)

- **Stats (FINAL):** HP 1,650 | ATK 65 | DEF 55 | MR 45 | Range 1 | Move 1.6 | ASPD 0.6
- **Core Identity:** Taunt-shield bulwark that forces enemies to fight him while shielding the backline.
- **Passive — Unyielding (refresh):** Below 30% HP, gains +25% damage reduction. **CD 4s.**
- **Ability — Bulwark Shout:** Taunts all enemies within 3 hexes for 2s; grants nearby allies a shield equal to 20% of their max HP. **CD 8s.** Trigger: `D`/`R` = any enemy in range or ally <70%; `A` = ally <40% or self focused by 2+.
- **L3 Paragon Evolution — Fortress Bastion:** Taunt radius expands to 4 hexes (lasts 3.0s); shield granted to allies increases to 35% Max HP and grants them 10 Tenacity.
- **Unique Twist:** Peel + protection in one package.
- **Key Synergies:** Paladin Luxor (double shields), Mender Tulia (sustain), Sniper Castella (safety), Colossus Obr (two-front wall).
- **Counterplay:** Sunder Aegis (shieldbreak, T1); magic damage vs his armor; CC-immune divers ignore the taunt.

---

## 2. Stoneheart Gol — *"Earthbind"* (T2)

- **Stats (FINAL):** HP 1,150 | ATK 55 | DEF 60 | MR 35 | Range 1 | Move 1.5 | ASPD 0.55
- **Core Identity:** Scaling armor rock that gets tougher the more damage he absorbs.
- **Passive — Bedrock (refresh):** +2 armor per missing 10% HP (max +20 armor). **CD 4s.**
- **Ability — Quake:** Deals 80% ATK AoE and roots all enemies in a 2-hex radius for 1.5s; gains +5 armor per rooted enemy. **CD 9s.** Trigger: `D`/`R` = 2+ enemies in radius; `A` = REACTIVE (3+ enemies).
- **L3 Paragon Evolution — Tectonic Rupture:** Quake creates jagged earth for 4.0s, slowing enemies by 50% and dealing 30 Physical Damage/sec to rooted targets.
- **Unique Twist:** Anti-physical wall with a reliable AoE root.
- **Key Synergies:** Frostward Ymir (root → freeze chain), Bulwark Aldric, Longshot Bren (pierce through rooted lines), Warden of Oath Galen.
- **Counterplay:** Magic damage ignores his armor; true/%max-HP damage (Drenn, Petra); kite (his move 1.5).

---

## 3. Tidecaller Nami — *"Watery Grave"* (T1)

- **Stats (FINAL):** HP 950 | ATK 45 | DEF 35 | MR 45 | Range 1 | Move 1.7 | ASPD 0.6
- **Core Identity:** Cheap CC tank with a passive regen aura.
- **Passive — Tidal Blessing (refresh):** Nearby allies (within 2 hexes) regenerate 1.5% max HP/sec. **CD 4s.**
- **Ability — Watery Grave:** Stuns the farthest enemy in a line for 2s and deals 60% ATK magic damage. **CD 8s.** Trigger: `D` = carry engaged in line; `A` = line through 2+ enemies.
- **L3 Paragon Evolution — Crashing Maelstrom:** Watery Grave stuns all enemies along the entire line (not just the farthest) and cleanses all soft and hard crowd control from allies within 2 hexes.
- **Unique Twist:** Budget sustain tank that keeps the frontline alive.
- **Key Synergies:** Warcry Beserka (regen keeps berserk alive), Stormrider Jinx, Gunslinger Wren, Phoenixblade Sera.
- **Counterplay:** Burst her first (cheapest tanker kill); anti-heal; she has the lowest tanker HP.

---

## 4. Thornback Bramble — *"Thorn Aura"* (T3)

- **Stats (FINAL):** HP 1,500 | ATK 60 | DEF 70 | MR 30 | Range 1 | Move 1.5 | ASPD 0.5
- **Core Identity:** Reflect-damage tank that punishes auto-attack compositions.
- **Passive — Thorns (refresh):** Reflects 30% of damage taken from melee attackers as true damage. **CD 3s** (highest-frequency defensive skill — pure reflect pressure).
- **Ability — Ironbark:** For 4s, +40 armor and reflect increased to 60%. **CD 6s.** Trigger: `D`/`A` = engaged by 2+ melee or focused; `R` = REACTIVE.
- **L3 Paragon Evolution — Spike Eruption:** Reflect damage increases to 80% and applies to ranged basic attacks; absorbing 500 damage triggers a thorn nova dealing 120 Physical Damage to all adjacent enemies.
- **Unique Twist:** The natural counter to marksman-heavy comps.
- **Key Synergies:** Frostward Ymir (slow keeps attackers in reflect range), Mender Tulia (self-sustain), Nyx Oracle Kira, Colossus Obr.
- **Counterplay:** Magic/spell damage (ignores reflect); CC him; simply don't attack him (focus the backline).

---

## 5. Bonecage Maldr — *"Necrotic Link"* (T4)

- **Stats (FINAL):** HP 1,850 | ATK 70 | DEF 65 | MR 55 | Range 1 | Move 1.5 | ASPD 0.55
- **Core Identity:** Damage-link chaining that punishes clumped enemies.
- **Passive — Rot (refresh):** Enemies that die near him grant +5% max HP (stacks 5×). **CD 5s.**
- **Ability — Necrotic Grip:** Entangles the 3 nearest enemies with chains for 4s (30% slow); damage dealt to any chained enemy is shared 40% to the other chained enemies. **CD 9s.** Trigger: `D` = 3 enemies clumped; `A` = REACTIVE (4+ clumped).
- **L3 Paragon Evolution — Death Tether:** Entangles up to 5 enemies; shared damage increases from 40% to 65% and tethered enemies cannot receive shields or healing.
- **Unique Twist:** Anti-cluster + focus-fire punish in one.
- **Key Synergies:** Astralweaver Orin (cluster AoE on the chain), Voidmaw Drenn (% damage spreads via link), Echo Sage Vermos (echo), Stormdancer Kael.
- **Counterplay:** Spread your units out (denies the chain); CC the linker; true damage bypasses his scaling.

---

## 6. Bulwark Aldric — *"Interceptor"* (T1)

- **Stats (FINAL):** HP 880 | ATK 48 | DEF 40 | MR 30 | Range 1 | Move 1.6 | ASPD 0.5
- **Core Identity:** Bodyguard that redirects damage meant for the lowest-HP ally.
- **Passive — Sentinel (refresh):** Takes 15% less damage from enemies within 1 hex. **CD 4s.**
- **Ability — Intercept:** Protects the lowest-HP ally within 3 hexes: redirects 60% of damage meant for them to himself for 5s; +25 armor during. **CD 5s.** Trigger: `D`/`R` = ally <60% HP (HIGH); `A` = ally <35%.
- **L3 Paragon Evolution — Iron Citadel:** Intercept redirects 80% of damage; Aldric reflects 30% of all redirected damage back to the attacker as Physical Damage.
- **Unique Twist:** The cheapest way to keep a fragile carry alive.
- **Key Synergies:** Ballista Grun (siege stance protection), Sniper Castella, Echo Sage Vermos, Eclipsed Iri.
- **Counterplay:** AoE damage bypasses the redirect (hits the carry anyway); kill the protected carry with pull/dash; ignore him.

---

## 7. Frostward Ymir — *"Glacial Aura"* (T4)

- **Stats (FINAL):** HP 1,750 | ATK 68 | DEF 60 | MR 50 | Range 1 | Move 1.5 | ASPD 0.55
- **Core Identity:** Slow-aura zone control tank that turns slows into freezes.
- **Passive — Glacial (refresh):** Enemies within 2 hexes are slowed 15%. **CD 3s.**
- **Ability — Permafrost:** Freezes enemies in a 3-hex line for 1.5s (100% ATK); enemies already slowed are frozen for 2.5s. **CD 9s.** Trigger: `D` = 2+ slowed enemies in line; `A` = REACTIVE.
- **L3 Paragon Evolution — Glacial Fortress:** Permafrost creates a 3-hex ice barrier blocking enemy movement for 3.0s; frozen enemies take +25% damage from all magic and physical attacks.
- **Unique Twist:** Zone-of-control CC.
- **Key Synergies:** Stoneheart Gol (root → freeze), Frostcaller Lyra (chill stacks), Twinblade Vex, Venomancer Slyth.
- **Counterplay:** Cleanse/CC-immunity (Vessa); engage from range (his slow needs proximity); spread.

---

## 8. Graviton Olum — *"Black Hole"* (T5)

- **Stats (FINAL):** HP 2,100 | ATK 80 | DEF 75 | MR 60 | Range 1 | Move 1.4 | ASPD 0.5
- **Core Identity:** Wombo-combo initiator that condenses the entire enemy team into a single cluster.
- **Passive — Dense Mass (refresh):** +10% HP per 3 enemies within 2 hexes (max +30%). **CD 5s.**
- **Ability — Event Horizon:** After a 1.5s channel, pulls all enemies within 3 hexes to center, stunning 1.5s and dealing 120% ATK. **CD 12s** (longest tanker CD — his payoff is comp-defining). Trigger: `A`/`D` = ≥3 enemies in radius AND no enemy CC ready in range (channel safety per `08` §1.3).
- **L3 Paragon Evolution — Singularity Collapse:** Channel delay reduced to 0.8s; pulled enemies have their Armor and MR shredded by 35% for 4.0s.
- **Unique Twist:** The setup king — everything AoE loves him; interrupts destroy him.
- **Key Synergies:** Chainbreaker Rhuk (double pull), Astralweaver Orin (meteor on the cluster), Voidmaw Drenn (rift on the cluster), Pyromancer Cinder (inferno on the cluster).
- **Counterplay:** Auto-interrupt the channel (any CC); spread before the pull; spell shield the stun.

---

## 9. Voidshell Krask — *"Adaptive Plating"* (T2)

- **Stats (FINAL):** HP 1,200 | ATK 52 | DEF 55 | MR 55 | Range 1 | Move 1.6 | ASPD 0.55
- **Core Identity:** Adaptive-resistance tank that reshapes its defenses against whatever is hitting it.
- **Passive — Adaptation (refresh):** After taking damage, armor/MR adapts toward that damage type (caps +50 to that stat, decays otherwise). **CD 3s.**
- **Ability — Shell Slam:** Deals 90% ATK and applies *Unstable* (target takes +20% damage for 3s) — a focus-fire enabler. **CD 7s.** Trigger: `A` = marked focus target in range; `D` = REACTIVE.
- **L3 Paragon Evolution — Volatile Fracture:** Unstable damage amplification increases to +35%; if an Unstable target dies within 3.0s, it detonates dealing 150 Magic Damage to surrounding enemies.
- **Unique Twist:** Anti-hybrid tank that wants mixed enemy damage (and fails vs true damage).
- **Key Synergies:** Gunmage Petra (mixed magic), Gunslinger Wren, Sniper Castella, Sapper Drox.
- **Counterplay:** True damage (bypasses adaptation); execute thresholds; mixed damage confuses the adaptation.

---

## 10. Paladin Luxor — *"Divine Bulwark"* (T3)

- **Stats (FINAL):** HP 1,550 | ATK 58 | DEF 58 | MR 48 | Range 1 | Move 1.6 | ASPD 0.55
- **Core Identity:** Shield-support tank that keeps the whole team alive through barriers.
- **Passive — Radiance (refresh):** Every 5s, grants the 2 lowest-HP allies a shield (10% max HP). **CD 5s.**
- **Ability — Sanctum:** AoE: allies gain shields equal to 25% max HP + 15% damage reduction for 4s; self-heals 15% max HP. **CD 8s.** Trigger: `D`/`R` = any ally <60% HP (HIGH); `A` = ally <35%.
- **L3 Paragon Evolution — Aegis of the Sun:** Allies in Sanctum gain shields equal to 40% Max HP, +25% DR, and gain complete immunity to Stun and Silence for the 4.0s duration.
- **Unique Twist:** Pseudo-support tank — the shield engine.
- **Key Synergies:** Aegis Bastion (double shields), Bannerlord Cassius, Phoenixblade Sera, Colossus Obr.
- **Counterplay:** Sunder Aegis shreds shields (the 1-gold answer); true damage bypasses barriers; force him out of position.

---

> **Class Summary (FINAL):** Tanker identity is preserved — the highest HP pools in the game, high armor/MR, and CC/debuff focus. Their damage (ATK 45–80) is always below dedicated damage dealers, and they rely on allies for killing power. All 10 run **persistent defensive skill loops** — no tank ever loses skill availability after first range acquisition (bug fixed per `09` §4). ✅
