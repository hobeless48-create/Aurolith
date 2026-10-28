# Stage 1 — Playable vertical slice

**Outcome:** one short local human-versus-bot match that proves the recruit → command → fight → breach → result loop. Use a representative map and up to two platoons, while retaining the full game's hex and command model.

## Tasks

- [x] **S1-1 — Render and navigate a hex board.** Add camera pan/zoom, click-to-hex mapping, selection feedback and a small set of terrain assets. **Verify:** selections remain accurate after zoom and resize.
  - [x] Full 150 × 90 board, pan/zoom, minimap, and selection verified in Chromium, including selection after resize.
  - [x] Opening check repeated on 2026-10-19: local page served, canvas rendered, selection worked before and after zoom/resize, region navigation and fit worked, and no page errors occurred. Run `node scripts/board-open-check.mjs`; screenshot: `Assets/Showcases/Board-Prototypes/board-stage1-open.png`.
  - [x] Load existing grass, jungle, road, marble and wall textures into the board; use the Obsidian/Imperial Gold UI palette and shaded pale cloud corners. Initial browser board check, production build and smoke passed on 2026-10-19; the shroud appearance and vision rules were revised on 2026-10-20 below.
  - [x] Revised on 2026-10-20: center both castles at columns 51–98 (48 × 20), keep six visible 3×3 facility plots per side and the five-segment/three-gate frontage, and give each home castle a ten-row front sight strip extending ten columns beyond both sides (columns 41–108). Unseen terrain retains color under translucent gray fog. Browser board check and full match passed.
- [x] **S1-2 — Recruit and command units.** Implement the chosen opening rule, platoon ownership, one hire action, move order, one stance and one focus directive. **Verify:** invalid orders are rejected and the HUD reflects the accepted state. Browser smoke and simulation tests cover this.
- [x] **S1-3 — Add one combat route.** Implement deterministic movement, target selection, damage, death/respawn, one jungle camp and a wall segment. **Verify:** units can clear the camp and breach the wall without getting stuck. The browser playthrough collected Gilded Ore and breached both wall layers.
- [x] **S1-4 — Add a simple opposing bot and result.** Give the bot legal commands through the same interface as the player; show victory, defeat and restart. **Verify:** a full match can end and restart without reloading the page. The browser playthrough reached victory, restarted and reached victory again.
- [x] **S1-5 — Test and present the playable loop.** Run a browser play path: recruit, command, contest camp, breach, finish; provide you a local build and short demo. **Verify:** the path works without developer commands and any observed confusion or delay becomes a tracked ticket.
  - [x] Browser smoke passes render, Rite, card cast, clock, hire, facility construction, order and reset (2026-10-19).
  - [x] Browser playthrough passed twice on 2026-10-19 through camp, both breaches, victory and restart, without page errors. Both runs used seed 1 and won by core collapse. The live UI timings differed (7:53 and 7:39), so their final state hashes differed; the separate simulation test verifies identical seed plus identical tick-stamped commands gives identical state hash. Run `npm run stage1:playthrough` with Vite running; result image: `Assets/Showcases/Board-Prototypes/stage1-result.png`.
  - [x] Production build and all 67 tests passed on 2026-10-19. A full automated browser match finished in under five minutes of wall-clock time at 24× test speed.

## Your input

Review or play the slice whenever useful and judge the core feel: Are platoon orders readable? Is recruiting meaningful? Do fights and breaches create choices? I run the required verification and implement the resulting changes.

## Exit check

The loop works from start to result and restart; two runs with the same seed and commands produce the same result; no critical input or pathing bug blocks the five-minute play test.
