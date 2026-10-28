---
tags: [Final, Support, Unit, Healer, Buffer]
type: Final Unit List
---

# ✨ FINAL: SUPPORTS (10 Units) — Authoritative Character File

> **This is the real character list.** Merged from the class roster (identity/design) and the tuning pass (balance numbers) — **the tuning numbers win on any conflict**. All skills are **off cooldown at combat start**, cooldowns are seconds-based, and activation follows the 5-command priority hierarchy (A/R/J/D/G) defined in `09 - Tuning Framework.md`. **Heal CDs are short (4–6s) for sustain uptime; big buff/revive skills are gated (8–12s).**
>
> **Support command behavior (defaults):** `R` heals HIGH (ally <70% HP sensitivity); `D` heals HIGH (ally <80%); `A` heals REACTIVE (ally <40%); `J` heals REACTIVE (critical <30%); `G` skill use OFF. Deviations noted per unit.

---

## 1. Seraph Angelus — *"Healing Light"* (T2)

- **Stats (FINAL):** HP 700 | ATK 45 | DEF 15 | MR 30 | Range 3 | Move 1.9 | ASPD 0.6
- **Core Identity:** Chain healer — the sustain engine of any comp.
- **Passive — Serene Aura (refresh):** Allies within 2 hexes regenerate 1% max HP/sec. **CD 4s.**
- **Ability — Healing Light:** Heals the 3 lowest-HP allies for 18% max HP (prioritizes carries); overheal becomes shield. **CD 5s.** Trigger: `R`/`D` = ally <70%; `A` = ally <40%.
- **L3 Paragon Evolution — Radiant Benediction:** Healing Light radiates to all 5 squad members simultaneously; allies receiving an overheal shield also gain a Cleanse of all movement-impairing effects and +15% Damage Reduction for 3s.
- **Unique Twist:** Continuous + burst sustain in one.
- **Key Synergies:** Warcry Beserka, Phoenixblade Sera, Ballista Grun, Gravewalker Corvin.
- **Counterplay:** Anti-heal; dive the healer (carry focus auto-targets her); burst the heal target through the shield.

---

## 2. Oracle Vessa — *"Foresight"* (T4)

- **Stats (FINAL):** HP 750 | ATK 50 | DEF 18 | MR 40 | Range 3 | Move 1.9 | ASPD 0.6
- **Core Identity:** Anti-CC oracle who turns incoming crowd control into shields.
- **Passive — Prescience (refresh):** When an ally within 3 hexes would be CC'd, grants them a 1.2s spell shield instead (once per 8s per ally). **CD 8s.**
- **Ability — Foresight:** Grants a target ally a shield (15% max HP) + CC immunity for 3s; Vessa gains +30% CD refund. **CD 9s.** Trigger: `R`/`D` = ally channeling OR targeted by a CC-caster; `A` = REACTIVE (ally <35% or focused).
- **L3 Paragon Evolution — Prophetic Aegis:** Foresight's shield value doubles to 30% max HP and reflects 50% of incoming damage back to attackers as magic damage; if the target is struck by hard CC during the 3s window, the shield detonates in a 2-hex flash blinding attackers for 2s.
- **Unique Twist:** The hard counter to CC-chain compositions.
- **Key Synergies:** Phoenixblade Sera (dive protection), Sniper Castella, Stormdancer Kael, Rammaster Kodo (charge immunity).
- **Counterplay:** Physical burst — she only stops CC, not damage; dive her; multi-hit CC wears the shield off.

---

## 3. Battlechanter Rory — *"War Chant"* (T3)

- **Stats (FINAL):** HP 800 | ATK 55 | DEF 20 | MR 35 | Range 3 | Move 1.9 | ASPD 0.7
- **Core Identity:** Attack-steroid aura — the damage amplifier for physical carries.
- **Passive — Inspiring (refresh):** Allies within 3 hexes gain +15% ASPD. **CD 5s.**
- **Ability — War Chant:** AoE: allies gain +25% ATK and +20% ASPD for 5s; enemies within 1 hex of an ally are slowed 10%. **CD 10s** (big buff gated). Trigger: `A` = 2+ carries engaged; `D` = defended fight.
- **L3 Paragon Evolution — Anthem of Conquest:** War Chant duration increases to 7s and grants all affected allies 15% Omnivamp (healing for 15% of all physical and magical damage dealt); enemies within 2 hexes have their Armor reduced by 20% for the duration.
- **Unique Twist:** The buff engine physical comps are built around.
- **Key Synergies:** Phoenixblade Sera, Stormrider Jinx, Vanguard Marrow, Warcry Beserka, Longshot Bren.
- **Counterplay:** Kill him (the buff dies with him); spread units out of the aura; dive.

---

## 4. Timekeeper Nora — *"Haste"* (T1)

