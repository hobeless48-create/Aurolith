---
tags: [Dashboard, MasterIndex, Overview, Aurolith, GeneralGilded]
type: Master Index
---

# 🛡️ AUROLITH — MASTER DESIGN & TECHNICAL VAULT (v3.1)

> **Welcome to the Aurolith Master Vault (formerly General Gilded).**  
> *Aurolith* is a high-empire, guild-fantasy RTS / Deckbuilder PC Web Game built on a 90×150 Hex Grid with 18-minute match caps, multi-depth courtyards, free-to-cast cards, **150 blessings across 3 In-Match Rites (5 tiers × 30)**, **80 units in 4 platoons of 5 (8 classes)**, **25 craftable equipment recipes, 6 Divine items, 4 consumable satchels and 7 materials**, **21 jungle monsters + 3 Jungle Boss Objectives**, plus 2.5D PixiJS graphics, visual unit models, ground hex frame chroma, and dual-layer UI/overlay systems.
>
> The authoritative modern systems live in `Data/` (BlessingList, ItemList, Monster, UnitRoster, FacilityList). Legacy systems are archived in per-topic files marked **Superseded** — no content was lost.

---

## 🏛️ Vault Navigation & Structure

### 📁 Section 0: Authoritative Data Systems (`Data`)
> **Rule of authority:** on any number conflict, the files here win. Built as the modern generation (auto-battler format).
- `[[BlessingList/00 - Blessing System Overview, Draft Rules & Audit]]` — **150 blessings** (5 tiers × 30: 10 Combat / 10 Economy / 10 Item), 3 In-Match Blessing Rites (0:00 Opening, 5:00 Expansion, 10:00 Siege), **3 tailored options** per pick, Smart Tailoring engine, Term Dictionary, and high-stakes Risk / Hard Cashout / Counter-Play Augments (*The Gilded Chrysalis*, *Last Bastion Vow*, *Vault Speculation*, *Martyr's Resolve*).
- `[[ItemList/00 - Item List, Acquisition & Crafting]]` — **25 craftable equipment recipes, 6 Divine items, 4 consumable satchels and 7 materials**. Divine grant tier is an open conflict within the item file, recorded in `TechnicalPlan/14`; equipment uses Common/Rare/Epic/Ancient quality, with conditional Divine items in a separate lane.
- `[[Monster/00 - Jungle Monsters & Material Drops]]` — **21 monsters** (7 material families × 3 variants), kill-time calibration (solo tank/support 60s · 6-squad ~8s · solo Assassin ~15s), **§7 canonical bounty table**.
- `[[Monster/01 - Jungle Bosses]]` — **3 boss camps** (Elite 2:00/1,500 HP · Alpha 8:00/3,000 HP · Ancient 12:00/6,000 HP), **3 distinct objective buffs** (2:00 Stampede Blessing, 8:00 Eyes of the Storm, 12:00 Emperor's Bastion & Siege), **>50% damage threshold contest rule** (Q5 confirmed) + 20% last-hit bonus.
- `[[Economy/00 - Economy Per-Second Audit]]` — **economy-per-second audit**: baseline per scene (10 g/s + 10 XP/s, Overtime +50%), jungle income (+80 XP | +100 Gold per monster, boss bounties), **Warlord Shutdown Bounties (+300g / +200 XP)**, every facility tier, every economy trait/blessing, every production unit — converted to g/s and XP/s.
- `[[Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign)]]` — **Cost Model v2**: all 80 units cost a flat **60g**; every 2:30 price +25% (cap +150%) and stats +10% (cap +60%); **Resign** = 70% refund + 30s slot lock; **respawn rule** — dead units respawn after a **30s timer** unless Resigned (losses cost tempo, not gold).
- `[[Economy/02 - Recruit Shop & Commander Level]]` — **Recruit Shop** (4 offers/2:30, 5g reroll, level-gated shop odds, Buy-XP 10g→+10 XP, interest = bank-threshold traits), **Commander level curve** (L1–L10, L8≈15:00, L5 unlocks the active skill), **Unit leveling** (max **L3**, squad kill XP, +10% HP/+5% ATK per level).
- `[[UnitRoster/00 - Unit Roster Overview & Class Definitions]]` — **80 units (10 per class × 8 classes)**, **4 Platoons of 5 Units (20 Cap)**, Unique Champion limit, Role Diversity Synergy bonus (+22% all stats + 10 Tenacity for 5 distinct roles), Final class files + audit/tuning/playtest vault.
- `[[FacilityList/00 - Facility Pool (18 Facilities)]]` — **18 active facilities** (6 Production + 6 Combat + 6 Buff), full tier specs, v3 rules, Arcane Barrier/Sanctuary power tether to Castle Core Desperation Battery.

### 📁 Section 1: Core Rules & Mechanics (`01 - Core Rules & Mechanics`)
- `[[Board & Map Grid]]` — 90×150 Hex grid, North (P1) vs South (P2) Fortresses, West & East Jungles, Single Central King's Highway (+10% Move Speed), 22-Tile Master Catalog & Two-Tier Layered Rendering, 3 unique boss objective buffs (2:00 Tuskgod, 8:00 Stormwing, 12:00 Emperor Altar), tether leashes, last-hit bounties.
- `[[Castle & Defensive Layers]]` — Segmented 6-hex breaches (5×3000 HP Outer / 5×4500 HP Inner, Core 4500), Demolition Sapping (-70% decays by 5%/15s down to -35%), Castle Core Desperation Battery (150 True Dmg / 4s below 50% HP) tethered to courtyard Arcane Barrier/Sanctuary (Q3 confirmed).
- `[[Match Timeline & Phases]]` — 18m timeline, phases, 3 In-Match Blessing Rites (0:00, 5:00, 10:00), 2:30 draw ticks, 15s Action Overflow Buffer, milestone bonus draws, Victory banner.
- `[[Numerical Baseline & Balance]]` — Modern economy (10g/s passive, 10 XP/s drip, flat equal unit cost + 2:30 escalation, 80-unit roster).

### 📁 Section 2: Units & Platoons (`02 - Units & Platoons`)
- `[[Commander & Platoon System]]` — 4 Platoons of 5 Units (20 Cap), Hotkeys `1`, `2`, `3`, `4`, Stances (`[A]`, `[D]` with 55% Ally HP Peel, `[R]`), Focus Directives (`[Z]`, `[X]`, `[C]`), 5-Man MOBA Role Diversity Synergy (+22% stats + 10 Tenacity), Live Army HUD (monochrome skill-readiness).

### 📁 Section 3: Facilities (`03 - Facilities`)
- `[[00 - Facility System (Complete)]]` — System rules (6 slots, 3×3 footprints, 500/750/1000 HP tiers, damage retention, 50% refund + rubble) + 18-facility roster (6 Production / 6 Combat / 6 Buff) + Core Upgrades.
- `[[02 - Core Upgrades (Treasury, Crucible, Barracks)]]` — Core Treasury (+5/+7/+10 g/s), Core Crucible (+3/+5/+8 XP/s), Core Barracks (+2 cap/tier → hard cap 20).

### 📁 Section 5: Command Cards (`05 - Command Cards`)
- `[[00 - Card System (Rules + All 25 Cards)]]` — 0-gold free cast, 2:30 cadence, milestone bonus draws, 6-card hand, 15s Action Overflow Buffer (Q4 confirmed), extra-buy scaling `100/250/500/1000g`, explicit targeting scopes across all 25 cards, new tactical counters (*Nullifying EMP*, *Orbital Signal Flare*, *Emergency Barricade*, 5-man *Shadow Flank*).

### 📁 Section 6: World & Lore (`06 - World & Lore`)
- `[[The Gilded Empire]]` — High Empire world setting, golden aesthetic, commander identity.

### 📁 Section 8: UI & Graphic Design System (`08 - UI & Graphic Design System`)
- `[[UI HUD Layout & Color Palette Specification]]` — 1920x1080 HUD grid layout, 4-platoon Roster Panel with monochrome-when-unready skill indicators, In-World Tactical Overlay (convex hulls, chevrons, laser leashes), bottom dock.

### 📁 Section 9: Technical Engineering Roadmap (`TechnicalPlan`)
- `[[00 - Technical Master Roadmap]]` — Engineering index & system architecture diagram.
- `[[01 - Hex Grid Engine & Coordinate Systems]]` — Axial/Cube coordinates, raycasting, soft stacking, tether leashes, 22-Tile Catalog integration.
- `[[02 - Pathfinding, Drag-Vector & Movement Engine]]` — Flow fields, King's Highway (+10% Move Speed), drag-vector painting, 4 platoons of 5 units (20 cap), vector chevrons & dynamic convex hulls.
- `[[03 - Command Priority Queue & Smart-Tactics AI]]` — 4-platoon hotkeys (`1–4`), Stances (`A`,`D`,`R`), Focus Directives (`Z`,`X`,`C`), 55% Ally HP Peel & Assassin counter.
- `[[04 - Card System, Draw Ticker & Trap Manager]]` — 2:30 ticker, milestone bonus draws, 15s action overflow buffer, explicit targeting scopes.
- `[[05 - Structure Breach, Bottlenecks & Shroud Masking]]` — Demolition Sapping, Castle Core Desperation Battery tethered to Arcane Barrier.
- `[[06 - Match Game Loop, Phases & Overtime Engine]]` — 18m timer engine, 3 In-Match Blessing Rites (0:00, 5:00, 10:00), mode pause, Victory banner.
- `[[07 - AI Commander Bot State Machine]]` — Utility AI, 4-platoon role allocation, stance switching (`A/D/R`), spell heatmaps.
- `[[08 - Audio Engine & Visual Render Pipeline]]` — Two-Tier Layered Terrain Engine (World-UV seamless + transparent props), 72% inner hex sprite clamping (zero vertical occlusion invariant), Ground Micro Hex Frame Chroma (1-draw-call vector health), 1920x1080 canvas, Retina scaling, frustum culling, `YSortedWorldContainer`.
- `[[09 - UI Layout Engine & Sprite Asset Pipeline]]` — Sprite sheet atlases, Assets/ organization (Tiles/1_Field..3_Base, Structures, Units), PixiJS UI component tree, `TacticalWorldOverlayLayer`.
- `[[11 - Unit Model Visual Art Direction]]` — 80-unit art direction (8 classes), 72% inner hex scale, edge-connected floodfill background cutout protocol, universal 8-state animation template, sprite atlas pipeline.
- `[[12 - Client Architecture, Tech Stack & UX Panel System]]` — Monorepo, Vite + PixiJS v8, 4-Platoon Roster Panel (HP + monochrome skill-readiness), full hotkeys (`1–4`, `A/D/R`, `Z/X/C`, `Q/W/E`).
- `[[13 - Networking & Authoritative Server]]` — Node.js authoritative WebSocket server, shared deterministic sim, rooms/matchmaking, reconnect, Caddy deploy.
- `[[14 - Implementation Roadmap, Authority & Decision Log]]` — Current implementation entry point: source-rule authority, staged delivery, package ownership, open design conflicts, and Jev decision record.

### 📁 Section 10: Unit Roster (`Data/UnitRoster`)
> **80 unique units (10 per class × 8 classes)** — auto-battler format, full tuning & audit vault. 7 combat classes + the **Artisan** production class.
- `[[00 - Unit Roster Overview & Class Definitions]]` — 8 role definitions, tier baselines, class stat modifiers, roster index (v1.4).
- `[[Final - Fighters]]` / `[[Final - Tankers]]` / `[[Final - Mages]]` — **The real character list** (combat classes, 10 units each).
- `[[Final - Marksmen]]` / `[[Final - Supports]]` / `[[Final - Siege]]` — **The real character list** (combat classes, 10 units each).
- `[[Final - Assassins]]` — **8th class**: 10 jungle/scouting burst units (high burst + the universal Slayer's Mark) + class contract. Solo assassin clears a monster in ~15s.
- `[[Final - Artisans]]` — **7th class**: 10 production units (facility/item discounts, repairs, Roads, Barricades) + Production Economy Model (CSV / TPV / PVR audit) + class contract.
- `[[07 - Balance Audit & Synergy Matrix]]` — 4-requirement audit (80 units) + **§6 Artisan Production Audit**.
- `[[08 - Auto-Battler Integration & Full Re-Audit]]` — Deterministic AI framework (target priority, casting, channels, movement, §1.6 Artisan production AI).
- `[[09 - Tuning Framework]]` — 5-command system, cooldown overhaul, tank fix, counterplay mandate.
- `[[16 - Playtest Validation]]` — Cross-scenario checklists (T1–T6, C1–C6, K1–K4, A1–A9 artisan/army-cap checks, R1–R8).
- `[[90 - Legacy Unit Archetypes (Superseded)]]` — the 4 legacy archetype specs (Gilded Infantry / Arbalest Marksmen / Jungle Harvesters / Siege Operators) kept for unique mechanics (Golden Bastion, AP Bolt vs shields, Pounce CC rules, Demolition stances).

---
