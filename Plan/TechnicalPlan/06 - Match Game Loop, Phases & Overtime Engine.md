---
tags: [TechnicalPlan, GameLoop, Phases, PauseEngine, VictorySequence]
type: Technical Specification
---

# 06 - MATCH LOOP, PHASES AND OVERTIME

> Rule authority: `TextPlan/01 - Core Rules & Mechanics/Match Timeline & Phases.md` and `Data/BlessingList/00 - Blessing System Overview, Draft Rules & Audit.md`. This file specifies how to implement those rules.

## Clock and event order

- The simulation advances in fixed ticks. Store `tick` as an integer and derive match seconds from it. Start at 10 ticks per second; measure and adjust only if gameplay requires it. Never use `Date.now()` or `performance.now()` inside rule evaluation.
- In local play, `performance.now()` schedules ticks. On a slow frame, process a bounded number of catch-up ticks and expose a slowdown indicator; do not silently discard elapsed match time. Single-player pause stops the simulation tick. Auto-pause a local single-player match when the page becomes hidden, and show its paused state on return.
- In online play, the server owns the tick and match clock. A hidden or throttled client tab may render fewer frames, but it cannot slow or advance the server match. On return, request a current snapshot. Browser background animation callbacks are commonly paused or throttled ([MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)).
- Process each tick in a stable order: scheduled rule events -> accepted commands -> movement and combat -> deaths and rewards -> victory check -> visibility -> outbound view states. This makes a phase unlock effective before commands stamped for that exact tick. Give every command a tick and sequence number so ties are reproducible.
- Queue every threshold event crossed during a tick once, including the 0:00, 5:00, 10:00 and 15:00 phase boundaries, seven card draws, boss spawns and minute-boundary trait effects. Trigger the 0:00 events explicitly when the match starts.

## Phase contract

| Match time | Phase | Scheduled rule |
|---|---|---|
| 0:00–5:00 | Opening | Opening Rite at 0:00; siege locked. |
| 5:00–10:00 | Expansion | Expansion Rite at 5:00; siege unlocked. |
| 10:00–15:00 | Siege | Siege Rite at 10:00. |
| 15:00–18:00 | Overtime | Apply the overtime income rule and disable castle regeneration as specified in the core rules. |
| 18:00 | End | Resolve the core-rule tie-breaker. |

Each Rite offers **three tailored blessings**: composition, strategic state and wildcard. The player has **one reroll for the entire match**. Both players receive mirrored tier-roll seeds. The drawer is non-blocking; the authoritative match continues. For the first six real-time seconds of a Rite, schedule simulation ticks at 0.5x speed for **both players together**, not independently per client. Use a 30-real-second Rite decision timer and deterministic auto-pick when it expires. The server owns these schedules online. The 15-second card overflow timer pauses while a Rite drawer is open, per `TechnicalPlan/04`.

## End and pause rules

- Core HP reaching zero or surrender ends the match immediately and prevents later tick events from changing the result.
- At 18:00, if both cores survive, compare **cumulative damage dealt to outer and inner wall layers over the entire match**. If totals tie, compare remaining Core HP; if that also ties, the match is a draw. This follows `TextPlan/01 - Core Rules & Mechanics/Match Timeline & Phases.md` and the Stage 0 resolution in `TechnicalPlan/14`.
- Single-player vs AI pause freezes the simulation and all game timers. Online and hotseat pause menus are overlays; their match clocks continue. Online speed controls may only change replay playback, never an active competitive match.
- Post-match statistics and replay consume recorded events after the result is sealed. A capped recent-event telemetry array alone is not a complete replay format; see `TechnicalPlan/14`.

## Acceptance checks

1. Given the same seed and command list, two runs produce the same state hash at every phase boundary.
2. A hidden local tab resumes without skipping required rule events; an online client resynchronizes to the server tick.
3. Draws fire at 0:00, 2:30, 5:00, 7:30, 10:00, 12:30 and 15:00 exactly once.
4. Rites show three options, consume at most one reroll per match, and time out identically in local and online modes.
5. Match end prevents further rewards; the 18:00 result compares cumulative wall damage, then remaining Core HP, then draw.
