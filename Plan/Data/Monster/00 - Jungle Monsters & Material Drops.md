---
tags: [Monsters, Jungle, Materials, Drops, PvE]
type: Data - Authoritative
---

# 🐾 JUNGLE MONSTERS & MATERIAL DROPS

> **This is the real monster list.** 7 material families × 3 strength variants = **21 jungle monsters**, each family dropping **exclusively one material** for the item system (`Data/ItemList/00 - Item List, Acquisition & Crafting.md`). **Monster strength is positively correlated with the rarity of dropped materials** — the stronger the variant, the higher the probability of a rare drop.

---

## 1. 🎯 Design Rules

1. **Jungle exclusivity:** every monster lives in the Jungle biome; materials drop only from these monsters (no alternative source except the Bazaar pity-purchase).
2. **Family exclusivity:** each family drops exactly **one** material type (Boars → Gilded Ore, Wyrms → Arcane Crystal, Treants → Ironwood Timber, Insects → Emberbloom Sap, Raptors → Stormfeather, Spiders → Voidshard, Golems → Sunforge Alloy).
3. **Strength ↔ rarity:** within each family, the stronger the variant, the rarer the drop:
   - **Common camp** → drops **Common** material (2–3 copies per kill)
   - **Rare camp** → 55% **Rare** / 45% Common (1–2 copies per kill)
   - **Elite lair** → 40% **Epic** / 60% Rare (1–2 copies per kill, guaranteed)
4. **Multi-copy drops:** a single monster always drops multiple copies of the same material (this is what makes full-equip-by-10:00 feasible).
5. **Respawn cadence:** Common camps 40s · Rare camps 55s · Elite lairs 90s.
6. **Contest window:** camps are contested from 5:00 (Expansion Phase, per `Match Timeline & Phases.md`); the deep jungle (Rare/Elite) sits past the mid-line, so raids and counter-raids are a real threat.

---

## 2. ⚖️ Kill-Time & Camp Scaling Balance Pass (v3 Calibrated)

> **Standard (v3):** Scaled survival curves across monster tiers prevent premature Epic material farming. Higher tiers require dedicated squad attention or high-tier assassins.
> **Contested Bounty Rule (Anti-Last-Hit RNG):** Monster/Boss bounties are awarded to the player who dealt **>50% of total damage** to the monster. If neither player dealt >50%, the bounty splits **50/50**, with an extra **+20% bonus** to the last-hitter.

**Damage formula:** `Effective HP = HP × (100 + DEF) / 100` · `Kill time = Effective HP ÷ DPS`.

| Variant | HP | DEF | MR | ATK | ASPD | Eff. HP | Solo Tank/Support | 6-Squad (non-Assassin) | Solo Assassin (T2+) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Common** | 1,300 | 8 | 8 | 24 | 0.7 | 1,404 | ~46s–52s | ~6.8s | ~11.8s |
| **Rare** | 2,200 | 15 | 15 | 42 | 0.8 | 2,530 | ~83s–93s | ~12.3s | ~21.2s |
| **Elite** | 3,800 | 25 | 25 | 65 | 0.9 | 4,750 | *Unviable solo* | ~23.1s | ~39.9s (High Risk) |

**Design rationale:** Elite Lair monsters now represent genuine objectives that take a 6-squad over 20 seconds to take down, creating an active contest window for opponents to scout, collapse, or steal rather than an 8-second trivial drive-by. Solo assassins must pick their battles or farm with caution.

**Canonical HP by variant:** Common `1,300`, Rare `2,200`, Elite `3,800` for all seven families. The named tables below use these HP values. Their family-specific DEF, MR, ATK and abilities remain authoritative; the §2 effective-HP and kill-time estimates are reference calculations for the §2 example defenses, not exact timings for every family.

---

## 3. 🌿 The 21 Monsters (7 families × 3 variants)

### 3.1 Ironhide Boars → **Gilded Ore** (physical power)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Feral Boar** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Gilded Ore (Common) |
| **Ironhide Boar** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Gilded Ore (55% Rare) |
| **Boar Matriarch** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Gilded Ore (40% Epic) |

