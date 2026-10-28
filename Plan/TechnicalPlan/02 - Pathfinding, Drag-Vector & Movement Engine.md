---
tags: [TechnicalPlan, Pathfinding, FlowField, DragVector, Formations, Movement]
type: Technical Specification
---

# 🚶 02 - PATHFINDING, DRAG-VECTOR & MOVEMENT ENGINE

> Flow Field vector pathfinding, `Ctrl+G` platoon merging, color-coded waypoints, and Frontline Wall Sweep formations.

**Stage 2 map rule:** tree, canopy, fence and boulder props are decorative and do not block traversal or sight. Structural cloud borders and castle walls retain their movement and line-of-sight rules. Brush hexes remain passable and preserve the concealment mechanic.

**Implemented jungle access update (2026-10-25, revised 2026-10-26):** Four mirrored highway-material branches run from the front flank gates to the battlefield side of both forest entrances, as specified in Board & Map Grid section 2. Map dimensions and castle boundaries are unchanged. Highway terrain supplies its canonical 1.10 speed factor in platoon marching, detached rallying, Outrider movement and defensive peel movement. A marching formation uses its anchor's terrain; independently moving units use their current tile. Roads stay outside the jungle zones, whose normal terrain, brush and sight rules are retained.

**Entrance-only revision (2026-10-26):** Branches stop at battlefield-side entrance points `(30,29)`, `(119,29)`, `(30,60)` and `(119,60)`. Clip the entire one-hex shoulder to columns 30-119, not just the road centerline. No highway terrain may extend inside west/east jungle zones. The approach keeps +10% movement; forest movement, brush and sight rules resume at the boundary. Earlier deep-jungle endpoints are historical.

The Stage 2 deterministic A* minimizes travel cost: leaving highway terrain costs 100, ordinary terrain 110, and the admissible distance heuristic is 100 per hex. Routing and movement share `terrainMoveSpeedBps` from the board module. This allows direct player orders and bot orders to use the faster roads when worthwhile without preferring an arbitrarily long detour. Existing wall ownership, breaches and blocked facilities still constrain traversal. The hierarchical flow-field design below remains a later implementation target.

---

## 1. ⚡ Hierarchical Flow Field & Flat Buffer Pathfinding

To maintain 60 FPS across 13,500 hexes without CPU spikes or Garbage Collection pauses:
- The 90×150 grid is divided into **15×15 coarse clusters** ($6 \times 10$ clusters total). Long-range platoon pathfinding evaluates cluster transition portals ($O(60)$ Dijkstra).
- Within the active and adjacent clusters, each **Platoon Leader** indexes its dedicated slice of a pre-allocated multi-platoon Flow Field buffer (`Float32Array(4 * 150 * 90 * 2)`), guaranteeing that different platoons never overwrite each other's velocity vectors.
- Units in each platoon sample velocity vectors directly from their platoon's flat buffer in $O(1)$ time by index `(platoonId * 150 * 90 + r * 150 + q) * 2` without allocating heap objects.
- `Shift + Drag` custom vector drawing pools B-spline coordinate samples inside a fixed `Float32Array(1024 * 2)` ring buffer, eliminating runtime garbage collection stutter.
- **Terrain Speed Modifiers & Rotation Corridors (Hybrid Flow Integration - Jev Consensus):**
  - **King's Highway and jungle branches (`Tile 2: field_dirtpath`):** Grant **+10% Movement Speed** (`moveModifier = 1.10`). The central north-south spine connects the fortress fronts at rows 19 and 70 through the altar at row 45. Four branches connect the front flank gates to west/east jungle access points; their exact bounds are defined in Board & Map Grid section 2.
  - **Shallow River Ford (`Tile 10: river_shallow`):** Imposes a **-15% Wading Penalty** (`moveModifier = 0.85`).
  - **Jungle Zones (`WEST_JUNGLE` & `EAST_JUNGLE`):** Off-path ground uses normal movement (`moveModifier = 1.0`); path tiles use 1.10. The 50% Canopy Vision Penalty remains zone-based, including jungle road tiles, serving as high-risk ambush and neutral farming corridors.
  - **Hybrid Velocity Execution:** Flow field integration calculates geometric gradient vectors; the unit translation ticker multiplies base march velocity by `tile.moveModifier` ($V_{\text{final}} = V_{\text{platoon}} \times \text{tile.moveModifier}$), ensuring zero detour jitter while rewarding strategic highway positioning.

