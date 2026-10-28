---
tags: [VisualPrompts, AIImagePrompt, StyleGuide, PromptTemplate, ArtDirection, GildedEmpire]
type: Design Specification
---

# 🎨 00 - VISUAL PROMPT STYLE GUIDE & AI IMAGINATION TEMPLATE

> One reusable "imagination template" so every entity in the game (unit, monster, item, card, facility, world element) can be described as a **2–4 line AI image prompt** that anyone can read and instantly picture. Every file in this folder (`01` → `06`) follows this template.

---

## 1. 🖼️ The Imagination Template (6-Line Structure)

Every entity prompt MUST use this exact order. At least 2 full lines per entity (most use 4–6).

```
**[ENTITY NAME]**
- **Subject:** <who/what it is, class/role/identity — 1 sentence>
- **Look:** <build, silhouette, armor/materials, distinguishing features — 1–2 sentences>
- **Gear:** <signature weapon / tool / prop — 1 sentence>
- **Palette:** <dominant colors from the Gilded Empire token set>
- **Style:** <isometric 2.5D game sprite · stylized fantasy · clean silhouette readable at 64px>
- **Finish:** <high-detail · soft golden rim light · game-ready texture · no text>
```

---

## 2. 🧠 GLOBAL STYLE SUFFIX (append to every prompt)

> A fixed reusable tag string so all assets share one visual language:

```
isometric 2.5D strategy game asset, stylized fantasy, clean readable silhouette, high detail, soft ambient occlusion, warm golden rim light, game-ready texture, no text, no watermark
```

---

## 3. 🎨 THE GILDED EMPIRE PALETTE (canonical tokens)

| Token | Hex | Use |
| :--- | :--- | :--- |
| Imperial Gold | `#D4AF37` | Primary UI, borders, active reticles, victory, fighter/empire accents |
| Sunburst Orange | `#FF8C00` | Card title highlights, active skills, XP bars, marksman accents |
| Obsidian Dark | `#111116` | Panel backgrounds, dark armor, shadows, assassin accents |
| Arcane Cyan | `#00E5FF` | Magic, mana, intel, ranged-range markers, mage accents |
| Crimson Red | `#FF4444` | Enemy, danger, traps, siege strikes, warrior trim |
| Emerald Green | `#00A86B` | Healing, support, nature, jungle life |
| Polished Steel | `#E0E0E0` | Tanker plate, clean metal |
| Brass Yellow | `#E5B80B` | Siege machinery, brasswork |
| Jungle Bronze | `#CD7F32` | Artisan tools, bronze accents |
| Dark Violet | `#8A2BE2` | Traps, ambush, forbidden magic |

---

## 4. ⚔️ PER-CLASS ACCENT (from `TechnicalPlan/11` — unit prompts only)

| Class | Silhouette | Palette token |
| :--- | :--- | :--- |
| Fighter | athletic · one-handed blade / paired weapons · light golden plate · lion pauldrons · crimson cloak trim | Imperial Gold `#D4AF37` |
| Tanker | broad tower-shield wall · heavy full plate · Suncrest emblem · white enamel trim | Polished Steel `#E0E0E0` |
| Mage | robed caster · floating tome/orb · crystal staff · obsidian-embroidered robes | Arcane Cyan `#00E5FF` |
| Marksman | hooded sniper · heavy crossbow / dual bows · gilded leather tunic · obsidian vambraces · scope | Sunburst Orange `#FF8C00` |
| Support | white-gold vestments · healing stave/shield · enamel-and-gold liturgical armor · soft glow | Emerald Green `#00A86B` |
| Siege | demolition cart / mortar platform · reinforced iron-gilded apron · brass welding visor | Brass Yellow `#E5B80B` |
| Artisan | tool belt · hammer/trowel · harness of crafting tools · leather work apron · clan badge | Jungle Bronze `#CD7F32` |
| Assassin | slim · cloaked · dual daggers / ghost-blade · dark leather + gilded trim · hood · smoke accents | Obsidian Black `#111116` |

---

## 5. 🏷️ CATEGORY-SPECIFIC TIPS

