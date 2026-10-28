# Stage 2 acceptance evidence — updated 2026-10-26

**Current requirement audit (2026-10-26):** The [gate matrix](stage2-gate-audit-2026-10-26.md) separates completed machine checks from missing human acceptance. New targeted Outrider browser verification passes real emission, owner projection, correct minimap coordinates, expanding ring, expiry while paused and zero opponent-only ring draws, without page errors. Build/type checking passes. S2-6 remains open.


**Automated late-game evidence (2026-10-26):** Defensive recruitment/training/facilities through the normal HUD reached active 15:00 overtime and an 18:00 wall-damage defeat, no page errors or rule overrides. Exact 5/10/15/18-minute DOM checkpoints are saved separately from human observations. Fixed misleading Build availability at the shared three-combat-facility cap. [Evidence](stage2-late-game-2026-10-26.md). S2-6 remains open.


**Latest HUD/readability verification (2026-10-26):** Expanded browser smoke passes the new help/pause bindings, expandable groups, formation, tactics, economy, craft/equip, move and reset paths. Added character-art battlefield markers, HP bars and explicit skill/status labels following the user's report that effects were hard to read. The 100% event harness passes boss warning/ability, card cast, Nami cast/hit/stun/expiry, trap placement/warning/detonation, audio and cleanup; visible STUN and WATERY GRAVE labels are asserted. Final build/type checking passes. Updated full UI scenarios produce victories at 7:50/7:47 and an unattended defeat at 11:09, with corrected own-Core wording and successful restart, no page errors. These are automated outcomes, not human balance/pacing evidence. [Detailed record and captures](stage2-readability-and-hud-2026-10-26.md).

**Latest revision (2026-10-26):** At the user's request, the four roads stop at field-side forest entrances with shoulders clipped to columns 30-119. Regression coverage asserts no highway tile exists anywhere in either jungle zone. Fresh full suite **171/171 across 17 files**, build/type checking and browser overview capture pass. User reports most functions are usable; exact match result and timed S2-6 notes are still unrecorded. [Current screenshot](stage2-jungle-entrances-20261026.png).

This log separates machine evidence from gate acceptance. **Current status (2026-10-24):** S2-1 through S2-5 are accepted. S2-6 and the Stage 2 exit gate remain open pending a human-vs-bot match and 15:00 pacing review. Machine evidence covers the defined S2-2 behaviors; Glossary-only 25% dive and 60% kite rules remain provisional per user direction.

**HUD layout follow-up (2026-10-25):** The left region-jump rail has been removed; match controls are grouped in the right rail, and a floating keyboard-help panel is toggled by `?` or `P`. Pause/resume is now `O`. The browser smoke was updated to navigate with the minimap. The layout rendered in the painted-terrain browser captures; help/pause/menu interactions were not exercised in that art check. Assess HUD readability during the still-open S2-6 human playtest.

**Pause update (2026-10-24):** The user deferred the human playtest until a later request. No human match result or checkpoint observations have been recorded; S2-6 remains open.

**New-session handoff (2026-10-25):** Localhost `http://127.0.0.1:5173/` was rechecked (HTTP 200) and left running. Latest evidence remains the 2026-10-25 build/terrain captures and 2026-10-24 full 164-test suite. Before claiming a fresh HUD smoke pass, open the newly collapsed roster/recruit/build groups in the existing script and check help/pause behavior. No human match evidence was added. See [the handoff](stage2-session-handoff-2026-10-25.md).

## Current recheck — 2026-10-24

- **Jungle access and terrain movement (2026-10-25):** Four mirrored front-gate-to-jungle branches and canonical +10% highway speed implemented. Movement and deterministic A* share the terrain factor. Seven new regression cases verify access, mirror/wall rules and actual travel-time improvement for platoons and detached units. Fresh full suite **171/171 across 17 files**, production build, and five-region 100% terrain captures pass. User supplied positive initial UI/function feedback; exact human match/checkpoint evidence remains pending. [Details and screenshots](stage2-jungle-access-paths.md).