```typescript
class HierarchicalFlowFieldPathfinder {
  // Pre-allocated flat buffers for integration and per-platoon direction vectors (4 platoons)
  private integrationBuffer = new Uint16Array(150 * 90);
  private flowVectorBuffer = new Float32Array(4 * 150 * 90 * 2);

  generateClusterFlow(platoonId: number, targetHex: HexTile, grid: HexTile[]): Float32Array {
    // 1. Run coarse portal pathfinding across 15x15 clusters
    // 2. Compute local integration field only on touched clusters
    // 3. Populate dedicated platoon slice of flowVectorBuffer without object instantiation
    return this.flowVectorBuffer.subarray(platoonId * 150 * 90 * 2, (platoonId + 1) * 150 * 90 * 2);
  }
}
```

---

## 2. 🖱️ Platoon Drag Selection & Zero-Micro Macro Model

- **Platoon-Level Selection Only:** Clicking any unit or overhead chip automatically selects its entire **5-man Platoon**. Individual frontline unit micro-selection is disabled, preventing AI command thrashing and reducing player cognitive load from $O(20)$ micro tasks to $O(4)$ macro tactical decisions.
- **In-Platoon Tactical Swap / Emergency Fallback:**
  - Resolves the "RTS muscle-memory shock" (wanting to save a 10% HP carry) without breaking the macro platoon invariant:
  - **Right-Clicking a specific soldier's hex or portrait** in the Roster Panel triggers an immediate **In-Platoon Tactical Swap** (3.0s cooldown per unit):
    1. **EHP Role-Weighted Replacement Scoring:** The advancing replacement is chosen by highest survival suitability:
       $$\text{Priority Score} = \text{EHP} \times W_{\text{Role}} = \left( \frac{\text{Current HP}}{1 - \frac{\text{Armor}}{\text{Armor} + 100}} \times (1 + \text{Passives}) \right) \times W_{\text{Role}}$$
       - $W_{\text{Tank}} = 1.6$, $W_{\text{Fighter}} = 1.3$, $W_{\text{Support}} = 0.7$, $W_{\text{Assassin}} = 0.6$, $W_{\text{Mage/Marksman}} = 0.2$.
       - This guarantees a 65% HP Fighter will always step forward before a 100% HP fragile Mage!
    2. **0.3s Physical Dash Step (No Instant Teleports):** The advancing unit dashes forward at $2.5\times$ speed to secure the frontline tile, while the retreating carry slides back into the rearguard with a 0.3s aggro-immunity window.
    3. **Aggro Shedding:** Attacking melee enemies immediately drop target lock from the retreating unit and lock onto the newly advanced defender.
    4. The unit **never splits away from the 5-man platoon**, preserving unified movement and stance cohesion.
- **Platoon March Speed Model (Formation-Clamped Anchor Pace):**
  - To prevent fast units (Assassins at 4.2 hex/s) from sprinting ahead of heavy tanks (2.6 hex/s) and breaking the formation frame during travel:
    $$\text{Platoon March Speed} = V_{\text{Anchor}} \times \left(1 + 0.03 \times N_{\text{Skirmishers}}\right)$$
    - The platoon moves as a single cohesive unit anchored by its frontline pace, gaining a $+3\%$ formation speed bonus per lightweight skirmisher/assassin in the squad (up to $+12\%$).
    - **Combat Burst Exception:** The instant combat engages or Directive `[X] Backline Dive` is issued, individual combat speeds unlock, allowing Assassins to break formation at their full 4.2 hex/s sprint speed.
- **Platoon Drag Box:** Left-click + drag draws a selection box that selects any friendly platoons whose convex hull or member units intersect the rectangle.
- **Autonomous Role Execution (Including Assassins):** All 8 classes (including Assassins and Scouts) operate strictly within their designated 5-man platoon. Assassins execute their signature stealth backstabs autonomously via class Smart-Tactics AI when the platoon is in Aggressive stance `[A]` or when issued Directive `[X] Backline Hunt`.
- **Shift + Left-Click + Drag:** Paints a Custom Vector Movement Path for the currently selected Platoon.
- **Input Protection:** UI drawer animations are deferred while `isVectorPainting === true` until mouse drag is released.
- **Clamped Off-Screen Boundaries:** Mouse coordinates outside the 90×150 canvas automatically clamp to valid border hexes (`q = clamp(q, 0, 149)`, `r = clamp(r, 0, 89)`).

---

## 3. 🎯 Strict Platoon Architecture (4 Platoons × 5 Units = 20 Cap Invariant)