- **Stats (FINAL):** HP 620 | ATK 40 | DEF 12 | MR 25 | Range 3 | Move 2.0 | ASPD 0.6
- **Core Identity:** Speed enabler — makes the fastest units even faster.
- **Passive — Quick Feet (refresh):** All allies gain +8% move speed. **CD 4s.**
- **Ability — Haste:** Grants the nearest ally +40% move speed and +30% ASPD for 4s; refunds CD. **CD 6s.** Trigger: `A` = dive ally engaging; `R` = retreating ally.
- **L3 Paragon Evolution — Chrono Acceleration:** Haste now applies to the two nearest allies and grants them complete unit phasing (can walk through units and obstacles); basic attacks made by hastened allies reduce the cooldown of their primary ability by 0.5s per hit.
- **Unique Twist:** Tempo support that accelerates dive and kiting comps.
- **Key Synergies:** Stormdancer Kael, Phantom Dart Nyx, Eclipsed Iri, Twinblade Vex.
- **Counterplay:** Focus her (cheap kill — 620 HP); CC chain; her buffs are global but she dies fast.

---

## 5. Bard of Echoes Lim — *"Resonance Note"* (T5)

- **Stats (FINAL):** HP 850 | ATK 55 | DEF 16 | MR 45 | Range 3 | Move 1.9 | ASPD 0.6
- **Core Identity:** Ability-CDR aura — the late-game spell amplifier.
- **Passive — Harmony (refresh):** Allies within 3 hexes gain +10% cast speed. **CD 5s.**
- **Ability — Resonance Note:** The next friendly ability cast within 4s is echoed at 50% (if damaging) or boosted +30% (if buff/heal). **CD 11s.** Trigger: `A` = ally with damage ult in range; `R`/`D` = ally healer ready.
- **L3 Paragon Evolution — Symphonic Crescendo:** Resonance Note affects the next TWO friendly abilities cast within 5s; echoed damage abilities deal 75% effectiveness (up from 50%), and echoed heals/buffs trigger a symphony wave that restores 30 Mana to the entire platoon.
- **Unique Twist:** Spell amplification — turns good ults into game-enders.
- **Key Synergies:** Echo Sage Vermos (echo the echo), Astralweaver Orin, Seraph Angelus, Timewarp Elowen.
- **Counterplay:** Silence zones (Kira) nullify him; dive; kill before the echo.

---

## 6. Penitent Lucian — *"Sacrificial Transfusion"* (T2)

- **Stats (FINAL):** HP 920 | ATK 42 | DEF 16 | MR 35 | Range 2 | Move 1.9 | ASPD 0.6
- **Core Identity:** Sacrificial lifeline healer — trades his own robust life pool to pull dying allies back from the brink, sustaining himself with accelerated regenerative flesh.
- **Passive — Martyr's Recuperation (refresh):** Lucian regenerates **4% max HP/sec** baseline. When falling below 50% HP, his recovery doubles to **8% max HP/sec** for 4s. **CD 5s.**
- **Ability — Sacrificial Transfusion:** Channels a golden blood-tether (up to 3 hexes) to the lowest-%-HP ally: instantly heals **35% of the target's missing HP**, then siphons **10% max HP/sec for 2s** into the ally. Lucian takes equal damage to the health siphoned. **Safety Clause:** self-drain immediately cancels if Lucian reaches **15% max HP**. Target gains +20% damage reduction while tethered. **CD 6s.** Trigger: `R`/`D` = ally <60% HP; `A` = REACTIVE (ally <35% HP).
- **L3 Paragon Evolution — Martyr's Transcendence:** Transfusion self-siphon cannot reduce Lucian below 30% max HP; when the 2s channel completes without interruption, both Lucian and the tethered ally receive an invulnerability barrier for 1.25s and burst-heal adjacent allies for 15% max HP.
- **Unique Twist:** Triage lifeline — emergency burst save followed by a tether that opponents can exploit by diving the weakened martyr.
- **Key Synergies:** Stoneheart Gol / Colossus Obr (massive HP tanks restored safely), Warcry Beserka (rescued at peak berserk), Warden of Oath Galen (shared mitigation buffers the self-drain).
- **Counterplay:** Dive Lucian right after a transfusion cast while his HP is critically depleted; anti-heal (Grievous Wounds) cuts his 4–8% recuperation in half; stun/silence breaks the 2s tether channel.

---

## 7. Warden of Oath Galen — *"Oathbind"* (T3)

- **Stats (FINAL):** HP 900 | ATK 52 | DEF 25 | MR 35 | Range 2 | Move 1.8 | ASPD 0.6
- **Core Identity:** Damage-link mitigator who ties an ally's survival to an enemy's pain.
- **Passive — Shared Fate (refresh):** Allies gain +5% damage reduction for each linked enemy. **CD 5s.**
- **Ability — Oathbind:** Links a target ally to a target enemy for 5s: the ally takes 40% less damage; the enemy takes 40% of the damage dealt to the ally. **CD 8s.** Trigger: `R`/`D` = ally <65%; `A` = REACTIVE (ally <35%).
- **L3 Paragon Evolution — Ironclad Bloodbound:** Oathbind links to two enemies simultaneously, splitting 60% of damage taken by the ally equally between both targets (30% each); linked enemies are rooted for 1.5s if they attempt to move further than 4 hexes away from the protected ally.
- **Unique Twist:** Soft taunt + mitigation in one — enemies must choose between feeding the link or ignoring a protected carry.
- **Key Synergies:** Warcry Beserka (safer berserk), Sniper Castella, Gravewalker Corvin, Voidmaw Drenn.
- **Counterplay:** Kill the link (CC Galen); break the link by killing either end; AoE damage hits the linked ally regardless.

