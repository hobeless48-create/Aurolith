---
tags: [TechnicalPlan, AssetPipeline, SpriteAtlas, UIEngine, ComponentTree]
type: Technical Specification
---

# 🎨 09 - UI LAYOUT ENGINE & SPRITE ASSET PIPELINE

> Sprite atlases for the PixiJS battlefield, DOM components for information panels, asset preloading, and one-way UI state binding. See `TechnicalPlan/12` and `TechnicalPlan/14` for ownership and stages.

---

## 1. 📦 Sprite Sheet Texture Atlases & Asset Pipeline

Pack runtime world sprites into atlases after measuring texture and draw-call pressure. The atlas count and dimensions are outputs of profiling, not fixed requirements. DOM panels can use ordinary images and CSS; they need not share a WebGL atlas.

```
Assets/ (Source Repositories)
├── Tiles/
│   ├── 1_Field/               (field_grass, field_dirtpath, prop_tall_brush, prop_stone_fence, prop_field_tree, prop_craggy_boulders, elevation_stairs)
│   ├── 2_Jungle/              (jungle_floor, prop_jungle_canopy, prop_fern_thicket, river_shallow, river_deep_chasm, boss_beast_den, boss_tuskgod_pit)
│   └── 3_Base/                (courtyard_marble, courtyard_gravel, castle_wall_rampart, facility_pad, perimeter_cliff)
├── Structures/                (castle_gate, boss_emperor_altar, inner_keep_core)
├── Units/                     (1_Fighter/ .. 8_Assassin/ - 80 Units at 72% inner hex scale)
└── Showcases/                 (Showcase atlases and tactical composites)

public/assets/ (Packed WebGL Runtime Atlases)
├── sprites/
│   ├── units_atlas.json        (80 unit transparent sprites, clamped to 72% hex diameter)
│   ├── structures_atlas.json   (Wall segments, 3x3 facilities Tier 1-3, Gates, Emperor Altar, Core)
│   ├── environment_atlas.json  (14 transparent props/decals + 8 seamless base textures)
│   └── vfx_atlas.json          (Explosions, fuses, spell circles, traps)
├── ui/
│   ├── ui_frames_atlas.json    (HUD panels, card frames, stance buttons, icons)
│   └── font/
│       ├── gilded_font.fnt     (BitmapText font descriptor)
│       └── gilded_font.png     (BitmapText texture atlas)
└── audio/
    └── audio_manifest.json     (Sound key mapping for Howler.js)
```

---

## 2. 🌳 World canvas and DOM panel hierarchy

```
Stage (Pixi.Container)
├── WorldLayer (Terrain, structures, units with Y-sorting)
├── TacticalWorldOverlayLayer (In-World Telemetry - always above units)
│   ├── GroundHexChromaLayer        (Hex tile border dynamic color shift Green -> Yellow -> Red)
│   ├── PlatoonHullRenderer         (Dynamic convex hulls in Amber, Cyan, Ruby, Jade)
│   ├── OrderVectorContainer        (Animated chevron trails '>>>' to destination)
│   ├── WaypointBadgeContainer      (Isometric floating destination badges [P1] ATTACK)
│   ├── AggroLaserLeashLayer        (0.5 alpha dashed targeting lines)
│   └── PlatoonCentroidCrestLayer   (ONE master bar per squad centroid with 5 soldier pips)
└── InWorldHUDLayer (Pixi.Container)
    ├── PerimeterThreatChevrons
    └── TargetReticlesAndHints

DOM overlay (fixed screen space, outside Pixi stage)
├── TopBarAndMacroRibbon
├── ConsolidatedRosterPanel (4 platoons × up to 5 units)
├── MinimapFrame (world minimap canvas inside)
├── CardDrawer (6 hand slots, 15s overflow area, discard)
├── BlessingDrawer (3 options, once-per-match reroll)
├── RecruitAndArsenalPanels
└── PauseAndResultPanels
```

---

## 3. ⚡ Dynamic UI State Binding Engine

The simulation emits a typed, player-specific `viewState`. Both Pixi world objects and DOM widgets render from it; widgets send commands and never mutate `CommanderState` directly:

```typescript
function renderGoldCounter(element: HTMLElement, viewState: PlayerViewState) {
  element.textContent = `GOLD: ${viewState.gold}`;
}
```


## Stage 2 facility availability feedback - 2026-10-26

The local HUD derives facility categories from the shared facilityCategory helper and shows Combat N/3 and Production N/3 alongside unspent facility XP. Disable Build for an occupied slot, uncleared rubble, Arcane Barrier outside the courtyard or a full selected category; supply the reason in its title. Pending facilities count toward the shared category limit. This is client feedback for existing rules, not a balance change. See ../Stages/stage2-late-game-2026-10-26.md for the browser scenario that exposed the issue.
