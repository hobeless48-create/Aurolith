---
tags: [Final, Fighter, Unit, MeleeDPS]
type: Final Unit List
---

# ⚔️ FINAL: FIGHTERS (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All skills are **off cooldown at combat start**, cooldowns are seconds-based, and activation follows the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`.
>
> **Fighter command behavior (defaults):** `A` engage/dash HIGH, defensive REACTIVE; `R` all offense OFF; `J`/`G` engage OFF; `D` engage OFF. Deviations noted per unit.

---

## 1. Vanguard Marrow — *"Blade Cyclone"* (T2)

- **Stats (FINAL):** HP 700 | ATK 78 | DEF 25 | MR 20 | Range 1 | Move 2.0 | ASPD 0.9
- **Core Identity:** Sustained armor-shredding spin blender who gets stronger the longer a fight lasts.
- **Passive — Sunder (refresh):** Basic attacks reduce the target's Armor by 4% (max 20%). **CD 6s** (stack refresh window).
- **Ability — Cyclone Sweep:** Spins for 3s, dealing 60% ATK/sec to all enemies in melee range; armor shred is doubled during the spin. **CD 8s.** Trigger: `A` = 2+ enemies in melee OR engaged; `D` = diving enemy in range.
- **L3 Paragon Evolution — Vortex Shred:** Cyclone Sweep pulls enemies within 1 hex into melee contact and inflicts a 40% slow for 2s after the spin concludes.
- **Unique Twist:** Long-fight scaler — his shred sets up the whole team's physical damage.
- **Key Synergies:** Ironclaw Grendal (shredded targets die faster to execute), Hawkeye Vale (both focus one tank), Battlechanter Rory (AS aura), Warden of Oath Galen (link keeps him safe while spinning).
- **Counterplay:** CC before the spin cancels the window (Gol root, Lyra freeze, Fae poly); ranged kite; true/magic damage bypasses his mid armor.

---

## 2. Ironclaw Grendal — *"Executioner"* (T3)

- **Stats (FINAL):** HP 950 | ATK 95 | DEF 30 | MR 25 | Range 1 | Move 2.0 | ASPD 0.85
- **Core Identity:** Execute-and-reset chainsaw that snowballs kills into permanent attack power.
- **Passive — Blood Debt (refresh):** All healing received is increased by 20%. **CD 5s.**
- **Ability — Sundering Execution:** Deals 160% ATK; instantly executes enemies below 25% HP. On execute, resets 15% ATK (stacks 3×). **CD 8s.** Trigger: `A` = target <25% OR engaged; `R`/`D` = REACTIVE at threshold only.
- **L3 Paragon Evolution — Unstoppable Cleave:** Execution threshold expands to 35% HP; executing an enemy grants 2.0s of Crowd-Control Immunity and instantly resets 100% of Sundering Execution's cooldown.
- **Unique Twist:** Executioner with reset-chain — snowballs hard but is entirely threshold-based.
- **Key Synergies:** Vanguard Marrow (shred → execute), Sniper Castella (double execute pressure), Battlechanter Rory (AS), Bannerlord Cassius (revive keeps the chain alive).
- **Counterplay:** Keep units above the 25% threshold; anti-heal; hard CC interrupts the execute chain; magic comps ignore his armor.

---

## 3. Stormdancer Kael — *"Tempest"* (T4)

- **Stats (FINAL):** HP 1,200 | ATK 105 | DEF 28 | MR 30 | Range 1 | Move 2.3 | ASPD 1.0
- **Core Identity:** Dash-through-and-detonate skirmisher that punishes clumped backlines.
- **Passive — Windborne (refresh):** +15% dodge chance against ranged basic attacks. **CD 5s.**
- **Ability — Tempest Mark:** Dashes through up to 4 enemies, marking them for 8s; marks auto-detonate 1.2s later (120% ATK each); kills refund 2s CD. **CD 7s.** Trigger: `A` = carry in range + ≥2 enemies in dash line.
- **L3 Paragon Evolution — Gale Detonation:** Tempest Mark detonations hit for 180% ATK; mark kills release a blinding vortex that causes nearby enemies to miss 50% of basic attacks for 3.0s.
- **Unique Twist:** High-mobility burst — dangerous if left alone, punished if caught mid-dash.
- **Key Synergies:** Twinblade Vex (backline dive duo), Gunslinger Wren (spray follows his marks), Phantom Dart Nyx (untargetable pair), Bard of Echoes Lim (energy/CDR).
- **Counterplay:** AoE CC interrupts the dash mid-flight; thick frontline blocks the dash path; taunt pulls him off the backline.

---

## 4. Warcry Beserka — *"Frenzy"* (T2)

