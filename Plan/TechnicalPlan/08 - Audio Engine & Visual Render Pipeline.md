---
tags: [TechnicalPlan, RenderEngine, PixiJS, HighDPI, YSorted, ParticlePool, AudioEngine]
type: Technical Specification
---

# 🎨 08 - AUDIO ENGINE & VISUAL RENDER PIPELINE

> PixiJS 2.5D Isometric viewport, `YSortedWorldContainer` depth sorting, Max 150 Particle Object Pooling, 3:5 Minimap ratio, and Priority Audio Voice Pool.

---

## 1. 🖼️ PixiJS 2.5D Render Pipeline & Depth Sorting

- **Virtual 16:9 Canvas (1920×1080 Base):** Fixed virtual resolution with automatic aspect-ratio letterboxing.
- **High-DPI Retina Scaling & Resolution Clamping:** Passes `resolution: Math.min(window.devicePixelRatio || 1, 2.0)` and `autoDensity: true`. Clamping device pixel ratio to 2.0 strictly prevents 4K/Retina displays from exploding into $3840 \times 2160$ framebuffers (8.2 million pixels), protecting integrated GPUs from thermal throttling while preserving crisp display on laptops and smartphones.
- **Viewport Frustum Culling (2-Hex Buffer):** Render hex tiles and units in the viewport plus a 2-hex margin. Profile draw calls on target hardware; `< 50` is a starting target, not a guaranteed count.
- **YSortedWorldContainer Depth Sorting:** Sorts units and structure footprints dynamically by `y-position` in a single container, preventing visual wall clipping. Units use a standardized base anchor point of `[0.5, 0.85]` (feet planted on the hex plane), ensuring exact depth sorting whether rendered as Milestone 1 2D billboard sprites or Milestone 2 2.5D animated atlases.
- **Two-Tier Visual Engine Support (2D Procedural First -> 2.5D Drop-In):**
  - **Milestone 1 (Procedural 2D Tweens):** Units render as crisp 2D character sprites managed by `UnitVisualComponent`. All animations (`IDLE` breathing, `MARCH` hop/facing-flip, `ATTACK` lunge, `HIT` shake, `ABILITY` pulse) are computed in the PixiJS v8 render ticker using pre-allocated, object-pooled tween state structs to eliminate Garbage Collection allocations.
  - **Milestone 2 (Pre-Rendered 2.5D Atlases):** `UnitVisualComponent` encapsulates an identical interface, allowing `PIXI.Sprite` to be swapped for `PIXI.AnimatedSprite` reading 8-directional texture atlases with zero changes to world sorting or depth layers.
- **Two-Tier Layered Terrain Engine (World-UV Seamless + Prop Overlays):**
  - **Layer 1: Base Ground Textures:** Rendered as seamless global coordinate mappings `(worldX / tileSize, worldY / tileSize)` using `PIXI.TilingSprite` / custom batch shader. Adjacent hexes of the same biome (grass-to-grass, marble-to-marble) flow continuously with **ZERO geometric texture cuts**.
  - **Layer 2: Transparent Props & Structures:** Overhanging sprites (Trees, Boulders, Fences, Gates, Altars) rendered as transparent PNG cutouts. Because foliage and stone overhang hex borders naturally, rigid polygon seams are completely eliminated.
  - **The 22-Tile Master Catalog:** Strictly split into 8 Base Grounds (`field_grass`, `field_dirtpath`, `jungle_floor`, `river_shallow`, `river_deep_chasm`, `courtyard_marble`, `courtyard_gravel`, `perimeter_cliff`) and 14 Transparent Props/Structures in `Assets/Tiles/` and `Assets/Structures/`.
- **Unit Sprite Clamping & Zero-Occlusion Invariant:**
  - Unit sprites are scaled strictly to **72% of the hex inner diameter** with a 20% margin and anchored at `[0.5, 0.85]`.
  - **Visual acceptance check:** Inspect adjacent rows at tactical zoom and reduce overlap where silhouettes become unreadable. The 72% scale alone does not prove zero overlap for every weapon, halo or animation frame.
- **Hex Frame Dynamic Chroma Shader (Ground-Plane Health):**
  - Solves the 20v20 chokepoint billboard clutter problem. Individual soldier health is rendered directly onto the **ground-plane 2.5D hex border frame** rather than floating overhead bars.
  * `100% – 60% HP`: Luminous Emerald Green (`#00E676`) transitioning to yellow-green.
  * `60% – 30% HP`: Amber Yellow (`#FFD600`).
  * `< 30% HP`: Warning Crimson (`#FF1744`) with a 2 Hz breathing pulse animation.
  * `Dead / Empty`: Dims to neutral slate (`#37474F`).
  - **Sprite Isolation Invariant:** Unit sprite artwork remains 100% clean and unshaded, preserving class silhouette recognition in heavy combat.
  - **Hex frame batching candidate:** Prototype batched ground-frame geometry and measure draw calls and GPU time. Do not require a custom instanced shader until ordinary PixiJS graphics or mesh batching fails the frame-time budget.
