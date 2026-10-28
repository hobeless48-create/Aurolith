# Aurolith — Current State and Detailed Checklist

- [x] Automated late-game HUD scenario (2026-10-26): ordinary recruitment/training/defensive facilities reached active overtime at 15:00 and a wall-damage defeat at 18:00, without simulation overrides or page errors. Fixed facility category counts and disabled invalid builds with reasons; production build/type checking and expanded category-cap HUD smoke pass. Human S2-6 review remains open. [Checkpoint record and captures](Stages/stage2-late-game-2026-10-26.md).


**Updated:** 2026-10-26 (readable combat markers, facility-cap HUD, and automated overtime/result verified)  
**Current location:** Stage 2 — complete local browser match  
**Work status:** Stage 2 remains in progress. S2-1 through S2-5 are accepted. S2-6 and the Stage 2 exit gate remain open for the user human match and 15:00 pacing review.
**Human review:** The user reports most functions work but has not tested balance and finds skills/stun difficult to see with the earlier plain unit markers. Existing character-art markers and readable status/cast labels now address that report and await user review. Exact human match result and 5:00/10:00/15:00 observations remain unrecorded; use `Stages/stage2-human-playtest.md` at `http://127.0.0.1:5173/` for the remaining S2-6 evidence.
**Project root:** `C:\Users\s0846\Desktop\Files\ExGame\Aurolith`  
**Stage 2 source plan:** [Stages/stage-2-complete-match.md](Stages/stage-2-complete-match.md)  
**Current execution notes:** [Stages/build-process.md](Stages/build-process.md)  
**Pacing evidence:** [Stages/stage-2-pacing-audit.md](Stages/stage-2-pacing-audit.md)
**Latest handoff:** [2026-10-25 session handoff](Stages/stage2-session-handoff-2026-10-25.md) - read this first in the next session.
**Live game:** http://127.0.0.1:5173/ - HTTP 200 confirmed for this handoff; existing server left running.

This is the resume checklist: it records what is done, the evidence available, and every remaining stage-plan gate. Detailed game rules remain in `Plan/Data/` and `Plan/TextPlan/`; technical authority and decisions remain in `Plan/TechnicalPlan/`. Do not treat a task as accepted just because code exists: use its stated verification and update the source stage plan when evidence is reviewed.

## Current status and next action

- [x] Requirement audit and Outrider visual check (2026-10-26): live Canvas checks prove the owner-only ambush ring is correctly positioned, expands and expires; opponent-only alerts produce no ring. Production build/type checking passes. [Gate-by-gate audit and evidence](Stages/stage2-gate-audit-2026-10-26.md). S2-6 human review remains unchecked.


- [x] Combat readability/HUD review (2026-10-26): existing character art now appears in battlefield markers with HP bars and explicit status/cast labels; markers follow player-view visibility. Fixed the effect pause hook and defeat wording. Latest build, expanded HUD smoke, 100% boss/card/Nami-stun/trap effect harness and complete browser match scenarios pass. Attacking victories at 7:50 and 7:47; unattended defeat at 11:09 with correct own-Core wording. [Full evidence and screenshots](Stages/stage2-readability-and-hud-2026-10-26.md).

- [x] Entrance-only path revision (2026-10-26): shortened the four branches to `(30,29)`, `(119,29)`, `(30,60)` and `(119,60)` and clipped road shoulders to the battlefield. Fresh full suite **171/171 across 17 files**, build/type checking and browser overview capture pass. [Current screenshot](Stages/stage2-jungle-entrances-20261026.png). User reports most functions are usable; formal match/checkpoint evidence remains open.

- [x] Jungle access update: four mirrored front-gate paths to both jungle flanks, +10% road speed in all player-unit movement, and travel-cost-aware A*. Map remains 150 by 90. **Fresh full suite: 171/171 across 17 files; build and five-region 100% captures pass.** [Rules, feedback and screenshots](Stages/stage2-jungle-access-paths.md).

- [x] Updated the [new-session handoff](Stages/stage2-session-handoff-2026-10-25.md) with current character markers, readable skill/status cues, entrance-only paths, user feedback and remaining gates. Shared regression is 171/171 across 17 files on 2026-10-26; fresh client build, HUD smoke, effects and match scenarios pass as detailed above.
- [x] Post-layout HUD interaction follow-up completed: smoke opens groups through their summaries and verifies help/P, pause/O, select-field guards, roster/formation, stance/focus/macros/cards, hiring/training, facilities, material purchase/craft/equip, orders and reset. Human S2-6 balance/pacing review remains open.

