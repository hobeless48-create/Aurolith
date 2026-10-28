---
tags: [Cards, Rules, Cadence, System, FreeCast, Traps, BuyScaling, Ambush, FuseDelay, Intel, Scouting, FuzzyRanges, TemporaryTraps, Tactics, Recall, ChannelingDelay, Economy, Production, Siege, DemolitionCharge, Constraints]
type: System Core
---

# 🃏 CARD SYSTEM RULES & DECK ARCHITECTURE

> [!NOTE]
> All drawn cards are **100% FREE to play from your hand (`0 Gold`)**. Gold is used exclusively to buy EXTRA tempo card draws with steep escalating costs.

---

# Part 1 — System Rules

## 1. Free-to-Cast Hand Mechanics & 5 Card Categories

- **Cadence Draw:** 3 Cards drawn automatically into your hand every 2:30 (7 ticks total across 18 minutes: 0:00, 2:30, 5:00, 7:30, 10:00, 12:30, 15:00).
- **Milestone Bonus Draws:**
  - **First Outer Wall Breach:** Both players immediately draw **+1 bonus card**.
  - **Jungle Boss Slay:** Slaying team immediately draws **+1 bonus card**.
  - **10:00 Siege Phase Entry:** Both players immediately draw **+1 bonus card**.
- **Casting Cost:** **`0 Gold` (Free from Hand).** Playing any card from your hand consumes the card with no Gold penalty.
- **Hand Capacity:** **Maximum 6 Cards in Hand**.
- **15-Second Action Overflow Buffer (Q4 Confirmed):** When drawing with a full 6-card hand, the excess card floats in an active **15-Second Action Buffer** above the hand dock. The commander can immediately cast it via floating reticle during the 15s window, or swap it with a card in hand. If unplayed at 15s, it safely discards to the discard pile without blocking game loop or modal popups.
- **Explicit Card Targeting Scopes:** Every card has an explicit spatial/entity scope:
  1. **Platoon Target:** Applied to 1 designated 5-man platoon.
  2. **Hex AoE Target:** Applied to a target ground hex with explicit radius in hexes.
  3. **Structure Target:** Applied to an intact friendly or enemy wall segment, gate, or facility.
  4. **Global / Commander Target:** Applied empire-wide.

---

## 2. 💰 Increased Gold Cost for Extra Tempo Card Buys

Buying extra card draws out of cadence requires significant economic investment, preventing wealthy commanders from buying infinite tempo:

| Extra Card Buy # | Gold Cost | Economic Penalty Level |
| :--- | :--- | :--- |
| **1st Extra Buy** | **`100 Gold`** | Moderate investment (equals ~10s of passive income). |
| **2nd Extra Buy** | **`250 Gold`** | Heavy investment (equals a Tier 1 Facility build). |
| **3rd Extra Buy** | **`500 Gold`** | Massive investment (equals a Tier 2 Upgrade). |
| **4th+ Extra Buy** | **`1,000 Gold`** | Extreme luxury buy *(Resets each match)*. |

---

## 3. 🂠 Deck & Draw Mechanics

- **Master Pool:** The full **25 unique cards** (5 categories × 5 cards) form the Master Pool. Each card exists exactly once.
- **Cadence Draw:** Every 2:30 tick, **3 random cards** are drawn from the Master Pool (cards already in hand, in the overflow slot, or in the Discard pile are excluded).
- **No Duplicates Rule:** A card can never appear twice in the player's hand, overflow buffer, or Discard pile simultaneously.
- **Extra Tempo Buys:** Each extra buy draws **1 random card** from the remaining Master Pool (subject to the escalating gold cost).
- **Discard & Recycling:** Casting a card, or buffer-discarding it, moves it to the visible **Discard panel**. When the Master Pool has no remaining drawable cards, the entire Discard pile is reshuffled back into the Master Pool.
- **Deck Locks:** Cards with a deck lock (e.g. *Overtime Surge*) are excluded from the Master Pool entirely until their unlock condition is met (`15:00`).
- **Hand Cap Enforcement:** Excess cards enter the 15s Action Overflow Buffer rather than pausing gameplay.

