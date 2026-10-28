---
tags: [TechnicalPlan, Architecture, TypeScript, Vite, PixiJS, UX, Panels, HUD, RosterPanel]
type: Technical Specification
---

# 🖥️ 12 - CLIENT ARCHITECTURE, TECH STACK & UX PANEL SYSTEM

> **Platform and work model (2026-10-19):** PC web browser first (mouse and keyboard), selected in the prior session titled "Choose a platform for Aurolith". The user steers creative direction; Codex handles most implementation and verification so each build can be reviewed directly in a browser. Stage 2 acceptance is a complete local browser match through player-facing controls; online server delivery follows in the online stage. See `TechnicalPlan/14` for the decision record.

> Full-stack **TypeScript** web build: a Vite + PixiJS v8 client, a Node.js authoritative server, and a **shared deterministic simulation** package both sides import. PixiJS draws the battlefield and in-world overlays; browser DOM renders the information panels, cards, shop and accessible controls. The match HUD follows the **Teamfight Manager** screen anatomy — the battlefield on the left, and **all match information consolidated in a right-side panel** (roster, health, skill readiness, platoons, graveyard, selection, commands). Implementation stages and rule authority are in `TechnicalPlan/14`.

---

## 1. 🏗️ Tech Stack (confirmed by research)

- **Language:** TypeScript (strict) everywhere — client, server, and shared sim. One language end-to-end; the sim code compiles for both Node and the browser (the single biggest win of full-stack TS).
- **Repo layout:** npm-workspaces monorepo:

```
general-gilded/
├── shared/      # deterministic sim: grid, combat, blessings, units, items, economy, AI
├── client/      # Vite + PixiJS v8 (browser app)
├── server/      # Node.js authoritative game server (WebSocket rooms)
└── package.json # workspaces root
```