- [x] Painted terrain pass (2026-10-25): generated and integrated five PNG ground materials for field, jungle, path, courtyard and rampart; reduced color overlays so painted detail shows. Build and five-region 100% terrain capture check passed. [Art notes and screenshots](Stages/stage2-painted-terrain.md). Human readability/game-feel acceptance remains in S2-6.

- [x] Recorded the current process and detailed stage checklist here, then resumed the Stage 2 gates when the user directed continuation.
- [x] Recovered and applied the platform decision from the prior session titled **“Choose a platform for Aurolith”** (2026-10-19): PC web browser, mouse/keyboard, TypeScript + Vite + PixiJS; local solo first, online later. This is also recorded in `TechnicalPlan/14`. The original history and the technical plan agree.
- [x] Reviewed the Stage 2 handoff and current Stage 2 plan. Preserve the 150×90 map, 18:00 match limit, deterministic shared simulation, and representative fixture-content scope. Stage 3 owns full-catalog expansion.
- [x] Current verification (2026-10-24): full regression passes 164/164 tests across 16 files; production build, browser smoke, 100% event-centered visual harness and five-region terrain review pass. A UI player-vs-bot match reached enemy Core collapse at 8:48. Retreat now stops unit, camp and structure attacks; scenery props are passable and transparent to LoS while brush concealment and structural walls remain. Five terrain captures were refreshed and inspected.
- [x] Pre-playtest usability update: clearer region/navigation labels; opening camera at the north player's fortress at 100% zoom; persistent floating full-map panel with click-to-jump and viewport outline; gold friendly-unit markers and red currently spotted enemies; deterministic decorative detail for jungle, fields/clearings, highway and fortress/walls. Scenery is cosmetic and does not change pathing or vision. Browser smoke checks opening zoom, map jump and zoom retention. Screenshot: [stage2-ui-refresh.png](Stages/stage2-ui-refresh.png).
- [x] HUD organization pass (2026-10-25): condensed live match state, grouped controls into tactical orders/cards and expandable roster/economy/equipment sections, displayed existing shortcuts beside actions, and made strategy shortcuts available throughout the match UI except while editing fields. Updated the S2-6 observation sheet; human readability review remains open.
- [x] HUD layout follow-up (2026-10-25): removed left region navigation, expanded board area, kept match controls in the right rail, and added a floating keyboard guide toggled by `?` or `P`. Moved pause/resume to `O`; the board viewport has no scroll bar and the rail scrolls independently. Narrow layouts move the rail below the board.
- [x] Fresh verification after the usability update: `npm test -- --maxWorkers=1` passed **146/146 tests across 16 files**; `npm run build` passed shared/client/server typecheck and production Vite build; browser smoke passed against http://127.0.0.1:5175/ including map navigation.
- [x] Earlier scripted UI playthroughs completed camp, both wall layers, Core collapse and restart at 8:13 and 8:56 at 24x speed. After the decorative scenery and Retreat changes, the current UI player-vs-bot run ended by enemy Core collapse at 8:48; these automated runs do not provide the required human 15:00 review.
- [x] S2-2 command/reaction gate (accepted for defined source behavior). Covers 12/13 Aggressive range, pathability, detection, target ID ties, explicit-order/reaction/macro priority, peel/channel responses, Retreat speed and no-attacks disengagement against units/camps/structures. Per the user, Glossary-only Aggressive dive below 25% and Defensive kite below 60% remain provisional and are not claimed or required here. Current full suite: 164/164. See [stage2-acceptance-log.md](Stages/stage2-acceptance-log.md).
- [x] S2-4 fixture/visual gate (accepted 2026-10-24). Representative fixtures pass valid/invalid/boundary coverage; illustrated 2D PNG props and vector terrain render in Pixi; five 100% regional screenshots and event-centered cue captures were inspected. Tree, canopy, fence and boulder props are decorative, passable and transparent to LoS; brush still conceals units. Full regression/build/smoke/visual harness pass. See [stage2-acceptance-log.md](Stages/stage2-acceptance-log.md).
- [ ] S2-6 full-length human gate. The user must complete/review a human-vs-bot match and record game feel, strategy, HUD and pacing at 5:00, 10:00 and 15:00; active bot seeds collapse before 15:00. Also check scenery passability, brush concealment, Retreat clarity, stranded platoons and blocked results. Use the [S2-6 observation sheet](Stages/stage2-human-playtest.md); automation cannot supply this judgment.
- [x] **Cartoon terrain art pass (2026-10-24):** hand-authored repeating 2D vector patterns cover field, jungle, path, courtyard and rampart surfaces. The illustrated 2D PNG prop atlas renders in Pixi at 1.3x sizing. Props are decoration; brush tiles retain concealment. Build and five-region visual review pass; S2-4 is accepted.
- [ ] After the user's review, record observations, fix any findings, rerun affected checks, and decide whether Stage 2 exit criteria are met.
- [x] Started the Vite client at `http://127.0.0.1:5173/` on 2026-10-24 for the current playtest handoff. Browser smoke and the event-centered visual harness pass there. Keep this server available for the user playtest. Development-only visual hooks are in `client/src/main.ts`; the acceptance harness is `scripts/stage2-visual-acceptance.mjs`.

