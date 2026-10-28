---
tags: [Tuning, Framework, CommanderCommands, CooldownSystem, Balance]
type: Tuning Framework
---

# 🛠️ TUNING FRAMEWORK — COMMAND SYSTEM, COOLDOWN OVERHAUL & COUNTERPLAY MANDATE

> **Purpose:** a single implementation plan that makes all 80 units **symmetrically fair** — every unit has a defined counterplay mechanism, and no unit is unconditionally dominant in any matchup. All tuning preserves the auto-action system tied to the **5 base commander commands**. (Artisan production auras are the one alive-gated exception — `Final - Artisans.md`.)

---

## 1. 🎖️ The 5 Base Commander Commands (A / R / J / D / G)

Defined in the project's commander system (`Commander & Platoon System`). Units are **always** under exactly one command. Skills activate **only** according to the command's priority hierarchy — never by player micro, never by resource availability.

| Command | Hotkey | Definition | Combat Stance |
| :--- | :--- | :--- | :--- |
| **Attack** | `A` | March to enemy walls / core. | Aggressive — push, engage, offensive skills priority. |
| **Retreat** | `R` | Fall back to inner keep. | Disengage — escape/heal/peel priority, offense suppressed. |
| **Jungle** | `J` | Auto-search and clear neutral camps. | Farm — DoT/AoE/farm skills on neutrals, nukes held vs players. |
| **Defense** | `D` | Return to castle walls and station. | Hold — defensive skills full sensitivity, offense only in defended range. |
| **Gather** | `G` | Assemble platoons at target hex waypoint. | Formation — movement priority; on arrival inherits prior combat stance. |

---

## 2. ⚙️ Skill Activation Priority Hierarchy (per command)

Skills are categorized by type. Each type has a priority per command: **HIGH** (cast immediately when trigger valid), **REACTIVE** (cast only when the trigger is valid — e.g., ally below threshold / enemy in range), **OFF** (never cast).

| Skill type | `A` Attack | `R` Retreat | `J` Jungle | `D` Defense | `G` Gather |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Offensive nuke (Mage/Siege) | **HIGH** | OFF | REACTIVE | REACTIVE | OFF |
| Engage / dash (Fighter) | **HIGH** | OFF | OFF | OFF | OFF |
| Execute | **HIGH** | REACTIVE | REACTIVE | REACTIVE | OFF |
| Crowd control | **HIGH** (cluster/carry) | REACTIVE (peel) | OFF | REACTIVE (defensive) | OFF |
| Defensive (tank shield/taunt) | REACTIVE | **HIGH** | REACTIVE | **HIGH** | REACTIVE |
| Heal / sustain | REACTIVE | **HIGH** | REACTIVE | REACTIVE | REACTIVE |
| Buff / aura / steroid | REACTIVE | REACTIVE | REACTIVE | REACTIVE | OFF |
| Zone (damage or protection) | **HIGH** | REACTIVE | **HIGH** (farm) | REACTIVE | OFF |
| Structure damage (Siege) | **HIGH** | OFF | REACTIVE | **HIGH** | OFF |

**Rule:** a skill's *trigger condition* (specified per unit) must also be valid — the command sets priority, the trigger gates the cast. No skill fires if its trigger is false, even at HIGH priority.

---

## 3. ⏱️ Skill Cooldown System Overhaul (Mana → Seconds)

The previous energy/mana resource is **replaced** by a seconds-based cooldown system.

### 3.1 Spec

1. **All units enter combat with Primary and Secondary skills fully available (off cooldown).** Combat starts hot — no ramp-up phase.
2. **Skills are activated only by command priority + trigger condition** (§2). There is no resource to spend or hoard.
3. **Cooldown starts the moment the skill resolves** (not on cast start; channeled skills start their CD on completion).
4. **Cooldowns are role-tuned** so that defensive uptime is high on frontline sustain and burst damage is gated (anti-spam).

### 3.2 Role Cooldown Budgets (reference ranges)