- **Stats (FINAL):** HP 680 | ATK 82 | DEF 20 | MR 15 | Range 1 | Move 2.1 | ASPD 1.0
- **Core Identity:** Low-HP berserker that is most dangerous exactly when she should be dead.
- **Passive — Bloodrage (refresh):** Below 50% HP, +50% ASPD and +25% lifesteal. **CD 4s.**
- **Ability — War Shout:** AoE 70% ATK damage; heals for 12% missing HP; +30% damage reduction for 3s. **CD 6s.** Trigger: `A` = below 50% HP (berserk window) OR engaged; `R` = below 60% HP.
- **L3 Paragon Evolution — Bloodbound Taunt:** War Shout additionally taunts all struck enemies for 1.5s, and her basic attacks inflict 50% Anti-Heal for 4.0s.
- **Unique Twist:** High-risk/high-reward sustain brawler.
- **Key Synergies:** Mender Tulia (HoT keeps her inside the berserk window), Tidecaller Nami (regen aura), Battlechanter Rory (AS), Paladin Luxor (shields protect the window).
- **Counterplay:** Burst past the 50% threshold quickly; anti-heal; CC denies the window.

---

## 5. Sunder Aegis — *"Shieldbreaker"* (T1)

- **Stats (FINAL):** HP 520 | ATK 60 | DEF 22 | MR 18 | Range 1 | Move 2.0 | ASPD 0.9
- **Core Identity:** Anti-shield specialist — shatters barrier stacks without completely invalidating defensive compositions.
- **Passive — Shield Rend (refresh):** Attacks deal +30% damage to shielded targets and ignore 40% of active shields. **CD 5s.**
- **Ability — Aegis Crack:** Deals 130% ATK; shatters **60% of the target's active shield** and deals 50% of the shattered value as **bonus True Damage**, applying a 1.2s silence. **CD 7s.** Trigger: `A` = shielded target in range; else nearest.
- **L3 Paragon Evolution — Fracture Shockwave:** Shatters 100% of the target's active shield and radiates 50% of the shattered barrier value as True Damage to all adjacent enemies.
- **Unique Twist:** Heavy shield punisher that converts defensive barriers into offensive backfire, while allowing shield-bearers a fighting chance.
- **Key Synergies:** Warden of Oath Galen (link adds pressure), Frostward Ymir (freeze sets the crack), Voidmaw Drenn (true damage follow-up), Bulwark Aldric (bodyguard keeps him alive).
- **Counterplay:** Non-shield comps make his bonus damage irrelevant; cheap 520 HP body collapses to simple ranged focus.

---

## 6. Duelist Valen — *"Rival's Mark"* (T3)

- **Stats (FINAL):** HP 900 | ATK 92 | DEF 26 | MR 24 | Range 1 | Move 2.0 | ASPD 0.95
- **Core Identity:** Honorable 1v1 duelist who isolates and shreds a single high-value target.
- **Passive — Honor Bound (refresh):** +20% move speed while no enemy is within 2 hexes. **CD 6s.**
- **Ability — Duel:** Challenges the highest-ATK enemy for 6s: both deal +25% damage to each other; Valen gains +20% damage reduction from all other enemies during the duel. Killing the dueled target refunds 3s CD. **CD 9s.** Trigger: `A` = carry in range; `D` = REACTIVE vs diving carry.
- **L3 Paragon Evolution — Grand Challenge:** Duel duration increases to 8s; killing the challenged enemy permanently grants Valen +15 ATK for the rest of the battle and restores 30% Max HP.
- **Unique Twist:** Isolation specialist — oppressive in 1v1, fragile when focused by many.
- **Key Synergies:** Bulwark Aldric (intercept keeps the duel alive), Mender Tulia (heal through the trade), Warden of Oath Galen (link reduces duel damage taken), Pixie Trickster Fae (polymorph backup).
- **Counterplay:** Focus-fire with 2+ units; CC breaks the duel's value; tanks absorb the challenge.

---

## 7. Pugilist Oni — *"Combo Count"* (T3)

- **Stats (FINAL):** HP 850 | ATK 88 | DEF 30 | MR 22 | Range 1 | Move 2.0 | ASPD 1.1
- **Core Identity:** Combo-string boxer rewarded for relentless single-target focus.
- **Passive — Rhythm (refresh):** Every 3rd basic attack is a *Crushing Jab* (150% ATK, stuns 0.5s). **CD 4s.** AI hard-locks target (only enemy CC resets the combo).
- **Ability — Flurry:** Unleashes 5 rapid jabs (40% ATK each); each jab extends the target's stun by 0.2s. **CD 8s.** Trigger: `A` = target locked; casts on lock completion.
- **L3 Paragon Evolution — Haymaker Finisher:** Flurry unleashes 7 rapid jabs (up from 5); the 7th strike is an explosive uppercut dealing 150% ATK that knocks the target back 1 hex and stuns for 1.5s.
- **Unique Twist:** Skill-expression DPS — a single lock-on target chains into near-perma-stun.
- **Key Synergies:** Oracle Vessa (CC immunity protects the combo), Frostward Ymir (freeze overlap), Sniper Castella (focus fire), Phoenixblade Sera (melee pair).
- **Counterplay:** CC him before Flurry (breaks combo + rhythm); rotate tank targets — his lock never helps clear adds.