---

## 4. 🪤 Trap Card Mechanics (Hidden Hex Placement)

- **Hidden POV:** Trap cards are placed onto target hex tiles and remain **100% INVISIBLE to enemy vision**.
- **Detection Rule:** Traps can only be revealed if the enemy casts a *Scout* card or uses specialized vision over those hexes.
- **Trigger Condition:** Detonates automatically when an enemy unit or platoon steps onto the trapped hex.

---

# Part 2 — Card Pools

## 👁️ CARD POOL: INTELLIGENCE & SCOUTING

> [!NOTE]
> Reconnaissance cards that reveal **brief, approximate, estimated intelligence** and reveal hidden enemy **Traps** for temporary vision windows, forcing commanders to deduce enemy game plans. All drawn cards are free to play from hand.

---

### 🃏 The 5 Intel Cards

#### 1. 👁️ Scout (Reconnaissance)
- **Requirement:** Target 1 friendly unit to execute the recon mission (**5% death risk per enemy unit present within the scouted radius**).
- **Brief Facility Info:** Reveals facility *category type* (e.g. "Production Structure" or "Combat Facility"), but conceals exact facility names, tier levels, and remaining HP.
- **Fuzzy Unit Army Range:** Returns a rough estimated range rather than exact unit numbers:
  - If enemy has **10 units** -> Returns **`8 – 13 Units`**
  - If enemy has **4 units** -> Returns **`3 – 6 Units`**
  - If enemy has **18 units** -> Returns **`15 – 22 Units`**
