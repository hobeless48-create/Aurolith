---
tags: [Tuning, Playtest, Validation, QA, Balance]
type: Playtest Validation
---

# 🧪 PLAYTEST VALIDATION — CROSS-SCENARIO CHECKLIST

> Post-tuning validation for all 80 units (70 combat + 10 Artisan). Run each checklist after any tuning change. A failure in any ❌ row blocks the release of that unit/mechanic.

---

## 1. ✅ Tank Skill Activation (the §4 fix — highest priority)

| # | Test | Pass criteria |
| :--- | :--- | :--- |
| T1 | Tank under `A` Attack vs engaged enemy | Defensive skill re-casts **every cooldown** while trigger is valid — never a one-time cast on first range acquisition. |
| T2 | Tank under `D` Defense | Skill re-casts at max trigger sensitivity (ally <85% HP / enemy in range) — no lost availability across a 30s fight. |
| T3 | Tank under `R` Retreat | Skill re-casts as peel/heal while retreating; no skill misfire, no lost availability. |
| T4 | Tank under `J` Jungle | Defensive skill casts at critical (<30% ally) — fires correctly, no spamming. |
| T5 | Tank under `G` Gather | Skills OFF during movement; on arrival the inherited stance resumes the loop correctly. |
| T6 | Skill interrupts / deaths mid-cast | Cooldown starts on **resolve**; interrupted casts refund or restart CD per spec (channels: CD starts on completion; interrupted = no CD, re-castable). |

## 2. ✅ Cooldown System & Command Priority

| # | Test | Pass criteria |
| :--- | :--- | :--- |
| C1 | Combat start | **All 80 units have Primary + Secondary off cooldown.** No ramp-up, no mana. |
| C2 | Command switch mid-fight (`A`→`D`, `D`→`R`, etc.) | Priority hierarchy (`09` §2) takes effect within 1 tick; no misfire, no double-cast. |
| C3 | Trigger gating | No skill fires when its trigger is false, even at HIGH priority (e.g., nuke vs single enemy with `A` if trigger requires 2+). |
| C4 | CD role budgets | Tank defensive 3–5s, Mage nukes 8–12s, Siege structure nukes 8–14s, Support heals 4–6s — verified per class file. |
| C5 | Anti-spam | No nuke can be cast twice within 8s; no structure burst within 8s of itself. |
| C6 | Passive refresh skills | All periodic passives re-apply on their refresh CD — no permanent-effect decay bugs. |

## 3. ✅ Counterplay Mechanics (per mandate archetype)