| Role | Defensive / sustain CDs | Offensive / nuke CDs | Control / CC CDs | Note |
| :--- | :--- | :--- | :--- | :--- |
| **Tanker** | 3–5s | — (low dmg) | 8–10s | Short CDs = persistent frontline protection (the fix below). |
| **Fighter** | 4–6s | 7–9s | 6–8s | Engage dash short; burst nuke gated. |
| **Mage** | — | 8–12s | 7–10s | High damage = long CDs (anti-spam). |
| **Marksman** | 5–7s (self peel) | 9–11s (execute/ulti) | — | Sustained DPS is auto-attacks; skills are supplements. |
| **Support** | 4–6s (heal) | 10–12s (ultimate buff) | 8–10s | Heal uptime high; big buffs gated. |
| **Siege** | — | 8–12s (nuke), 12–15s (global) | — | Structure burst gated hardest. |
| **Artisan** | 20–90s (production abilities) | — | — | Production is a strategic rhythm, not a combat gate — no spam, no burst. |

### 3.3 Passives → Periodic Skills

Pure passives (e.g., armor shred, thorns reflect, regen auras) become **periodic skills**: a passive with a **refresh cooldown**. The effect persists, but the system re-applies / re-evaluates it on the CD tick. This keeps all 80 units on one uniform cooldown architecture (Artisan production auras are the single deliberate exception — `Final - Artisans.md`).

---

## 4. 🛡️ TANK SKILL TIMING FIX (Critical Bug Resolution)

### 4.1 The bug

Under the `Attack` command, tank units currently activate their defensive skill **once, immediately upon first reaching skill range**, then never again for the rest of the engagement. Result: tanks fulfill their protective role for one cast and then stand idle — the frontline collapses and backline dies.

### 4.2 The fix — Persistent Skill Availability (retrigger loop)

Tank skills are no longer a one-shot "on range acquisition" event. Every tank defensive/CC skill runs a **persistent retrigger loop**:

```
combat_start:
  primary.ready = true
  secondary.ready = true

tick (every frame):
  # Priority comes from the current commander command (section 2)
  for skill in [primary, secondary]:
    if skill.ready and skill.trigger_valid():        # trigger_valid = e.g. ally < 70% HP,
        skill.cast()                                  #                enemy in range, self focused
        skill.ready = false
        start_cooldown(skill.cooldown_seconds)        # starts when skill RESOLVES

cooldown_complete(skill):
  skill.ready = true                                  # availability is persistent by construction

# Command stance modulates trigger sensitivity:
#   D / R  -> defensive triggers at max sensitivity (ally < 85% HP, any enemy in range)
#   A      -> defensive triggers only when valid (ally < 40% HP, self CC'd, or focused by 2+)
#   J / G  -> defensive triggers at critical only (ally < 30% HP)
```

### 4.3 Behavior guarantees

- **`D` Defense / `R` Retreat:** defensive skills re-cast every cooldown the instant the trigger is valid — persistent protection, no "lost availability."
- **`A` Attack:** defensive skills still re-cast while engaged (never lost after first range acquisition) — the fix — but at reduced sensitivity so tanks don't waste casts while pushing.
- **No one-time latch:** the "first range acquisition" latch is deleted from the tank AI entirely. Skill availability is `ready` state → cooldown → `ready` state, forever.

---

## 5. 🎯 Global Counterplay Framework (the "No Unconditional Dominance" mandate)

Every unit must have a **defined counterplay roadmap** (delivered per unit in the 8 `Final - <Class>.md` files). The framework guarantees coverage of the three mandated archetypes:

1. **AoE crowd control interrupts dash/mobility abilities.** Every dash/charge unit (Kael, Vex, Kodo, Rhuk, Iri) is interruptible mid-movement by any AoE CC — verified per unit in tuning.
2. **Thick frontline blocks pathing for mobile units.** Dive units are stopped by body-blocking frontline (Gol, Bastion, Aldric, Olum) — their dashes/hooks respect unit collision and taunt override (§1.5 of doc `08`).
3. **Coordinated focus-fire overwhelms high-health targets.** High-HP units (all Tankers, Colossus Obr) lose to comp-level focus (curse/mark/execute stacks) — verified per unit.