---

## 8. Gravewalker Corvin — *"Soul Form"* (T4)

- **Stats (FINAL):** HP 1,150 | ATK 100 | DEF 24 | MR 28 | Range 1 | Move 2.0 | ASPD 0.9
- **Core Identity:** Transform-hypercarry that banks souls from nearby deaths into a devastating alternate form.
- **Passive — Soul Harvest (refresh):** Gains +5s CD refund for every enemy unit killed within 3 hexes (any team). **CD 6s.**
- **Ability — Gravewalker Form:** Transforms for 8s: +40% ATK, attacks cleave to adjacent enemies, +20% lifesteal; each kill extends the transformation by 2s. **CD 12s** (transform resolved → CD). Trigger: `A` = 4+ souls banked; `D` = REACTIVE.
- **L3 Paragon Evolution — Dread Ascendancy:** Transformation grants +60% ATK, and 30% of cleave damage converts to True Damage; kills extend form duration by 3.0s.
- **Unique Twist:** Snowball transform that can carry a fight if fed; a paper tiger before it.
- **Key Synergies:** Bannerlord Cassius (revive keeps the form alive), Mender Tulia (sustain), Warden of Oath Galen (link), Nyx Oracle Kira (silence zone protects his ramp).
- **Counterplay:** Kill him before transform (carry focus auto-targets him); CC during it; starve him of nearby deaths.

---

## 9. Chainbreaker Rhuk — *"Iron Tether"* (T1)

- **Stats (FINAL):** HP 540 | ATK 62 | DEF 20 | MR 16 | Range 1 | Move 2.0 | ASPD 0.85
- **Core Identity:** Cheap hooking disruptor that drags backline targets into the meat grinder.
- **Passive — Heavy Pull (refresh):** Enemies that are knocked or pulled take +10% damage for 3s. **CD 5s.**
- **Ability — Chain Hook:** Pulls the farthest enemy within 4 hexes into melee range, stunning them 1s and dealing 100% ATK. **CD 7s.** Trigger: `A` = backline target in range; `D` = peel vs diving carry.
- **L3 Paragon Evolution — Dual Harpoon:** Fires twin chains simultaneously, pulling the 2 farthest enemies within 5 hexes into melee range and rooting both for 1.5s.
- **Unique Twist:** 1-gold backline removal that enables wombo combos.
- **Key Synergies:** Graviton Olum (pull → black-hole wombo), Ballista Grun (siege stance finally gets a target), Eclipsed Iri (backline burst on the dragged target), Timewarp Elowen (rewind protects the hooking frontline).
- **Counterplay:** Frontline blockers stop the hook; keep a tank as the "farthest enemy"; CC the hooker.

---

## 10. Phoenixblade Sera — *"Phoenix Rotation"* (T5)

- **Stats (FINAL):** HP 1,450 | ATK 130 | DEF 32 | MR 32 | Range 1 | Move 2.2 | ASPD 1.1
- **Core Identity:** Reset-chain melee hypercarry — the late-game win condition of a melee core comp.
- **Passive — Bladesong (refresh):** Every 4th basic attack deals 200% ATK. **CD 5s.**
- **Ability — Phoenix Spin:** 360° AoE attack (170% ATK); if it hits 2+ enemies or scores a kill, immediately recasts (max 3 casts per cycle). **CD 10s** (after final recast resolves). Trigger: `A` = 2+ enemies in melee; `D` = REACTIVE.
- **L3 Paragon Evolution — Immortal Conflagration:** Max recasts increase to 4; each spin leaves scorched ground dealing 40 True Damage/sec for 3.0s to enemies standing within 1 hex.
- **Unique Twist:** Multi-cast monster that shreds clumped teams.
- **Key Synergies:** Battlechanter Rory (AS/ATK buff), Oracle Vessa (CC immunity), Bannerlord Cassius (revive), Mender Tulia (sustain).
- **Counterplay:** Hard CC before the spin chain; keep your units spread (denies multi-cast); armor stacking; anti-heal.

---

> **Class Summary (FINAL):** Fighter identity is preserved — all are melee, frontline-committed, and depend on staying alive inside the fight. None have ranged poke, big survivability pools (that's Tanker), or structure damage (that's Siege). Every burst window is gated by a 6–10s CD, and every dash/engage is interruptible by AoE CC. ✅
