# Aurolith

Browser game prototype. The first playable artifact is a navigable 150 × 90 hex board (13,500 cells).

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173/`.

Drag to pan, scroll to zoom at the pointer, click a hex to inspect it, use WASD or arrow keys to pan, and press Home to fit the whole board. The minimap and region buttons jump to major areas.

For a short Stage 1 match, choose the opening Rite, start the match, select platoon 1 and right-click the west jungle camp. Hire a sapper into platoon 2 when you have 60 gold. After the camp, use the Southern fortress button and order both platoons toward its outer wall, inner wall and core. The 24× test speed helps you reach the result quickly; Restart match begins again without reloading. With the dev server running, `npm run stage1:playthrough` automates this same route twice.

```powershell
npm run typecheck
npm test
npm run build
```

## Status

- [Build process and stage checklists](Plan/Stages/build-process.md) live in `Plan/Stages/`.
- [Whole-board preview](Assets/Showcases/Board-Prototypes/board-preview.png) and [front-gate detail](Assets/Showcases/Board-Prototypes/board-detail.png) live with the other showcase images.
- [Current 48-column castle preview](Assets/Showcases/Board-Prototypes/board-castle-48-preview.png) shows the narrower fortress, fixed facility plots and wider front sight strip.
- Board bounds, four cloud corners, two jungle flanks, centered 48 × 20 frontal castles, highway, and altar coordinate follow `Plan/TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md`. Each player sees their own fortress and a ten-row front strip extending ten columns beyond each castle side.
- Stage 1 playable slice is verified through camp, breaches, result and restart. The board uses a small set of project terrain textures, an Obsidian/Imperial Gold UI theme, shaded cloud barriers and a visual fog shroud. The complete 22-tile catalog and finished art remain Stage 3 work.
- `shared/src/board.ts` owns tile IDs, coordinates, and terrain fixtures. `client/src/main.ts` renders visible chunks with PixiJS.
- The Stage 0 rule decisions, including five free starters and 0 starting gold, are recorded in `Plan/TechnicalPlan/14 - Implementation Roadmap, Authority & Decision Log.md`.