- **Painted materials update (2026-10-25):** Five versioned generated ground PNGs replace the live SVG surface patterns. The build passes; all five regional terrain captures pass at 100% zoom without page errors. Field/path, jungle and fortress captures were inspected. [Full art record and screenshots](stage2-painted-terrain.md). This does not complete the S2-6 human review.

- **S2-2 accepted for defined source behavior (2026-10-24):** `foundation.test.ts` covers the 12/13 Aggressive range, target ID tie-break, brush detection, pathability, explicit waypoint priority, peel/channel boundaries, macros, idle fallback and Retreat speed boundary. `combat.test.ts`, `camp.test.ts` and `structures.test.ts` prove Retreat suppresses attacks on units, camps and structures. User direction: keep the Glossary-only Aggressive dive below 25% HP and Defensive kite below 60% HP provisional; these behaviors are not implemented or claimed as covered. Full suite passes 164/164 across 16 files.
- **S2-2 provisional rules:** Glossary §8.2 lists Aggressive dive below 25% HP and Defensive kite below 60% HP without defining their actions in TechnicalPlan/03 or TextPlan/02. The user explicitly chose to keep these provisional. They are not implemented and are excluded from S2-2 acceptance until later rules define them.
- **S2-4 accepted (2026-10-24):** representative valid/invalid/boundary fixtures pass in the full 164-test suite. `environment-props-cartoon.png` is wired as eight Pixi atlas frames at 1.3x size; hand-authored SVG ground patterns cover field, jungle, path, courtyard and rampart. Tree, canopy, fence and boulder props are decoration only: passable and transparent to sight. Brush tiles remain concealing; castle walls/cloud borders retain structural rules. Browser smoke, 100% event visual harness, five-region terrain review and production build passed. See updated captures below.
- **S2-4 terrain review (2026-10-24):** `npm run stage2:terrain-review` captured the west/east jungle, central field/path and both fortress regions at 100%. All five cameras reached their requested regions and rendered without page errors. I inspected the refreshed screenshots after switching to the illustrated atlas and making scenery props passable/transparent to sight. S2-4 is accepted; user game-feel/readability review remains under S2-6.
- **S2-6 open:** User must complete a human-vs-bot match and record match result/time, observations at 5:00/10:00/15:00, HUD/readability, strategic decisions, scenery passability, brush concealment, Retreat clarity, stranded units and blocked result behavior in `stage2-human-playtest.md`.

## Pre-playtest usability refinement — 2026-10-24

| Requirement | Implementation and evidence |
|---|---|
| Start with a close view | Camera opens at 100% centered on the player's fortress. Browser smoke verifies the displayed zoom. |
| Keep a whole-map overview available | A floating map sits over the battlefield and shows the current camera rectangle. Clicking it moves the camera in both axes while preserving zoom; browser smoke verifies the jump. |
| Show spotted enemies | Red dots come from `projectPlayerView(...).enemy.visibleUnits`; shared vision and brush detection determine what can appear. Friendly living units use gold dots. |
| Improve terrain readability | Stable decorative details add foliage/ferns, field grass and rare fence sections, fortress mortar lines, highway paving seams and wall stone seams. These render behind units and do not change walkability, collision or line of sight. |
| Clarify controls | Region buttons now say where they jump; sidebar instructions describe drag, scroll, map click, hex inspection and arrow-key camera pan. |

**Verification:** `npm test -- --maxWorkers=1` passed 146/146 tests across 16 files; `npm run build` passed typecheck and production build; browser smoke on `http://127.0.0.1:5175/` passed initial camera, 2D map jump and zoom-retention checks plus existing HUD interactions. Default screen capture: [stage2-ui-refresh.png](stage2-ui-refresh.png). The user's S2-6 playtest still needs to judge readability and whether spotted-enemy markers match expectations.