| Category | Extra instruction |
| :--- | :--- |
| **Unit** (01) | Lead with class accent; 10 units per class share body base — differentiate via weapon, accessory, skin tint, secondary color. Mention the item-slot attach point. |
| **Monster** (02) | Lead with the family (Boar/Wyrm/Treant/Insect/Raptor/Spider/Golem); mention variant strength (Common/Rare/Elite) as size/armor escalation. |
| **Item** (03) | Describe as a 64×64 inventory icon AND a worn model on a unit; include quality tint (Common none / Rare blue / Epic purple / Ancient gold pulsing / Divine radiant halo). |
| **Material** (03) | 64×64 resource icon, cluster/stack of the raw material. |
| **Card** (04) | Describe as a card illustration + mini-icon; keep the category frame color from the UI spec (cyan intel / gold economy / emerald movement / crimson siege / violet trap). |
| **Facility** (05) | Lead with T1→T2→T3 progression from the facility pool Visual lines; top-down isometric footprint. |
| **World** (06) | Describe atmosphere + tile language + readability (contrast for colorblind). |

---

## 6. ✅ QUALITY BAR (what "high quality looking" means here)

- Readable as a **pure silhouette at 64×64 px** (units/monsters) — the anti-confusion rule.
- **Clear material language:** you can tell gold from brass from bronze from steel from leather at a glance.
- **One dominant palette token per entity**, with a 1–2 token secondary — never a rainbow.
- **Game-ready:** flat game-art shading (soft AO, no photorealistic clutter), no text, no watermark.
- Prompts read as plain English first, tags second — so a human can picture it before running it through any AI tool.

---

## 6.1 🤖 LOCAL SD 1.5 GENERATION & TRANSPARENCY PIPELINE (DreamShaper 8)

For the **80 unit characters**, generation is automated via local Stable Diffusion 1.5 (`DreamShaper 8`) running on the local WebUI daemon (`http://127.0.0.1:7860/sdapi/v1/txt2img`):

1. **Anti-Bleed Prompt Formulation:**
   - Prompt format: `masterpiece, best quality, 2.5D game sprite, full body, human <gender> <class> in <armor> with <relief-engraved> accents, <signature weapon>, compact centered framing, 20% safe margin, clean silhouette, pure solid white background, isolated on white background`
   - Negative prompt: `bad hands, missing limbs, cropped, cut off at edges, out of frame, background clutter, gradient background, floor shadow, dark background, complex background, blurry, lowres, watermark, text`
2. **Edge-Connected Floodfill Cutout Protocol:**
   - Global RGB color-keying fails because specular armor reflections and white silk robes are inadvertently stripped out.
   - The asset script runs a **boundary-connected BFS floodfill** starting strictly from the outer image borders (`x=0, y=0`, `x=max, y=max`) with a color tolerance of `230..255`.
   - Result: 100% clean exterior transparency while preserving all interior white fabrics, metallic specular glints, and character details.
3. **72% Inner Hex Scale Clamping:**
   - The extracted sprite is automatically scaled to fit within **72% of the hex inner diameter** with a subtle ambient contact shadow beneath the boots, anchored at `[0.5, 0.85]`.
   - Guarantees **0% vertical occlusion** between units occupying adjacent vertical hex rows (North and South).

---

## 7. 📁 FILE MAP (this folder)

| File | Contents |
| :--- | :--- |
| `00 - Style Guide & Prompt Template.md` | THIS file — read first |
| `01 - Unit Visual Prompts (80).md` | 8 classes × 10 units |
| `02 - Monster Visual Prompts (21).md` | 7 families × 3 variants |
| `03 - Item, Material & Consumable Visual Prompts.md` | crafted items · divine items · 7 materials · 4 consumables |
| `04 - Command Card & Trap Visual Prompts (25).md` | 25 command cards + traps |
| `05 - Facility Visual Prompts (18).md` | 18 facilities, T1→T3 |
| `06 - World, Fortress, Commander & Icon Visual Prompts.md` | field/terrain · fortress · commander · trait icons · UI/portrait/minimap icons · VFX |
