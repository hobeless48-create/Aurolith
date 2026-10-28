---
tags: [Monsters, Jungle, Bosses, Objectives, PvP, PvE]
type: Data - Authoritative
---

# 🐲 JUNGLE BOSSES — ELITE / ALPHA / ANCIENT CAMPS

> **Authoritative boss specification.** This file is the single source for Jungle Boss stats, abilities, bounties, spawn timing and contest rules. The numbers below **are the contract** and match `TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md` §1 and the bounty table in `Data/Monster/00 - Jungle Monsters & Material Drops.md` §7.
>
> **Relationship to monsters:** the 21 jungle monsters (`Data/Monster/00`) are farming targets that drop materials. Bosses are **objective targets** — they drop no materials, only a gold/XP bounty plus a team-wide damage buff.

---

## 1. ⚖️ The Contract (fixed numbers)

| Camp | HP | Spawn Time | Bounty (XP | Gold) | Unique Objective Reward (90s Duration) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Elite Camp (Tuskgod)** | `1,500` | `2:00` | `+120 XP | +150 Gold` | **Stampede Blessing:** +25% Movement Speed and +50% Gold from regular Jungle Camps for 90s. (Early-game farming acceleration & tempo). |
| **Alpha Camp (Stormwing)** | `3,000` | `8:00` | `+200 XP | +300 Gold` | **Eyes of the Storm:** Clears Shroud over enemy Courtyard for 45s, and grants +15% Critical Strike Chance for 90s. (Mid-game tactical vision & breach setup). |
| **Ancient Camp (Emperor)** | `6,000` | `12:00` | `+350 XP | +500 Gold` | **Emperor's Bastion & Siege:** +15% Damage Reduction and +100 True Siege Damage/sec to structures on physical attacks for 90s. (Late-game decisive breach decider). |

- **Objective buffs:** Each boss grants a **unique mechanical objective advantage** matching its match phase, rather than a generic flat damage buff.
- **Spawn cadence:** Each boss camp **spawns once per match** at its scheduled minute and **never respawns**.
- **No material drops:** Bosses reward gold/XP bounty + unique objective buff only.

---

## 2. 🗺️ Camp Placement (90×150 grid — c:0–149 × r:0–89)

> Grid canonical in `TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md` §2: WEST_JUNGLE c 0–29, r 20–69 · BATTLEFIELD c 30–119, r 20–69 · North Castle c 51–98, r 0–19 · South Castle c 51–98, r 70–89 · EAST_JUNGLE c 120–149, r 20–69 · four cloud corners outside those zones · mid-line = r 44/45 boundary.