## S2-2 — Command, reaction and match-loop matrix

Canonical precedence is **explicit order > Smart-Tactics reaction > macro posture > idle**, from `Plan/TextPlan/09 - Glossary of Game Terms & Attributes.md` §8.3. The technical interpretation is in `Plan/TechnicalPlan/03 - Command Priority Queue & Smart-Tactics AI.md`.

| Priority/rule | Behavior evidence |
|---|---|
| Explicit order | `foundation.test.ts`: blocked/valid order handling; one-shot waypoint completion and replacement; waypoint preempts Aggressive pursuit, Gather routing, and Defensive peel; explicit waypoint or Retreat cancels/preempts Deadeye channel in `combat.test.ts`. |
| Smart-Tactics reactions | `foundation.test.ts`: wounded-ally peel; healthy backline Assassin dive; channeling enemy; Nightblade telegraph interception; peel target priority and lock. `combat.test.ts`: Nami cast requirements/cooldown, Deadeye targeting/channel/interrupt/execute, Shadow Blink/Executioner/Phantom Flurry. |
| Critical-ally override | New `foundation.test.ts` cases prove an ally below 20% HP breaks a different active 25-tick peel lock, while an ally at exactly 20% does not. |
| Aggressive target validity | `foundation.test.ts`: chooses a visible/detectable enemy within the 12-hex anchor leash, routes to an adjacent engagement hex, rejects targets outside 12 hexes, breaks equal-distance ties by unit ID, and waits for an adjacent friendly brush scout before pursuing a concealed occupant. |
| Macro posture | `foundation.test.ts`: Aggressive pursues visible enemies within its leash; Defensive holds; Retreat routes to Core then returns to Defensive hold; Gather routes to the nearest camp; Outrider scouts, alerts once, projects owner-only alert, and rallies. |
| Idle fallback | New `foundation.test.ts` case proves a standard Defensive platoon with no order/reaction remains at its anchor. |
| Formation/route state | `foundation.test.ts`: four-platoon order model, rank/slot limits and march ordering, no teleporting distant members, stable routing and validation. `pathfinding.test.ts`: gates, blockers and breached-wall routes. |
| Match timing/results | `foundation.test.ts`, `blessings.test.ts`, `combat.test.ts`, and `bot.test.ts`: fixed phase/Rite boundaries, overtime, respawn, terminal tie-break, and scheduled events. |
| Seeded match acceptance | `pacing.test.ts`: seeds 1, 2 and 42 reach legal Core-collapse results; no rejected bot commands; 5:00/10:00 checkpoints validate; event IDs exactly match the schedule; gold, XP, materials, arsenal and relic ledger deltas reconcile. Seed 7 reaches the 18:00 draw and checks 5:00/10:00/15:00/18:00 income and state checkpoints. |

**Historical verification 2026-10-24:** full `npm test` passed 146 tests across 16 files; typecheck/build, browser smoke and visual harness at `http://127.0.0.1:5175/` passed at that checkpoint. At that historical checkpoint S2-2 remained open; the accepted 2026-10-24 scope recorded above supersedes that status. TechnicalPlan 03's 55% trigger, 65% release, 25-tick lock, below-20% override and channel reaction are represented in tests.

**Reopened audit finding:** the prior matrix did not directly assert Explicit Order > Outrider macro. Added `foundation.test.ts` coverage that enters Outrider mode, issues an explicit waypoint and verifies the waypoint route remains authoritative. Focused run: 27/27 tests pass. Reviewed `TechnicalPlan/03` plus canonical Glossary §8.3 against the tests above. Explicit-order priority has direct cases over Outrider, Aggressive, Gather, Defensive peel and active channels; reactions over macro posture include wounded-ally peel and backline Assassin dive; macro and idle paths are directly covered. The latest full regression passes 146/146. This historical entry records machine evidence; the later defined-scope S2-2 acceptance at the top supersedes its open status. The earlier Jev result (Yes, 76% confidence) is not gate acceptance.

