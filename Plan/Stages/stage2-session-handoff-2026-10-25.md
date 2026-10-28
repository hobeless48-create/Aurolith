# Aurolith session handoff - 2026-10-25

**Current gate audit:** Read [the 2026-10-26 requirement matrix](stage2-gate-audit-2026-10-26.md). The last distinct visual gap, Outrider minimap owner projection/rendering/expiry, now has passing browser evidence and captures. Only human S2-6 acceptance remains among these gates; do not close it using automated records.


**Newest continuation, 2026-10-26:** [Late-game verification and facility HUD correction](stage2-late-game-2026-10-26.md): ordinary-HUD defensive match active at 15:00, ended at 18:00 by wall damage. Automated observations do not fill the human playtest sheet. Category-limit feedback is now shown before attempting a build. Read this alongside the readability continuation below.


**Read first for the current build:** [HUD and combat readability continuation, 2026-10-26](stage2-readability-and-hud-2026-10-26.md). HUD, effects, victory/defeat and restart checks are now passing; only the human S2-6 review remains open among these gates. Earlier 2026-10-25 follow-up notes below are historical where superseded.

The user is switching to a new session after the UI and painted terrain updates. Leave the local server running. Stage 2 is incomplete; no human playtest result or checkpoint observations have been recorded.

**Latest continuation (2026-10-25):** The user has since tried the game and reports the UI looks good and most functions work. They chose fortress-to-jungle speed paths instead of increasing map height. Four mirrored branches are implemented, along with the planned +10% highway speed and travel-cost-aware routing. Fresh suite: **171/171 across 17 files**, build and five-region terrain captures pass. Read `stage2-jungle-access-paths.md` for current rules, feedback and screenshots. Exact human match results/checkpoints and the post-layout HUD interaction-smoke follow-up remain open.

## Start here

**Latest HUD/readability continuation (2026-10-26):** The user clarified that their review was functional, not balance testing, and that skills/stun were hard to see without unit presentation. Existing fixture character artwork now renders as battlefield markers with HP bars and explicit status/cast labels. Expanded HUD smoke, full 100% boss/card/skill/status/trap effect harness and final build pass. Full UI scenarios record attacking victories at 7:50/7:47, restart, and an unattended defeat at 11:09 with correct own-Core wording. Read `stage2-readability-and-hud-2026-10-26.md` first for this continuation. Only human gameplay/readability/balance/pacing review remains open among these checks; do not repeat the formerly pending HUD work as if it were still unverified.

**Latest revision (2026-10-26):** User reports most functions are usable and asked to stop the four roads at jungle entrances. Current endpoints are `(30,29)`, `(119,29)`, `(30,60)` and `(119,60)`; centerline and shoulders are restricted to battlefield columns 30-119. No road enters forest terrain. This supersedes the earlier deep-jungle endpoint coordinates below and in historical notes. The +10% approach speed remains; S2-6 exact match/checkpoint observations remain open.

- Project: `C:\Users\s0846\Desktop\Files\ExGame\Aurolith`
- Live game: http://127.0.0.1:5173/
- Server was already running and returned HTTP 200 when checked for this handoff on 2026-10-25; listener PID was 21144. Recheck rather than relying on that PID in a later session.
- If unavailable, run `npm run dev -w client -- --port 5173 --strictPort` from the project root. Check for an existing server before launching another.
- Read `Plan/State.md`, this handoff, `stage-2-complete-match.md`, and `stage2-acceptance-log.md` before continuing. TechnicalPlan/03, /08 and /12 record input, rendering and HUD changes.
- The repository currently lists its project contents as untracked. Preserve the existing files; an empty tracked diff does not mean the workspace is empty or unchanged.

## Current implementation