| # | Archetype | Pass criteria |
| :--- | :--- | :--- |
| K1 | **AoE CC interrupts dash** | Kael, Vex, Kodo, Rhuk, Iri: every dash/charge is cancelled by AoE CC mid-movement. No dash is CC-immune. |
| K2 | **Thick frontline blocks pathing** | Dive units are body-blocked by Gol/Bastion/Aldric/Olum; taunt overrides target choice; no unit dashes *through* a blocking tank. |
| K3 | **Focus-fire overwhelms high-HP** | Any Tanker (and Obr's 1,600 HP) loses a 3v1 focus to a standard damage trio (mark + curse + execute). No tank outlasts a full focus with healer removed. |
| K4 | No unconditional dominance | Every unit in the 8 `Final - <Class>.md` files has its documented counterplay verified as executable by a legal comp (spot-check all 80 against their roadmap). |

## 4. ✅ Cross-Scenario Balance (all 80 units)

| Scenario | Sample test | Pass criteria |
| :--- | :--- | :--- |
| **1v1** | Every unit vs every unit in its tier (spot-check: all T1/T2 pairs; all T3+ against their designated counters) | No unit wins >70% of its 1v1 matchups; no unit loses <30%. Squishy units lose to their counters; no "mirror-proof" unit. |
| **Small-scale (3v3)** | 3-unit comps vs their designated counter-comps (audit `07` §3 combos) | No comp wins >65% vs its counter-composition; combos are strong but beatable. |
| **Large-scale (full 10-unit)** | Full comps from `07`/`08` meta list + free-builds | No single composition dominates (>60% winrate across 50 simulated matches); no unit outperforms its role budget. |
| **Role performance** | Damage per role in full fights | Tanker DPS < Fighter/Mage/Marksman/Siege DPS; Support DPS < all; Siege structure DPS > all by ×1.25–×2.0. No class exceeds its stat budget (`09` §6). Artisan DPS < Support DPS (the class floor). |

## 5. ✅ Artisan Production & Army Cap Checks (7th class + 20-cap)

| # | Test | Pass criteria |
| :--- | :--- | :--- |
| A1 | **Army cap (20)** | A side can field **at most 20 active units** — exactly **4 platoons of 5 units** (hotkeys `1`–`4`). Platoon merge rejects any group > 5; the 21st unit blocks recruitment. |
| A2 | **Alive-gating** | Kill any Artisan mid-match → its production effect stops the **same tick** (no banked discounts, no passive income in arrears). |
| A3 | **Production caps hold** | Facility discount ≤ 40% (Foreman+Venn), craft ≤ 50% time / 45% gold (Sable+Quick Crafting), barricades ≤ 8, caltrops ≤ 6, snares ≤ 4, ledger ≤ +0.6g/s. No stacking vector exceeds its cap. |
| A4 | **PVR band** | In winning states, each Artisan's TPV lands at 0.7–1.0 × CSV (audit `07` §6). Aurelia is the only one allowed near 1.0; Rook's spike must only appear when losing structures. |
| A5 | **Artisan dive check** | A standard dive unit (Kael, Vex, Rhuk) kills an **unguarded** Artisan in ≤ 3s; an Artisan under attack stops producing (work channel interrupted). |
| A6 | **Artisan AI** | Artisans never voluntarily engage; flee to nearest friendly structure when threatened; never place constructs on top of allies; no infinite work-loop (site completed → next site). |
| A7 | **Map constructs** | Roads (+40% friendly move, 200 HP destructible) & barricades (300 HP, movement-blocking) function as terrain; enemy siege clears them in ~3s; a destroyed construct can be rebuilt at cost. |
| A8 | **Econ comp vs full-combat comp** | 3-artisan econ comp vs mirror full-combat comp: winrate band **45–55%** across 50 simulated matches (the slot tax pays for the production). |
| A9 | **No out-pacing** | Compare "1 Artisan team" vs "same comp with 1 more combat unit": the artisan team must NOT exceed 55% winrate at any single match-time checkpoint. |

## 6. ✅ Specific Regression Tests (from the tuning pass)

| # | Test | Pass criteria |
| :--- | :--- | :--- |
| R1 | Grendal execute chain | Execute reset respects the 8s CD (no infinite chains); CC interrupts it. |
| R2 | Sera Phoenix Spin multi-cast | Max 3 recasts per 10s CD; spread formations reduce it to 1. |
| R3 | Kira silence vs channel ults | Silence auto-targets channeling enemies (Olum/Gorm/Castella) — channels never complete into a ready silence. |
| R4 | Vessa vs CC chains | Prescience blocks 1 CC per ally per 8s; CC DR (50%) still applies to the second. |
| R5 | Cassius revive | Banner revive triggers once per banner; killing Cassius removes the banner; no chain revives. |
| R6 | Luxor/Sunder interaction | 1-gold Sunder Aegis shreds Luxor/Bastion shields — the 1-gold answer must remain viable in full fights. |
| R7 | Siege under `R` | Siege units never `R` (commander misuse); under any command they hold position while a structure is in range. |
| R8 | All skills off-CD at start | Verified per unit in the 8 `Final - <Class>.md` files — no unit opens a fight gated. |
| R9 | **Scout 10s protocol (8th class)** | Scout card on a unit: it leaves the board immediately; at **exactly 10.00s** one notification fires with (a) intel gathered and (b) `SURVIVED`/`K.I.A.`; on `SURVIVED` the unit returns to its original hex on the same tick. Silas: 0% death risk + 1 extra accurate facility intel; no farming that turn. |

## 7. 📋 Sign-Off Gate

> Release a tuning batch only when: **T1–T6, C1–C6, K1–K4, A1–A9 all pass**, the 1v1/small/large winrate bands hold, and no regression in R1–R9. Any failure is fixed via the data knobs in `09` §7 (CD ±1s, trigger ±5%, threshold shifts) — no ability redesigns should be required.
>
> **Expected playtest outcome (per mandate):** tank skills fire persistently across all commander commands; cooldown triggers never misfire or conflict; every unit's documented counterplay works as intended; no unit outperforms its combat role in any scenario; and no Artisan's production out-paces the combat slot it replaces (A4/A8/A9).
