---
tags: [TechnicalPlan, HexGrid, Coordinates, ScreenToHex, SoftStacking]
type: Technical Specification
---

# 📐 01 - HEX GRID ENGINE & COORDINATE SYSTEMS

> Data structures, coordinate transforms, 90×150 grid management, 5-hex jungle tether leashes, and soft hex stacking physics.

---

## 1. 🌐 Axial & Cube Coordinate Systems (90×150 Grid)

The 90×150 hex board uses **Axial Coordinates `(q, r)`** internally mapped to **Cube Coordinates `(x, y, z)`** where `x + y + z = 0` to enable $O(1)$ distance calculations and neighbor lookups.

```typescript
interface HexTile {
  q: number; // Column (0 to 149)
  r: number; // Row (0 to 89)
  zone: 'CLOUD' | 'WEST_JUNGLE' | 'BATTLEFIELD' | 'EAST_JUNGLE' | 'NORTH_FORTRESS' | 'SOUTH_FORTRESS';
  tileId: number;                   // 1 to 22 (from 22-Tile Master Catalog)
  isWalkable: boolean;
  moveModifier: number;             // 1.10 (King's Highway, Tile 2), 0.85 (Shallow River, Tile 10), 1.0 standard
  isJungleCanopy: boolean;          // True in West/East Jungle: penalizes vision 50% (4 -> 2 hexes)
  isBrush: boolean;                 // True in brush hexes (Tiles 3 & 9): grants total outside concealment
  elevation: number;                // 0 ground level, +1 on Wall Ramparts (Tile 17: +1 Attack Range, +2 Vision)
  occupants: Unit[];                // Up to 2 units (Soft Stacking Limit during bottlenecks)
  structureEntity: Structure | null;// Multi-hex structure entity reference (Walls, Facilities, Core, Altar)
  trapId: string | null;            // Hidden Trap Card ID
  shroudState: 'UNEXPLORED' | 'EXPLORED' | 'VISIBLE'; // 3-Tier Dynamic MOBA Line-of-Sight
}
```

The four `CLOUD` corner regions in `TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md` §2 are permanently impassable. They are map boundaries, not the dynamic `shroudState` fog-of-war system. Front gates are traversable terrain fixtures in the board prototype; ownership and siege rules later determine when an army may pass through a gate or breach a front wall.

### Cube Distance Formula
$$\text{Distance}(A, B) = \frac{|A.x - B.x| + |A.y - B.y| + |A.z - B.z|}{2}$$

---

## 2. 🎯 Unified Multi-Hex Entity Selection & Raycasting

Multi-hex structures (6-hex wall segments and 3×3 facility footprints) share a single entity reference across all underlying hex tiles:

- **Entity Raycasting:** Clicking ANY hex tile belonging to a 6-hex wall segment or 3×3 facility selects and targets the **entire structure entity**, highlighting its full footprint.

```typescript
function getEntityUnderMouse(pixelX: number, pixelY: number, grid: Map<string, HexTile>): Entity | null {
  const hex = pixelToHex(pixelX, pixelY);
  const tile = grid.get(`${hex.q},${hex.r}`);
  if (!tile) return null;

  if (tile.occupants.length > 0) return tile.occupants[0];
  if (tile.structureEntity) return tile.structureEntity;
  return tile;
}
```

---

## 3. 👥 Soft Hex Stacking Physics (Max 2 Units per Hex)

- **Movement Funneling:** Up to **2 units** can occupy a single hex tile temporarily while moving through breach bottlenecks.
- **Soft Repulsion Physics & Epsilon Clamp:** When stationary or attacking, units exert soft repulsion forces ($F_{\text{repulsion}} = \frac{k}{\max(d, 0.25)^2}$) to smoothly spread out into **1 unit per hex**. Clamping $d \ge 0.25$ strictly prevents division-by-zero singularities and `NaN` coordinate explosions when units spawn or cross centroids simultaneously.

---

## 4. 🐾 Neutral Monster Contested Bounty & 5-Hex Leash

- **5-Hex Tether Leash with LoS Validation:** If pulled 5 hexes away from spawn camp or if physical line-of-sight back to the camp anchor is completely broken by a structure, neutral monsters drop aggro, become invulnerable, and return to camp at +100% Move Speed to heal to 100% HP. If the spawn anchor hex is blocked upon arrival, monsters push the blocking unit to the nearest adjacent walkable hex.
- **Contested Bounty Rule (>50% Threshold & +20% Finisher Bonus):**
  - Camp damage is tracked per commander using **applied damage capped at remaining HP**. Any player dealing **> 50% of total applied damage** secures the primary bounty (+80 XP, +100 Gold).
  - In a 50/50 contested engagement, bounty is split evenly (40 XP / 50 Gold each), and the player whose unit deals the final killing blow earns a **+20% Last-Hit Finisher Bonus** (+16 XP / +20 Gold).