---

## 8. Pixie Trickster Fae — *"Pixie Dust"* (T2)

- **Stats (FINAL):** HP 650 | ATK 45 | DEF 14 | MR 35 | Range 3 | Move 1.9 | ASPD 0.6
- **Core Identity:** Polymorph control — turns a carry into a harmless critter.
- **Passive — Mischief (refresh):** Every 6s, charms the nearest enemy for 1s (they walk toward Fae). **CD 6s.**
- **Ability — Pixie Dust:** Polymorphs a target enemy into a critter for 2s (cannot attack or cast, −50% move speed). **CD 8s.** Trigger: `D` = enemy carry engaging; `R` = peel; `A` = REACTIVE (carry within range).
- **L3 Paragon Evolution — Pandemonium Dust:** Pixie Dust bounces to an additional adjacent enemy upon impact (polymorphing two targets for 2s); polymorphed targets shed 25% Armor and MR, and any damage they take while transformed splashes 30% damage to surrounding enemy units.
- **Unique Twist:** Hard-disable on a support — the anti-carry tool.
- **Key Synergies:** Ironclaw Grendal (execute while disabled), Chainbreaker Rhuk (pull → poly), Stormdancer Kael, Phoenixblade Sera.
- **Counterplay:** CC immunity (Vessa) blocks the poly; kill her; spread so the charm hits a tank.

---

## 9. Bannerlord Cassius — *"Standard of Gilded"* (T4)

- **Stats (FINAL):** HP 760 | ATK 48 | DEF 22 | MR 35 | Range 3 | Move 1.8 | ASPD 0.6
- **Core Identity:** Resurrection banner — tactical second wind enabler.
- **Passive — Marching Orders (refresh):** Adjacent allies gain +15 armor and +15 MR. **CD 5s.**
- **Ability — Standard of Gilded:** Plants a banner (3-hex radius, 6s): allies inside gain +20 armor/MR. The first ally to suffer fatal damage inside enters **Golden Stasis for 1.2s** (untargetable/invulnerable) and reassembles at **25% max HP + a 20% max HP decay shield (lasts 3s)** once per banner. **CD 12s** (revive gated hardest). Trigger: `D` = carries in formation; `A` = REACTIVE.
- **L3 Paragon Evolution — Eternal Sovereign Standard:** The Standard's radius expands to 4 hexes and lasts 8s; the Golden Stasis reassembly restores the resurrected ally to 45% max HP (up from 25%) and grants them 100% Mana and 2s of CC immunity upon reassembling.
- **Unique Twist:** Stasis-gated rebirth — buys clutch seconds to turn a fight, but prevents instant offensive resets without recovery time.
- **Key Synergies:** Phoenixblade Sera (carry revive window), Gravewalker Corvin (transform persists), Colossus Obr, Ballista Grun.
- **Counterplay:** CC allies out of the banner radius before they die; kill Cassius (the banner collapses with him); wait out the 1.2s stasis to time burst on the 25% HP reassembly.

---

## 10. Nyx Oracle Kira — *"Silence Field"* (T2)

- **Stats (FINAL):** HP 700 | ATK 48 | DEF 15 | MR 45 | Range 3 | Move 1.9 | ASPD 0.6
- **Core Identity:** Silence-zone control — the caster shutdown.
- **Passive — Mana Leak (refresh):** Enemies within 2 hexes gain **+20% CD penalty**. **CD 4s.**
- **Ability — Silence Field:** Zone (3 hexes) for 3s: enemies inside are silenced (cannot cast) and take 40% AP damage on entry. **CD 9s.** Trigger: `D` = channeling enemy OR ≥3 casters in zone; `A` = REACTIVE.
- **L3 Paragon Evolution — Null-Magic Voidzone:** Silence Field expands to a 4-hex zone lasting 4.5s; enemy projectiles passing through the field are instantly disintegrated, and silenced enemies trapped inside have their active cooldowns paused for the entire duration of the field.
- **Unique Twist:** Mage/burst-comp counter.
- **Key Synergies:** Stormcaller Zeph, Seraph Angelus (protect), Voidmaw Drenn, Echo Sage Vermos.
- **Counterplay:** Physical teams (silence is caster-only); position out of the zone; dive.

---

> **Class Summary (FINAL):** Support identity is preserved — the lowest ATK in the game (38–58), zero structure damage, and no frontline durability. Every support's value is entirely dependent on allied units, making them high-priority dive targets by design. Heal uptime (4–6s CDs) is the role's core, but every healer is dive-bait (carry focus auto-targets them) and anti-heal counters the sustain archetype wholesale. All 10 Supports feature signature L3 Paragon Evolutions elevating team synergy and clutch game-turning impact. ✅
