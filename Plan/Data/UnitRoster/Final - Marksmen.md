---
tags: [Final, Marksman, Unit, RangedDPS, Kiting]
type: Final Unit List
---

# 🎯 FINAL: MARKSMEN (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All skills are **off cooldown at combat start**, cooldowns are seconds-based, and activation follows the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`. **Marksman damage is auto-attack-based; skills are supplements (steroids 5–7s, executes 9–11s). No manual kiting — positioning is the commander's job (`08` §1.4).**
>
> **Marksman command behavior (defaults):** `A` steroids/execute HIGH; `D` hold-range + defensive skills REACTIVE; `R` disengage tools HIGH, offense OFF; `J`/`G` skill use OFF. Deviations noted per unit.

---

## 1. Hawkeye Vale — *"Marked Prey"* (T2)

- **Stats (FINAL):** HP 650 | ATK 78 | DEF 18 | MR 15 | Range 5 | Move 1.9 | ASPD 0.85
- **Core Identity:** Single-target focus damage that melts whatever he decides to hunt.
- **Passive — Hunter's Focus (refresh):** +10% damage against the unit he last attacked (stacks per hit, per-target ramp). **CD 5s.**
- **Ability — Marked Prey:** Marks the highest-HP enemy: Vale deals +30% damage to them; killing the marked target refunds 3s CD. **CD 9s.** Trigger: `A` = mark not on target; `D` = REACTIVE.
- **L3 Paragon Evolution — Apex Hunter:** Vale and all allied Marksmen deal +45% damage to the marked target; when the mark dies, Vale gains +80% ASPD and +20% move speed for 4.0s.
- **Unique Twist:** Anti-tank marksman — a dedicated tank-melter.
- **Key Synergies:** Ironclaw Grendal (same target focus), Hexkeeper Mira (curse stack), Gunslinger Wren (follow-up), Warden of Oath Galen (drain).
- **Counterplay:** Dive him; rotate tanks to break his focus ramp; CC.

---

## 2. Gunslinger Wren — *"Fan the Hammer"* (T3)

- **Stats (FINAL):** HP 700 | ATK 85 | DEF 16 | MR 12 | Range 5 | Move 1.9 | ASPD 1.0
- **Core Identity:** Multi-target spray damage — volume over precision.
- **Passive — Quickdraw (refresh):** After casting, the next 3 basic attacks fire at 150% speed. **CD 5s.**
- **Ability — Fan the Hammer:** Fires 5 shots at up to 3 enemies in range (55% ATK each). **CD 7s.** Trigger: `A` = 2+ enemies in range; else REACTIVE.
- **L3 Paragon Evolution — Gatling Barrage:** Fires 8 shots (up from 5) dealing 70% ATK each; every bullet shreds 4% Armor (stacking up to 24%).
- **Unique Twist:** Spread DPS — strong vs clumps, weak single-target.
- **Key Synergies:** Hexkeeper Mira (curse amplifies the spray), Graviton Olum (cluster), Stormdancer Kael (dash-in), Tidecaller Nami.
- **Counterplay:** A single tank absorbs the spray; CC; dive.

---

## 3. Sniper Castella — *"Deadeye"* (T4)