## Platform and technical direction

- **Target:** PC browser game, mouse and keyboard. No native desktop package is planned.
- **Stage 2 target:** complete local solo match against a bot, playable through the ordinary browser UI.
- **Architecture:** strict TypeScript workspaces: `shared/` owns deterministic rules/simulation and contracts; `client/` owns Vite, PixiJS battlefield rendering and DOM HUD; `server/` is for later online authority. Renderers consume player-view state and must not own game rules.
- **Later delivery:** Stage 3 expands the content catalog; Stage 4 adds authoritative online 1v1; Stage 5 replay, accessibility, performance and polish; Stage 6 deployment and support.
- **Rule authority:** `Plan/Data/` governs data-driven content; `Plan/TextPlan/01` governs core map/timeline/walls; `Plan/TextPlan/05` governs cards; `Plan/TechnicalPlan/14` is the roadmap/decision entry point. Mark fixture assumptions provisional where source rules are silent.
- **Platform history:** the “Choose a platform for Aurolith” session selected PC browser to fit the existing PC RTS/deckbuilder and direct playable review. The user's role is creative direction/game-feel review; implementation and repeatable technical verification are handled in the project workflow. The decision and Jev confidence are recorded in TechnicalPlan/14; confidence describes the judgment, not a forecast of project success.

## Stage 0 — Rules and foundation: complete

Source: [stage-0-rules-and-foundation.md](Stages/stage-0-rules-and-foundation.md)

- [x] S0-1 Workspaces, strict TypeScript configuration, and install/typecheck/test/build scripts.
- [x] S0-2 Rule inventory maps mechanics to authoritative data/text sources; fixture choices are labeled; source references are tested.
- [x] S0-3 Five known rule conflicts and adopted baseline values recorded in TechnicalPlan/14 and canonical sources.
- [x] S0-4 Stable IDs, typed commands/state, seeded RNG, fixed tick, validation, determinism and state-hash coverage.
- [x] S0-5 Seven unit definitions plus camp/wall/card fixtures; selected 15 images decode and are included in production output.
- [x] Exit verification recorded 2026-10-19: install, build/typecheck and 11 tests passed.

## Stage 1 — Playable vertical slice: complete

Source: [stage-1-playable-slice.md](Stages/stage-1-playable-slice.md)

- [x] S1-1 Render and navigate the 150×90 hex board; pan/zoom, minimap, resize and accurate click selection.
- [x] S1-2 Recruit and command units; apply stance/focus; reject invalid orders and reflect state in HUD.
- [x] S1-3 Deterministic movement/combat/death/respawn; clear a jungle camp and breach both wall layers.
- [x] S1-4 Opposing bot, victory/defeat result and restart using the command interface.
- [x] S1-5 User-facing browser path through recruit, orders, camp, breaches, result and restart without developer controls; smoke and playthrough recorded.
- [x] Exit evidence recorded 2026-10-19: production build and 67 tests passed at that checkpoint; subsequent Stage 2 runs also exercised the full local match loop.

## Stage 2 — Complete local match: in progress

Source and acceptance criteria: [stage-2-complete-match.md](Stages/stage-2-complete-match.md)

### Acceptance gates