- **Strict $4 \times 5 = 20$ Invariant:** The army consists of exactly **4 Platoons** (Hotkeys `1`, `2`, `3`, `4`), each holding up to **5 units** (Army Cap = 20). Zero unassigned or "loose" units wander the battlefield.
- **Direct Guild Recruitment:** Newly hired champions from the Deterministic Mercenary Guild are assigned directly into the active player's selected platoon slot (or auto-fill the platoon with the lowest unit count).
- **Auto-Rally Respawn Pipeline:** When a fallen unit completes its 30-second respawn at the Castle Core, it automatically re-evaluates its platoon membership and executes an individual Flow Field path to reunite with its Platoon Centroid ($C_q, C_r$).
- **Frontline Wall Sweep Formation:** When attacking a wall breach, platoons automatically fall back into a 3-hex wide wedge/firing line at the breach mouth (frontline melee in contact, ranged units standing 3–5 hexes back).
- **Independent Stopping Ranges:** Units in mixed platoons stop based on their individual attack range (Marksmen stop at 4–5 hex range; Fighters/Tankers advance to 1-hex melee range).
- **`Ctrl + G` Platoon Rebalancing:** To re-organize units between squads, the commander can select two platoons and press `Ctrl + G` to rebalance roles (preserving the strict 5-unit max cap per platoon).

```typescript
class PlatoonManager {
  private platoons: Platoon[] = [
    new Platoon(1, 'Imperial Amber', 0xF59E0B),
    new Platoon(2, 'Azure Cyan',     0x06B6D4),
    new Platoon(3, 'Crimson Ruby',    0xEF4444),
    new Platoon(4, 'Emerald Jade',    0x10B981)
  ];

  assignRecruitToPlatoon(unit: Unit, targetPlatoonId?: number): boolean {
    const target = targetPlatoonId 
      ? this.platoons.find(p => p.id === targetPlatoonId)
      : this.getPlatoonWithLowestCount();

    if (!target || target.units.length >= 5) {
      showWarningUI('Selected platoon is full (Max 5 units)!');
      return false;
    }

    target.addUnit(unit);
    unit.platoonId = target.id;
    return true;
  }

  handleUnitRespawn(unit: Unit, coreTile: HexTile) {
    unit.hp = unit.maxHp;
    unit.isDead = false;
    unit.tile = coreTile;

    const platoon = this.platoons.find(p => p.id === unit.platoonId);
    if (platoon && platoon.getLivingUnits().length > 0) {
      // Auto-rally to living platoon centroid
      const centroid = platoon.computeCentroid();
      unit.issueMoveOrder(centroid);
    }
  }
}
```

---

## 4. 🗺️ Command Queue Visual Feedback (Waypoints & Tactical Vectors)

When commands are issued or chained with `Shift` (`J` Jungling → `G` Gather → `A` Attack), the engine projects dynamic color-coded paths with animated chevrons and floating destination badges:

1. **Platoon Color Coding:**
   - **Platoon 1 (Hotkey `1`):** Imperial Amber (`#F59E0B`)
   - **Platoon 2 (Hotkey `2`):** Azure Cyan (`#06B6D4`)
   - **Platoon 3 (Hotkey `3`):** Crimson Ruby (`#EF4444`)
   - **Platoon 4 (Hotkey `4`):** Emerald Jade (`#10B981`)
2. **Dynamic Ground Convex Hull:**
   - Units in the platoon are bound by a subtle, semi-transparent ground contour rendered in their Platoon's accent color.
3. **Animated Vector Chevron Trails (`>>>`):**
   - An animated chevron trail in the platoon's color projects from the platoon centroid to its target destination hex.
4. **Floating Tactical Destination Badges:**
   - Destination hexes display an isometric floating badge:
     - `[P1] ⚔️ ATTACK WALL BREACH` (Red border)
     - `[P2] 🛡️ GUARD CHOKEPOINT` (Blue border)
     - `[P3] 🌲 CLEAR GORGON CAMP` (Green border)
     - `[P4] 🏃 RETREAT TO RALLY HEX` (Yellow border)
   - Chained waypoints display numbered flags: `[1]`, `[2]`, `[3]`.

---