| Camp | Placement | Rationale |
| :--- | :--- | :--- |
| **Elite (Tuskgod)** (×1, shared) | WEST_JUNGLE Stone Pit (`c: 15, r: 42–47`) | Spawns 2:00 in the early game — situated in the West Jungle arena. Players choose whether to clash early to contest the **Stampede Blessing** (+25% Move Speed, +50% Camp Gold) or farm side creep camps safely. |
| **Alpha (Stormwing)** (×1, shared) | EAST_JUNGLE Boss Aerie (`c: 135, r: 42–47`) | Spawns 8:00 in the contested Expansion phase — located in the East Jungle. High-stakes midgame tactical objective granting **Eyes of the Storm** (reveals enemy courtyard shroud for 45s, +15% Crit Chance) for breach preparation. |
| **Ancient (Emperor)** (×1, shared) | BATTLEFIELD Ancient Altar (`c: 75, r: 44–46`, Midpoint of King's Highway) | Spawns 12:00 on the golden imperial dais at the exact center of the King's Highway — the **late-game decider**; drops Gilded Core Relic (3.0s capture channel) and grants **Emperor's Bastion & Siege** (+15% DR, +100 True Siege Dmg/s) for the final push. |

- Bosses are positioned across the triad of **West Jungle**, **East Jungle**, and **Central King's Highway Altar**, enforcing strategic choices between jungle ganks/farming and direct center clash.
- The 5-hex Tether Leash rule applies to bosses too (`Board & Map Grid` §1): pulled 5 hexes from camp, the boss drops aggro, becomes invulnerable, and heals to 100% at camp.

---

## 3. 🐗 Elite Camp — **Gilded Tuskgod** (apex boar)

`1,500 HP · spawns 2:00 · +120 XP | +150 Gold`

> The first objective. Sized so a **solo assassin or small squad** clears it inside the kill-time standard (`Data/Monster/00` §2): Eff-HP 1,680 (1,500 HP × DEF 12) → **6-squad ≈ 8s · solo Assassin ≈ 14s** (`Eff-HP ÷ DPS`: 1,680 ÷ 205 / 119). Take it fast, or farm greedily past 5:00 and lose it.

| Stat | Value |
| :--- | :--- |
| HP / DEF / MR | 1,500 / 12 / 12 |
| ATK / ASPD | 70 / 0.8 |
| Engagement | melee (1 hex) |

**Abilities**
- **Tusk Charge** (8s CD): charges the nearest unit **2 hexes**, knocking it back 1 hex + 1.5s slow (boar-family charge, `Data/Monster/00` §3.1).
- **Enrage** (once, <50% HP): +25% ATK for 20s — punish a slow first-take, reward a bursty one.

---

## 4. 🦅 Alpha Camp — **Dreadmother Stormwing** (apex raptor)

`3,000 HP · spawns 8:00 · +200 XP | +300 Gold`

> The mid-game objective, contested by rule (contest window opens 5:00). Needs a **real squad or a duo farm** (Eff-HP 3,480 → **6-squad ≈ 17s · solo Assassin ≈ 29s** — assassins can still solo it, but the risk is the other player, not the boss).

| Stat | Value |
| :--- | :--- |
| HP / DEF / MR | 3,000 / 16 / 16 |
| ATK / ASPD | 90 / 0.9 |
| Engagement | melee, 3-hex dive engage |

**Abilities**
- **Dive Strike** (6s CD): engages the **furthest** unit within 3 hexes — punishes backline farmers, exactly like the Roc's 3-hex dive (`Data/Monster/00` §3.5).
- **Screech** (12s CD): −15% ASPD to all enemy units within 4 hexes for 3s (raptor-family harass, stacking once).
- **Brood Call** (once, <50% HP): summons **2 Razortail Hawks** (Common raptor stats) — tax on low-AoE comps.

---

## 5. 🏛️ Ancient Camp — **Obsidian Emperor** (apex golem)

`6,000 HP · spawns 12:00 · +350 XP | +500 Gold`

> The late-game decider — a **team effort** (Eff-HP 7,200 → **6-squad ≈ 35s · solo Assassin ≈ 60s** — a solo assassin *cannot* steal it from a defending army). The +500g bounty is the largest single gold swing in the match (scalable to +750g at the bounty cap, `Data/Economy/00` §7-6).

| Stat | Value |
| :--- | :--- |
| HP / DEF / MR | 6,000 / 20 / 20 |
| ATK / ASPD | 110 / 0.7 |
| Engagement | melee, 2-hex AoE slam |

**Abilities**
- **Obsidian Skin** (passive): +25% DEF while stationary (golem-family stone-skin, `Data/Monster/00` §3.7) — reposition your squad to draw the Ancient from its altar and strip the armor bonus. **Stage 2 fixture interpretation:** when an enemy is within 4 hexes but outside the Ancient's 2-hex attack reach, it moves one path hex toward the nearest eligible enemy every 10 ticks (one hex per second). The stationary-defense bonus is absent on a tick when it moves. The source does not specify pursuit cadence; the one-hex-per-second fixture rate remains provisional.
- **Titan Slam** (9s CD): roots a **2-hex line** for 1.5s — punish clumped frontline.
- **Magnitude Pull** (14s CD): pulls the **furthest** enemy unit 1 hex toward it — anti-backline, forces formation discipline.
- **Brood Call** (once, <50% HP): summons **2 Ironclad Golems** (Rare golem stats).

---

## 6. ⚔️ Contest, Boss Rewards & Anti-Bypass Rules

1. **Multi-Category Reward Resolution (>50% Damage Threshold - Q5 Confirmed):**
   - **Team Objective Buff (Stampede / Eyes / Emperor):** Awarded strictly to the player whose army dealt **>50% of total damage** to the boss (guaranteeing that the army carrying the heavy burden absorbs the primal power, preventing 1% last-hit steals of game-deciding buffs).
   - **Gold & XP Bounty (Proportional Base Share):** Split **proportionally to damage dealt** by each player (e.g. 70% damage earns 70% of base gold/XP).
   - **Executioner's Spoils (Last-Hit Bonus):** The player whose unit lands the final killing blow earns an additional **+20% Gold Bonus** on top of their damage share.
   - **Physical Ground Relic / Item Drop (Hex Claim):**
     - Slaying an Alpha or Ancient boss drops a physical **Gilded Core Relic** onto the boss's central death hex.
     - **Claim Rule:** An alive unit must remain stationary on the relic hex for **3.0 seconds uninterrupted** to claim the relic and transfer it to their Arsenal.
     - If a team wipes to the boss or an ambush, they **cannot claim the relic**; the surviving squad holding the territory secures the item.
2. **30-Second Warning Horns (Empire-Wide Notification):**
   - At **30 seconds before spawn** (1:30 for Elite, 7:30 for Alpha, 11:30 for Ancient), an empire-wide war horn sounds, an alert banner appears on HUD, and the boss hex is highlighted through the Fog of War. Neither commander can be blindsided.
3. **Boss Engagement Zones:**
   - The Alpha spawns at the **East Jungle Boss Aerie (c 135, r 42–47)**. The Ancient spawns at the **central Ancient Altar (c 75, r 44–46)**, where it contests the King's Highway. The Elite remains at the West Jungle Stone Pit. These are the three shared placements in §2.
   - Alpha and Ancient have a **4-hex aggressive engagement radius** around their respective spawn areas. Only the Ancient guards the main march corridor; an army can route around it through the jungle at the cost of time and exposure.
4. **Buff duration is global to the winning army:** The player whose army dealt strictly more than 50% of a boss's total damage receives that boss's **unique §1 objective reward** for 90s. Eyes of the Storm's courtyard reveal lasts 45s within its 90s buff. There is no generic +15% damage reward.
5. **Tether leash applies:** A boss dragged 5 hexes from camp resets to 100% HP.
6. **Death does not end the fight:** Units that die mid-boss-fight enter the 30s Graveyard respawn (`Data/Economy/01` §3) with their items intact.

---

## 7. 📊 Balance Notes & Known Tuning Levers

- **Elite tempo math:** the one shared Elite bounty (+150g) ≈ 15s of passive gold (`Data/Economy/00` §1). Stampede's +25% movement and +50% regular camp gold last 90s; securing it at 2:00 accelerates farming and repositioning through 3:30.
- **Alpha math:** +300g ≈ 30s of passive gold. Eyes of the Storm grants 45s of enemy courtyard vision and 90s of +15% critical chance, so the team can prepare a breach without carrying the buff into the Ancient's 12:00 spawn.
- **Ancient math:** +500g ≈ 50s of passive gold. Emperor's Bastion & Siege grants 90s of +15% damage reduction and +100 true siege damage per second against structures on physical attacks, making the central altar a late push objective.
- **Tuning levers (single numbers, no redesign):** Elite HP (±250) · Alpha spawn (8:00 → 9:00) · Ancient bounty (+350 XP) · objective buff duration (90s ±30s). Changes to the unique buff effects require an explicit rules revision.
- **Hunter's Lodge & bounty traits** multiply the **gold** column only (cap +150% total); **XP bounties are never multiplied** (`Data/Monster/00` §7).

---

## 8. 🔗 Canonical Sources

- `TextPlan/01 - Core Rules & Mechanics/Board & Map Grid.md` §1 — tether leash, last-hit, boss numbers (contract).
- `Data/Monster/00 - Jungle Monsters & Material Drops.md` §7 — the bounty table (contract).
- `Data/Economy/00 - Economy Per-Second Audit.md` §2 — boss income context; §7-6 — bounty stacking cap.
- `Data/ItemList/00 - Item List, Acquisition & Crafting.md` — the material/quality system bosses deliberately do not feed.
