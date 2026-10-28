---
tags: [Units, ArtDirection, VisualDesign, Animations, Models, SpritePipeline, TwoTierVisual]
type: Technical Specification
---

# 🎨 11 - UNIT MODEL VISUAL ART DIRECTION & ANIMATION SPECIFICATION

> Visual language, armor aesthetics, color tokens, and the **Two-Tier Visual Pipeline** for the **80-unit roster** (8 classes × 10 units).
> 
> **Milestone 1 (Active Target):** High-Detail 2D Stylized Character Sprites + PixiJS v8 Procedural Tween Animation Engine. Eliminates the 16,000-frame asset generation bottleneck while delivering immediate, responsive gameplay juice and 60 FPS performance on standard hardware (Intel Iris Xe friendly).
> 
> **Milestone 2 (Deferred Expansion):** Pre-rendered 2.5D 8-directional isometric animated sprite sheets (~180–220 frames per unit) generated via automated headless Blender baking scripts.
> 
> **Decoupled Architecture Invariant:** All visual rendering is encapsulated behind `UnitVisualComponent`. The simulation engine, pathfinding, and networking interact strictly via abstract state events (`playState(state, direction)`), allowing a seamless drop-in transition from 2D billboards to 2.5D animated atlases with **zero technical debt and zero logic churn**.

---

## 1. 🧬 Two-Tier Universal Animation Architecture

Every unit supports the universal **8-state machine** (driven by the auto-battler command engine in `03`). The rendering tier determines how frames are generated:

### 1.1 Milestone 1: 2D Procedural Tween Engine (Active Target)
Units render as crisp, high-detail 2D character sprites anchored at `[0.5, 0.85]` (feet grounded inside the hex tile). 

- **Inner Hex Clamping Rule (Zero Vertical Occlusion Invariant):**
  - Sprites are scaled strictly within **72% of the hex inner diameter** with a 20% safe margin around weapon tips and halos.
  - **Guaranteed Invariant:** Even when units occupy adjacent vertical hex rows (North and South), **0% sprite overlap occurs**. Weapons, crowns, and boots never obstruct adjacent squad members.
- **Edge-Connected Floodfill Cutout Protocol:**
  - Background removal operates via boundary-connected floodfill BFS from image borders (`tolerance >= 230`), rather than global color-keying.
  - Preserves 100% of internal white silk garments, eye highlights, and metallic specular reflections within the character silhouette.

Animations are executed procedurally in the PixiJS v8 render ticker using zero-allocation pooled tweens:

1. `IDLE` — Sinusoidal breathing scale & bobbing: $y(t) = y_0 + \sin(\omega t) \times 2\text{px}$, scale $s(t) = 1.0 + \sin(\omega t) \times 0.03$ (period: 1.6s).
2. `MARCH` — Rhythmic hop and tilt: periodic bounce ($y - 4\text{px}$) with $\pm 4^\circ$ rotation wobble and horizontal facing flip (`scale.x = dir.x >= 0 ? 1 : -1`).
3. `ATTACK` — Directional lunge & recoil: 0.12s forward thrust (40% hex radius towards target) + weapon slash VFX overlay, followed by a snappy 0.18s spring recoil.
4. `ABILITY` — Signature wind-up & release: 0.3s glowing aura scale pulse ($1.15\times$) + golden ground decal, snapping into target cast with camera screen-shake (the **monochrome→color portrait moment** in Roster Panel `12 §4.3`).
5. `HIT` — Flinch & flash: 0.10s white color-additive flash + high-frequency horizontal displacement ($x \pm 3\text{px}$ at 20 Hz).
6. `CAST_CHANNEL` — Sustained grounding pose: subtle vertical float ($y - 3\text{px}$) with pulsing radial magic rings.
7. `DEATH` — Dissolution into gold dust: sprite opacity tweens to 0 over 0.6s while emitting 12 golden spark particles from the 150-particle pool (`08`), leaving scorched ground decal.
8. `REVIVE` — Radiant reassembly: vertical light pillar spawns, drawing gold dust inwards as sprite scales from $0 \to 1.0\times$.

### 1.2 Milestone 2: Pre-Rendered 2.5D Isometric Atlases (Deferred Expansion)
- **8-directional sprites** (N / NE / E / SE / S / SW / W / NW) for MARCH and ATTACK; 4-directional (N/E/S/W) for IDLE/ABILITY/DEATH.
- **Frame budget:** ≤ 8 frames per direction per state; total per unit ≈ 180–220 frames of 64×64 packed into class texture atlases.
- **Automated Blender Pipeline:** Rendered headlessly via automated Python scripts using 3D base rigs + class prop attachments.