## 5. 🛡️ Dynamic Accordion Chokepoint Funneling & Minimum 3-Hex Breach Invariant
 
 > **The Minimum 3-Hex Breach Invariant (ADR-001, Jev Confirmed 60%):**  
 > To mathematically eliminate permanent deadlock states where opposing 5-man platoons meet head-on in a bottleneck, **all destroyed wall segments and castle gates dynamically clear an open corridor of AT LEAST 3 HEXES WIDE ($W_{\text{hex}} \ge 3$)**. 1-hex terrain gaps are restricted exclusively to natural mountain switchbacks and neutral jungle bridges where simultaneous two-way platoon assault cannot occur.

When pathfinding a 5-unit platoon through narrow terrain constraints:

1. **Detection of Geometric Constriction:**
   - The pathfinder analyzes the path corridor width ($W_{hex}$). If $W_{hex} < 3$ hexes (the standard 2-front / 3-back formation bounding box), the formation controller automatically enters **Accordion Funneling Mode**.
2. **Initiative-Ordered Column Collapse:**
   - Units collapse dynamically from wide formation into a single-file column based on class role initiative:
     - **Point 1 (Front Vanguard):** Tank / Heavy Melee (takes first contact / aggro).
     - **Point 2–3 (Midguard):** Fighters / Assassins / Skirmishers.
     - **Point 4–5 (Rearguard):** Marksmen, Mages, and Support.
   - Units queue in single-file progression through constriction without pathing deadlocks, jittering, or halting. Soft stacking allows friendly units to slide through each other with a minor 15% speed damping.
3. **Automatic Post-Breach Line Reformation:**
   - The moment the lead unit exits the constriction into open terrain ($W_{hex} \ge 3$), it advances 2 hexes forward while following squad members fan out laterally to their designated custom 3-rank positions.
   - **Zero-Micro Rule:** Squad members execute this defensive fan-out autonomously without requiring player waypoints or micro-clicks.

---

## 6. 📐 Customizable 3-Rank Formation Grid Matrix

To solve the positioning vulnerability where a 5-unit Rainbow comp (1 Tank, 1 Fighter, 1 Marksman, 1 Mage, 1 Support) would otherwise force squishy ranged units into the front rank:

```
              [ RANK 1: VANGUARD (1-3 SLOTS) ]
                    < >    [ Tank ]    < >
         
          [ RANK 2: MIDLINE / FLANK (1-4 SLOTS) ]
            < >    [ Fighter ]    [ Assassin ]    < >
         
             [ RANK 3: REARGUARD (1-3 SLOTS) ]
            [ Mage ]    [ Marksman ]    [ Support ]
```

1. **Customizable Rank Slotting:**
   - In the Roster Panel (or via drag-and-drop in base), players can freely assign their 5 units into any slot within this 3-rank formation template:
     - **Solo-Tank Spearhead:** Place 1 Tank solo on Rank 1 center; place all 4 squishies safely in Rank 3.
     - **Twin-Tank Wall:** Place 2 Tanks in Rank 1 for wide chokepoint blocking.
     - **Double Flank Ambush:** Place Assassins on the extreme outer wings of Rank 2.
2. **In-World Field Visualization:**
   - On the battlefield, the platoon's active formation footprint is rendered as a **subtle translucent white/grey frame hull** (or colored with the platoon's accent: Amber, Cyan, Ruby, Jade).
   - Units preserve their relative matrix offsets while moving along vector paths. In 1-hex breaches, the matrix collapses into single file, then snaps back into the player's customized 3-rank configuration upon clearing the choke.

---

## 7. 👁️ Vision Scouting: Outrider Directive `[J]` & Flexible Solo Squads

To enable high-speed vision scouting across the 90×150 battlefield without UI bloat:

1. **Directive `[J]` (Outrider / Jungle Scout):**
   - When a platoon containing an Assassin or Scout is issued Directive `[J]`, the scout advances 3–4 hexes ahead of the platoon's formation hull, projecting their **+2 Vision Cone** forward through jungle canopy and revealing hidden brush hexes.
   - **Tumble & Rally Reaction:** If an enemy ambush is detected, the scout automatically executes an evasive vault back into the platoon's defensive ranks while triggering an immediate alert ping on the minimap.
2. **Flexible Platoon Sizing (The Solo Outrider Option):**
   - Because each of the 4 platoons has a **maximum capacity of 5 units** (rather than a mandatory fixed 5), players who prefer dedicated solo scouting can simply place a single Assassin in **Platoon 4 (`[4]`)**.
   - A 1-unit scout platoon moves at the Assassin's full unimpeded **4.2 hex/s sprint speed** across the river and neutral camps, fulfilling the dedicated scout fantasy with zero HUD bloat (preserving the clean `1`–`4` hotkey layout).