- [x] **S2-1 — Fixture board and visibility.** 150×90 map, zones, camera/minimap, blockers, three-state fog, jungle vision, structure footprints, projected enemy view, and obstacle-aware vision/combat. Tests cover hidden information and obstacle visibility.
- [x] **S2-2 — Simulation, commands and reactions (accepted for defined source behavior).** Explicit-order, reaction, macro, idle, timing and outcome coverage passes. Tests cover the 12/13 Aggressive leash, target ties, concealment detection/pathability, priority, peel/channel boundaries and Retreat speed/disengagement across combat contexts. The user explicitly kept the Glossary-only 25% dive and 60% kite rules provisional; these are unimplemented and excluded from S2-2 acceptance. Full suite 164/164; see `Stages/stage2-acceptance-log.md`.
- [x] **S2-3 — Fixture economy and recruitment.** Passive income, hire escalation, commander/unit levels, deterministic unlocked Guild, Academy training, six facility sockets per castle, fixture Caravan Post/Ballista and facility upgrades are implemented and tested. Resource-ledger accounting includes gold, XP, materials, arsenal and relics. Full catalog is Stage 3.
- [x] **S2-4 — Representative tactical systems, fixtures and visuals (accepted 2026-10-24).** Valid/invalid/boundary fixtures, five 100% terrain views and event-centered cue capture are recorded. User-requested decorative props are passable/transparent to sight, while brush retains concealment. Full suite, build, smoke, visual harness and match UI playthrough pass.
  - [x] Implemented representative systems: six-card hand/overflow and casts; three-choice Rite with one reroll; fixture items, crafting and equipment; Nami Watery Grave and status timing; Alchemical Landmine; shared bosses/relics; representative facilities and event-projected PixiJS cues.
  - [x] Captured card cast; same-tick Nami skill cast/hit/status applied; status expiry; trap placed/warning/detonation and boss cues at 100% zoom. Named aliases and timing are in the acceptance log.
  - [x] The visual harness drove a living unit into a legally placed trap through the real simulation; warning and scheduled detonation were reached. Timed pulses clear after their display windows.
  - [x] Inspected refreshed 100% images for cue legibility, target/tile association and cartoon prop readability; renderer tracks visible unit positions each Pixi ticker; vision tests check hidden endpoint suppression and detection.
  - [x] Valid/invalid/boundary fixture matrix per representative system is recorded in the acceptance log. Coverage includes:
    - [x] Cards: legal cast/draw, overflow timing and hand limits, extra draw/cast, invalid missing card, Phalanx requirement/window, active effects and camp rewards.
    - [x] Rites/blessings: three offers, reroll, unoffered rejection, deadline auto-pick, exact 0/5/10-minute timings and effects on economy/camp.
    - [x] Items: valid purchase/craft/equip/respawn; invalid craft/equip without spending resources; interruption/refund, keep vs field equip, retention and 18:00 terminal boundary.
    - [x] Traps: legal visible placement; hidden/castle placement rejection without consumption; enemy-only trigger, 12-tick fuse, one-hex damage/slow, concealment and fog projection.
    - [x] Skills/combat statuses: Nami aligned-target success; single/out-of-range rejection, cooldown and stun duration; Deadeye channel/interrupt/execute and Shadow Blink/Executioner representative cases.
    - [x] Bosses/relics: 30-second warnings, unique spawn, strict-majority reward vs last hit, exactly-half no buff, uninterrupted 30-tick relic claim, visibility and objective buffs.
    - [x] Facilities/structures/vision: ownership/slots/category cap/duplicate potency, tier costs and minute payout, Ballista start/cooldown, barriers/sanctuary, wall layers and fog/obstacle cases.
    - [x] Reconciled this inventory against every representative system and boundary named in the S2-4 plan; see `Stages/stage2-acceptance-log.md`.
  - [x] Documented source-unspecified values as provisional: Ancient one-hex-per-second pursuit cadence, Landmine one-hex blast radius and magic-resistance damage type, Nami three-hex reach, and five-second construction duration.
- [x] **S2-5 — Match HUD and short browser acceptance.** Right rail includes roster, card dock, Guild, Rite and facility controls; the floating battlefield map handles overview/navigation; tooltips and pinned rejected-command status remain visible. Smoke checks render, Rite, card, clock, hire, facility construction, order and reset. Two UI-driven player-vs-bot runs completed, with no page errors.
- [x] **Pre-playtest usability refinement.** Verified 100% home-fortress opening, floating clickable map and retained zoom after map jump; player-view projection supplies red enemy markers only when spotted; deterministic terrain accents cover jungle, field/clearing, highway, fortress and wall tiles. Cosmetic scenery does not change walkability. Human review of readability remains in S2-6.
- [ ] **S2-6 — Full-length checks and human game-feel review.** Current pacing tests confirm active bot seeds 1/2/42 end between 10:00 and 15:00; unattended seed 7 reaches 18:00. UI player-vs-bot run: enemy Core collapse at 8:48. **Remaining:** the user completes a human-vs-bot match and assesses strategic choices, HUD/game feel and active-match pacing at 5:00, 10:00 and 15:00; check for stranded platoons and blocked results in that play.
- [ ] **Stage 2 exit.** Keep open until the S2-6 human-vs-bot match and 5:00/10:00/15:00 game-feel/pacing observations are recorded and reviewed.