### 1.3 `UnitVisualComponent` Decoupling Interface
```typescript
export interface IUnitVisual {
  readonly container: PIXI.Container;
  playIdle(): void;
  playMarch(velocity: { x: number; y: number }): void;
  playAttack(targetPos: { x: number; y: number }): void;
  playAbility(targetPos: { x: number; y: number }): void;
  playHit(damage: number): void;
  playChannel(): void;
  playDeath(): void;
  playRevive(): void;
  update(deltaMs: number): void;
}
```
In Milestone 1, `UnitVisualComponent` wraps `PIXI.Sprite` + `ProceduralTweenController`. In Milestone 2, it wraps `PIXI.AnimatedSprite` + `AtlasTrackController`.

---

## 2. 🎨 Class Art Direction & Color Tokens

| Class | Silhouette | Armor / visual language | Signature token |
| :--- | :--- | :--- | :--- |
| **⚔️ Fighter** | Athletic, one-handed blade or paired weapons, light golden plate | Sun-forged golden plate, lion pauldrons, crimson cloak trim | Imperial Gold `#D4AF37` |
| **🛡️ Tanker** | Broad tower-shield wall, heavy full plate | Tower shield w/ Imperial Suncrest, polished white enamel trim | Polished Steel `#E0E0E0` |
| **🔮 Mage** | Robed caster, floating tome/orb, crystal staff | Obsidian-embroidered robes, arcane crystal foci | Arcane Cyan `#00E5FF` |
| **🏹 Marksman** | Hooded sniper, heavy crossbow / dual bows | Gilded leather tunic, obsidian vambraces, scope | Sunburst Orange `#FF8C00` |
| **💚 Support** | White-gold vestments, healing stave / shield | Enamel-and-gold liturgical armor, soft glow accents | Emerald Green `#00A86B` |
| **⚙️ Siege** | Demolition cart / mortar platform, heavy apron | Reinforced iron-gilded apron, brass welding visor | Brass Yellow `#E5B80B` |
| **🔨 Artisan** | Tool belt, hammer/trowel, harness with crafting tools | Leather work harness, gilded tooling, clan badges | Jungle Bronze `#CD7F32` |
| **🗡️ Assassin** | Slim, cloaked, dual daggers or one ghost-blade | Dark leather + gilded trim, hood, smoke accents | Obsidian Black `#111116` |

**Per-unit variation:** 80 unique illustrations (8 classes × 10 units). The 10 units within each class share the class silhouette and body base, distinguishing themselves via weapon props, accessories, skin tint, and class-token offset. Item slots (Ancient Warblade / Excalibur) render as cosmetic badges or under-base auras.

---

## 3. ✨ Quality & Ground-Plane Integration Language

- **Hex Frame Dynamic Chroma Border (Primary Health Indicator):**
  - Soldier health is rendered directly onto the **ground-plane 2.5D hex border frame** (`#00E676` Green $\to$ `#FFD600` Yellow $\to$ `#FF1744` Red) in **1 GPU draw call** (`08 §1`).
  - **Sprite Cleanliness:** 2D character artwork remains 100% clean and unshaded by health bars, ensuring crisp class readability even during intense 20v20 clashes.
- **Tier Tint Ring Under Base:** Common (none) · Rare (blue ring) · Epic (purple ring) · **Ancient (gold, pulsing)** — item-bearing units show the equipped item's quality as an under-base circular glow aura (matches `Data/ItemList/00 §4`).
- **Divine Items:** Persistent radiant ground halo on carrier (Excavate shovel glow, Midnight smoke wisp, Absolute Shield light-reflect).
- **Platoon Distinction:** Platoon-leader unit carries a small gold pennant above the head; selected units display a sharp gold ground reticle.
- **Monochrome Readiness:** Grayscale readiness filtering is strictly a **UI-layer effect on Roster Panel portraits** (`12 §4.3`). In-world sprites never desaturate.
- **Dead Units:** Dissolve to golden dust particles; the Roster Panel displays the dark silhouette + 30s countdown timer (`12 §4.2`).

---

## 4. 🧵 Asset Pipeline & Budget

- **Milestone 1 Asset Budget:** Exactly **80 high-detail 2D character sprites** (formatted to 128×128 or 256×256, rendered at 64×64 in-world with High-DPI scaling).
- **Atlas Build:** Packed into two `2048×2048` master atlases (one for units, one for environment & structures). Loaded via `PIXI.Assets` with preload progress tracking.
- **Batching:** Group runtime sprites into atlases where profiling shows a benefit. Measure draw calls and texture memory with the full 80-unit catalog before setting a pass/fail budget.
- **Silhouette Test Gate:** Every unit illustration must pass a 64px pure black silhouette test against its class peers to eliminate tactical ambiguity.
- **Particle Budget:** Unit VFX reuses the 150-particle pool (`08`); death dissolves and hit sparks are particle-driven, avoiding baked sprite bloat.
