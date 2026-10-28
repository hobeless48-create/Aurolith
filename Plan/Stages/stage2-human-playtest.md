# Stage 2 human-vs-bot playtest

**Separate automated evidence (2026-10-26):** A defensive HUD scenario reached active 15:00 overtime and an 18:00 wall-damage defeat. These are machine observations, not this human playtest; the fields below remain unfilled. [Evidence](stage2-late-game-2026-10-26.md).

**Status:** Functional feedback received through 2026-10-26: most functions work, balance was not assessed, and subtle skill/stun cues were unclear. Character-art markers and readable status/cast labels are now implemented and automatically checked; user review of them remains open. Exact human match result and timed observations remain unrecorded; S2-6 is open.  
**Build:** http://127.0.0.1:5173/  
**Server handoff:** HTTP 200 confirmed on 2026-10-25; existing local server left running. [Session context](stage2-session-handoff-2026-10-25.md).  
**Match speed:** 1× normal  
**Opening camera:** Player fortress at 100% zoom; drag or use the floating map to explore  
**Current behavior to review:** trees, canopy, fences and boulders are decoration you can move and see through; brush conceals units; Retreat stops attacks and sends the platoon home.  
**HUD update to review:** the left region-jump rail is removed; the board fills the scene beside a right-side control rail. The floating keyboard-help panel opens with `?` or `P`; `O` pauses/resumes. Check the right-rail grouping and confirm the battlefield has no scroll bar.  
**Stage 2 plan:** [stage-2-complete-match.md](stage-2-complete-match.md)  
**Acceptance evidence:** [stage2-acceptance-log.md](stage2-acceptance-log.md)

## How to run

1. Open the build URL and start a new match.
2. Play naturally at 1× speed. Use the right-rail controls; press `P` or click the small `?` button for keyboard help, and use `O` or the match button to pause/resume. Expand management sections to use roster, hiring, training, crafting and facilities.
3. Use the floating map in the upper-left to jump around. Gold dots mark your living units; red dots mark enemies your army currently spots. The white outline shows the camera view.
4. At 5:00, 10:00 and 15:00 simulation time, record the observations below. Note the in-game clock and whether the match is still active.
5. If the match ends before 15:00, record its exact end time and reason. That is useful pacing evidence; do not estimate or fill in a 15:00 state that was not reached.
6. At the end, report whether any platoon became stranded, any resource change was unclear, or the result became blocked or confusing.

## Match details

### Initial user feedback - 2026-10-25

**Detailed follow-up (2026-10-26):** User said there was not much to do in the current fixture, so they did not test balance. Most functions work properly, but small changes such as stun/skills were not clear beyond numbers, with the missing unit presentation noted. Recorded as functional feedback only. In response, the battlefield now has existing-art character markers, HP bars and explicit skill/status labels, verified at 100% by the event-driven harness. [Changes and evidence](stage2-readability-and-hud-2026-10-26.md). Ask for human review when ready; no timed match values are inferred.

**Follow-up (2026-10-26):** User reports most functions are usable. Requested that jungle access paths end at the forest front rather than extend into its center; paths now stop at the battlefield-side entrances. No exact result/time or 5/10/15-minute observations were supplied.

- UI looks good; most functions work, according to the user's play experience.
- Initial concern: base-to-base spacing feels short relative to the overall map. The user then chose fortress-to-jungle speed paths instead of expanding map height.
- Implemented response: four mirrored front-gate road branches; +10% path movement bonus; travel-cost-aware routing. [Change record](stage2-jungle-access-paths.md).
- Still needed: user review of jungle access/road speed, exact match result/time, and 5/10/15-minute observations where reached. No values are inferred for the blank fields below.

- Date/time:
- Match seed, if shown:
- Opening Rite/blessing:
- Match result and exact in-game end time:
- Did the match remain active at 15:00? Yes / No
- Any rejected command or browser error:
- Was the 100% opening view close enough to read the battlefield while still showing useful context?
- Was it clear how to use the floating map, camera outline, gold unit dots and red spotted-enemy dots?
- Could you quickly find the current match state, select a platoon and issue an order? Were the collapsed sections and shortcut labels easy to understand?
- Did the strategy shortcuts work from the controls and battlefield without interfering with typing or dropdown choices?
- Did map clicks put the camera where expected without changing zoom?
- Did scenery make jungle, field, fortress, walls and the central path easy to distinguish? Did any decoration look like a blocker?
- Did units move through tree, canopy, fence and boulder scenery while brush concealment still behaved as expected?
- When you used Retreat, did the platoon stop fighting and regroup clearly?

## 5:00 checkpoint

- Core and wall state:
- Gold/resources and whether the economy feels understandable:
- Platoon positions, orders and any unit that seems stuck:
- Available choices and whether the next useful action is clear:
- HUD readability, information overload or missing information:
- Game feel / pacing:

## 10:00 checkpoint

- Core and wall state:
- Gold/resources and whether the economy feels understandable:
- Platoon positions, orders and any unit that seems stuck:
- Available choices and whether the next useful action is clear:
- HUD readability, information overload or missing information:
- Game feel / pacing:

## 15:00 checkpoint

- Match active? If not, exact end time and reason:
- Core and wall state:
- Gold/resources and whether the economy feels understandable:
- Platoon positions, orders and any unit that seems stuck:
- Available choices and whether the next useful action is clear:
- HUD readability, information overload or missing information:
- Overtime transition/pacing, if reached:

## End-of-match review

- Did the match complete to a clear result?
- Did any scheduled Rite, card draw, boss or phase transition appear to be skipped?
- Did any platoon fail to move, fight, retreat or return to its formation when expected?
- Was any resource increase/decrease unexplained by a purchase, reward, income tick or other visible event?
- What felt too fast, too slow, unclear, frustrating or satisfying?
- What should be changed before Stage 2 closes?
