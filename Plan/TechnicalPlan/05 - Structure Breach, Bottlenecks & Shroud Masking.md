---
tags: [TechnicalPlan, Structures, Breaches, Shroud, DamageRetention, HotseatFoW]
type: Technical Specification
---

# 🧱 05 - STRUCTURE BREACH, BOTTLENECKS & SHROUD MASKING

> 6-hex segment HP tracking, 500/750/1000 HP facility tiers, mid-combat damage retention, 50% upgrade refund rules, and Hotseat FoW perspective switching.

---

## 1. 🧱 Segmented Wall HP, Demolition Sapping & Desperation Battery

- **Outer Wall:** 5 Segments @ `3,000 HP` per segment.
- **Inner Wall:** 5 Segments @ `4,500 HP` per segment.
- **-70% Non-Siege Resistance:** Intact walls and facilities take **-70% reduced damage** from non-siege units.
- **Demolition Sapping (Anti-Stalemate Decay & Gradual Recovery — Jev Confirmed 90%):** When non-siege units maintain continuous combat contact with an intact wall segment, structural fatigue accumulates:
  - **Integer Basis-Point Quantization (Deterministic Core):** Base resistance is **7,000 BPS** (70.0% reduction).
  - **Decay Rate:** Resistance penalty **decays by 500 BPS (5.0%) every 15 seconds** of continuous contact, capping at a maximum floor of **4,000 BPS (40.0% penalty) after 90 seconds**.
  - **Gradual Recovery:** Breaking combat contact does **NOT** instantly wipe sapping progress. Instead, structural resistance recovers gradually at **500 BPS (5.0%) every 10 seconds of absence** back toward the 7,000 BPS baseline. This prevents defenders from exploiting 1-second barricades to erase 90 seconds of siege investment while still rewarding defenders who push attackers away.
- **Castle Core Desperation Battery (Courtyard Defense):**
  - Upon any Outer Wall breach, the Castle Core awakens:
    - **Courtyard Bastion Aura:** Friendly units within the courtyard gain **+15% Damage Reduction and +10% Tenacity**.
    - **Arcane Obelisk Turret:** Fires a targeted 150 True Damage bolt every 4.0s at the highest-DPS enemy unit inside the courtyard.
    - **Facility Counter-Play:** The Arcane Obelisk's targeting core is powered by the courtyard's **Arcane Barrier** or **Sanctuary** facility. Attackers can disable the turret fire by destroying this 3×3 building first.

---

## 2. 🛡️ Mid-Combat Facility Upgrade Damage Retention & 50% Refund

- **Damage Retention:** Upgrading a facility retains existing damage taken ($\text{New HP} = \text{New Max HP} - (\text{Old Max HP} - \text{Old Current HP})$).
- **50% Refund:** If destroyed mid-upgrade, cancels upgrade and refunds **50% of Gold/XP cost**.
- **10-Second Rubble Cooldown:** Destroyed facilities leave a 10-second rubble cleanup phase before the 3×3 slot can accept a new build order.

---

## 3. 🌫️ Dynamic MOBA Line-of-Sight (LoS) Fog of War & Jungle Canopy Shroud

- **Global 3-Tier Fog of War Architecture:**
  - **Tier 1 — Unexplored (Pitch Black):** Blackened hexes; geometry and terrain completely unrevealed.
  - **Tier 2 — Explored / Memory Shroud (Static Grey):** Known static terrain (cliffs, walls, facilities, trees) rendered in desaturated monochrome. **Zero dynamic data:** enemy units, health bars, neutral camp statuses, and traps are completely invisible.
  - **Tier 3 — Active Line-of-Sight (Live Sight / Full Color):** Hexes currently illuminated by friendly line-of-sight. Full real-time entity rendering, health bars, stance chips, and spell telegraphs.
- **Raycast / Shadowcasting Line-of-Sight (LoS) Occlusion:**
  - Vision rays project outward from unit hex centers and are blocked by structural terrain:
    - **Intact Wall Segments (6-hex spans):** Block ground-level vision. Units behind intact walls are hidden until a breach occurs.
    - **Tree, canopy, fence and boulder props:** Decorative only; they do not cast sight shadows. Brush concealment is still checked independently for units inside brush hexes.