- **Temporary Trap Detection:** Reveals all hidden enemy **Traps** placed on hexes within the scouted area for a **temporary 20-second vision window** (rather than permanently destroying trap value).
- **Scout Protocol — fixed 10s board pull & resolution (the 10-second rule):**
  1. **Board removal:** the instant the Scout card resolves on a unit, that unit **leaves the board for a fixed 10.00 seconds** — it cannot move, attack, channel, be targeted, or be healed, and it contributes nothing (no farming, no combat) for the window. The timer is hard and exact; nothing shortens or extends it.
  2. **Death roll (resolved at the end, not on selection):** the death risk is rolled **at the 10.00s mark** — **5% per enemy unit present within the scouted radius** (Assassin class: 2% per unit; Scoutmaster Silas: **0%** — see `Data/UnitRoster/Final - Assassins.md` §6).
  3. **Notification (fires exactly at the 10.00s mark):** the commander receives **one combined notice** with two fields:
     - **(a) Intel gathered** — the normal scouting results (facility category, fuzzy army range, trap vision window) plus any unit bonus (Silas's extra accurate piece of facility intel — exact name/tier/HP).
     - **(b) Survived-or-died status** — a single flag: **`SURVIVED`** or **`K.I.A.`**.
  4. **Return-if-alive (same mark, same tick):** on `SURVIVED`, the unit **returns to the board at its original hex** at the 10.00s mark (or the commander's courtyard spawn hex if that hex is occupied) and resumes full autonomy — health/position as it left, no XP loss. On `K.I.A.`, the unit is removed from the army at the same mark and its item (if any) returns to the Arsenal (ItemList §1 — lossless).
  - **Farming trade-off (enforced):** the scouting unit cannot farm for the entire 10s window — and committing **Scoutmaster Silas** specifically means **no farming unit fielded that turn** (his kit trade-off, `Final - Assassins.md` §6).

---

#### 2. 🦅 Falcon Recon
- **Scope:** Hex AoE Target (Radius 12 hexes).
- **Effect:** Reveals a 12-hex vision radius anywhere on the map for 15 seconds. Reveals hidden Traps in range for 20 seconds and returns unit count ranges (e.g. `5 – 9 Units`).

---

#### 3. 🔮 Farsight Crystal
- **Scope:** Global / Intel.
- **Effect:** Reveals the enemy's facility construction queue status (*"Building Siege..."* or *"Building Economy..."*) for 30 seconds without revealing specific building tiers.

---

#### 4. 🗣️ Traitor's Whispers
- **Scope:** Global / Intel.
- **Effect:** Reveals the categories of cards in the enemy Commander's current Hand (*"2 Siege Cards, 1 Trap Card"*) for 20 seconds.

---

#### 5. 📡 Orbital Signal Flare
- **Scope:** Hex AoE Target (Radius 8 hexes).
- **Effect:** Illuminates target area with True Sight for 12 seconds. Reveals all hidden Traps and fully exposes Stealthed units (including Assassins and Platoons under *Shadow Flank*). Counterplay to enemy ambush setups.

---

## 🪙 CARD POOL: ECONOMY & PRODUCTION

> [!NOTE]
> Tactical command cards designed to boost resource generation, accelerate tech progression, and supply instant gold infusions. All drawn cards are free to play from hand.

---

### 🃏 The 5 Economy Cards

#### 1. 🌾 Bountiful Harvest
- **Effect:** Boosts all Gold and XP Production facility output rates by **+30% for the next 2 minutes**.

---

#### 2. 💰 Gold Rush
- **Effect:** Instantly grants `150 Gold` into the Commander's treasury.

---

#### 3. 🧪 XP Surge
- **Effect:** Instantly grants `200 XP` toward unit skill level-ups or tech tiers.

---

#### 4. 📦 Supply Line Convoy
- **Effect:** Reduces unit recruitment costs across all platoons by **30% for 90 seconds**.

---

#### 5. 💥 Alchemical Boom
- **Effect:** For the next 60 seconds, every Jungle neutral camp cleared grants double Gold and XP rewards.

---

## 📜 CARD POOL: MOVEMENT & TACTICS

> [!NOTE]
> Positioning, mobility, and defensive maneuvers. All drawn cards are free to play from hand.

---

### 🃏 The 5 Movement & Tactics Cards

#### 1. 🔄 Recall (1.5s Channeling Delay)
- **Scope:** Platoon Target (1 friendly 5-man platoon).
- **Effect:** Teleports a designated friendly platoon back to the Inner Keep instantly upon channel completion.
- **1.5-Second Channeling Delay:** Casting *Recall* initiates a **1.5-second channeling state**. Taking damage during channeling interrupts the teleport, preventing instant panic dodges!

---

#### 2. ⚡ Forced March
- **Scope:** Global / Movement.
- **Effect:** Grants all friendly units +30% Movement Speed for 8 seconds, allowing rapid rotations across Jungle A/B.

---

#### 3. 🛡️ Phalanx Formation
- **Scope:** Platoon Target (1 friendly 5-man platoon).
- **Effect:** Designated platoon locks shields, taking -30% Damage for 6 seconds at the cost of -20% Movement Speed.

---

#### 4. 👥 Shadow Flank
- **Scope:** Platoon Target (1 friendly 5-man platoon).
- **Effect:** Grants a full 5-man platoon Stealth (invisibility to enemy units) until they enter combat or step within 2 hexes of an enemy wall.
- **Trap Interaction:** Stealth does **NOT** protect against environmental traps — stealthed platoons still trigger hidden enemy traps (traps are terrain hazards, not unit vision).

---

#### 5. 🚧 Emergency Barricade
- **Scope:** Hex Target (1 hex on ground/bottleneck).
- **Effect:** Deploys a temporary 500 HP wooden barricade obstacle lasting 20 seconds. Blocks enemy movement vectors and seals breached wall chokepoints during desperate defenses.

---

## 💣 CARD POOL: SIEGE & COMBAT STRIKES

> [!NOTE]
> High-impact offensive barrage and tactical revive cards. All drawn cards are free to play from hand.

---

### 🃏 The 5 Siege & Combat Cards

#### 1. 💣 Demolition Charge (Single Charge Constraint)
- **Constraint:** Only **1 active Demolition Charge** can be planted on a 6-hex wall segment at a time. A segment must finish exploding before a 2nd charge can be planted on it!
- **Effect:** Directed Siege Operator plants an explosive dealing `350 Direct Siege Damage` to an enemy wall segment.
- **Naming Note:** This Command Card is distinct from the Siege Operator unit's own *Demolition Charge* skill (250 → 400 damage by level). The card version always detonates at `350` regardless of the operator's level, and is free to cast from hand.

---

#### 2. 🩸 Undying Will
- **HUD Selection:** Select 3 fallen units directly from the **Live Army & Graveyard Panel**.
- **Buff:** Revived units gain **+20% Stats** for 30s. Doubled respawn penalty clears after 30s if unit survives (**Capped at 60s MAX**).

---

#### 3. ⚡ Overtime Surge
- **Deck Lock:** Excluded from draw pool until match timer reaches `15:00` (Overtime Phase).
- **Effect:** Unleashes a global Overtime Surge — **all friendly units gain +25% Attack Speed and +25% Siege Damage for 60 seconds**. In the endgame stall, this is the comeback accelerant that turns wall-damage leads into lethal core pressure.

---

#### 4. 💥 Catapult Volley
- **Scope:** Hex AoE Target (Radius 3 hexes).
- **Effect:** Calls down an artillery strike dealing `150 Area Siege Damage` and `60 Physical Damage` in a 3-hex radius.

---

#### 5. ⚡ Nullifying EMP
- **Scope:** Hex AoE Target (Radius 3 hexes).
- **Effect:** Emits an anti-magic resonance pulse that **Silences all enemy units for 4.0 seconds** (preventing skill activations) and **instantly shatters all active temporary shield/barrier pools** within the radius. Crucial counterplay against deathball push windows.

---

## 🪤 CARD POOL: TRAPS & AMBUSHES

> [!NOTE]
> Trap cards are placed onto target hex tiles and remain **100% INVISIBLE to enemy vision**. When an enemy unit steps onto a trap, it enters a **1.2-second arming delay / warning audio state** before detonating.

---

### 🃏 The 5 Trap Cards

#### 1. 💣 Alchemical Landmine Trap
- **Placement:** Any hex tile in Battlefield or Jungle.
- **Arming Fuse:** `1.2 Seconds` (Warning visual flash + audio click SFX).
- **Effect:** Explodes after 1.2s delay dealing `200 Area Damage` and applying a 50% Movement Slow for 5 seconds.

---

#### 2. 🧱 Spike Chokepoint Trap
- **Placement:** Best placed inside 6-hex Wall Breach bottlenecks.
- **Arming Fuse:** `1.2 Seconds`.
- **Effect:** Roots the first 3 enemy units passing through for 4 seconds, dealing `100 Armor-Piercing Damage`.

---

#### 3. 👥 Decoy Illusion Trap
- **Placement:** Any hex tile.
- **Arming Fuse:** `1.2 Seconds`.
- **Effect:** Projects a fake unit/facility image. Explodes dealing `150 Arcane Damage` and blinding nearby units for 4 seconds.

---

#### 4. 🕸️ Ambush Net Trap
- **Placement:** Jungle hex tiles or flank routes.
- **Arming Fuse:** `1.2 Seconds`.
- **Effect:** Catches enemy scouts/harvesters, revealing position and disabling active skills for 8 seconds.

---

#### 5. ☣️ Explosive Gas Cloud Trap
- **Placement:** Any hex tile.
- **Arming Fuse:** `1.2 Seconds`.
- **Effect:** Releases toxic fumes dealing `35 DPS` over 6 seconds to any unit passing through the area.