### Stage 2 implementation map

- [x] **Board/vision:** full board, mirrored blockers and terrain, A* routes, camera/minimap, brush concealment, projected player view, wall/terrain LoS and visible structure footprints.
- [x] **Orders/formations:** four platoons, order validation, full explicit-order/reaction/macro/idle priority, stance/focus, Gather and Outrider macros, editable 3/4/3 rank slots, formation marching/visualization, Retreat and Aggressive pursuit, peel thresholds/override/lock/release and channel reactions; acceptance matrix passed.
- [x] **Combat/match loop:** attacks/armor/XP/death/respawn, camps/rewards/materials/respawn, outer/inner wall layers and Core condition, fixture bot route, 18:00 tie-break, boss schedules/rewards and overtime. Fresh seeded acceptance passed; human long-match play remains open under S2-6.
- [x] **Economy/recruitment:** passive income, hire escalation, thresholds, deterministic Guild, Academy, facility sockets/build/upgrades and fixture facility effects.
- [x] **Cards/Rites:** timed drafts at 0/5/10, three offers, reroll/anti-repeat/auto-pick, six card slots, overflow timer, discard/draw triggers and representative casts including defense, movement, jungle, trap and overtime.
- [x] **Items/status/skills/traps:** Bazaar/craft/equip fixtures, accounting/fog projection, Nami skill/status, Sniper Deadeye, Nightblade Shadow Blink/Executioner and Landmine simulation behavior; full catalog and broader effects remain Stage 3 or later.
- [x] **HUD/input:** local start/pause/reset, resources/clock/hash, roster/selection, cards/tooltips, Rite, orders/stances/macros, hire/facilities and pinned command errors; full match short-path scripts exist.

### Recorded Stage 2 verification and limitations

- [x] `npm test`: 146/146 tests across 16 files, including the added boss reward/cooldown and bot contest/steal cases (2026-10-24).
- [x] `npm run typecheck`, `npm run build`, `npm run smoke`: latest recorded checks passed.
- [x] `npm run stage2:playthrough`: latest current-tree runs completed at 8:13 and 8:56 and restarted without browser page errors; both ended before 15:00.
- [x] `scripts/stage2-visual-acceptance.mjs`: captured boss warning/ability, card, same-tick Nami cast/hit/status, status expiry and trap placed/warning/detonation at 100%, centering each effect event before capture; timed pulses clear. Test hooks are guarded by `import.meta.env.DEV`; details are in `Stages/stage2-acceptance-log.md`.
- [x] Historical 65% trap/card/skill/status and boss warning/ability captures and fixture coverage are recorded at that time. They do not represent review of the refreshed 100% cartoon sprite atlas.
- [x] Re-audited S2-2 against TechnicalPlan/03 and Glossary §8.3; the Aggressive 12/13 range boundary and equal-distance ID tie-break are covered, and the source conflict is resolved.
- [x] Historical verification before the latest 2026-10-24 changes: focused foundation suite 41/41, full suite 160/160, production build, browser smoke and event-centered visual harness pass; refreshed 100% environment screenshot and boss/card/skill/status/trap captures reviewed with hand-authored cartoon terrain patterns and SVG props.
- [x] Reran seeded pacing/resource audit; early active-match collapse and high-bank behavior are documented in `Stages/stage-2-pacing-audit.md`.
- [ ] Human review of a complete human-vs-bot match through the 5/10/15-minute checkpoints, including active pacing and stranded/blocked behavior.

## Stage 3 — Full content and balance: not started

Source: [stage-3-content-and-balance.md](Stages/stage-3-content-and-balance.md)

- [ ] S3-1 Import and validate 80 units, 150 blessings, 25 craftable items, six Divine items, four satchels, 21 regular monsters, three bosses, 18 facilities and 25 command cards; validate counts, IDs, references, unlocks and recipes.
- [ ] S3-2 Implement deterministic reusable effect families; every entry declares supported effect, target and trigger; no inert entry.
- [ ] S3-3 Inventory/connect all art and audio, remaining 22-tile terrain and props, usable fallbacks and visible load errors; profile before using atlases.
- [ ] S3-4 Test class diversity, card/blessing stacking, item compatibility, boss rewards, facility upgrades and death/respawn persistence; no duplicate rewards.
- [ ] S3-5 Record win rate by seed/side, match length, economy, picks, boss contest and wall timing; tune one rule family at a time and replay same seeds.
- [ ] S3-6 Playtest each class and blessing category plus full matches; record discoverability, confusion and dominant choices.
- [ ] Stage 3 exit: full catalog validates, is reachable/usable, cross-system cases pass, and complete matches remain playable.

