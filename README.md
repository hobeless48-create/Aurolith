# Aurolith

A browser strategy game where you command platoons across a 150 × 90 hex battlefield, gather resources, build fortress facilities, and siege an opposing castle. The current playable version is a local match against a bot, built with TypeScript, PixiJS, and Vite.

## Goal

Destroy the enemy Core while protecting your own. Break through the outer and inner fortress walls, then attack the Core.

A match has an 18-minute simulation limit. If neither Core has collapsed, the player who dealt more wall damage wins; remaining Core HP breaks a wall-damage tie. Equal wall damage and Core HP produce a draw.

## Run it

Requirements: Node.js 22.12 or newer, npm, Git for cloning, and a modern desktop browser with WebGL support.

Open PowerShell and run:

```powershell
git clone https://github.com/hobeless48-create/Aurolith.git
cd Aurolith
npm install
npm run dev
```

If you already have the repository, start with `npm install` from its root. Open the local URL printed by Vite, normally `http://127.0.0.1:5173/`. The playable local match needs no account or API key.

## How to play

1. Choose an opening **Rite** blessing. Read each option before selecting it; later Rites offer more upgrades during the match.
2. Press **Start match**. You control the northern army; the southern army is controlled by the local bot.
3. Select **platoon 1**, which contains your five free starting units. Right-click a walkable hex to issue a movement order.
4. Send the platoon toward the west jungle camp. Units fight automatically when eligible targets enter range. Watch health, target focus, and terrain rather than issuing individual attacks.
5. Use earned gold to hire reinforcements. A first sapper costs 60 gold before hire-price escalation. Put reinforcements in another platoon so you can command them separately.
6. Use the fortress controls to build facilities, train units, manage formation ranks, and craft or equip compatible items. Read disabled-button explanations when a placement, resource, or station requirement is missing.
7. Move toward the southern fortress. Breach its outer wall, then inner wall, and push toward the Core. Siege units help with structures; keep other troops available to defend your own base.
8. Play command cards, choose later blessings, and adjust platoon orders as the match changes. Use **Pause** to inspect the board and **Restart match** after the result.

For a first short run, follow the camp → sapper → southern fortress route. **24x test match** accelerates simulation time; use **1x normal** to learn the controls and see combat.

## Controls

| Input or control | What it does |
| --- | --- |
| Drag the board | Pan the camera |
| Mouse wheel / zoom buttons | Zoom in or out |
| Minimap / region buttons / Home | Jump around the map or fit the board |
| Left-click a hex | Inspect terrain and passability |
| Right-click a walkable hex | Order the selected platoon to that location |
| Platoon buttons / 1–4 | Select a platoon; during a Rite, 1–3 choose an offered blessing |
| Stance and focus selectors | Change combat behavior and preferred targets |
| G / J | Toggle Gather / Outrider behavior for the selected platoon |
| O | Start, pause, or resume the match |
| P | Open the keyboard help panel |
| Reset / Restart match | Begin a new match |

The help panel lists the remaining card, stance, focus, and camera shortcuts. Prefer the labeled buttons while learning; letter keys also control tactics.

## Current play loop

**Choose a blessing → gather and fight → recruit and train → develop the fortress → breach walls → threaten the Core → result and restart.**

| Simulation time | Phase | What to prepare for |
| --- | --- | --- |
| 0:00–5:00 | Opening | Scout, clear camps, and establish income |
| 5:00–10:00 | Expansion | Develop the army and facilities |
| 10:00–15:00 | Siege | Contest structures and defend breaches |
| 15:00–18:00 | Overtime | Push the advantage before the match limit |
| 18:00 | Result | Resolve wall damage, then Core HP if necessary |

Core collapse can end a match before the time limit.

## Rules notes

- **Starting army:** five free units, zero starting gold, and a Core with 4,500 HP. Income, camp rewards, cards, and blessings fund expansion.
- **Platoons:** four command groups organize the army. Movement orders, stances, formation positions, and target focus affect how their units behave.
- **Combat:** attacks and unit skills resolve automatically in the local simulation. Range, line of sight, terrain, concealment, and status effects affect engagements.
- **Recruitment:** the base hire price is 60 gold. It rises by 15 every 2 minutes 30 seconds, up to six increases. The HUD shows the current price.
- **Facilities:** combat and production facilities have separate limits of three each. Construction uses fixed fortress slots; upgrades and specialized placements have additional requirements.
- **Equipment:** crafting needs the recipe's materials, gold, and a unit at the required station. Equipping also checks role compatibility and the unit's existing equipment.
- **Cards and blessings:** cards provide tactical effects; Rites offer longer-lived upgrades. Read their displayed descriptions for targeting and timing.
- **Clock:** rules advance at ten fixed simulation ticks per second. Faster presentation speeds change how quickly you reach a phase, not its simulation-time boundary.

The implementation uses a defined fixture catalog. The larger design documents describe additional content and future stages; they should not be read as a list of everything already playable.

## Useful files

- [Build process and stage checklists](Plan/Stages/build-process.md) — scope and acceptance work for each stage.
- [Stage 2 match specification](Plan/Stages/stage-2-complete-match.md) — the current match systems and outstanding acceptance items.
- [Stage 2 late-game evidence](Plan/Stages/stage2-late-game-2026-10-26.md) — recorded automated pacing observations and remaining human review.
- [Board rules](<Plan/TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md>) — map layout and coordinates.
- [Board preview](Assets/Showcases/Board-Prototypes/board-preview.png) and [castle preview](Assets/Showcases/Board-Prototypes/board-castle-48-preview.png) — battlefield images.
- [Simulation](shared/src/simulation.ts), [combat](shared/src/combat.ts), and [structures](shared/src/structures.ts) — implemented rules.
- [Fixture catalog](shared/src/fixture.ts) — the current playable units and sample assets.
- [Client entry point](client/src/main.ts) — board rendering and match controls.

## Checks

Run from the repository root:

```powershell
npm run typecheck
npm test
npm run build
```

With `npm run dev` running in another terminal, the repository also provides browser checks:

```powershell
npm run smoke
npm run stage1:playthrough
npm run stage2:playthrough
```

The production frontend is written to `client/dist/`. Automated playthroughs check defined scenarios; balance, game feel, and the remaining Stage 2 acceptance work still need human playtesting.
