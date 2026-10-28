---
tags: [UnitRoster, Assassin, Jungle, Scouting, Burst]
type: Data - Authoritative
---

# 🗡️ FINAL — ASSASSINS (8th Class · 10 Units)

> [!IMPORTANT]
> **COST MODEL v2 (supersedes the gold figures in the headers below):** every unit in the game — including all 10 Assassins — costs the **same flat base price (60g)** with the global 2:30 escalation (+25%/tick, cap +150% → 150g) and Resign refund (70%, 30s slot lock). The `750g / 950g / 1150g / 1350g / 1600g` figures in the headers are the pre-v2 tier prices and are **obsolete** — see `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md`. Assassin value now comes from kit (burst + scouting + Slayer's Mark), never from price.

> **This is the real Assassin list.** The **8th class** of the Gilded roster — **80 units total** (8 classes × 10). Built for **jungle play**: strong scouting + high burst damage. Every Assassin follows the kit rule — **exactly 1 primary damage skill + the universal secondary (Slayer's Mark) + ≥1 unique passive/active** — with **no second damage skill, no heal, and no support aura**.
>
> **Jungle bonus:** a solo Assassin clears a monster in **≈15s** (vs 60s for a tank/support) — the jungle's fastest farmer. Verified against the monster kill-time standard in `Data/Monster/00 - Jungle Monsters & Material Drops.md` §2.

---

## ⚙️ CLASS CONTRACT

- **Role:** fast, fragile, high-burst single-target killers + the army's scouting specialists.
- **Stat profile:** HP ×0.8 · ATK ×1.25 · DEF/MR ×0.9 · Range 1 · **Move 2.6–2.7 (fastest class)** · ASPD 1.0–1.2.
- **Kit rule (enforced):** exactly 1 primary damage skill + **Slayer's Mark** + ≥1 unique passive/active. No healing, no auras, no second damage skill — burst and mobility only.
- **Jungle bonus:** solo ≈15s/monster (T2+; the T1 Stalker lands ~19–20s with Stalker's Trail — documented early-game trade-off).
- **Scouting bonus:** an Assassin selected for a Scout mission (see `TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md` §CARD POOL: INTELLIGENCE & SCOUTING) has death risk **5% → 2%** per enemy unit in radius and returns intel **1 sharpness tier tighter** than a normal scout. Scouting is the class's core utility beside burst.
- **Counterplay (universal):** the lowest HP pool in the game — any focus fire, CC chain, AoE zone, or ward+burst kills them. None is unconditionally dominant.

### 🎯 Slayer's Mark — the universal secondary skill (shared with ALL classes)

> **Slayer's Mark** *(universal secondary — any class)*: passive. The carrier **marks** its current monster target for 6s (marked monsters take +25% damage from all sources) and deals **+40% damage to marked monsters**. Any class may slot Slayer's Mark when fielded for jungle work (replacing that unit's utility secondary); **Assassins always carry it** as their kit secondary. It is the roster-wide monster-hunting tool that makes the kill-time standard (60s tank/support · 8s squad · 15s assassin) hold.

---

## 🗡️ The 10 Assassins

## 1. Jungle Stalker — *"Pounce"* (T1 · 750g)
- **Stats (FINAL):** HP 560 | ATK 50 | DEF 14 | MR 14 | Range 1 | Move 2.7 | ASPD 1.0
- **Core Identity:** the first scout/farmer you can field — cheap, jungle-native, and fast enough to keep early intel flowing.
- **Primary — Pounce:** **CD 6s.** Leaps 2 hexes to the lowest-HP target and strikes for **130% ATK**, slowing it 20% for 2s. Trigger `A` = engage / jungle clear.
- **L3 Paragon Evolution — Apex Pounce:** Pounce leap range increases from 2 to 4 hexes. If Pounce targets an enemy below 40% HP, its cooldown is refunded by 50% and Jungle Stalker gains +30% bonus movement speed for 3s.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Stalker's Trail:** +10% move speed in jungle hexes and +10% damage vs monsters (stacks with Slayer's Mark → T1 solo ≈ **19–20s/monster**).
- **Unique Twist:** the cheapest unit that can scout *and* farm — the Opening-phase tempo pick.
- **Key Synergies:** Stoneheart Gol, Stormdancer Kael, Sniper Castella, Pixie Trickster Fae.
- **Counterplay:** 560 HP dies to one rotation; vision + burst ends it; any CC stops the Pounce.

## 2. Cutter — *"Rend"* (T2 · 950g)
- **Stats (FINAL):** HP 680 | ATK 72 | DEF 16 | MR 16 | Range 1 | Move 2.7 | ASPD 1.0
- **Core Identity:** the armor-shred assassin — makes your whole front line's physical damage hit harder.
- **Primary — Rend:** **CD 7s.** 120% ATK + shreds **8 armor for 4s (max 24)**.
- **L3 Paragon Evolution — Arterial Cleave:** Rend shreds an additional 12 Armor immediately (max shred increased to 40) and causes the target to bleed for 25% ATK physical damage every second for 4s whenever they move or are displaced.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Deep Cuts:** attacks refresh the shred; shred value **doubles** against marked monsters.
- **Unique Twist:** a solo assassin that amplifies the *squad's* damage instead of just its own.
- **Key Synergies:** Vanguard Marrow, Ironclaw Grendal, Sunder Aegis, Rammaster Kodo.
- **Counterplay:** mages ignore shred (AP); out-range it; it's still an 680-HP body — burst it.

## 3. Viper — *"Venom Lash"* (T2 · 950g)
- **Stats (FINAL):** HP 680 | ATK 72 | DEF 16 | MR 16 | Range 1 | Move 2.6 | ASPD 1.1
- **Core Identity:** the poison assassin — burst on the hit, then bleed them out.
- **Primary — Venom Lash:** **CD 7s.** 110% ATK + a poison DoT (**25 DPS, 4s, stacks 3**).
- **L3 Paragon Evolution — Toxic Paralyzer:** Venom Lash instantly applies maximum (3) poison stacks; targets suffering maximum stacks have their Attack Speed slowed by 35% and healing received reduced by 50% (Grievous Wounds).
- **Secondary — Slayer's Mark (universal).**
- **Passive — Adder's Swiftness:** +15% ASPD while attacking a marked monster.
- **Unique Twist:** sustained-burst hybrid — the DoT punishes tanks and monsters that won't die to one hit.
- **Key Synergies:** Venomancer Slyth, Frostcaller Lyra, Oracle Vessa, Goldsmith Aurelia.
- **Counterplay:** cleanse/heal removes the DoT; high-MR tanks shrug it off; kill it before stacks land.

## 4. Nightblade — *"Shadow Blink"* (T3 · 1150g)
- **Stats (FINAL):** HP 800 | ATK 90 | DEF 18 | MR 18 | Range 1 | Move 2.6 | ASPD 1.1
- **Core Identity:** the backline diver — the reason mages and supports fear the jungle line.
- **Primary — Shadow Blink:** **CD 8s.** Emits a **0.6s shadow-glint telegraph** on target hex, then blinks behind the **lowest-HP enemy within 4 hexes**, striking for **130% ATK + 20% of the target's missing HP** (reduced from 30% to prevent unreactable oneshots).
- **L3 Paragon Evolution — Phantom Flurry:** If Shadow Blink scores a takedown within 2s of landing, Nightblade instantly blurs into smoke (untargetable for 1.25s) and the cooldown of Shadow Blink is completely reset (usable once per 4s).
- **Secondary — Slayer's Mark (universal).**
- **Passive — Executioner:** +20% damage vs targets **below 35% HP**.
- **Unique Twist:** Telegraphed precision dive — deadly to already wounded backlines, but gives frontline Tankers in `D` stance the 0.6s telegraph window to peel or taunt.
- **Key Synergies:** Stormdancer Kael, Gunslinger Wren, Eclipsed Iri, Twinblade Vex, Phantom Dart Nyx.
- **Counterplay:** Defensive Tanker positioning intercepts during the 0.6s shadow windup; armor items negate the physical burst; grouped allies focus him down before he can retreat.

## 5. Ghost Dagger — *"Spectral Slash"* (T3 · 1150g)
- **Stats (FINAL):** HP 800 | ATK 90 | DEF 18 | MR 18 | Range 1 | Move 2.6 | ASPD 1.1
- **Core Identity:** the true-damage assassin — nothing mitigates its burst.
- **Primary — Spectral Slash:** **CD 8s.** Deals **true damage** equal to **90% ATK + 8% of the target's max HP** (vs monsters: **15% max HP** — the jungle's fastest big-game hunter).
- **L3 Paragon Evolution — Soul Siphon Edge:** Spectral Slash's true damage converts 40% of damage dealt into a personal Soul Barrier shield lasting 4s; while this shield holds, Ghost Dagger ignores unit collision and cannot be slowed.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Phased:** the first basic attack against the carrier in each fight **misses**.
- **Unique Twist:** %max-HP true damage makes elite monsters and tanks die as fast as minions.
- **Key Synergies:** Gravewalker Corvin, Astralweaver Orin, Tidecaller Nami, Hawkeye Vale.
- **Counterplay:** short-ranged and squishy; mage CC or Marksman range; the miss is once per fight.

## 6. Scoutmaster Silas — *"Shadow Cipher"* (T3 · 1150g)
- **Stats (FINAL):** HP 800 | ATK 90 | DEF 18 | MR 18 | Range 1 | Move 2.7 | ASPD 1.0
- **Core Identity:** the intel specialist — the one scout you send when failure isn't an option.
- **Primary — Spotter's Blade:** **CD 8s.** 120% ATK and **reveals the target for 4s** (permanent vision on it; traps in a 2-hex radius are revealed). Vision that deals damage — scouting and burst in one cast.
- **L3 Paragon Evolution — Master Cipher Breach:** Spotter's Blade marks the target with a permanent Exposed flaw until death; all allied platoons within 6 hexes gain +20% Critical Strike Chance against the Exposed target, and Silas gains True Sight (revealing all stealthed units and traps within 5 hexes) for 6s.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Shadow Cipher (scout protocol, see `TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md` §CARD POOL: INTELLIGENCE & SCOUTING):** Silas's scout missions are **100% survival — zero death risk** (his class's 2%-per-unit risk becomes 0). On a successful scout he returns **one extra accurate piece of intel** about an enemy facility — the *exact* name, tier, and remaining HP of one facility, on top of the normal fuzzy scouting results. **Trade-off (enforced):** while Silas is the scout that turn, he is **not fielded as a farming unit** — the board slot he occupies contributes zero jungle-farm value, and the 10s scout window pulls him off the board entirely. Intel is his farm.
- **Unique Twist:** the only unit in the game that makes scouting a *guaranteed* resource — every Scout turn is safe and strictly better than baseline.
- **Key Synergies:** feeds Farsight Crystal / Traitor's Whispers timing; pairs with any comp that converts intel into a counter-build (Aegis Bastion, Titan Mortar Gus); Seraph Angelus keeps him alive when combat finds him.
- **Counterplay:** he is still an 800-HP assassin body — kill him in combat and the intel economy dies; fielding him is a self-imposed tempo hit, so pressure the farm line while he's away.

## 7. Umbral Knife — *"Lacerate"* (T3 · 1150g)
- **Stats (FINAL):** HP 800 | ATK 90 | DEF 18 | MR 18 | Range 1 | Move 2.7 | ASPD 1.1
- **Core Identity:** the multi-strike crit assassin — burst that rolls high or rolls over.
- **Primary — Lacerate:** **CD 7s.** Strikes **3 times for 60% ATK each** (180% total). Each strike may crit independently.
- **L3 Paragon Evolution — Thousand Cuts:** Lacerate delivers 5 rapid strikes instead of 3 (each dealing 50% ATK, total 250% ATK); if at least 2 strikes critically hit, the target is Silenced for 1.5s.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Precision Edge:** basic attacks have a **25% crit chance for 200% damage**; +25% crit chance vs marked monsters.
- **Unique Twist:** highest single-window burst ceiling in the class at T3 — one Lacerate rotation with 2 crits deletes a marked backliner.
- **Key Synergies:** Battlechanter Rory (War Chant's ATK/ASPD compounds), Stormdancer Kael (ASPD tempo), Goldsmith Aurelia (Mint funds his gilded daggers), Oracle Vessa (Foresight shield covers the wind-up).
- **Counterplay:** variance cuts both ways — a 3-miss rotation happens; any dodge/block nullifies the multi-hit; kill him before the CD comes up (7s window).

## 8. Penumbra — *"Duskfall"* (T4 · 1350g)
- **Stats (FINAL):** HP 1000 | ATK 108 | DEF 22 | MR 22 | Range 1 | Move 2.6 | ASPD 1.1
- **Core Identity:** the ambush assassin — first contact is always from a direction you didn't see.
- **Primary — Duskfall:** **CD 9s.** 150% ATK. If Penumbra is **stealthed** when it lands (the first strike of a fight), damage is **+50%**.
- **L3 Paragon Evolution — Eternal Eclipse:** Scoring a kill or assist with Duskfall immediately re-activates Shroud (stealth/untargetable by basic attacks) for 2.5s, allowing Penumbra to re-engage with the +50% Duskfall stealth bonus.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Shroud:** while **in jungle hexes or before first combat contact**, Penumbra is **untargetable by enemy basic attacks** — the first attack of a fight always comes from stealth.
- **Unique Twist:** the jungle flanker — opens every fight with a free burst from stealth, then plays like a normal assassin.
- **Key Synergies:** Trapsmith Vern (snare + stealthed Duskfall = delete), Lumberjack Bodhi (barricades give Shroud uptime), Gravewalker Corvin (stealth + revive timing), Frostcaller Lyra (freeze sets up the +50% strike).
- **Counterplay:** wards and traps strip Shroud (see Scout intel); AoE zones don't care about stealth; after the first strike he's a normal 1000-HP body.

## 9. Doomblade Shade — *"Death Sentence"* (T4 · 1350g)
- **Stats (FINAL):** HP 1000 | ATK 108 | DEF 22 | MR 22 | Range 1 | Move 2.6 | ASPD 1.0
- **Core Identity:** the execute assassin — he doesn't out-damage you, he out-deads you.
- **Primary — Death Sentence:** **CD 9s.** Marks the target; **after 2s the mark detonates** for 160% ATK, **executing targets below 15% HP**.
- **L3 Paragon Evolution — Reaper's Inevitability:** Death Sentence execution threshold increases from 15% to 25% max HP; if the mark triggers an execution, the detonation unleashes an agonizing wail dealing 100% ATK magic damage and fearing adjacent enemies for 1s.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Grim Tally:** each kill grants **+4% ATK permanently** (stacks to +20%).
- **Unique Twist:** the snowball assassin — every confirmed kill makes the next Death Sentence deadlier; great in fights with adds and monsters to farm into.
- **Key Synergies:** Viper (DoT primes the 15% execute), Penumbra (stealth burst drops them under threshold), Battlechanter Rory (buff scales Grim Tally), Sniper Castella (long-range chip primes the mark).
- **Counterplay:** cleanse/shield during the 2s wind-up denies the execute; burst him before Grim Tally stacks — he's 1000 HP; his snowball resets on death.

## 10. Apex Predator — *"Alpha Strike"* (T5 · 1600g)
- **Stats (FINAL):** HP 1200 | ATK 126 | DEF 26 | MR 26 | Range 1 | Move 2.6 | ASPD 1.2
- **Core Identity:** the jungle's apex killer — the solo elite-hunter that makes the 15s standard look slow.
- **Primary — Alpha Strike:** **CD 10s.** 170% ATK + **10% of the target's max HP** as bonus physical damage.
- **L3 Paragon Evolution — Primal Savagery:** Alpha Strike executes a dual-rend that strikes both the primary target and an adjacent enemy; against units above 75% HP or elite monsters, Alpha Strike deals double bonus max HP damage (20% max HP) and heals Apex Predator for 100% of the damage dealt.
- **Secondary — Slayer's Mark (universal).**
- **Passive — Terror of the Wilds:** +30% damage and +15% lifesteal vs monsters with **over 1,000 max HP** — which is **every jungle monster** (Common 1,300 HP, Rare 2,200 HP, Elite 3,800 HP; `Data/Monster/00 - Jungle Monsters & Material Drops.md` §2), so the bonus covers Common, Rare, and Elite lairs alike.
- **Unique Twist:** the only unit that farms the jungle's *hardest* content solo — Elite lairs fall to him alone at near-squad speed, and he self-sustains while doing it.
- **Key Synergies:** every comp that wants Epic materials fast (Master Enchanter Odette + Epic-quality items); Scoutmaster Silas routes intel to the lair; Seraph Angelus tops him between Alpha Strikes.
- **Counterplay:** vs units (not monsters) he's a plain strong assassin — 1200 HP is burstable by focus fire; he has no escape; Elite-lair roams leave your lane open while he farms.