- PC browser game: TypeScript, Vite and PixiJS; shared deterministic simulation; 150 x 90 board; 18:00 match limit; Stage 2 uses representative fixture content.
- Removed the left region-jump panel. Desktop battlefield expands beside the right control rail, which contains match status, orders, roster, cards, Rite, recruiting/training and build/equipment groups. Groups expand on demand. The board/page itself does not scroll; the rail can scroll independently. Very narrow layouts move the rail below the board.
- Opening camera is 100% near the player's fortress. Floating upper-left minimap supports click-to-jump with zoom retained; friendly dots are gold, currently spotted enemies red.
- `P` or the small `?` button toggles floating shortcut help. `O` starts/pauses/resumes local play. `1-4` select platoons; `A/D/R` set stance; `Z/X/C` set focus; `G/J` toggle Gather/Outrider; `Q/W/E/T/Y/U` play the six hand slots; `F1-F4` jump to platoons; `H` returns home; Escape cancels card placement. Most shortcuts work throughout the match UI except while editing text or select fields; arrows pan while the board is focused. Rite offers temporarily use `1-3` and `R`.
- Five generated PNG ground materials are integrated as repeating FillPatterns: grass/clover field, leafy jungle floor, worn dirt/sandstone path, limestone courtyard and cool rampart stone. Repeat scale is 256 world units per source image; terrain veils reduced to 5-12% opacity. Clearing uses a tinted meadow variant. See `stage2-painted-terrain.md` for assets and captures.
- The existing illustrated PNG prop atlas remains in use. Trees, canopy, fences and boulders are decoration: passable and transparent to sight. Brush tiles retain concealment; castle structure rules remain authoritative.
- Retreat suppresses attacks against units, camps and structures. Glossary-only Aggressive dive below 25% HP and Defensive kite below 60% HP remain provisional per explicit user direction; they are neither implemented nor required by S2-2 acceptance.

## Evidence and limits

- **Latest evidence (2026-10-26):** Entrance-only road revision passes **171/171 tests across 17 files**, production build/type checking, and a captured/inspected [current map overview](stage2-jungle-entrances-20261026.png). The dated 2026-10-25 captures below show the older road length.

- S2-1 through S2-5 have recorded acceptance for their defined scope. S2-6 and the Stage 2 exit remain open.
- Latest full simulation suite: **171/171 across 17 files on 2026-10-26**, after the entrance-only road revision. Later client marker and result-text changes are covered by the fresh build, HUD smoke, effects and match scenarios, not by a newly rerun shared suite.
- Latest `npm run build`: **passed on 2026-10-26**, including shared/client/server type checking and the production client build after the final marker and result-wording changes.
- Latest five-region terrain check: **passed on 2026-10-25** at 100% zoom, no browser page errors. Current capture prefix is `stage2-jungle-paths-v1`; reviewed the full-map overview and west-jungle detail showing the new branches. Earlier painted-material captures remain historical evidence.
- Current path-network overview: [stage2-jungle-paths-overview-v1.png](stage2-jungle-paths-overview-v1.png). Earlier close UI/art screenshot: [stage2-painted-ui-v1.png](stage2-painted-ui-v1.png).
- Browser screenshot console also showed an existing Pixi addProp warning and a missing favicon request; the terrain runner reported no page errors. Do not confuse the missing favicon with terrain asset loading failure.
- Latest HUD smoke **passes**: help/P, pause/O, paused clock, select-field guards, public group expansion, roster/formation, stance/focus/macros/cards, hiring/training, Sanctuary, materials/craft/equip, move orders and reset. `scripts/browser-smoke.mjs` uses the minimap and opens management groups through their summaries.
- The refreshed effects harness uses the live camera transform, asserts exact trap placement and readable skill/stun labels, and passes the full warning/cast/status/trap/audio/cleanup sequence at 100% zoom. Development effect pausing now reads running state instead of the button's old exact label.
- Latest automated UI scenarios: attacking victories at **7:50 and 7:47**, successful restart, and an unattended defeat at **11:09** with correct own-Core wording. These asynchronous UI runs repeat outcomes, not exact input logs or matching final hashes. None supplies a human 15:00 review. Earlier 8:48 and bot/unattended seed figures are historical.

## Next work when requested

1. Confirm the existing localhost server and preserve the current layout/art.
2. Ask for human review of the new character markers and readable skill/status cues when the user is ready. The post-layout HUD, event effects and complete browser scenarios are now passing; consult the latest evidence rather than restarting those checks without a changed requirement or defect.
3. When the user is ready, use `stage2-human-playtest.md` for a normal 1x human-vs-bot match. Record exact result/end time, 5:00 and 10:00 observations, and 15:00 observations only if the match is still active. If it ends earlier, record that fact rather than inventing a 15:00 state.
4. Review strategic choices, economy explanations, HUD/scenery readability, Retreat behavior, stuck platoons and result clarity. Resolve findings and update the acceptance log.
5. Keep S2-6 and the Stage 2 exit unchecked until the human evidence has been reviewed. Stages 3-6 remain future work in `Plan/State.md`.

Initial positive user feedback is now recorded in the playtest sheet. It does not supply an exact match result or the missing timed observations, and Stage 2 remains incomplete. Review the new jungle travel routes with the user during further play.