*Pack ability: Common/rare boars charge on spawn and knock back the nearest unit 1 hex (1.5s slow); the Matriarch's charge has a 2-hex range.*

### 3.2 Verdant Wyrms → **Arcane Crystal** (magic power)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Vine Wyrmling** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Arcane Crystal (Common) |
| **Verdant Wyrm** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Arcane Crystal (55% Rare) |
| **Jungle Drake** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Arcane Crystal (40% Epic) |

*Pack ability: wyrmlings spit a vine snare (roots the target 1.5s, 8s CD); the Drake's breath applies a magic-amp debuff (+10% damage taken) to the whole camp for 4s.*

### 3.3 Ancient Treants → **Ironwood Timber** (durability)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sapling Treant** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Ironwood Timber (Common) |
| **Ancient Treant** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Ironwood Timber (55% Rare) |
| **Elder Treant** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Ironwood Timber (40% Epic) |

*Pack ability: treants root themselves (+50% DEF while stationary) — reposition or accept the armor; the Elder's slam roots a 2-hex line for 1.5s.*

### 3.4 Emberbloom Insects → **Emberbloom Sap** (sustain)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Emberbloom Beetle** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Emberbloom Sap (Common) |
| **Flamevine Stinger** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Emberbloom Sap (55% Rare) |
| **Emberbloom Queen** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Emberbloom Sap (40% Epic) |

*Pack ability: beetles lay an ember patch on death (2s, 15 DPS burn); the Queen's stinger applies a stacking DoT (10 DPS, max 3 stacks) — healers counter this camp for free.*

### 3.5 Stormcrest Raptors → **Stormfeather** (tempo)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Razortail Hawk** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Stormfeather (Common) |
| **Stormcrest Eagle** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Stormfeather (55% Rare) |
| **Stormcrest Roc** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Stormfeather (40% Epic) |

*Pack ability: raptors dive and harass the nearest unit (−15% ASPD for 2s, stacking); the Roc's dive has a 3-hex engagement range — it punishes backline farmers.*

### 3.6 Shadowmaw Spiders → **Voidshard** (utility)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Shadowmaw Spiderling** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Voidshard (Common) |
| **Shadowmaw Weaver** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Voidshard (55% Rare) |
| **Shadowmaw Matriarch** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Voidshard (40% Epic) |

*Pack ability: spiderlings web the ground (slow 30% while standing on it); the Matriarch's web root lasts 2s and it pulls the furthest target 1 hex — split your squad to avoid the pull chains.*

### 3.7 Sunforged Golems → **Sunforge Alloy** (fortitude)
| Variant | HP | DEF | MR | ATK | ASPD | Group | Drop |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Clay Sentinel** (Common) | 1300 | 6 | 6 | 22 | 0.7 | 5/camp | 2–3 Sunforge Alloy (Common) |
| **Ironclad Golem** (Rare) | 2200 | 12 | 12 | 40 | 0.8 | 3/camp | 1–2 Sunforge Alloy (55% Rare) |
| **Sunforged Colossus** (Elite) | 3800 | 16 | 16 | 60 | 0.9 | 1–2/lair | 1–2 Sunforge Alloy (40% Epic) |

*Pack ability: golems are stone-skinned (+10% DEF while stationary); the Colossus's ground-slam roots a 2-hex line for 1.5s — a slow, tanky camp that punishes stand-and-tank (and feeds the Fortitude item line: shields / damage reduction).*

---

## 4. 💎 Material Rarity → Item Quality

| Component rarity | Crafted item quality (per `Data/ItemList/00` §4) |
| :--- | :--- |
| Common | **Common** (1.0× stats) |
| **Rare** | **Rare** (1.2× stats) |
| **Epic** | **Epic** (1.5× stats) |

