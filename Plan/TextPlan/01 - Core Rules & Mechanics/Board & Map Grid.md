---
tags: [Rules, Board, MapGrid, JungleBoss, TetherLeash, LastHit]
type: System Core
---

# 🗺️ BOARD & MAP GRID SPECIFICATION

> [!NOTE]
> 150-column × 90-row hex grid with two 30 × 50 jungle flanks, a 90 × 50 central battlefield, two centered 48 × 20 frontal castles, and four impassable cloud corners. The jungle leash and loot rules below still apply.

---

## 1. 🐾 Neutral Jungle Zones & 5-Hex Tether Leash

- **Jungle Zone A & B:** 30-column × 50-row side channels (rows 20–69) populated by neutral beast camps.
- **5-Hex Tether Leash:** If pulled 5 hexes away from their camp spawn, neutral monsters drop aggro, become invulnerable, and return to camp to heal to 100% HP.
- **Contested Bounty & Relic Distribution (>50% Damage Threshold - Q5 Confirmed):**
  - **Unique Objective Team Buffs (90s Duration):** Awarded strictly to the player whose army deals **>50% of total damage** to the boss:
    - **Elite Camp (2:00 Tuskgod):** **Stampede Blessing** (+25% Move Speed, +50% Camp Gold).
    - **Alpha Camp (8:00 Stormwing):** **Eyes of the Storm** (Clears enemy Courtyard Shroud for 45s, +15% Crit Chance).
    - **Ancient Camp (12:00 Emperor):** **Emperor's Bastion & Siege** (+15% DR, +100 True Siege Dmg/s to structures).
  - **Gold & XP Bounty:** Split **proportionally by damage dealt**, with an extra **+20% Gold bonus** to the unit landing the final killing blow.
  - **Physical Relic Drop:** Slain bosses drop a **Gilded Core Relic** onto their central hex, requiring an alive unit to stand on the hex for **3.0 seconds uninterrupted** to claim the equipment into their Arsenal. Wiped teams cannot claim relics.
- **30-Second Warning Horns:** An empire-wide alarm sounds 30s before any boss spawn, highlighting the hex on the minimap.
- **Jungle Boss Camps:** Three boss tiers, each with its own spawn time, bounty, and unique objective reward:
  - **Elite Camp (Tuskgod)** — `1,500 HP` — spawns `2:00` — drops `+120 XP | +150 Gold` · Stampede Blessing.
  - **Alpha Camp (Stormwing)** — `3,000 HP` — spawns `8:00` — drops `+200 XP | +300 Gold` · Eyes of the Storm.
  - **Ancient Camp (Emperor)** — `6,000 HP` — spawns `12:00` — drops `+350 XP | +500 Gold` · Emperor's Bastion & Siege.
  - **Authoritative boss stats, abilities & bounties:** `Data/Monster/01 - Jungle Bosses.md`. The numbers above remain the contract.

---

## 2. 🗺️ Canonical Zone Bounds & North-South Orientation

**Grid:** **150 columns (c: 0–149) × 90 rows (r: 0–89)** — the "90×150" board, using `TechnicalPlan/01` coordinates (`r: 0–89`).

**Revised layout from the player's board sketch:** the four corner rectangles are permanent, impassable cloud barriers. They are outside the traversable jungle. Each centered castle spans columns 51–98 (48 columns), leaving the central battlefield 90 columns wide. Its side edges and rear edge are blocked; attacks approach the front at row 19 (north) or row 70 (south). The north front has three three-hex gate openings centered at columns 59, 75 and 91; the south front is its 180-degree mirror, centered at 58, 74 and 90. Breachable wall segments remain a separate structure rule. The 20-row castle depth leaves space for the 10-row outer courtyard and 8-row inner keep plus perimeter walls.

Cloud barriers are a permanent **map boundary**, separate from dynamic fog of war or castle shroud. They use the impassable perimeter-cliff behavior of catalog tile 21 with a pale cloud presentation, so they do not increase the 22-tile catalog. The outer fronts are at rows 19 and 70; inner wall fronts are at rows 8 and 81. Their gate tiles are passable for the castle owner and blocked for attackers until a wall segment in that layer is breached. The five six-hex segments per layer remain separate damageable structures; gate tiles have no invented HP value.

| Zone | Columns (c) | Rows (r) | Size | Role & Dynamics |
| :--- | :--- | :--- | :--- | :--- |
| **WEST_JUNGLE** | 0 – 29 | 20 – 69 | 30 × 50 | Left flank farming, neutral creep dens, 2:00 Tuskgod Elite Boss Arena, stealth gank routes. |
| **BATTLEFIELD** | 30 – 119 | 20 – 69 | 90 × 50 | Central open meadow, King's Highway, and Emperor Altar. |
| **NORTH_CASTLE (P1)** | 51 – 98 | 0 – 19 | 48 × 20 | Top castle; blocked sides/rear, frontal wall at row 19 with three gates. |
| **SOUTH_CASTLE (P2)** | 51 – 98 | 70 – 89 | 48 × 20 | Bottom castle; blocked sides/rear, frontal wall at row 70 with three gates. |
| **EAST_JUNGLE** | 120 – 149 | 20 – 69 | 30 × 50 | Right flank farming, neutral creep dens, 8:00 Stormwing Boss Arena. |
| **CLOUD CORNERS** | 0 – 50 and 99 – 149 | 0 – 19 and 70 – 89 | Four 51 × 20 blocks | Permanently impassable; close all side and rear castle approaches. |