## S2-4 — Fixture and visual acceptance

### Valid / invalid / boundary fixture matrix

| Fixture system | Valid behavior | Invalid behavior | Boundary behavior | Evidence |
|---|---|---|---|---|
| Command cards/hand | Cast a real card and apply its window/effect | Reject missing card | Six-card hand and 15-second overflow expiry | `shared/src/cards.test.ts` |
| Rites/blessings | Pick an offered blessing; use one reroll | Reject an unoffered pick | Opening/5:00/10:00 Rites and deadline auto-pick | `shared/src/blessings.test.ts` |
| Items/crafting/equipment | Buy, craft, equip and retain through respawn | Reject invalid craft/equip without spending resources | Interrupted/refunded channels and 18:00 terminal tick | `shared/src/items.test.ts` |
| Landmine trap | Place on visible field/jungle and trigger on enemy entry | Reject hidden or castle placement without consuming card | 12-tick warning fuse, one-hex damage/slow, and visibility projection | `shared/src/traps.test.ts` |
| Nami skill/status | Cast on aligned valid targets and apply stun | Reject single target/out-of-range; cooldown blocks recast | Two-second stun expiry and level-3 line behavior | `shared/src/combat.test.ts` |
| Deadeye/Shadow Blink representative skills | Channel, execute/dive and hit valid targets | Stun or explicit order interrupts/cancels | Channel timing, execute thresholds, cooldown reset and untargetability window | `shared/src/combat.test.ts`; `shared/src/items.test.ts` |
| Bosses/relics | Spawn, abilities, summons/minion combat, damage, reward and claim | Exactly-half buff boundary, capped final-hit attribution, proportional bounty, +20% last-hit gold, cooldown edges, leash reset | 30-second warning and 30 uninterrupted relic ticks | `shared/src/bosses.test.ts` |
| Facilities/structures | Build/upgrade/payout, barrier and battery effects | Reject unowned/occupied/wrong-category slots | Category cap, tier thresholds, minute payout, Ballista start/cooldown, wall/core breach | `shared/src/facilities.test.ts`, `shared/src/structures.test.ts` |
| Vision/event projection | Project cues for visible/detectable units | Hide unseen combat cues and concealed endpoints | Brush detection, wall/obstacle LoS and visibility changes | `shared/src/vision.test.ts`, `shared/src/traps.test.ts`, `shared/src/items.test.ts` |

### Stage 2 visual evidence

The visual harness was rerun against `http://127.0.0.1:5175/` on 2026-10-24 using `node scripts/stage2-visual-acceptance.mjs`; no browser errors occurred, the client stayed at 65% tactical zoom, and timed effect arrays cleared after their display windows.

| Capture | Evidence |
|---|---|
| Boss warning | [stage2-visual-boss-warning.png](stage2-visual-boss-warning.png) â€” banner and fog-revealed west objective marker after minimap pan; Web Audio horn asserted |
| Boss ability | [stage2-visual-boss-ability.png](stage2-visual-boss-ability.png) â€” authoritative Tusk Charge event with visible effect pulse |
| Card cast | [stage2-visual-card-cast.png](stage2-visual-card-cast.png) |
| Skill cast | [stage2-visual-skill-cast.png](stage2-visual-skill-cast.png) — same tick/frame as the skill hit and status application |
| Skill hit | [stage2-visual-skill-hit.png](stage2-visual-skill-hit.png) |
| Status applied | [stage2-visual-status-applied.png](stage2-visual-status-applied.png) — same tick/frame as Nami's cast/hit |
| Status expired | [stage2-visual-status-expired.png](stage2-visual-status-expired.png) |
| Trap placed | [stage2-visual-trap-placed.png](stage2-visual-trap-placed.png) |
| Trap warning | [stage2-visual-trap-warning.png](stage2-visual-trap-warning.png) |
| Trap detonation | [stage2-visual-trap-detonation.png](stage2-visual-trap-detonation.png) |