- **Master Platoon Overhead Crest:** Exactly **ONE** master health bar floats above the platoon's geometric centroid, displaying **5 segmented soldier pips** (one per living squad member) + aggregate barrier/health.
- **3:5 Aspect Ratio Minimap Container:** Enforces explicit 180×300px minimap container with exact coordinate transform mapping.
- **Particle VFX Pool (Max 150 Particles):** Recycles fire/smoke sprites to prevent Garbage Collection frame stuttering.
- **Skill and tactical 2D effects:** Use PixiJS Graphics, sprites and the pooled particles on the battlefield canvas for cast wind-ups, projectiles or beams, impacts, healing, shields, traps and status changes. Drive each effect from a visible simulation event with a deterministic location and timestamp; the effect itself never changes game rules. Cull hidden enemy effects under fog and keep shapes and colors readable at tactical zoom. Stage 2 ships representative effects for the fixture skills and cards; Stage 3 expands the art catalog.
- **Canvas API distinction:** The battlefield is an HTML canvas rendered by PixiJS/WebGL, not a `CanvasRenderingContext2D` effects layer. Browser Canvas 2D may still draw the minimap or cached previews. Use PixiJS for world-space skill effects so they share the camera, fog mask and depth order.
- **BitmapFont Combat Text:** Uses pre-baked BitmapText atlas for dynamic damage/loot numbers, preventing GPU texture memory leaks. Floating combat text aggregates damage per platoon over 250ms windows.
- **Readiness treatment:** Apply grayscale and cooldown effects to DOM roster portraits. Keep world-space sprites clear; measure batching before adding per-unit filters.

---

## 2. 🔊 4-Tier Priority Audio Engine & Dynamic Ducking

- **4-Tier Priority Ducking Hierarchy:**
  * **Tier 1 (Master Alarms - Prio 100):** Imperial Core under attack, Fortress Wall breached. Automatically ducks all Tier 3 and Tier 4 channels by **40%** (-6dB) for 3.0s.
  * **Tier 2 (Tactical Milestones - Prio 75):** Platoon wiped, Neutral Boss (Tuskgod / Gorgon / Hydra) slain, Blessing Rite opened.
  * **Tier 3 (Combat FX - Prio 50):** Command Card spell impacts, weapon hit impacts, trap detonations.
  * **Tier 4 (Ambient & UI - Prio 25):** Background orchestral score, card draw tickers, UI hover clicks.
- **Priority Voice Pool (Max 16 Channels):** Evicts lower-tier voices when voice channels saturate.
- **Camera-Relative Stereo Panning:** Calculates panning relative to camera center: `(hexX - cameraCenterHexX) / (viewportWidthHexes / 2)`.
- **Audio Preloading Progress Bar:** Preloads high-priority sound assets during the initial Match Loading Screen / 0:00 Rite of the Opening with a visual loading bar, streaming ambient and secondary voice clips asynchronously.

## Stage 2 painted ground materials (2026-10-25)

The live hex ground uses five opaque generated `painted-*-v1.png` materials (field, jungle, path, courtyard, rampart) beneath the illustrated prop sprites. Pixi FillPatterns repeat at 256 world units per source image; scaling is normalized by image dimensions. Clearing reuses meadow art with a distinct light tint. Terrain veils are only 5-12% opaque to preserve surface detail. Fog, grid, units and event effects remain separate layers. Map terrain and simulation rules remain authoritative. Earlier SVG sources remain available. Build and five-region captures are recorded in `Stages/stage2-painted-terrain.md`.

## Implemented unit and status presentation (2026-10-26)

The current client loads the existing nine fixture character PNGs once, makes upper-body texture frames and draws them in cached 34-world-unit circular markers. Friendly and currently visible enemy markers have gold/red team borders and HP bars; selected platoons retain their selection ring. This is the present Stage 2 marker implementation, while the animated body/model milestones above remain later work.

Status labels show STUN, ROOT, SLOW, BLIND, CHANNEL and UNTARGETABLE from current unit state. Brief cast labels identify Watery Grave, Deadeye and Shadow Blink or an interrupted channel. Outlined Pixi Text is updated when the label changes; marker objects are reused per unit ID. Each refresh hides cached markers first and shows only living friendly or projected visible enemy units, preserving fog privacy. The event-driven harness verifies visible STUN and WATERY GRAVE labels at the actual skill event at 100% zoom, in addition to graphical effect and expiry captures. See `Stages/stage2-readability-and-hud-2026-10-26.md`.