- **King's Highway and jungle access paths:** All path tiles grant **+10% Movement Speed** while occupied. The central north-south highway remains the primary clash spine. Four mirrored branches connect the two fortresses' front flank gates to both jungles; they reuse the highway terrain and illustrated dirt/stone material.
  - North-west: from the gate centered at `(59,19)`, with road starting at `(59,20)`, to `(30,29)` on the field side of the west jungle entrance.
  - North-east: from the gate centered at `(91,19)`, with road starting at `(91,20)`, to `(119,29)` on the field side of the east jungle entrance.
  - South branches are the 180-degree mirrors: gates `(58,70)` and `(90,70)`, road starts `(58,69)` and `(90,69)`, entrance endpoints `(30,60)` and `(119,60)`.
  - Branches have approximately three-hex width. They occupy only the existing middle map (rows 20-69); castle side/rear walls and cloud corners remain sealed. The map stays 150 by 90.
  - **Entrance-only revision (2026-10-26):** Road shoulders are clipped to battlefield columns 30-119. No road tile enters either jungle zone (columns 0-29 or 120-149); forest terrain and brush resume immediately beyond the path endpoint. The +10% movement bonus applies on the approach path, with normal forest speed and sight rules inside. Both teams can use any path; it is a terrain bonus, not a timed buff.
  - Platoons use their anchor tile for the shared marching bonus; detached/rallying units use their own tile. The bonus combines multiplicatively with applicable movement effects and stops adding speed after leaving path terrain.
- **Mid-point Altar:** The Ancient Emperor Altar sits at `(c: 75, r: 45)` at the exact midpoint of the King's Highway, with lateral connectors leading into West and East jungles.

---

## 3. 🌫️ Dynamic MOBA Fog of War & Jungle Canopy Vision Reduction

Aurolith utilizes an authentic **MOBA Line-of-Sight (LoS) Fog of War** engine:

1. **3-State Visibility Hierarchy:**
   - **Unexplored (Gray Shroud):** Static tile colors remain visible under a translucent gray overlay. Dynamic units, health bars, camp timers, and traps are hidden.
   - **Explored / Memory Shroud:** Scouted static terrain remains visible under a lighter gray overlay after live sight leaves. **Zero live intelligence:** dynamic units, health bars, camp timers, and traps are hidden.
   - **Active Vision (Full Color / Live Sight):** Currently illuminated by allied units, standing wall bastions, or aerial reconnaissance. Full real-time telemetry (HP bars, status effects, and stance chips).
2. **Line-of-Sight Obstacle Occlusion:**
   - Vision rays are occluded by structural terrain: intact 6-hex wall segments and the cloud border. Trees, canopies, fences and boulders are visual decoration and do not block movement or line of sight. Brush concealment remains a separate gameplay rule.
   - Each player always has live sight across their own fortress (columns 51–98, rows 0–19 north or 70–89 south). The ten rows immediately outside its outer wall also have ten columns of side warning vision: columns 41–108, rows 20–29 north or 60–69 south. This defended sight does not reveal the opposing fortress. Outside it, units and other sight rules reveal tiles normally.
3. **The Jungle Canopy Vision Penalty (50% Sight Reduction):**
   - **Open Battlefield:** Standard units possess an unobstructed **4-Hex Vision Radius** (Marksmen on wall ramparts gain **6 Hexes**).
   - **Jungle Zones (West & East Jungles):** Dense tree canopies and creeping mist penalize ground vision down to **2 Hexes** for standard units.
   - **Brush & Tall Grass Hexes:** Units inside brush hexes gain total concealment from units outside the brush (even if adjacent), creating high-leverage ambush zones. Vision into brush requires entering the brush tile or true sight.
   - **Assassin Native Stalker Trait:** Assassins ignore the canopy penalty, maintaining **4 Hexes of vision inside jungles** and detecting hidden footsteps in adjacent brush.

---

## 4. 🌾 The Complete 22-Tile Catalog & Two-Tier Layered Rendering

Terrain is strictly decoupled into **Two Visual Layers** in PixiJS v8 to eliminate tile-cut seams and guarantee organic visual blending across 13,500 hexes:

1. **Layer 1: Base Ground Textures (Seamless World-UV):** Pure repeating textures mapped continuously across global coordinates `(worldX, worldY)`. Adjacent hexes of the same biome possess **ZERO polygon seams**.
2. **Layer 2: Overlay Props & Obstacles (Transparent Cutouts):** Standalone objects placed on top of hexes. Canopies, boulders, and fences naturally overhang the hex border, breaking rigid polygon geometry.

