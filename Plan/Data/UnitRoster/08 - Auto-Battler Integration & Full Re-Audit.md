---
tags: [Roster, Audit, AutoBattler, AI, Commander, Balance]
type: Full Re-Audit
---

# 🎮 AUTO-BATTLER INTEGRATION & FULL RE-AUDIT

> **Context added:** this is an **auto-battler**. The player is **only a commander** — no unit is ever directly controlled. Every unit moves, targets, casts, and responds **fully autonomously** via deterministic AI. This document (a) defines the AI action framework that makes all 80 units playable without input, and (b) re-runs the complete 4-requirement balance audit under that auto-action assumption.

---

## 1. 🧠 The Auto-Action AI Framework (Global Rules)

These rules apply to **every** unit. They replace any implied "player timing / player targeting / manual kiting".

### 1.1 Target Selection Priority (default order, evaluated each tick)

1. **Interrupt Priority (highest):** any unit holding a CC or silence ability auto-retargets an enemy that is **currently channeling a dangerous ability** (e.g., Olum's Event Horizon, Gorm's Cataclysm, Castella's Deadeye). To prevent multiple friendly CC units from blowing all stuns on the same tick (wasting CC duration to diminishing returns), the engine applies a **deterministic micro-tick stagger offset (1-tick queue delay per unit ID)**: only the highest-initiative CC unit casts immediately; secondary CC units wait 1.2s before casting if the channel is still unbroken.
2. **Carry Focus:** diving units (Fighters with mobility, backline hunters) target the enemy with the **highest ATK/AP** within range, preferring ranged backline units.
3. **Structure Priority:** Siege-class units target **structures first**, then high-HP units, then anything else.
4. **Nearest Enemy:** the default fallback for all other units.
5. **Execute Priority:** units with execute thresholds (Grendal 25%, Castella 20%) re-target the **lowest-HP enemy below threshold** when one exists; otherwise they follow their default.
6. **Artisan Value-Kill Priority (7th class):** dive units (Fighters with mobility, backline hunters) target an **Artisan actively working a production site** (constructing, harvesting, repairing, or within 3 hexes of a construction site) when one exists within their dive range and no higher-priority interrupt/carry target is live. Rationale: an Artisan is a non-combat unit whose entire value is *alive* — the AI treats it as a Support-tier squishy with a permanent "collect" value, so the enemy automatically punishes unprotected artisans without any player micro.
7. **Assassin Priority (8th class):** Assassins use **dive priority** — target the enemy with the **lowest HP within dive range** (engage / jungle clear), or the **highest ATK/AP backline** (carry focus) — plus **Execute Priority** where a kit has a threshold (Nightblade <40%, Doomblade <15%). All assassin "pick" mechanics (lowest-HP, marked, below-threshold) are deterministic predicates, never player choices.

### 1.2 Casting Rules

- Cast the ability **as soon as its cooldown is ready and a valid target exists** unless the ability is a **channel** (see 1.3), a **zone**, or a **targeted buff/heal**.
- **Buff/Heal cast logic:** cast when (a) any ally is below 70% HP, or (b) a valid ally target exists with cooldown ready. Always prefer the **lowest-HP ally** (or the unit's specified priority, e.g., Cassius prefers carries).
- **Zone ability logic:** cast on the **highest-density enemy cluster** within range (for damage zones) or the **most-threatened friendly cluster** (for protection zones).
- **Echo logic (Vermos):** copies the **highest-value** friendly ability cast within the last 4s, by priority: damage ults > damage buffs > heals.

### 1.3 Channel Rules (fair counterplay by design)

- A channeling unit is **vulnerable and visible**; the enemy's Interrupt Priority rule guarantees any enemy CC unit will auto-attempt the interrupt.
- A channel **starts only when no enemy CC-caster in range has its interrupt cooldown ready** (AI threat check). This prevents "instant channel wins" and makes interruptible ults a real risk/reward decision for the AI — not a coin flip.
- **Maximum channel duration is 2.5s** (Gorm's Cataclysm is the cap). Channels are cancelled by any CC, silence, or the channeling unit's death.

### 1.4 Movement & Positioning Rules (no manual micro)

- **Formation is a pre-battle choice.** Once combat starts, units do not respond to player input.
- **Melee advance:** melee units advance to engage their current target; they **never pursue beyond 1 hex past their engagement point** (prevents tanks abandoning the frontline).
- **Ranged hold:** ranged units **attack in place** when their target is in range. If the target dies, they re-target (default priority). Ranged units do **not** manually kite.
- **Ranged disengage:** if a melee enemy becomes adjacent, a ranged unit will attempt one 1-hex reposition to a safe hex if one exists; otherwise it fights in place. This is the **only** automated kiting and it is strictly limited (no infinite kiting).
- **Siege immobility:** siege units hold position and never move while a structure is in range. Their weakness (0.7–1.3 move) is exploitable by dive units automatically.
- **Stealth rule (Iri):** auto-stealths only when a high-value enemy carry is within range; the stealth-break attack auto-targets that carry.

### 1.5 Aggro & Target Lock Rules

- **Taunts override all targeting** (Bastion). Taunted units attack the taunter.
- **Target lock (Oni):** Pugilist Oni **never voluntarily switches targets** — his combo resets only from enemy CC, not from his own re-targeting. The AI locks the first target until death.
- **Links bind targets (Galen):** linked allies/enemies keep their link until duration ends or the linked ally dies.
- **Re-target delay:** 0.25s global re-target delay after a target dies (prevents instant snap, adds readable counterplay).

### 1.6 Artisan Production AI (7th class — autonomous construction)

Artisans are never manually directed. The 5 commands are interpreted as **production directives** (command behavior in `Final - Artisans.md`):

- **`D` Defense:** station at the highest-value friendly production site (facility under construction > damaged wall > base) and work it (construct / repair / craft).
- **`G` Gather:** move to the waypoint and build the commander's assigned structure there (road / barricade / emplacement). If no assignment, default to chokepoints.
- **`J` Jungle:** harvest trees (Lumberjack) / build forward emplacements / support the farm line.
- **`A` Attack:** advance and build forward infrastructure — Roads toward the enemy wall, barricades at flank approaches — then hold.
- **`R` Retreat:** return to base; resume base production/repairs.

**Production execution rules:**
- Construction/repair/craft **requires standing still** on the site (work channel, interruptible by being attacked or CC'd — an artisan under fire stops producing, which is the counterplay).
- **Self-preservation & Smoke Bomb Reaction:** Artisans never voluntarily engage in combat. If an enemy unit enters their threat radius or attacks them while constructing/repairing, the Artisan automatically triggers **Smoke Bomb** (1.5s stealth + 3-hex evasive retreat dash toward the nearest friendly platoon centroid or structure, 30s internal cooldown). If still threatened, they flee to base (1.8–2.1 move speed). They only fight with their basic wrench when completely cornered — and lose.
- **Alive-gating:** all production auras/effects are active **only while the artisan lives**; nothing is banked. Death = production stops that tick.

### 1.7 Assassin AI (8th class — jungle burst + scout protocol)

Assassins are autonomous burst hunters plus the army's scouting specialists (class contract in `Final - Assassins.md`):

- **Targeting (pure predicates, no player picks):** dive-priority per §1.1 — **lowest-HP target within dive range** (engage / jungle clear) or **highest ATK/AP backline** (carry focus); execute predicates where a kit has one (Nightblade <40% HP, Doomblade Shade <15%). Every "choice" in a kit (lowest-HP, marked target, below-threshold) is a deterministic AI rule.
- **Jungle clear (`J`):** assassins auto-clear the nearest monster camp; the **Slayer's Mark** secondary is always active (marks the current monster target → +40% carrier damage, +25% from all sources). Solo clear ≈ **15s** (T2+).
- **Scout protocol (the 10-second rule, see `TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md` §CARD POOL: INTELLIGENCE & SCOUTING):** when the Scout card resolves on an assassin, it **leaves the board for a fixed 10.00s** — no actions, no targeting, no farming; the death roll resolves at the **10.00s mark** (2% per enemy unit in radius; Scoutmaster Silas 0%); a combined notification (intel + `SURVIVED`/`K.I.A.`) fires at that mark; on `SURVIVED` the unit returns to its original hex and resumes autonomy.
- **Stealth (Penumbra — Shroud):** automatic — the unit is untargetable by enemy basic attacks until its first attack lands; no stance toggle, no player input.

---

## 2. ⚙️ Unit-Level AI Compatibility Check (all 80 units)

**Verdict: PASS.** No unit requires player input. Units whose kits read like they need manual decisions are pinned to explicit AI rules below; the remaining units are purely reactive (taunts, heals, executes, zones, projectiles) and need no rule beyond the global framework.

| Unit | Mechanic that looked "manual" | Deterministic AI rule |
| :--- | :--- | :--- |
| Stormdancer Kael | Mark → "recast to detonate" | Marks auto-detonate 1.2s after dash completes (no player recast). |
| Pugilist Oni | Combo resets on target switch | AI hard-locks target; only enemy CC resets the combo (per §1.5). |
| Duelist Valen | "Challenges a target" | Auto-challenges the enemy with highest ATK within range (carry focus). |
| Sniper Castella | 1s channel + execute | Auto-casts per §1.3; never starts if an enemy melee is within 2 hexes. |
| Ballista Grun | Siege Stance "cancelable" | Auto-enters stance when no enemy within 3 hexes (or frontline engaged); auto-exits if engaged by a melee. |
| Graviton Olum | 1.5s pull channel | Auto-channels only when ≥3 enemies are within the radius (per §1.3). |
| Trebuchet Elder Gorm | 2.5s channel | Auto-channels on the highest-HP structure when safe per §1.3; accepts interrupt risk. |
| Blastengine Rik | Overheat timing | AI fires the burst when the cooldown is ready; overheat is automatic downtime (predictable, punishable). |
| Rammaster Kodo | Self-stun charge | Auto-charges toward the nearest structure/frontline when a line is clear. |
| Timewarp Elowen | Zone placement | Auto-places on the most-threatened friendly cluster. |
| Echo Sage Vermos | "Copies last friendly ability" | Auto-echoes the highest-value ability per §1.2 (damage ult > buff > heal). |
| Pixie Trickster Fae | Polymorph target pick | Auto-targets the enemy with highest ATK (carry shutdown). |
| Nyx Oracle Kira | Silence zone placement | Auto-places on the highest-density enemy cluster or on a channeling enemy. |
| Bulwark Aldric | Intercept target | Auto-protects the lowest-HP ally (reactive, already autonomous). |
| Oracle Vessa | Foresight timing | Auto-casts preemptively on channeling/protected allies (reactive). |
| Bannerlord Cassius | Banner placement | Auto-plants beside the highest-value carry cluster. |
| Battlechanter Rory / Timekeeper Nora | Buff targets | Auto-buff the highest-ATK/ASPD ally (carry priority). |
| Seraph Angelus / Mender Tulia | Heal targets | Auto-heal the lowest-HP ally (overheal → shield). |
| All Siege units | "Choose target" | Structure-first priority per §1.1. |
| **All Artisans (10)** | "Build / craft / repair / farm" | Production directives per §1.6 — command-driven construction sites, no player target pick. Site work is a stand-still channel; enemy attack/CC interrupts it. |
| **Lumberjack Bodhi** | "Which tree to fell / where to barricade" | Fells nearest tree under `J` (harvest loop); barricade placement follows §1.6 site rules (chokepoint > waypoint > breach). |
| **Civil Engineer Markus** | "Where to lay roads" | Lays Roads along the platoon's active march vector (`A` = toward enemy wall, `G` = toward waypoint, `J` = farm route); Highway Line follows the same vector. |
| **Trapsmith Vern** | "Where to place traps" | Caltrops at commander waypoint / most-trafficked chokepoint; Snap Trap roots the *first* enemy entering, no target pick needed. |

**Remaining 49 units:** purely reactive / projectile / aura / zone kits (e.g., Marrow spin, Grendal execute, Bramble reflect, Olum-tier tank auras, Zeph chain bounce, Bren pierce, Jinx rockets, Krag melt, Vul volley, and the 7 purely-aura Artisans — Foreman, Venn, Marble, Sable, Odette, Aurelia, Rook). They act on the global framework with **zero** player dependency. ✅

---

## 3. 🔄 FULL RE-AUDIT UNDER AUTO-ACTION (4 Requirements)

### Requirement 1 — Synergies (unchanged, still PASS)

Synergies are combination-level effects (focus-fire, cluster wombo, dive squad, protection packages) and do **not** depend on player micro. All 80 units still hold exactly 4 partners spanning ≥2 non-own classes. ✅ *Re-verified from `07 - Balance Audit & Synergy Matrix.md` §1 — no synergy references player input, including the 10 Artisans and 10 Assassins (each pairs with 2 same-class + 2 other classes).*

### Requirement 2 — No Unit Overpowered in Isolation (re-checked under AI)

| Standalone threat | Manual-mode counter | Auto-battler counter (now AUTOMATIC) |
| :--- | :--- | :--- |
| Graviton Olum (pull wombo) | "Interrupt the channel" | Enemy CC units auto-interrupt via Interrupt Priority; AI also refuses to channel into a ready CC-caster (§1.3) — fair, no manual timing. |
| Trebuchet Elder Gorm (global shot) | "Interrupt the channel" | Same automatic interrupt rule; 2.5s is the global channel cap. |
| Sniper Castella (executes) | "Dive her" | Dive units auto-target carries (§1.1.2); her AI won't channel into melee range. |
| Phoenixblade Sera (multi-cast) | "CC, spread units" | CC auto-applies; her multi-cast needs 2+ clumped enemies — spread is a pre-battle formation choice, no micro. |
| Eclipsed Iri (stealth burst) | "Reveal, CC at break" | Reveal/AoE effects are auto; tanks auto-face her via taunt/aggro. |
| Gravewalker Corvin (transform) | "Kill pre-transform" | Carry-focus priority auto-targets him; feeding him is still a positioning mistake. |
| Thornback Bramble (reflect) | "Use magic, don't attack" | Magic units auto-prioritize him when he is the highest-threat target in range. |

**Verdict: PASS — and stronger than the manual audit.** Every previously "skill-gated" counter is now a guaranteed automatic behavior. A single unit can never dominate because the counter requires no human reaction speed.

### Requirement 3 — No Unbeatable Combo (re-checked under AI)

| Combo (from `07` §3) | Auto-battler resolution | Unbeatable? |
| :--- | :--- | :--- |
| 1. Olum + Orin/Drenn/Cinder wombo | Interrupt Priority auto-stops the pull; AI holds channel back if CC is ready. Zone ults still punish *mispositioning*, which is the commander's risk. | ❌ No |
| 2. Rhuk + Olum pull chain | The hook pulls the *farthest* enemy — a tank placed farthest absorbs it automatically; CC DR (50%) applies to the follow-up stun. | ❌ No |
| 3. Kael + Vex + Iri + Nyx dive squad | Taunt (Bastion) and Intercept (Aldric) are automatic; Fae auto-polymorphs the highest-ATK diver; Vessa auto-shields. Counter needs only formation, not micro. | ❌ No |
| 4. Cassius + Vessa + Sera immortal carry | Kill priority (carry focus) auto-targets Vessa/Cassius (both are squishy Supports); CC auto-chains Sera when immunity lapses. | ❌ No |
| 5. Triple siege (Gorm + Gus + Rik) | Carry focus + structure-threat logic: dive units auto-prioritize the backline; siege units cannot move/escape (0.7–0.9 move). | ❌ No |
| 6. Gol + Ymir + Lyra CC chain | CC DR (50% after first application within 6s) is a hard system cap; Vessa's passive auto-negates the first CC per ally. | ❌ No |
| 7. Slyth + Marrow + Grendal armor-shred execute | Counter is comp-level (magic damage, anti-heal), both chosen pre-battle — no micro involved, symmetric. | ❌ No |

**New auto-battler-specific check — channel-stacking cheese:** because Interrupt Priority is automatic and channels never start while a ready CC-caster is in range, **no combination of channel ults can force an unbeatable sequence.** The global 2.5s channel cap + 50% CC DR + automatic interrupts close every possible stunlock. ✅

**Verdict: PASS.**

### Requirement 4 — Role Weaknesses Preserved (re-checked under AI)

| Class | Weakness | Still enforced under auto-action? |
| :--- | :--- | :--- |
| Fighter | Melee-only, no range, no structure damage | ✅ AI melee advance keeps them in the fight; their target choice never grants range. |
| Tanker | Lowest damage, no burst | ✅ AI never deals more damage than stats allow; their job (soak/CC) is fully automatic. |
| Mage | Fragile, AoE-dependent, no frontline | ✅ Fragility is exploited automatically by dive units (carry focus). |
| Marksman | Squishy, positioning-dependent | ✅ **Strengthened framing:** since there is no manual kiting, marksman value now comes from *formation* — the commander must place and protect them. A mis-positioned marksman is removed automatically. |
| Support | Zero damage, dive bait | ✅ AI carry-focus automatically hunts Supports; their healing is reactive and never damage. |
| Siege | Slowest, lowest durability | ✅ The most exploitable weakness — dive units auto-prioritize them; their slow move (0.7–1.3) is never out-playable by AI, only mitigated by formation. |
| Artisan | Even weaker than Support (ATK 34–55, no CC/heal/structure damage) | ✅ **Newly enforced by §1.1.6:** dive AI auto-prioritizes artisans working production sites; work channels are interrupted by any attack/CC; production is alive-gated so death erases all value automatically. An unprotected artisan is removed from the game with zero player effort. |

**Verdict: PASS.** No class weakness can be manually out-played anymore (which is exactly right for an auto-battler — weaknesses are *exploited* by AI and *mitigated* by the commander's formation).

---

## 4. ⚖️ Balance Shifts Introduced by Auto-Action (honest delta audit)

| Design element | Manual-mode value | Auto-battler value | Correction applied |
| :--- | :--- | :--- | :--- |
| Channels (Olum/Gorm/Castella) | Strong (skill to interrupt) | **Weaker** (auto-interrupt) | Compensated: interrupt requires a ready CC-caster in range — dive comps must bring CC; pure no-CC comps still fear channels. |
| Manual kiting | Marksman skill ceiling | **Removed** | Marksmen gained formation value instead (hold-range + 1-hex disengage only). Positioning, not micro, is the carry skill. |
| Oni target lock | Player-managed combo | **Stronger** (AI never mis-targets) | Compensated: his lock also means he never helps clear adds — pure single-target commit is his identity and his tax. |
| Duelist Valen | Player picks rival | **Auto** (carry focus) | No change needed — carrying focus is his intended role; counter (focus fire) is symmetric. |
| Vessa / Aldric / healers | Reactive micro | **Fully automatic** | These kits were already reactive; autonomy only removes misplay — buffed slightly, countered by anti-heal + dive (unchanged). |
| CC diminishing returns | Soft guardrail | **Critical guardrail** | Promoted to hard system rule: 50% duration cut on repeat CC within 6s, plus 0.25s re-target delay. Prevents AI-perfect stunlocks. |

**Net: no unit or combo gained or lost more than ±1 tier of power from the format shift. The roster stays internally balanced under auto-action.** ✅

---

## 5. 🎖️ Commander-Facing Design Notes (final)

- The commander's **only combat input is formation placement** — so every unit's counterplay must be expressible as a *formation choice* (spread vs clump, frontline depth, backline protection). Verified: all counters in §3 are formation-level, not reaction-level. ✅
- **Recommended commander tooling** (optional, roster-agnostic): 1 active commander skill (zone/global only — no unit targeting, per `00` §6), shop with interest economy, item/banner slots. No further unit-facing controls should exist.
- **Playtest levers** (in order, no redesign needed): CC DR window (6s), re-target delay (0.25s), channel cap (2.5s), tier gold economy. All are single-number tuning knobs documented in `07` §5.

---

## 6. 📋 Final Auto-Battler Re-Audit Statement

> **All 4 requirements PASS under the auto-battler / commander-only framing (80 units, 8 classes):**
> 1. **Synergies:** all 80 units retain 4 partners across ≥2 classes — combination play needs no micro. ✅
> 2. **Isolated power:** every standalone threat has an *automatic* counter (no human reaction speed required); AI channels are self-regulating. ✅
> 3. **Meta stability:** all 8 dangerous combos + a new channel-stacking cheese vector are closed by system rules (Interrupt Priority, 2.5s channel cap, 50% CC DR, 0.25s re-target). ✅
> 4. **Role integrity:** all 7 class weaknesses are preserved and now *enforced by the AI itself* — the commander can only mitigate them through formation. ✅
>
> **Artisan addition:** the 7th class is fully autonomous — production runs on §1.6 directives, dive AI automatically value-kills unprotected artisans, and its production audit (§6 of `07`) confirms a PVR band of 0.7–1.0 so it can never out-pace a full-combat army. ✅
>
> **Assassin addition:** the 8th class (jungle burst + scouting) runs on §1.7 — burst targeting is pure §1.1 predicates (lowest-HP / carry / execute), the 10s Scout protocol is fully automatic (board pull → death roll → combined notification → return-if-alive), and solo jungle clears hold the 15s standard via the always-on Slayer's Mark. ✅
>
> **Format delta:** the auto-action shift net-nerfs channels, net-buffs reactive supports, and converts marksman value from micro to formation — all within ±1 power tier, with tuning knobs documented. The roster is fully autonomous-ready: **no unit requires player input.**