The **highest material rarity in the recipe sets the item's quality** (mixed recipes use the highest). Quality multiplies the item's base stats only — the **Ancient** tier (2.0× stats **and** 2.0× effect) is never a jungle drop; it is produced exclusively by **Genius+** trait sources (`Data/ItemList/00` §4). Rarity never creates new item entries (anti-bloat per the Item Scoring System S5/S6).

---

## 5. ⏱️ Farming Cadence & Pacing Check

| Metric | Value |
| :--- | :--- |
| Common camp cycle (5 monsters × ~8s squad clear + loot + travel + 40s respawn) | **~95–100s → ~12 Common components** |
| Rare camp cycle (55s respawn) | ~95–105s → ~4 components @ 55% Rare |
| Elite lair cycle (90s respawn) | ~130–140s → 1–2 components @ 40% Epic |
| Solo Assassin clear (15s standard) | 1 common monster per ~15s ≈ 4 per minute — the jungle's fastest farmer |
| Full item needed | 2 components |
| Army of 12 units fully equipped | ~24 components ≈ **2–3 Common camp cycles per material pair** (≈5 min of focused 2-squad farming) |

**Verdict:** two dedicated farming squads can bank a full 12-unit army's worth of components by ~6:00–8:00, and any player focused on the jungle is **fully equipped before 10:00** — the Siege Phase starts with every fielded combat unit carrying an item.

---

## 6. ⚔️ Contest & Counterplay Notes

- **The jungle is a PvP zone from 5:00** — farming greed is punishable: send a diving squad (Stormdancer Kael, Phantom Dart Nyx) at a farmer's backline, or steal camps with a raiding platoon.
- **Pack abilities create PvE counterplay** (no stat walls): burn patches counter healers, web pulls counter backlines, treant roots punish stand-and-tank — the "correct" farmer comp varies by family.
- **Elite lairs are objective-pace:** 90s respawn and 40% Epic means both players race to the same lair — a live PvP point, not a static farm.
- **Bazaar fallback caps frustration:** unlucky Rare/Epic streaks can always be bought (300g/500g), keeping the primary loop "farm, contest, craft" without RNG dead-ends.

---

## 7. 💰 Bounty Table (canonical)

> **This is the single source for every kill reward in the jungle.** Monsters pay the last-hit bounty; **Jungle Bosses** are a separate PvE objective with their own bounty + buff — full boss stats & abilities are authoritative in **`01 - Jungle Bosses.md`** (this table is the contract).

| Kill target | Bounty | Notes |
| :--- | :--- | :--- |
| **Any jungle monster** (last-hit) | **+80 XP | +100 Gold** | awarded to the killer's player only; every Common/Rare/Elite monster. |
| **Boss — Elite Camp** | **+120 XP | +150 Gold** | spawns `2:00` · `1,500 HP` |
| **Boss — Alpha Camp** | **+200 XP | +300 Gold** | spawns `8:00` · `3,000 HP` |
| **Boss — Ancient Camp** | **+350 XP | +500 Gold** | spawns `12:00` · `6,000 HP` |
| **Boss Objective Buffs** | Unique per Boss (90s Duration) | **2:00 Tuskgod:** Stampede Blessing (+25% Move, +50% Camp Gold) · **8:00 Stormwing:** Eyes of the Storm (Reveals Courtyard Shroud 45s, +15% Crit) · **12:00 Emperor:** Emperor's Bastion & Siege (+15% DR, +100 True Siege Dmg/s). (Authoritative: `01 - Jungle Bosses.md`). |

- **Last-hit rule:** bounty goes to the player whose unit lands the final killing blow (mirrors `Board & Map Grid` §1).
- **Bounty scaling:** Hunter's Lodge and bounty traits (cap **+150% total**) multiply the **Gold** column only — XP bounties are never multiplied (see `Data/Economy/00` §7-6).
- **Bosses drop no materials.** Their reward is bounty + buff only; materials stay exclusive to the 21 jungle monsters.
- **Spawn cadence:** regular camps respawn (40/55/90s); **boss camps spawn once per match** at their scheduled minute and never respawn.