| # | Tile Name | Group | Layer | Mechanics & Asset Path |
|---|---|---|---|---|
| **1** | Open Grass | 🌾 Field | Base Ground | Standard turf; 1.0× Move, open vision (`Tiles/1_Field/field_grass.jpg`). |
| **2** | Paved Dirt Path | 🌾 Field | Base Ground | **+10% Move Speed** rotation highway (`Tiles/1_Field/field_dirtpath.jpg`). |
| **3** | Tall Steppes Brush | 🌾 Field | Prop Decal | **Total Concealment** ambush zone (`Tiles/1_Field/prop_tall_brush.png`). |
| **4** | Low Stone Fence | 🌾 Field | Obstacle Prop | Blocks ground movement; ranged shoot over (`Tiles/1_Field/prop_stone_fence.png`). |
| **5** | Solitary Tree | 🌾 Field | Obstacle Prop | Blocks movement; casts vision shadow cone (`Tiles/1_Field/prop_field_tree.png`). |
| **6** | Craggy Boulders | 🌾 Field | Obstacle Prop | Impassable stone cluster; blocks LoS (`Tiles/1_Field/prop_craggy_boulders.png`). |
| **7** | Jungle Moss Floor | 🌴 Jungle | Base Ground | Humid earth; **Canopy Penalty (-50% vision)** (`Tiles/2_Jungle/jungle_floor.jpg`). |
| **8** | Canopy Trees | 🌴 Jungle | Obstacle Prop | Impassable jungle maze corridor (`Tiles/2_Jungle/prop_jungle_canopy.png`). |
| **9** | Fern Thicket | 🌴 Jungle | Prop Decal | Jungle ambush concealment (`Tiles/2_Jungle/prop_fern_thicket.png`). |
| **10** | Shallow River Ford | 🌴 Jungle | Base Ground | **-15% Move Speed** wading penalty (`Tiles/2_Jungle/river_shallow.jpg`). |
| **11** | Deep River Chasm | 🌴 Jungle | Base Ground | Impassable water boundary (`Tiles/2_Jungle/river_deep_chasm.jpg`). |
| **12** | Beast Den Nest | 🐾 Neutral Boss | Decal Prop | 5-hex leash creep spawn anchor (`Tiles/2_Jungle/boss_beast_den.png`). |
| **13** | Tuskgod Stone Pit | 🐾 Neutral Boss | Arena Decal | 2:00 Elite Boss arena; Stampede Blessing (`Tiles/2_Jungle/boss_tuskgod_pit.png`). |
| **14** | Emperor Altar | 🐾 Neutral Boss | Structure | 12:00 Ancient Boss spawn; Relic drop (`Structures/boss_emperor_altar.png`). |
| **15** | Suncrest Marble | 🏰 Base | Base Ground | Courtyard paving with gold inlays (`Tiles/3_Base/courtyard_marble.jpg`). |
| **16** | Courtyard Gravel | 🏰 Base | Base Ground | Clean military staging ground (`Tiles/3_Base/courtyard_gravel.jpg`). |
| **17** | Wall Ramparts | 🏰 Base | Base Ground | **+1 Elevation (+2 Vision Range)** (`Tiles/3_Base/castle_wall_rampart.jpg`). |
| **18** | Castle Portcullis | 🏰 Base | Structure | Friendly passage / Enemy barrier (`Structures/castle_gate.png`). |
| **19** | Facility Plot Pad | 🏰 Base | Decal Plot | Marked 3×3 construction foundation (`Tiles/3_Base/facility_pad.png`). |
| **20** | Inner Keep Core | 🗺️ Objectives | Structure | **Final match objective (4,500 HP)** (`Structures/inner_keep_core.png`). |
| **21** | Perimeter Cliff | 🗺️ Objectives | Base Ground | Impassable border bounding the 90×150 (`Tiles/3_Base/perimeter_cliff.jpg`). |
| **22** | Elevation Stairs | 🗺️ Objectives | Incline Prop | Stone steps connecting riverbed to field (`Tiles/1_Field/elevation_stairs.png`). |

---

## 5. 🎯 Unit Sprite Clamping & Ground Hex Frame Chroma

1. **Inner Clamping Rule (Zero Vertical Occlusion):**
   - Unit sprites are scaled strictly within **72% of the hex inner diameter** with a 20% safe margin.
   - Anchored firmly at `[0.5, 0.85]` with an ambient contact shadow.
   - **Guaranteed Invariant:** Even when units occupy directly adjacent vertical hex rows (North and South), **0% sprite overlap occurs**.
2. **Micro Hex Frame Chroma (Tier 2 UI Spec):**
   - Individual unit health is communicated exclusively via the **instanced ground-plane vector hex border stroke**:
     - `100% – 60% HP`: Luminous Emerald Green (`#00E676`) transitioning to yellow-green.
     - `60% – 30% HP`: Amber Yellow (`#FFD600`).
     - `< 30% HP`: Warning Crimson (`#FF1744`) with 2 Hz breathing pulse.
   - Unit sprite artwork remains 100% unshaded and clean, preserving class silhouette recognition without ugly floating HP bars obscuring character art.