- **Stats (FINAL):** HP 750 | ATK 105 | DEF 15 | MR 18 | Range 7 | Move 1.8 | ASPD 0.7
- **Core Identity:** Extreme-range execute sniper — the safest damage dealer in the game, if protected.
- **Passive — Long Shot (refresh):** +1 range while no enemy is within 3 hexes. **CD 4s.**
- **Ability — Deadeye:** Channels 1s, then fires at the farthest enemy: 250% ATK damage; executes enemies below 20% HP. **CD 10s.** Trigger: `A` = farthest enemy in range AND no melee within 2 hexes (channel safety); `D` = REACTIVE.
- **L3 Paragon Evolution — Ballistic Piercer:** Deadeye range becomes map-wide; execute threshold expands to 30% HP; executing an enemy instantly resets Deadeye's cooldown.
- **Unique Twist:** Unmatched range + execute; completely vulnerable up close.
- **Key Synergies:** Bulwark Aldric (bodyguard), Ballista Grun (shield wall), Aegis Bastion (taunt), Chainbreaker Rhuk (removes threats).
- **Counterplay:** Dive/teleport onto her (no channel into melee — she can't fight up close); flank; CC interrupts the channel.

---

## 4. Twinblade Vex — *"Ricochet"* (T1)

- **Stats (FINAL):** HP 580 | ATK 65 | DEF 14 | MR 10 | Range 4 | Move 2.0 | ASPD 1.0
- **Core Identity:** Bounce-damage skirmisher that punishes clumped backlines.
- **Passive — Bounce (refresh):** Basic attacks ricochet to 2 additional enemies at 40% damage. **CD 5s.**
- **Ability — Blade Waltz:** Dashes to the farthest enemy, striking for 120% ATK, then bounces back to her original spot. **CD 6s** (shortest marksman CD — cheap mobile threat). Trigger: `A` = backline target in range.
- **L3 Paragon Evolution — Shadow Pirouette:** Blade Waltz leaves behind a blade vortex at the target hex dealing 140% ATK to all surrounding enemies; refunds 100% cooldown if she scores a kill.
- **Unique Twist:** Cheap anti-cluster mobile marksman.
- **Key Synergies:** Stormdancer Kael (backline dive duo), Phoenixblade Sera, Pyromancer Cinder (spread burn), Pixie Trickster Fae.
- **Counterplay:** AoE CC interrupts the dash mid-flight; frontline blocks the path; she dies to any engage (580 HP).

---

## 5. Phantom Dart Nyx — *"Phase Shift"* (T3)

- **Stats (FINAL):** HP 660 | ATK 88 | DEF 14 | MR 14 | Range 5 | Move 2.1 | ASPD 0.9
- **Core Identity:** Untargetable-phase kiter who erases herself mid-fight.
- **Passive — Ghost Step (refresh):** Every 6s, phases briefly (untargetable) for 0.5s. **CD 6s.**
- **Ability — Phase Barrage:** Becomes untargetable for 1.5s while firing 6 shots (50% ATK) at random enemies. **CD 9s.** Trigger: `A` = self being focused OR full CD ready; `D` = REACTIVE self-peel.
- **L3 Paragon Evolution — Void Shroud Barrage:** Fires 9 shots (up from 6) dealing 70% ATK each; remains untargetable for an extra 1.0s after barrage finishes to safely reposition.
- **Unique Twist:** Self-peel built into the kit — impossible to burst while casting.
- **Key Synergies:** Oracle Vessa (extra immunity), Stormdancer Kael, Eclipsed Iri, Timewarp Elowen.
- **Counterplay:** AoE/true damage hits through phase; CC between phases; chase after phase ends.

---

## 6. Gunmage Petra — *"Hex Rounds"* (T2)

- **Stats (FINAL):** HP 620 | ATK 70 (magic) | DEF 15 | MR 25 | Range 5 | Move 1.9 | ASPD 0.8
- **Core Identity:** Hybrid marksman dealing magic basic attacks that shred MR.
- **Passive — Hex Rounds (refresh):** Basic attacks deal magic damage and shred 3 MR per hit (max 15 MR). **CD 4s.**
- **Ability — Void Shot:** Fires a bolt dealing 140% ATK magic damage; against targets at 0 MR, deals true damage. **CD 8s.** Trigger: `A` = MR-shredded target in range; else REACTIVE.
- **L3 Paragon Evolution — Null-Resonance Cannon:** Void Shot pierces through the primary target in a 4-hex line; applies 100% MR shred for 4.0s to all enemies struck.
- **Unique Twist:** Anti-MR-stack counterplay for magic comps.
- **Key Synergies:** Stormcaller Zeph (bounce), Hexkeeper Mira, Voidmaw Drenn, Voidshell Krask (mixed damage).
- **Counterplay:** Armor-stack instead of MR; dive; her magic basics are countered by MR-regen supports.

---

## 7. Longshot Bren — *"Piercing Bolt"* (T1)

- **Stats (FINAL):** HP 570 | ATK 68 | DEF 16 | MR 12 | Range 6 | Move 1.9 | ASPD 0.8
- **Core Identity:** Line-pierce marksman that punishes clumped tanks.
- **Passive — Piercing (refresh):** Basic attacks pierce through enemies, dealing 80% to each subsequent target. **CD 4s.**
- **Ability — Fulminate Bolt:** Fires a piercing bolt dealing 150% ATK to all enemies in a line. **CD 7s.** Trigger: `A` = 2+ enemies in line; `D` = REACTIVE.
- **L3 Paragon Evolution — Voltaic Railgun:** Deals 220% ATK in a line and inflicts a 1.2s Stun to all targets struck; deals double damage to enemy structures.
- **Unique Twist:** Line control — frozen or rooted lines take full-value pierce.
- **Key Synergies:** Frostward Ymir (frozen line = full pierce), Stoneheart Gol, Bonecage Maldr (chained), Sniper Castella.
- **Counterplay:** Spread (kills the line); flank; dive (570 HP).

---

## 8. Stormrider Jinx — *"Rapidfire Rocket"* (T4)

- **Stats (FINAL):** HP 780 | ATK 100 | DEF 15 | MR 15 | Range 5 | Move 1.9 | ASPD 1.1
- **Core Identity:** Rocket-frenzy snowball marksman.
- **Passive — Frenzy (refresh):** On kill, +40% ASPD for 3s (refreshes on kills). **CD 4s.**
- **Ability — Rocket Barrage:** Fires 3 rockets at random enemies (90% ATK each, small AoE). **CD 9s.** Trigger: `A` = 2+ enemies cluster; `J` = camp.
- **L3 Paragon Evolution — Super-Mega Rocket:** Fires a 4th colossal rocket at the densest enemy cluster dealing 240% ATK in a 2-hex AoE and applying Burn (40 True Dmg/s for 3.0s).
- **Unique Twist:** The harder you win, the faster she shoots.
- **Key Synergies:** Battlechanter Rory (AS), Mender Tulia, Gunslinger Wren, Hexkeeper Mira.
- **Counterplay:** Focus her before the frenzy ramps; CC; spread (reduces rocket value).

---

## 9. Eclipsed Iri — *"Moonlight Shot"* (T5)

- **Stats (FINAL):** HP 820 | ATK 120 | DEF 16 | MR 18 | Range 6 | Move 2.0 | ASPD 0.9
- **Core Identity:** Positional assassin-marksman — the backline's nightmare.
- **Passive — Shadow's Edge (refresh):** +30% damage when attacking enemies not currently targeting her. **CD 5s.**
- **Ability — Moonlight Veil:** Stealths for 3s; the next attack from stealth deals 220% ATK and applies a 30% slow. **CD 10s.** Trigger: `A` = carry in range AND self not revealed; `D` = REACTIVE.
- **L3 Paragon Evolution — Lunar Eclipse:** Moonlight Veil damage increases to 320% ATK and always critically strikes; scoring a kill from stealth immediately re-cloaks her without breaking.
- **Unique Twist:** Highest-risk/highest-reward marksman — kills carries, dies if revealed.
- **Key Synergies:** Chainbreaker Rhuk (pull removes the frontline), Stormdancer Kael, Phantom Dart Nyx, Graviton Olum.
- **Counterplay:** AoE reveal; tanks turn to face her (aggro); CC at stealth break; she dies to any engage (820 HP).

---

## 10. Ballista Grun — *"Siege Stance"* (T3)

- **Stats (FINAL):** HP 680 | ATK 92 | DEF 16 | MR 15 | Range 5 (→9) | Move 1.5 | ASPD 0.6
- **Core Identity:** Rooted siege turret with extreme commitment — immense range, no mobility.
- **Passive — Reinforced (refresh):** +20 armor while in Siege Stance. **CD 4s.**
- **Ability — Siege Stance:** Roots self for 5s: +4 range, attacks pierce, +25% damage; auto-exits if engaged. **CD 10s** (stance duration → CD). Trigger: `A`/`D` = no enemy within 3 hexes AND frontline engaged.
- **L3 Paragon Evolution — Over-Penetration Artillery:** Siege Stance grants +6 range (Range 5–11); attacks pierce through all targets without damage falloff and deal +60% damage against walls and defensive structures.
- **Unique Twist:** Longest sustained range in the game; completely immobile.
- **Key Synergies:** Bulwark Aldric (intercept), Aegis Bastion (taunt), Bannerlord Cassius (revive), Mender Tulia.
- **Counterplay:** Flank; dive while rooted; Rhuk hook pulls him out of stance; CC while rooted (immobility = vulnerability).

---

> **Class Summary (FINAL):** Marksman identity is preserved — every marksman is squishy (570–900 HP), ranged, and positioning-dependent. None have meaningful armor, crowd control (beyond kiting tools), or self-sustain. Every escape tool (dash, phase, stealth) is on a 6–10s CD and interruptible. All are dive-vulnerable and die to a single engaging Fighter. ✅