4. **Recuperation Fatigue (anti-deathball sustain limiter):** when an ally receives healing or shields, any subsequent heal or shield cast upon that same ally within **3.0s** suffers a **30% fatigue penalty** (stacks up to 2×, max −60%). This prevents unkillable triple-support stall compositions in late-game auto-battles without punishing single-target triage.
5. **Dive & Teleport Telegraph Window (auto-MOBA peel agency):** all backline teleport/blinking skills (e.g. Nightblade's *Shadow Blink*) project a **0.6s–0.8s ground telegraph** before resolving. This window grants nearby Tankers stationed in `D` (Defense) or `G` (Gather) the frame window needed to automatically trigger intercept taunts or defensive shields.

Plus per-class counterplay archetypes, assigned to every unit:

| Class | Universal counterplay archetype |
| :--- | :--- |
| Fighter | CC before the burst window; range kiting; armor stacking. |
| Tanker | True/%max-HP damage (Drenn, Petra, Vul); ignore-and-kite; magic damage. |
| Mage | Interrupt channels; spread formations; MR stacking; dive. |
| Marksman | Dive/teleport; flanking; taunts pulling focus. |
| Support | Kill priority — always the squishiest high-value target; anti-heal & Recuperation Fatigue. |
| Siege | Dive before the shell lands; interrupt channels; kill-on-sight. |

**Fairness rule:** no unit may have *both* its primary counterplay absent *and* a dominant stat line. Every unit's stats in the 8 `Final - <Class>.md` files are tuned so at least one archetype from this framework is always viable against it.

---

## 6. 📐 Global Stat Alignment Rules (applied in class tuning)

- **HP pools:** Tier 1 < Tier 2 < ... < Tier 5 within a class; Tanker ×1.8 class multiplier kept; Siege ≤ Marksman-level squish per tier.
- **Armor/MR:** Tankers highest (45–75 DEF / 35–60 MR); Mages and Marksmen lowest (12–28 / 8–25); no unit may exceed its class budget.
- **Move speed:** Siege 0.7–1.3 (hard cap 1.3); everyone else ≥1.4. Dive units 2.0–2.3.
- **Attack range:** class-fixed (Fighter 1, Tanker 1, Mage 3–4, Marksman 4–7, Support 2–3, Siege 2–9, Artisan 1–2).
- **Damage:** Tanker/Support ceilings fixed below damage-class floors (Tanker ≤ 80, Support ≤ 58, Fighter ≥ 60, Mage AP ≥ 52, Marksman ≥ 65, Siege ≥ 70 vs structures ×1.25–×2.0). **Artisan ≤ 55 — below the Support floor: the class floor.**

---

## 7. 🔧 Conversion & Tuning Knobs

- **Old energy cap → new CD (reference conversion):** Energy 80–90 → 5–7s CDs; 95–110 → 7–10s; 120–130 → 10–12s (role-adjusted per §3.2).
- **Live tuning knobs (no redesign):** any cooldown ±1s, trigger thresholds ±5% HP, command priority table (§2) edits, taunt radius ±1 hex. All are data-driven — the framework never requires ability redesigns to balance.

---

## 8. 📁 Deliverable Map

| File | Content |
| :--- | :--- |
| `09 - Tuning Framework...` | This document |
| `Final - Fighters.md` | 10 units — stats, CDs, command behavior, counterplay roadmap |
| `Final - Tankers.md` | 10 units — incl. persistent skill availability verification |
| `Final - Mages.md` | 10 units |
| `Final - Marksmen.md` | 10 units |
| `Final - Supports.md` | 10 units |
| `Final - Siege.md` | 10 units |
| `Final - Artisans.md` | 10 Artisans — production CDs, command behavior, alive-gated auras + class contract |
| `Final - Assassins.md` | 10 Assassins — burst CDs, Slayer's Mark, scout protocol + class contract |
| `16 - Playtest Validation.md` | Cross-scenario checklists (1v1 / small / large / tank fix / cooldown / counterplay / artisan A1–A9) |

> The 8 `Final - <Class>.md` files merge each class's design identity with its tuning numbers into a **single authoritative character list** — on any conflict, the tuning numbers win.