```typescript
function applyDamageToMonster(monster: MonsterEntity, damage: number, attacker: Unit) {
  if (monster.isDead || monster.isInvulnerable) return;
  const applied = Math.min(Math.max(damage, 0), monster.hp);
  if (applied === 0) return;
  monster.hp -= applied;
  monster.damageLog.set(attacker.owner.id, (monster.damageLog.get(attacker.owner.id) || 0) + applied);
  createDamageFloatText(monster.tile, applied, 0xFF4444);

  if (monster.hp <= 0 && !monster.isDead) {
    monster.isDead = true;
    resolveContestedMonsterBounty(monster, attacker);
    // Recompute occupancy/walkability from terrain and structures; do not force the hex walkable.
  }
}

function resolveContestedMonsterBounty(monster: MonsterEntity, killer: Unit) {
  const totalDmg = Array.from(monster.damageLog.values()).reduce((sum, dmg) => sum + dmg, 0);
  let majorityOwner: CommanderState | null = null;

  for (const [ownerId, dmg] of monster.damageLog.entries()) {
    if (dmg * 2 > totalDmg) {
      majorityOwner = getCommanderById(ownerId);
      break;
    }
  }

  if (majorityOwner) {
    // Majority winner claims full base bounty
    majorityOwner.xp += 80;
    majorityOwner.gold += 100;
    createFloatingTextLootBurst(monster.tile, `+80 XP | +100 Gold (${majorityOwner.id})`, 0xFFD700);
  } else {
    // 50/50 split + 20% finisher bonus to killer
    for (const [ownerId] of monster.damageLog.entries()) {
      const comm = getCommanderById(ownerId);
      comm.xp += 40;
      comm.gold += 50;
    }
    killer.owner.gold += 20;
    killer.owner.xp += 16;
    createFloatingTextLootBurst(monster.tile, `Contested Split! +20g Finisher (${killer.owner.id})`, 0xF59E0B);
  }
}
```

---

## 5. 🛡️ Platoon Convex Hull & Spatial Color Tokens

Each of the 4 platoons (5 units each) maps to a distinct visual color token and spatial boundary:

| Platoon | Name | Color Hex | RGB | Minimap & World Visual Identity |
| :--- | :--- | :--- | :--- | :--- |
| **Platoon 1 (`1`)** | Imperial Amber | `#F59E0B` | `245, 158, 11` | Primary Frontline / Mid Lane Assault |
| **Platoon 2 (`2`)** | Azure Cyan | `#06B6D4` | `6, 182, 212` | Flank / Jungle Harvester / Objective |
| **Platoon 3 (`3`)** | Crimson Ruby | `#EF4444` | `239, 68, 68` | Siege Artillery / High DPS Spearhead |
| **Platoon 4 (`4`)** | Emerald Jade | `#10B981` | `16, 185, 129` | Tactical Reserve / Courtyard Defense |

- **Platoon Centroid:** Computed as the arithmetic mean of the 5 member units' axial coordinates: $C_q = \frac{1}{5} \sum q_i, \quad C_r = \frac{1}{5} \sum r_i$.
- **Convex Hull Ground Boundary:** Evaluated via Graham Scan ($O(N \log N)$ where $N \le 5$) over the isometric screen coordinates of the 5 units, rendering a translucent, anti-aliased polygon (0.25 alpha fill, 1.5px border) that expands and contracts dynamically as units maneuver.

---

## 6. 🔍 Dual-Tier Semantic Zoom & Spatial Frustum Navigation

To navigate the massive 90×150 hex board (13,500 tiles) without APM fatigue:

1. **Dual-Tier Semantic Zoom Thresholds:**
   - **Tactical Micro View ($1.0\times \ge \text{Scale} \ge 0.6\times$):**
     - Renders individual soldier sprites (8-direction walk/attack cycles).
     - Renders ground-plane **Hex Frame Dynamic Chroma** borders (`#00E676` $\rightarrow$ `#FFD600` $\rightarrow$ `#FF1744`).
     - Renders spell ground decals, cast telegraphs, and detailed floating combat text.
   - **Strategic Macro View ($\text{Scale} < 0.6\times$ down to $0.25\times$):**
     - Individual soldier sprites and hex borders smoothly cross-fade into a unified **Platoon Heraldic Shield Badge** positioned at the platoon centroid.
     - Displays Platoon Stance icon (`⚔️ Aggressive`, `🛡️ Defensive`, `🧱 Fortress`), living soldier pips (`4/5`), and directional vector path arrows.
     - Provides clear situational awareness over 60+ hexes simultaneously.
2. **Camera Snapping Hotkeys:**
   - `Spacebar`: Snaps camera viewport immediately to the latest high-priority combat alert (wall breach or squad ambush).
   - `F1`–`F4` (or double-tapping `1`–`4`): Snaps camera directly to Platoon 1–4.
   - `H`: Snaps camera to Imperial Castle / Core.
   - `Middle-Mouse Drag / Right-Drag`: Zero-slip direct viewport pan navigation.


