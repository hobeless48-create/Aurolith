# Stage 2 requirement audit - 2026-10-26

Stage 2 is incomplete. S2-2 and S2-4 are accepted for their defined fixture scope; S2-6 and the stage exit remain open. This audit preserves the human-review requirement rather than treating machine evidence as its replacement.

## Requirement evidence

| Gate / requirement | Authoritative implementation or check | Current finding |
| --- | --- | --- |
| S2-2: explicit order > reaction > macro > idle | `shared/src/foundation.test.ts` directly covers waypoint replacement, Aggressive/Gather/Outrider precedence, Defensive peel/channel priority and idle hold | Covered by the recorded 171-test regression; current source cases inspected |
| Aggressive target range, reachability, detection and ID ties | `foundation.test.ts`: range boundary, intact-wall target rejection, brush scouting and roster-order-independent ties | Covered |
| Defensive reaction thresholds and lock | `foundation.test.ts`: wounded ally, healthy backline Assassin dive, channeling enemy, telegraph interception, 25-tick lock, 65% release and below/exactly-20% override | Covered |
| Retreat movement and disengagement | `foundation.test.ts`, `combat.test.ts`, `camp.test.ts`, `structures.test.ts`: home route/speed and no attacks against units, camps or walls | Covered |
| Formation, movement, respawn, phases and results | Foundation/pathfinding/combat/blessings/bot/pacing suites; ordinary-HUD full match scripts | Covered for fixture scope |
| Glossary-only 25% dive / 60% kite | User explicitly chose to keep provisional; action semantics are not defined in the technical Commander rules | Deferred by user direction; not claimed implemented |
| S2-4: cards, blessings, crafting, equipment, traps, skills/statuses, facilities and bosses | Valid/invalid/boundary matrix in `stage2-acceptance-log.md`, with named shared test files | Accepted representative fixtures; full catalog remains Stage 3 |
| Skill cast/hit, card cast, trap warning/detonation, status application/expiry at normal zoom | `stage2-visual-acceptance.mjs`; latest `stage2-unit-visual-final-20261026-*` captures and marker-label assertions | Passed; human clarity review remains open |
| Hidden-event suppression | Shared vision/projection fixtures, player-view filtering in `client/src/main.ts`; owner-filtered browser Outrider check below | Covered for defined fixtures |
| Illustrated terrain and scenery rules | Five-region terrain review; prop atlas/painted material assets; scenery passability/LoS and brush tests | Accepted; human readability review remains open |
| Outrider minimap pulse | New `scripts/stage2-outrider-visual.mjs`, real simulation emission and owner projection through live client Canvas rendering | Passed: correct coordinates, expansion, expiry and opponent filtering |
| S2-6: legal complete browser matches and terminal UI | `stage2-playthrough.mjs`: victories at 7:50/7:47, unattended Core defeat at 11:09, restart | Passed automated scenarios |
| Active 15:00 and 18:00 late-game client | `stage2-defensive-pacing.mjs`: normal HUD commands, exact DOM checkpoints, no balance overrides | Active overtime at 15:00; wall-damage defeat at 18:00; no page errors |
| Human game feel, strategic choice, HUD load, resource clarity, stranded units and timed pacing | `stage2-human-playtest.md`; user reports most functions work, did not assess balance and could not clearly see earlier skill/stun cues | **Incomplete.** No exact human result/time or 5/10/15-minute observations supplied; new markers await user review |

The 171/171 shared regression is the earlier 2026-10-26 run after the entrance-path revision, not a new run for this audit. Current production build/type checking and the targeted Outrider browser check pass. The preceding category-limit HUD smoke and broad effects/match checks retain their separate records. No shared gameplay rules changed in this continuation.

## New Outrider browser evidence

The DEV-only encounter fixture positions a Jungle Stalker and a nearby enemy, then uses the real `stepMatch` detector. It temporarily suppresses fixture-bot commands for that single setup tick. It does not inject an alert directly. The browser observes the actual minimap Canvas arc/stroke calls, checks their coordinates against the projected event, verifies expansion and timed cessation while paused, and repeats with a south-owned encounter to assert zero projected events and zero alert-ring strokes on north's map.

- [Raw results](stage2-outrider-final-20261026.json)
- [Own alert pulse](stage2-outrider-final-20261026-owner-pulse.png)
- [Expired pulse](stage2-outrider-final-20261026-expired.png)
- [Opponent alert filtered](stage2-outrider-final-20261026-opponent-filtered.png)

The raw record reports one north event at `(76,40)` and twelve observed ring draws, with correct coordinates and expiry. The south fixture emits one south-owned simulation alert but projects zero events and draws zero rings for north. No browser page errors occurred. These controlled encounters prove the visual pipeline, not human Outrider strategy or game feel. Jev selected this verification step with 100% confidence in that judgment, not a prediction of player satisfaction.

## Remaining exit condition

Retain S2-6 unchecked until the user reviews an actual match and supplies the human observations. Record an early result exactly if the match ends before 15:00; do not invent an unreached checkpoint. If the review identifies a problem, implement and verify the resulting correction before closing the stage. No balance or full-content acceptance can be inferred from the current functional feedback.