## Stage 4 — Online 1v1: not started

Source: [stage-4-online-1v1.md](Stages/stage-4-online-1v1.md)

- [ ] S4-1 Server-authoritative shared simulation, two-seat rooms, server tick/seed, command sequence/acks; same accepted inputs match local state hashes.
- [ ] S4-2 Server validates ownership, resources, range, visibility, timing and duplicate commands; forged/repeated actions cannot change unauthorized state.
- [ ] S4-3 Build snapshots after fog resolution; verify captured frames omit hidden units/traps and private hand/blessing data.
- [ ] S4-4 Bound/coalesce updates, interpolate presentation and resync filtered snapshots after slow client/reconnect; no duplicate purchases.
- [ ] S4-5 Private HTTPS/WSS deployment; two browser clients can join, finish and agree on result.
- [ ] S4-6 Test simultaneous actions, phase boundaries, surrender and reconnect; resolve leaks, result disagreement and unexplained rejection.
- [ ] Stage 4 exit: complete two-player match, privacy and reconnect checks pass, solo still works offline.

## Stage 5 — Replay and polish: not started

Source: [stage-5-replay-and-polish.md](Stages/stage-5-replay-and-polish.md)

- [ ] S5-1 Seed/rule-data version/accepted-command log/seek snapshots and playback controls; replay hashes match live checkpoints/end.
- [ ] S5-2 Review selection, orders, damage, cooldowns, fog, card targets, errors, audio and match stats; first match understandable without developer controls.
- [ ] S5-3 Keyboard/focus/labels/readable states and color-independent cues; keyboard-only route through menu, recruit, Rites and result.
- [ ] S5-4 Profile frame time, memory, textures and network queues during crowd fights/full-map movement; record and meet agreed PC/browser budgets on chosen hardware.
- [ ] S5-5 Regression for deterministic rules and browser start/mid-match/win/reconnect/replay; saved seeds reproduce or versioned rule changes are recorded.
- [ ] S5-6 Freeze candidate after full solo/online matches; triage defects; no issue blocks finishing, understanding or replay.
- [ ] Stage 5 exit: reproducible replay, accessibility/regression gates and measured performance pass; release candidate works.

## Stage 6 — Release and support: not started

Source: [stage-6-release-and-support.md](Stages/stage-6-release-and-support.md)

- [ ] S6-1 Pin dependency/content versions; prepare static client, server/domain/HTTPS and backups; fresh deployment works without development files.
- [ ] S6-2 Record deployed-candidate checks for loading/assets/audio/solo/online/reconnect/result/replay.
- [ ] S6-3 Publish the approved build and smoke solo/online from outside the development machine.
- [ ] S6-4 Monitor errors, disconnects, failed commands, loading and player reports; each material failure has reproduction, owner and severity.
- [ ] S6-5 Patch blockers, rerun affected checks, preserve rollback, version rule/data changes.
- [ ] Stage 6 exit: public browser build passes solo/online smoke, replay opens, failures are observable and support/rollback works.

## Resume protocol

1. Read this file, `Stages/stage2-session-handoff-2026-10-25.md`, `Stages/build-process.md`, `Stages/stage-2-complete-match.md`, and relevant technical/rule documents.
2. Check the working tree and current dev-server state before relying on earlier reports; do not overwrite unrelated user changes.
3. Use the live local client at `http://127.0.0.1:5173/` and confirm it loads. If unavailable, run `npm run dev -w client -- --port 5173 --strictPort` from the project root after checking for an existing server.
4. Review `Stages/stage2-readability-and-hud-2026-10-26.md`. When the user is ready, review the new skill/status presentation and record a human-vs-bot match at 1x with exact result/time, 5:00/10:00 observations, and 15:00 notes only if still active; cover choices, economy, HUD/scenery clarity, stranded units and blocked-result behavior. The revised HUD/effect automation is already passing.
5. Implement any playtest fixes and rerun affected tests, pacing checks, build and smoke.
6. Update S2-6 evidence and all status documents from the observed playtest. Keep Stage 2 open until its exit criteria are demonstrably met.