- **Vision Radii & The Jungle Canopy Reduction Rule:**
  - **Open Battlefield (Standard Sight):**
    - **Standard Ground Units (Fighter, Tanker, Mage, Support, Siege, Artisan):** Base circular vision of **4 Hexes**.
    - **Wall-Stationed High Ground Units (Marksmen / Ballistae):** Elevated vision of **6 Hexes** looking down onto battlefield lanes and breaches.
    - **Aerial Recon (Falcon Recon, Orbital Flare):** Unobstructed aerial vision ignoring ground blockers (10–12 hex radius).
  - **Jungle Zones (Jungle A & B — Reduced Canopy Vision):**
    - Under the thick jungle canopy, standard unit vision is **severely penalized: 4 Hexes → 2 Hexes** (50% reduction).
    - **Brush / Tall Grass Hexes:** Units inside brush are completely concealed from units outside the brush. Vision into brush requires physically entering the same or adjacent brush hex, or triggering True Sight.
    - **Assassin Jungle Native Passive:** All Assassins possess predatory night-vision, retaining **4 Hexes of vision inside jungle hexes** (ignoring the 2-hex penalty) and revealing hidden enemies in adjacent brush hexes.
- **Leak-Free Shroud Fade:** When friendly units move, alpha masks smoothly transition between 1.0 and 0.0, explicitly calling `Pixi.Ticker.shared.remove(fadeCallback)` when `alpha <= 0` to prevent memory leaks.
- **Hotseat & Observer Perspective Switching:** Local hotseat rebuilds the player-specific view and clears old DOM/hover data before switching seats. An online observer gets only the information its explicit spectator policy allows; see `TechnicalPlan/13`.

---

## 4. 🚀 Two-Stage Mathematical Frustum & Shroud Culling Pipeline

On a 90×150 grid (13,500 hexes), first cull outside the camera, then draw only the layers allowed by the player's visibility. The diagram is a target design; the illustrated frustum size and draw-call counts must be measured rather than treated as fixed guarantees:

```
[ 13,500 Total Hexes ]
         │
         ▼  (Stage 1: Camera Frustum Culling - O(1) Coordinate Bounds)
[ ~300 Hexes in Frustum ] (90% Discarded before GPU)
         │
         ├───────────────────────────────┬───────────────────────────────┐
         ▼                               ▼                               ▼
   [ UNEXPLORED ]                  [ EXPLORED ]                    [ VISIBLE ]
   • ZERO Terrain Draws            • Static Cached Terrain Only    • Full Terrain Texture
   • ZERO Entity Draws             • Tinted at 0.4 Brightness      • Instanced Hex Chroma
   • Canvas Clear (#0a0a0f)        • 100% Entities Culled          • Sprites + VFX + Crests
   • (0 Draw Calls / 0 Fillrate)   • (1 Batched Background Pass)   • (Live Tactical Feed)
```

1. **Stage 1: Frustum Culling ($O(1)$ Math):**
   - The camera frustum clamps the rendered bounding box: `minQ..maxQ`, `minR..maxR` (+ 2 hex safety margin).
   - Hexes outside this bounding box are not submitted for rendering. The number excluded depends on zoom and viewport size.
2. **Stage 2: Shroud State Masking (Bitwise Evaluation):**
   - **`UNEXPLORED` (Black Shroud):** Do not submit hidden terrain or entities. Render a dark backdrop or shroud as needed; profile the actual pass count and fill cost.
   - **`EXPLORED` (Grey Shroud / Static Memory):** Renders only the static terrain sprite cache with a 0.4 ambient darkness multiplier. All enemy units, jungle monsters, trap decals, and dynamic hex border chroma shaders are **completely culled**.
   - **`VISIBLE` (Active Line of Sight):** Full rendering pass including unit sprites, instanced hex chroma frames, dynamic particle emitters, and floating platoon crests.

