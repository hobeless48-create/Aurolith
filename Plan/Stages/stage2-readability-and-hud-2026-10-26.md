# Stage 2 HUD and combat readability - 2026-10-26

## Human feedback

The user reports that most functions work properly, but did not assess balance because the fixture offers limited things to do. Small changes such as skills and stun were difficult to see; they mainly saw numbers and noted the missing unit presentation. This is functional feedback, not a completed balance or timed-match review. No exact human result/end time or 5/10/15-minute observations were supplied.

## Changes

- Battlefield units now use existing fixture character artwork in cached circular portrait markers, replacing the plain colored dots. This is an illustrated marker presentation, not a finished animated unit model.
- Gold friendly and red visible-enemy borders distinguish teams; selected platoons keep their selection ring. Markers have visible HP bars.
- Added explicit STUN, ROOT, SLOW, BLIND, CHANNEL and UNTARGETABLE labels. Cast labels identify Watery Grave, Deadeye and Shadow Blink; interrupted channels are labeled too. Text is outlined for contrast against the painted ground.
- Marker visibility is derived only from friendly units and projected visible enemies. Hidden/dead units' cached markers are hidden each update. Readability does not change status duration, skill damage or fog rules.
- The development-only visual pause hook now checks running state rather than the button's exact text, which changed when its O shortcut badge was added. Resuming with O also clears the development effect-time hold.
- Corrected result wording: a defeat by Core collapse identifies the player's own Core; simultaneous Core collapse is described separately from an 18:00 equal-score draw.
- Updated smoke, effects and match scripts to use the minimap instead of removed region buttons and to open expandable management groups through their summaries. Pause/resume helpers tolerate the visible key badge.
- Effects fixture clicks now use the live camera transform and assert the actual trap-placement coordinate; minimap camera jumps do not imply an exact center hex.
- Optional screenshot prefixes preserve older evidence instead of overwriting it.
- Jev selected existing-art markers plus readable status/cast labels with 100% probability. This expresses confidence in that response to the readability problem, not a prediction of human preference.

## Verified evidence

- Production build and shared/client/server type checking passed after the final marker and result-wording changes.
- `npm run smoke` passed with the new markers. It verifies help button/P, O pause/resume, paused clock, native select-field handling, camera/minimap zoom retention, collapsed roster/recruit/build groups, formation rank/slot, Rite, stance/focus, macro buttons/keys, cards, hiring, commander training, Sanctuary construction, material purchases, actual craft completion, compatible-unit equip, move orders and reset.
- Smoke capture prefix: `stage2-unit-hud-final-20261026`. [Opening UI](stage2-unit-hud-final-20261026-initial.png).
- The event-driven visual harness passed boss warning/horn and ability, visible card effect, Nami cast/hit/stun, status expiry, trap placement/warning/detonation, warning audio and timed-effect cleanup at 100% zoom, without page errors. It also asserts visible STUN and WATERY GRAVE unit labels.
- Effects capture prefix: `stage2-unit-visual-final-20261026`. [Skill and stun](stage2-unit-visual-final-20261026-skill-hit.png), [status expiry](stage2-unit-visual-final-20261026-status-expired.png), [trap warning](stage2-unit-visual-final-20261026-trap-warning.png), [trap detonation](stage2-unit-visual-final-20261026-trap-detonation.png).
- Shared regression remains 171/171 across 17 files from the entrance-path revision earlier on 2026-10-26. Subsequent changes here concern client presentation and browser verification scripts; do not describe that suite as a new post-renderer run.

## Match scenario findings

The old attacking script lost while waiting for its target wall to breach; it also exposed the wrong defeat reason text. The revised ordinary-HUD scenario recruits a second reinforcement, builds defensive facilities and uses Defensive/Siege orders while attacking. Gameplay rules were not tuned to make the script win.

Two attacking runs reached enemy Core collapse at 7:50 and 7:47. Commands were submitted through asynchronous real UI interactions, so these are repeated scenario outcomes, not identical accepted-command logs or matching final replay hashes. An unattended local player then lost at 11:09; the browser verified own Core HP was zero and the result said "your core collapsed". Restart and all three scenario outcomes passed without browser page errors.

Current captures: [attacking victory](stage2-playthrough-final-20261026-result.png) and [correct defeat wording](stage2-playthrough-final-20261026-defeat.png). These automated matches ended before 15:00 and do not supply an active human 15-minute review.

S2-6 remains open. Ask the user to review the new markers/cues and strategic choices during a normal match when ready. Do not replace their missing pacing observations with these accelerated automated runs.
