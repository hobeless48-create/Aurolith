---
tags: [UI, GraphicDesign, ColorPalette, HUDLayout, DesignSystem]
type: Design Specification
---

# 🎨 UI HUD LAYOUT & GRAPHIC DESIGN SYSTEM SPECIFICATION

> HUD layout grid, color tokens, typography system, card frame categories, and interactive button states.

---

## 1. 📐 HUD Master Screen Layout Grid (1920×1080)

```
+-------------------------------------------------------------------------------+
| TOP BAR: [Gold: 450] [XP: 320]   [ ⏱️ 08:42 | EXPANSION ]   [Pause ⏸️] [Option ⚙️] |
| MACRO RIBBON: [🏰 Upgrade Keep: 250g] [🐲 Gorgon: 0:45] [🛒 Guild: Restocked] |
+-------------------------------------------------------------------------------+
| LIVE ARMY HUD | ▲ [THREAT CHEVRON: WALL BREACH]               | SELECTED INFO |
| - Infantry 1  |                                               | - Platoon #1  |
|   [80% HP]    |              HEX BATTLEFIELD (90x150)         |   [Aggressive]|
| - Marksmen 1  |       [Platoon Crest: 4/5 Alive ||||| ]       | - Stance:     |
|   [100% HP]   |       (Ground Hex Frames: Green/Yellow/Red)   |   [⚔️] [🛡️] [🧱]|
|               |                                               |               |
| GRAVEYARD:    |                                               | COMMANDS:     |
| - 🪦 Harvester|                                               | [A] [D] [R]   |
|   (12s)       |                                               | [Z] [X] [C]   |
+---------------+-----------------------------------------------+---------------+
| [ 🗺️ MINIMAP ]| BOTTOM CARD DRAWER:             [👑 CROWN]    | [🗑️ DISCARD ] |
| (180x300px    | [Card 1] [Card 2] [Card 3] [C4] [C5] | [SLOT G] |               |
|  3:5 Ratio)   |  [ (0g) ]  [ (0g) ]  [ (0g) ] (0g) (0g) |  [ (0g) ] | [Buy +1: 250g]|
+-------------------------------------------------------------------------------+
```

---

## 2. 🎨 Color Tokens & Design System

- **Imperial Gold (`#D4AF37`):** Primary UI borders, active selection reticles, victory banners.
- **Sunburst Orange (`#FF8C00`):** Card title highlights, active skill buttons, XP progress bars.
- **Obsidian Dark (`#111116`):** Panel backgrounds, minimap backdrop, card drawer background.
- **Arcane Cyan (`#00E5FF`):** Intel cards, mana costs, ranged attack range indicators.
- **Crimson Red (`#FF4444`):** Enemy health bars, invalid target highlights, trap detonation warnings.

### Ground-Plane Hex Rim Dynamic Chroma Health Palette
- **100% – 60% HP:** Luminous Emerald Green (`#00E676`) transitioning smoothly to Warm Yellow-Green.
- **60% – 30% HP:** Amber Yellow (`#FFD600`).
- **< 30% HP:** Warning Crimson Red (`#FF1744`) with 2 Hz breathing pulse.
- **Dead / Empty Hex:** Neutral Slate (`#37474F`).

### Screen-Edge Threat Chevron Palette
- **Yellow Chevron (`#FFD600`):** Neutral camp contested or spotted.
- **Red Chevron (`#FF1744`):** Platoon engaged in combat off-screen.
- **Flashing Crimson Chevron (`#D50000`):** Wall breach or Imperial Core taking damage.

---

## 3. 🃏 Card Category Frame Styles

1. **Intelligence & Scouting:** Arcane Cyan borders with a crystal ball icon header.
2. **Economy & Production:** Core Treasury borders with a coin stack icon header.
3. **Movement & Tactics:** Emerald Green borders with a winged boot icon header.
4. **Siege & Combat Strikes:** Crimson Red borders with an exploding shell icon header.
5. **Traps & Ambushes:** Dark Violet (`#8A2BE2`) borders with a skull-and-crossbones icon header.
6. **Crown / Momentum Bonus:** Royal Amethyst & Imperial Gold frame with sunburst border (Hotkey `G`).

---

## 4. 🔤 Typography & Font Hierarchy

- **Title Font:** *Cinzel* / *Outfit Bold* (Gold uppercase headers).
- **Body Font:** *Inter* / *Roboto Regular* (Clean white/gray readable text).
- **Damage/Loot Numbers:** *BitmapText Gilded Imperial Font* (High-contrast numbers with black outlines).

---

## 5. 👁️ 2-Tier Visual Clarity Engine (Chokepoints & Clutter Prevention)

To solve the 20v20 chokepoint billboard collision issue:
1. **Tier 1 (Macro Centroid Crest):** Exactly ONE floating health bar hovers above the platoon centroid with 5 discrete soldier pips.
2. **Tier 2 (Micro Hex Frame Chroma):** Individual soldier health is rendered exclusively onto the ground-plane hex border frame. The unit sprite artwork remains 100% clean and unshaded, preserving class silhouette recognition.