- **Client:** Vite (HMR, tree-shaking, ES modules) + **PixiJS v8** (WebGL renderer, 2.5D isometric) + DOM panels. WebGL is the production default in the [PixiJS renderer guide](https://pixijs.com/8.x/guides/components/renderers).
- **Server:** Node.js + `ws` / Socket.IO, authoritative — clients send commands, server simulates and broadcasts state.
- **Serving:** Vite static build + Node WS server behind Caddy (auto-HTTPS, `wss://` proxy).

---

## 2. 🧱 Client Architecture & PixiJS v8 Lifecycle

- **`App` Permanent Singleton (ADR-004, Jev Confirmed 90%):**
  - Exactly one `PIXI.Application` instance is created at boot via `await app.init({ width: 1920, height: 1080, resolution: Math.min(window.devicePixelRatio || 1, 2.0), autoDensity: true })`.
  - The renderer is **never destroyed or re-initialized between matches**. Tearing down and recreating WebGL contexts in the same tab is strictly forbidden to eliminate WebGL Context Lost crashes and GPU driver stalling on mobile/Safari.
  - Full destruction via `app.destroy({ removeView: true, releaseGlobalResources: true }, { children: true, texture: true, textureSource: true })` is invoked strictly when the browser tab closes or unmounts the application wrapper.
- **`SceneManager`:** swaps scenes (Boot → Lobby → Match [with 3 In-Match Blessing Rites] → PostMatch) by replacing owned scene containers without tearing down the renderer. Keep shared textures loaded; release per-match objects on exit.
- **Letterbox Offset Raycasting:** Coordinate conversion from pointer events compensates for aspect-ratio letterboxing:
  $$\text{canvasX} = (\text{event.clientX} - \text{rect.left}) \times \left(\frac{1920}{\text{rect.width}}\right)$$
  $$\text{canvasY} = (\text{event.clientY} - \text{rect.top}) \times \left(\frac{1080}{\text{rect.height}}\right)$$
  guaranteeing zero targeting offset on ultra-wide or 16:10 displays.
- **Layered scene graph** (PixiJS v8 `RenderLayers`):
  1. **Background layer** — static iso terrain (baked, never re-rendered per frame).
  2. **World layer** — units (encapsulated via `UnitVisualComponent`, running Milestone 1 2D High-Detail Sprites + Procedural Tweens with a modular drop-in path to Milestone 2 2.5D Animated Sprites; see `11 §1`), walls, facilities, `YSortedWorldContainer` depth sorting using the `[0.5, 0.85]` base anchor point.
  3. **Overlay layer** — selection reticles, range hexes, ghost placements, Shroud fog (always above world, below UI).
  4. **In-world HUD layer** — target hints and screen-edge threat markers. DOM panels sit above the canvas and do not participate in PixiJS world sorting.
- **Systems** (singleton modules): `InputSystem`, `CameraSystem`, `CommandSystem`, `UISystem`, `AudioSystem`, `TelemetrySystem`.
- **Render budget:** frustum culling (2-hex buffer), sprite atlases and pooling are candidate optimizations. Measure frame time, draw calls and memory on the agreed test hardware before setting pass/fail thresholds; `< 50` draw calls is an initial profiling target, not a guaranteed result. Per [08 - Audio Engine & Visual Render Pipeline](08%20-%20Audio%20Engine%20&%20Visual%20Render%20Pipeline.md).

---

## 3. 🖥️ Match Screen Layout (1920×1080) — Teamfight Manager anatomy

> TFManager-style split: **match action is the anchor on the left**, every piece of match info lives in the **right-side information panel**. Nothing but the world and transient overlays sits over the battlefield.

```
+------------------------------------------------------------------------------------+
| TOP BAR: [Gold] [XP] [CL]   [ ⏱ 08:42 | SIEGE ]  [Pause ⏸] [Speed 1x/2x] [Options ⚙] |
+---------------------------------------------+--------------------------------------+
|                                             |  ██ ROSTER PANEL (4 Platoons × 5) ██ |
|                                             |  ┌────────────────────────────────┐  |
|                                             |  │ [1] P1 · 5 roles (+22%)  Dir:[F]│  |
|        HEX BATTLEFIELD (90×150)             |  │ Stance: [A ⚔️] [D] [R]           │  |
|        - unit sprites + HP bars             |  │ [🖼] Marrow  ██████░░ 72% [⚡]  │  |
|        - Platoon convex hulls (Amber/Cyan)  |  │ [🖼] Aldric  ████████ 100%      │  |
|        - Waypoint vector chevrons (>>>)     |  │ [🖼] Grun    ████░░░░ 41% [⚡]  │  |
|        - Aggro laser leashes (targeting)    |  │ [🖼] Cassius ██████░░ 80%       │  |
|        - Destination badges [P1] ATTACK     |  │ [🖼] Selene  ████████ 100% [⚡] │  |
|                                             |  └────────────────────────────────┘  |
|                                             |  ┌────────────────────────────────┐  |
|                                             |  │ [2] P2 · 4 roles (+12%)  Dir:[B]│  |
|                                             |  │ Stance: [A] [D 🛡️] [R]          │  |
|                                             |  │ ... (5 rows)                   │  |
|                                             |  └────────────────────────────────┘  |
|                                             |  ┌ [3] P3 (5 rows) ┐ ┌ [4] P4 ┐   │  |
|                                             |  └─────────────────┘ └────────┘   │  |
|                                             |  ───────────────────────────────   │  |
|                                             |  💀 GRAVEYARD (30s Respawns)       │  |
|                                             |  [💀] Rory (18s)  [💀] Teresa (4s) │  |
+---------------------------------------------+--------------------------------------+
| [🗺 MINIMAP] | BOTTOM DOCK: [Recruit] [Arsenal] [Cards] [Blessings] [Discard]       |
+------------------------------------------------------------------------------------+
```

- **Battlefield (left ~75%):** pure world + transient telemetry overlays (Convex Hulls, Waypoint Chevrons, Destination Badges, Aggro Laser Leashes).
- **Roster Panel (right, fixed ~25%):** every friendly unit at a glance — the Teamfight Manager in-match player list. Full spec in §4.
- **Top bar:** resources, commander level, match clock + phase, pause, and options. Match speed may change only in local single-player or replay; online competitive play uses the server clock.
- **Bottom dock, tab-switched:** `Recruit` / `Arsenal` / `Cards` / `Blessings` / `Discard`.
- **Left-side collapsible panels:** (Imperial Blessings list, economy breakdown, game-rule encyclopedia) — hidden by default, `Tab` to open.

---

## 4. 🎴 ROSTER PANEL — full-army status (core feature)

> The right-side vertical panel that visualizes **every unit's stats and live state** in one scroll-free view (army cap = 20: 4 Platoons × 5 Units). Layout reference: Teamfight Manager's in-match player list — grouped, readable at a glance, click-to-act.

### 4.1 Structure (vertical, grouped by 4 platoons)

```
ROSTER PANEL
├─ PLATOON 1 card: "[1] Platoon 1 · 5 roles (+22%)"
│   ├─ Header controls: [A ⚔️] [D] [R] Stance Buttons · Directive: [Frontline Melt]
│   ├─ row 1: [portrait] Marrow (Fighter)   [HP bar 72%]   [⚡ skill-ready ring] [Target Icon]
│   ├─ row 2: [portrait] Aldric (Tanker)    [HP bar 100%]                         [Target Icon]
│   ├─ row 3: [portrait] Grun   (Marksman)  [HP bar 50%]   [⚡ skill-ready ring] [Target Icon]
│   ├─ row 4: [portrait] Cassius(Support)   [HP bar 80%]                         [Target Icon]
│   └─ row 5: [portrait] Selene (Assassin)  [HP bar 100%]  [⚡ skill-ready ring] [Target Icon]
├─ PLATOON 2 card: "[2] Platoon 2 · 4 roles (+12%)"
│   └─ ... (5 rows)
├─ PLATOON 3 card: "[3] Platoon 3" (5 rows)
├─ PLATOON 4 card: "[4] Platoon 4" (5 rows)
└─ GRAVEYARD section — dead units, dark silhouettes + respawn countdowns (30s)
```

### 4.2 Row anatomy (each unit)

| Element | Behavior |
| :--- | :--- |
| **Portrait** | 64px class art. **Skill ready → full color. Skill on cooldown → monochrome** (grayscale via `tint`/filter + dimmed). **Dead → near-black silhouette** until respawn. |
| **Skill-ready indicator** | Small radial ring / glow on the portrait corner. Filled = ultimate/ability ready and the portrait is color; empty + grayscale = on cooldown; a thin arc shows remaining cooldown progress. |
| **HP bar** | Live Max-HP-to-current bar; colors Green (>60%) → Yellow (30–60%) → Red (<30%) with 0.1s damage flash (per render spec). Stacked 2nd bar (thin white) under it shows **temporary shields** (Mantle of Dawn, Dawn Ward, etc.). |
| **Role chip** | 8-class icon (Fighter/Tanker/Mage/Marksman/Support/Siege/Artisan/Assassin) + a **role-diversity counter** contribution dot — used to plan the platoon bonus. |
| **Item slot** | Tiny equipment icon (up to 2 with Grand Armory/Armory Eternal); item name on hover. |
| **Status icons** | Micro-icons for active statuses: crowd-control (greyed), lifesteal drain, DoT, resurrection window. |
| **Click = select / cast target** | Clicking a row selects the unit. Also serves as the **card-cast target picker** (Undying Will on a graveyard row, single-target spells, item equips). |

### 4.3 Monochrome-when-unready rule (the spec)

- A unit's **portrait is rendered in full color only while its signature ability is ready**.
- The instant the ability is cast (or enters cooldown), the portrait **desaturates to monochrome** in one 150ms tween.
- The moment the cooldown completes, the portrait **returns to full color** with a 0.3s glow pulse + a soft "ready" chime (respects the 16-voice audio pool).
- Dead units stay monochrome **plus** a dark overlay and the respawn countdown badge; a graveyard row can be clicked to target `Undying Will`.
- **No-stat visibility:** HP, shields, readiness, and status icons are always visible. Full stat sheet (ATK/AP/ASPD/DEF/MR, item breakdown, every modifier source) opens in a **nesting tooltip** on hover — the panel never scrolls for basics.

### 4.4 Platoon synergy integration

- Each platoon header shows the **live Platoon Composition Bonus** (3 Roles: +5%, 4 Roles: +12%, 5 Roles: +22% All Attributes + 10 Tenacity) and its active role icons.
- A small **"+1 role → +12%" ghost hint** appears on the header while inspecting an unrecruited champion with a novel role in the Mercenary Guild.
- Panel renders from the **same UI state binding** as the world (single source of truth, see §6), so HP/readiness are always in sync with the sim.

---

## 5. 🎛️ Other Panels & Screen Overlays (summary)

- **Global HUD Macro Ribbon (top/side strip):**
  - **Fortress Upgrade:** 1-click upgrade button showing cost, current tier, and progress bar without shifting camera to base.
  - **Neutral Boss Timers:** Live countdown tickers for camps (`Gorgon: 0:45`, `Hydra: 2:10`); clicking the timer pings the camp location for team coordination without moving your camera.
  - **Mercenary Guild Ticker:** Alerts when new mercenary contracts arrive in the shop.
- **Screen-Edge Threat Chevrons:**
  - Directional perimeter triangles along the viewport border pointing toward off-screen skirmishes.
  - Color-coded severity: 🟡 *Yellow* (Neutral camp contested), 🔴 *Red* (Platoon in combat), 🚨 *Flashing Crimson* (Structure/Wall breach).
- **Mercenary Guild Dock:** Curated 40-unit match pool divided into 8 class boards. Champions cost 60g base (+ escalating cost per hire). Zero RNG rerolling; strict 1 unique copy per player. Recruited units assign directly to the targeted platoon.
- **Academy Training (`F` key):** Directly invest 100 Gold for +100 XP into a selected champion to fast-track progression toward L2 (+10% stats) and signature L3 Paragon Evolutions.
- **Craft & Arsenal Dock:** The 7 materials + recipe combine table; **auto-highlights materials held** that complete an item recipe; craft = 15s facility cooldown at Forge (equipped in Safe Zone, or field-equipped via Artisan).
- **Cards Dock:** Six-card hand, 2:30 draw ticker, 15-second overflow area and discard drop zone; free 0-gold casting with explicit targeting reticles. Milestone cards follow the same hand/overflow path as other draws.
- **Imperial Blessings Panel (left, collapsible):** Displays your 3 drafted Imperial Blessings with live stat counters and active effect milestones.
- **Game-Rule Encyclopedia (left, collapsible):** In-game rule manual displaying all unit stats, item recipes, and damage formulas.
- **Post-Match:** Result screen with per-unit damage breakdown and MVP rating. Replay playback and speed scrubbers are a later milestone after the replay format is implemented and verified.

---

## 6. 🔄 UI State Binding (single source of truth)

- The sim (`shared/`) emits typed **state snapshots**; the client's `UISystem` consumes them through one `viewState` object.
- Every panel is a pure function of `viewState` — **no panel owns game data**. Roster HP, skill readiness, platoon bonus, and the world's HP bars update from the identical value, so nothing can desync.
- Throttle: UI diffing runs at 10 Hz for panels, 60 Hz for world HP bars / portraits (cooldown arcs need frame-level smoothness; text counters do not).
- Grayscale "unready" = a filter state derived from `skill.remainingCD > 0` in `viewState`, applied to the portrait sprite only (never the whole panel).

---

## 7. ⌨️ Input & Hotkeys (player-comfort mandate)

- **Every frequent action has a dedicated hotkey**:
  - `1`, `2`, `3`, `4`: Select Platoon 1, 2, 3, or 4 (Double-tap snaps camera to Platoon).
  - `F1`, `F2`, `F3`, `F4`: Instant camera jump to Platoon 1, 2, 3, or 4.
  - `Spacebar`: Instant camera jump to latest high-priority combat alert (wall breach or squad ambush).
  - `H`: Instant camera jump to Imperial Castle / Core.
  - `A`, `D`, `R`: Switch selected platoon's Stance (`[A]` Aggressive, `[D]` Defensive Guard / 55% Peel, `[R]` Retreat). Double-tap `R` = quick pull to Core.
  - `Z`, `X`, `C`: Switch selected platoon's Focus Directive (`[Z]` Frontline Melt, `[X]` Backline Hunt, `[C]` Objective Siege).
  - `Q`, `W`, `E`: Play Command Card from Hand slots 1, 2, 3 (`T`, `Y`, `U` for slots 4, 5, 6). `G` remains Gather.
  - An overflow card has a visible click target; its optional hotkey must not displace a six-card hand binding.
  - `F`: Academy Training (+100 XP into selected champion or +100 Commander XP for 100g).
  - `Tab`: Toggle collapsible side panels (Imperial Blessings, Encyclopedia).
  - `O`: Pause/resume (local single-player only).
  - `P`: Toggle the floating keyboard-help panel.
  - `Ctrl+G`: Rebalance / hot-swap units between platoons (5 units max per platoon).
  - `Middle-Click Drag / Right-Drag`: Zero-slip direct viewport pan navigation.
- **Ghost Placement:** Guild recruits and facility construction follow the cursor as a ghost before confirm.
- **Drag-Lock:** During placement or card targeting, the board ignores stray unit selection.
- **Nesting Tooltips** with high-contrast dual-outline range hexes (black outer / white inner) for colorblind accessibility.
- **All panels collapsible**; layout state persists to `localStorage`.

---

## 8. 🧠 Human Player Ergonomics & Action Efficiency Analysis

To ensure Aurolith feels fluid, lightning-fast, and fatigue-free over 18-minute match sessions, every human player interaction is engineered against formal Human-Computer Interaction (HCI) principles:

### 8.1 Zero-Distance Left-Hand Home Row (Keystroke-Level Model - KLM)
- **The Problem:** In traditional RTS games, moving the mouse cursor to screen corners to click buttons takes $300\text{–}650\text{ms}$ per action (Fitts's Law: $T = a + b \log_2(1 + D/W)$) and forces the player to look away from the combat engagement.
- **The Solution:** The left hand rests on the home keys:
  - Finger row 1 (`1`, `2`, `3`, `4`): Instant Platoon selection ($D = 0\text{mm}$).
  - Card row (`Q`, `W`, `E`, `T`, `Y`, `U`): the six hand slots. `R` remains the Retreat stance outside a Rite; `G` remains Gather.
  - Finger row 3 (`A`, `D`, `R`): Macro Stance toggles.
  - Finger row 4 (`Z`, `X`, `C`): Focus Directives.
  - Academy Training (`F`); pause/resume is `O`; `Space` jumps to the latest high-priority alert.
  - Pinky (`Tab`): Side Drawer toggle.
- **Execution Efficiency:** 92% of all tactical commands execute via instantaneous keyboard chords ($< 90\text{ms}$ cognitive execution time), allowing the mouse cursor to stay 100% focused on spatial targeting on the battlefield.

### 8.2 Fitts's Law & Infinite-Target Screen Edge Mapping
- **Right Screen Edge (Consolidated Roster Panel):** The right 25% of the screen houses the 4-Platoon Roster Panel. By anchoring it to the physical screen border, the edge acts as a physical boundary stop ($W \to \infty$). Players can flick the mouse aggressively to the right to inspect or target a unit without fear of overshooting.
- **Monochrome Pre-Attentive Visual Processing:** Visual cognition registers color vs. grayscale within $< 100\text{ms}$ in peripheral vision. A glance at the right panel reveals ability readiness without reading numerical timers or parsing text.

### 8.3 Fluid Vector Movement Drawing (Steering Law Optimization)
- **The Problem:** Tracing individual hexes violates the Accot-Zhai Steering Law ($T = a + b \int \frac{ds}{W(s)}$), feeling jagged, inaccurate, and frustrating.
- **The Solution (Continuous Spline with Hex-Corridor Quantization):**
  1. Holding `Shift + Left-Click + Drag` allows the player to draw a freehand continuous curve across the board.
  2. The engine samples mouse points at 60 Hz and applies a B-spline smoothing filter.
  3. The smoothed curve projects onto the closest continuous corridor of axial hex coordinates in $O(1)$ time.
  4. Animated chevrons (`>>>`) in the platoon's color flow along the vector, ending in an isometric destination badge.
  5. Drawing a complex 30-hex jungle flank takes **under 0.8 seconds** with a single mouse stroke. Right-clicking before release cancels without penalty.

### 8.4 Non-Occluding Slide-Out Drawers vs. Modal Popups
- **No Full-Screen Modals:** Full-screen modals destroy combat situational awareness and cause fatal unit losses during phase transitions.
- **Left-Edge Slide Drawer (Blessing Rites):** When Rites trigger at 0:00, 5:00, and 10:00, the selection drawer slides smoothly from the left margin (25% width), leaving the central battlefield (50%) and Roster Panel (25%) fully visible.
- **Keyboard Selection Chords:** While the Rite drawer has focus, `1`, `2`, `3` select the three blessings and `R` uses the once-per-match reroll. The UI must show that these keys temporarily target the Rite, then restore their normal battlefield bindings when it closes.

## 9. Stage 2 HUD implementation and 3E interaction rule (2026-10-25)

For the Stage 2 browser HUD, apply 3E as **Easy to scan, Efficient to control, Effective feedback**:

- **Easy to scan:** Keep clock/phase, gold/XP/materials, Core HP, visible enemy wall status, and match controls together at the top of the right rail. Keep the battlefield and floating full-map overview unobstructed. Group controls by Orders, Army roster, Command cards, Blessing Rite, Recruit & train, and Build & equipment.
- **Efficient to control:** Keep platoon selection, stance/focus, Gather/Outrider, camera snaps and cards directly available in the match rail with their current shortcut labels. Strategy hotkeys work while the player is using the match UI or battlefield, except when focus is in a text/editable/select field. Right-click movement still requires the battlefield.
- **Effective feedback:** Show selected platoon, roster health/status, resources, Core/wall state, accepted/rejected command feedback, Rite offers and the final result in the same HUD. Open the Blessing Rite group automatically while an offer is active. Make shortcut keys visible beside their actions and in the expandable help group.
- Keep recurring tactical actions open and setup/economy detail collapsed by default. Expansion state remains player-controlled; do not automatically close a group the player opened during a match.
- Stage 2 review criterion: a player can locate the current match state and selected platoon quickly, issue a move/order/card without searching through economy controls, and understand command feedback. The human playtest remains the acceptance gate for game feel and readability.

### Stage 2 screen layout update (2026-10-25)

- Remove the left region-jump/navigation rail. Keep the full-map overview on the battlefield for navigation and spotted-unit visibility.
- Use a two-column desktop layout: the battlefield fills the available scene area and all match-management controls (platoon/unit overview, cards, recruiting, training, items, crafting, facilities and other match actions) live in the right rail. The scene itself clips its content and has no page/scene scrollbar; the right rail may scroll independently when its controls exceed the viewport.
- Put keyboard help in a separate floating panel on the right side of the scene. A small `?` button toggles it and `P` opens/closes it. `O` pauses/resumes the local match so the requested help binding is unambiguous. Keep `Space` available for the planned high-priority alert camera jump.
- Preserve map clicks, camera drag/zoom, minimap, and board right-click movement. On narrow screens the control rail moves below the board to preserve a usable battlefield width.
