---
tags: [Technical, Architecture, PixiJS, WebAudio, FlowField]
type: Technical Spec
---

# 💻 TECHNICAL ARCHITECTURE & IMPLEMENTATION SPECIFICATION

> [!NOTE]
> PC Web Browser Engine built with **HTML5 Canvas / PixiJS (2.5D Isometric)**, Web Audio API / Howler.js, and Flow Field Pathfinding. Refer to the dedicated [`TechnicalPlan`](TechnicalPlan) directory for low-level engineering specs.

---

## 1. 🏗️ Tech Stack & Platform Specs

- **Platform:** PC Web Application (Mouse + Keyboard).
- **Virtual Viewport Canvas:** Fixed virtual **1920×1080 Resolution** with automatic aspect-ratio letterboxing.
- **High-DPI Retina Scaling:** `resolution: window.devicePixelRatio || 1` with `autoDensity: true`.
- **Render Engine:** PixiJS 2.5D Isometric Scene Graph (`YSortedWorldContainer`).
- **Render Optimization:** Viewport frustum culling with a 2-hex buffer; profile draw calls and frame time before setting hardware-specific acceptance budgets.
- **Audio Engine:** Priority Voice Pool (Max 16 Channels) with camera-relative stereo panning and preloading progress bars.
- **Pathfinding Engine:** Flow Field Vector Pathfinding for 4 Platoons (5 units each) + dynamic convex hull bounding polygons.
- **Army Sizing & Macro Control:** Strict **4 Platoons × 5 Units = 20 Cap Invariant** (Hotkeys `1-4`, Stances `A/D/R`, Directives `Z/X/C`).
- **Economy & Progression:** Deterministic Mercenary Guild (zero gacha rerolls) + Dual-XP Academy Training (`100g -> +100 XP`).
- **Augment System:** 3 In-Match Blessing Rites (`0:00`, `5:00`, `10:00`) with non-blocking 30s drafting.
- **Telemetry and replay:** bounded recent-event telemetry for diagnostics; full replay requires the match seed, accepted command log, simulation version and seek snapshots (`TechnicalPlan/13–14`).

---

## 2. 📁 Low-Level Engineering Specifications Index

Detailed algorithms, state machines, and code schemas are maintained in the sibling files of this directory:

- `[[00 - Technical Master Roadmap]]`
- `[[01 - Hex Grid Engine & Coordinate Systems]]`
- `[[02 - Pathfinding, Drag-Vector & Movement Engine]]`
- `[[03 - Command Priority Queue & Smart-Tactics AI]]`
- `[[04 - Card System, Draw Ticker & Trap Manager]]`
- `[[05 - Structure Breach, Bottlenecks & Shroud Masking]]`
- `[[06 - Match Game Loop, Phases & Overtime Engine]]`
- `[[07 - AI Commander Bot State Machine]]`
- `[[08 - Audio Engine & Visual Render Pipeline]]`
- `[[09 - UI Layout Engine & HUD Overlays]]`
- `[[10 - Technical Architecture & Implementation Spec]]`
- `[[11 - Unit Model Visual Art Direction]]`
- `[[12 - Client Architecture, Tech Stack & UX Panel System]]`
- `[[13 - Networking & Authoritative Server]]`