The eight earlier names represent six unique screenshot frames; the three Nami names intentionally alias the same-tick event frame. These prior captures show the card, skill/status and trap sequence at 65% zoom. Current boss visual/audio acceptance ran on 2026-10-24 using the live Vite client at `http://127.0.0.1:5175/`; the harness asserted the boss warning callback, two Web Audio oscillator starts, banner text, and an authoritative ability event, then completed the card/skill/status/trap sequence with no browser errors and cleared timed effects. The warning hex was manually reviewed after panning to the west camp; the ability pulse was manually reviewed at 65%.

Prior Jev checks were Yes at 79% for readability and 68% for matrix completeness; they are confidence values in earlier judgments, not future probabilities. Current visual/audio evidence is from the 2026-10-24 harness run described below. Captures were taken at 65% tactical zoom; the log does not claim a separate 100% zoom review.

**Provisional fixture rules remain provisional:** Ancient one-hex-per-second pursuit cadence, Landmine's one-hex blast radius and magic-resistance damage type, Nami's three-hex reach, and the five-second facility construction duration are unspecified by source rules.

**S2-4 evidence recorded 2026-10-24:** the source-backed Ancient counterplay is executable. At one-second movement intervals it pursues the nearest living enemy within four hexes if outside its two-hex attack reach; movement strips stationary defense on that tick, and the bonus returns once it stops. This cadence is explicitly provisional because the source gives no speed. Tests prove the Ancient does not move before the cadence boundary, moves one path hex at the boundary, takes more damage on that movement tick, and regains defense on the next stationary tick. Boss tests also cover capped damage attribution, proportional gold/XP, last-hit bonus, Stormwing/Emperor cooldown edges, minion behavior, leash, Titan Slam line roots, hidden boss-event suppression and relic-to-Arsenal transfer. Bot tests cover all three objective windows and dispatching Platoon 2 when an enemy has damaged a boss below half HP, including the exact-half and no-enemy-damage boundaries. Earlier visual harness and manual screenshot review passed for warning/horn/banner/fog-highlight, Tusk Charge, card, skill/status and trap cues at 65% tactical zoom. Five traps and Falcon Recon detection remain verified. The full 25-card catalog remains Stage 3 scope. This historical note is superseded by the S2-4 acceptance recorded at the top of this log.

**Cartoon prop rendering update — 2026-10-24:** connected `environment-props-cartoon.png` to the live Pixi renderer, cropped into eight atlas frames and scaled to 1.3x for readability at default 100% zoom. Tree/canopy/fence/boulder props are visual-only, passable and transparent to sight. Brush alone preserves concealment behavior. `npm run build`, browser smoke, 100% event visual acceptance and five-region terrain review pass; UI player-vs-bot playthrough reached enemy Core collapse at 8:48. S2-4 is accepted.

## S2-6 — still open

- [x] Re-ran the active seeded match/resource suite on 2026-10-22; it passes with exact scheduled-event matching and per-tick resource reconciliation. The prior measured results remain: seeds 1/2/42 collapse at about 10:03–11:10 and do not reach 15:00; unattended seed 7 reaches the 18:00 draw.
- [x] Current-tree scripted player-vs-bot browser playthrough passed twice: Victory by enemy Core collapse at 8:13 and 8:56, no page errors. The script orders through camp, both wall layers and the Core at 24× speed. It uses the live camera transform for map clicks; the decorative compass now allows battlefield clicks underneath. Both runs end before 15:00 and are not a human game-feel review.
- [ ] Review active-match economy and ensure no stranded platoons/blocked result under human play conditions.
- [ ] User completes a human-vs-bot match and records game-feel, strategic choices and HUD load at 5:00, 10:00 and 15:00. The automated 18:00 draw does not substitute for this human review or for an active-match 15:00 pacing observation.
