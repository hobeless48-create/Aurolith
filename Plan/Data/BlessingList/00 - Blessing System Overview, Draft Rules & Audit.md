---
tags: [BlessingList, Draft, System, Audit, Augments]
type: Data - Authoritative
---

# 🎴 BLESSING SYSTEM — OVERVIEW, IN-MATCH RITES & AUDIT

> **Authoritative Blessing Specification.** A **150-blessing tiered system** (5 tiers × 30 blessings, with 10 Combat / 10 Economy / 10 Item in every tier), drafted across **3 In-Match Blessing Rites** (at match timestamps 0:00, 5:00, 10:00).
>
> **Supersedes:** the legacy pre-match draft. Changes: draft moved in-match across 3 strategic inflection points (0:00 Opening, 5:00 Expansion, 10:00 Siege), **3 tailored options** per pick (with 1 reroll), Smart Tailoring engine active, and high-stakes Risk / Hard Cashout / Counter-Play Augments added.
>
> **Rule of authority:** on any number conflict, the numbers here and in the tier files win.

---

## 1. 🪜 The Tier Ladder

| Tier | File | Power Level | Design Voice & Mechanics |
| :--- | :--- | :--- | :--- |
| **1. Goddess** | `01 - Goddess Blessing.md` | Game-defining | High-stakes gambles, build-around flagships (*The Gilded Chrysalis*) |
| **2. Transcendence** | `02 - Transcendence Blessing.md` | Powerful · Comeback | Signature counter-play, unique items, fortress vows (*Last Bastion Vow*) |
| **3. Imperial** | `03 - Imperial Blessing.md` | Strong · Synergetic | High stat lines, facility gambles (*Vault Speculation*), legacy full forms |
| **4. Exalted** | `04 - Exalted Blessing.md` | Moderate · Tactical | Solid value, casualty counters (*Martyr's Resolve*), formation hooks |
| **5. Grace** | `05 - Grace Blessing.md` | Consistent · Safe | Reliable baseline filler that any composition can leverage |

- **Power budget rule:** a higher tier is strictly stronger than the same archetype one tier down. No tier inverts a lower tier.
- **No-flat-stat rule:** *every* blessing features a **2-line hook** — one base effect + one trigger/payoff (stacking, conditional comeback, gamble, or unique item).
- **Risk / Hard Cashout Rule (Rebalanced with Consolation Floor):** Gamble blessings (*The Gilded Chrysalis*, *Vault Speculation*) feature high-stakes payoffs. To eliminate extreme rage-quitting when triggers fail at 99% progress (e.g. unit dying at 118s of a 120s cocoon), gamble traits grant a **30% baseline consolation payout** (e.g. +30% of base gold/stats) upon failure while withholding the god-tier jackpot.

---

## 2. 🎲 In-Match Blessing Rites Flow

> Both players draft in parallel on synchronized match timestamps. Uses a **non-blocking slide-out drawer** accompanied by **6.0s of 0.5x Tactical Bullet-Time** (temporal dilation) and a **30-second countdown** to prevent match stalling or multiplayer desync.

1. **Rite Timestamps:**
   - **Rite 1: Opening (0:00)** — Establishes starting strategic direction.
   - **Rite 2: Expansion (5:00)** — Adapts to jungle control, economy scale, and skirmishes.
   - **Rite 3: Siege (10:00)** — Delivers decisive late-game win conditions or fortress defenses.
2. **Tier Allocation:** Tier slot rolled synchronously for both players (mirrored fairness).
3. **Smart Tailoring Protocol (3 Choices):**
   - **Slot A (Composition):** Biased toward the player's dominant unit class (Tank, Marksman, Mage, Fighter, etc.).
   - **Slot B (Strategic State):** Biased toward current match conditions (Economy catchup, Siege pusher, Camp clearing, or Courtyard defense).
   - **Slot C (Universal / Wildcard):** Drawn from the general tier pool.
4. **Rerolls:** Each player receives **1 Reroll per match**. Rerolling discards the 3 offerings and rolls 3 fresh blessings from the same tier pool.
5. **Anti-Repeat Rule:** Any blessing offered in an earlier rite (or discarded via reroll) cannot appear in subsequent rites. Cross-tier variants do not stack (only the highest tier applies).

---

## 3. 📊 Pool Structure (150 Traits)

| Type | Transcendence | Genius | Perfect | Extra | Ordinary | Total |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| ⚔️ Combat | 10 | 10 | 10 | 10 | 10 | 50 |
| 🪙 Economy | 10 | 10 | 10 | 10 | 10 | 50 |
| 🧪 Item | 10 | 10 | 10 | 10 | 10 | 50 |
| **Total** | **30** | **30** | **30** | **30** | **30** | **150** |

**Type definitions:**
- **⚔️ Combat** — buffs your army's fighting power (stats, regen, executes, siege, monster-hunting).
- **🪙 Economy** — resources (gold, XP, production rate, discounts, bounties, windfalls).
- **🧪 Item** — the item lane: free items, craft speed/cost, item stats, quality, salvage, transform, unique items.

**Cross-reference notes (authority chain):**
- Items & materials = `Data/ItemList/00 - Item List, Acquisition & Crafting.md` (25 items, 7 materials, Common/Rare/Epic/**Ancient** quality + 6 **Divine** items, Bazaar pity 150/300/500g, 1 item per unit).
- Monsters & drops = `Data/Monster/00 - Jungle Monsters & Material Drops.md` (21 monsters, 7 families).
- Units & classes = `Data/UnitRoster` (8 classes · 80 units). Assassin jungle bonus ≈15s/monster.
- Scout missions = `TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md` §CARD POOL: INTELLIGENCE & SCOUTING (10s scout window).
- **5-start pool:** before the match clock starts, each player freely selects **5 starter units** into Platoon 1 at no gold cost and starts with **0g**; they are the army's core and the anchor for `Commander` and `Commander of the Five`. Paid hires use the 60g base price after passive income accrues (`Data/Economy/02` §1).

---

## 4. ⚖️ Term Dictionary & Combat-State Machine (authoritative definitions)

> **Scope:** this section is the **contract layer** for every verb/noun the 150 traits use. If a trait line uses a term defined here, the definition wins — **no trait needs rewriting**. Where a definition corrects an earlier draft line, it is flagged **⟲** and this section supersedes it.

### 4.1 The Combat-State Machine — what a "fight" is

- **Fight** = one discrete engagement. A fight **engages** the moment either side first deals damage to the other: a platoon vs an enemy platoon, a platoon vs a camp/lair, or a platoon vs a wall segment.
- **Fight states:** **Running** (engaged) → **Resolved**. A fight **resolves** when any of:
  1. **Wipe** — every enemy unit in the engagement is dead (for a camp: all monsters in that camp/lair).
  2. **Disengage** — no damage dealt or received by either side for **10 consecutive seconds** (contact broken).
  3. **Recall** — a player pulls the platoon away (command order), ending the fight for the retreating side.
- **Per-fight counters** (revives, "first attack of a fight", "first melee/ability hit received per fight", "first 5 wall hits each fight", "once per fight") **reset when a fight resolves**, for the surviving units. A unit that dies and is revived stays in the same fight — its counters do not reset mid-fight.
- **Out of combat** (`Mess Hall`): a unit is out of combat when it is **not part of a Running fight**. The trait's parenthetical "(no damage for 10s)" is an *additional* condition, not a redefinition: the **1.5% missing-HP/s applies only when both (a) no active fight and (b) no damage received for 10s**; the 0.5%/s always applies.
- **Kill-time standards** (Monster file) — solo tank/support ≈60s, 6-squad ≈8s, solo Assassin ≈15s per monster — are **pacing benchmarks only**, never a rules trigger.

### 4.2 The Clock — minutes and "turns"

- The game is **real-time** (auto-battler, no player turns). All clocks tick against the **match timer's minute boundaries** (0:00, 1:00, 2:00, …).
- **"Turn" (once per turn / per turn / in a turn) = one game minute (60s), resetting exactly at the minute boundary.** This is a definition, not a change: every "per turn" trait reads as "per minute" — `Pandora's Genesis`, `Pandora's Bench`, `Pandora's Forge`, `Golden Bazaar` (1 extra material), `Bazaar Contract` (buy-3), `Perfect Understanding` (+1 salvage).
- **"Per minute"** triggers (`Courier Line`, `Courier Contract`, `Copper/Silver/Golden Interest`, `War Bonds`, `Midas Touch`, `Speculative Genius`, `War Economy`'s 10-kills-in-a-minute, `Bazaar Patron`'s first buy) all evaluate at the same minute boundaries. Resolution order for simultaneous events: **scout/mission payouts first, then the minute tick** (§4.11-7).
- **"Per match"** = once ever: `The Inventor`, `The Creator`, `Training Grounds`' first-3-kills, `Bounty Trail`'s first camp clear, `Bounty Cartel`'s first clear of each family. Per-match flags never reset.

### 4.3 Commander Level & XP

- **Commander Level (CL):** starts at **1**, **max 10**. Levels are a progression clock — their only mechanical effects are trait triggers (`Night School`, `Scholar's Guild`, `Academy of Genius`) plus the universal **+1% damage to all your units per level** (so leveling is never dead).
- **XP sources:** (a) **passive drip — 10 XP/s baseline**, scaled by production rate and +XP bonuses (`Holy Nation`, `Night School` +10%, `Scholar's Guild` +15%, `Scholar's Blessing` +25%, `Omniscient Academy` +50%); (b) **monster bounties — +80 XP | +100 Gold per monster last-hit kill** (see `Data/Monster/00 - Jungle Monsters & Material Drops.md`), scaled by +XP bounty traits; (c) **cards** may grant XP as a card reward.
- **Level curve:** **canonical curve in `Data/Economy/02 - Recruit Shop & Commander Level.md` §4** (L2 `500` · L5 `3,400` · L8 `9,000` · L10 `14,500` cumulative XP — the modern thresholds, L8 ≈ 15:00 on the 10 XP/s baseline). *(The older "level n → n+1 = 300 × n" formula is superseded by the canonical table.)* At baseline (10 XP/s) a player reaches ~L8 by a 15-minute match; XP traits push to L10.
- **Trigger:** "level up" fires the instant cumulative XP crosses the threshold; **overflow XP carries** (no loss). Army-wide per-level bonuses (`Academy of Genius`, `Scholar's Guild`) apply to all current units at the moment of level-up.

### 4.4 Walls & Breach

- **Wall structure:** each fortress has an **Outer Wall of 5 segments (6 hexes wide) @ 3,000 HP each** and an **Inner Wall of 5 segments @ 4,500 HP each** (per `Castle & Defensive Layers.md`). A **segment** is intact while HP > 0; at **0 HP it is destroyed — that is a breach**.
- **Wall damage model (⟲ correction):** the wall's **70% damage reduction is a non-siege penalty** — non-siege attacks deal **30% (i.e., −70%)** damage to intact segments. **Siege damage** (siege-unit structure multipliers ×1.25–2.0, and every "+X% siege damage" trait bonus) **deals full damage**. True damage also deals full damage to walls. This supersedes the earlier draft line that applied the 70% reduction to siege/true damage — otherwise siege units could never break a 3,000 HP segment.
- **Breach events:** the moment a segment is destroyed, every breach trigger fires: `Gilded Taxes` (+100g), `Gilded Monarchy` (+150g), `Speculative Genius` (minute kill-or-breach), `Fortress Mind` (breached-state buff), `Wallcrusher` (permanent +4% army damage per segment, max +20%).
- **"Unbreached wall segment"** (`Vanguard Strike`) = a segment never destroyed (HP > 0). "First strikes" = the first time that platoon damages an undestroyed segment **this fight**.
- **"Your wall is breached"** (`Fortress Mind`) = at least one of your wall segments is currently destroyed.
- **Defense shred never touches the wall** (`Doom's Staff`): halve/shred effects apply to units only; the wall's damage model is unaffected.

### 4.5 Platoons & Leadership

- **Platoon:** a formed tactical squad of **exactly 5 units** (army cap 20 = **4 platoons × 5 units**, hotkeys `1`, `2`, `3`, `4`). Every unit belongs to exactly one platoon.
- **Leader:** the unit in a platoon's anchor (lead) hex, set at formation. Blessings that crown a unit (`Commander`, `Overlord`) make that unit the platoon's leader while they live. **"The platoon it leads / it is on"** = the platoon containing that unit.
- **Starter platoon = first platoon:** both phrases (`Drill Sergeant`, `War Drums`, `Expedition Gear`, `Issue Equipment`, `Standard Issue`) mean **Platoon 1 — the first platoon formed from your 5-start-pool core**.
- **Platoon wipe** = killing every enemy unit in a platoon (fight-state wipe scoped to a platoon). Triggers cashout forfeits for gambles like *The Gilded Chrysalis*.
- **Role Diversity Bonus (5-Man MOBA Synergy):** a platoon's basic stats (HP, ATK/AP, ASPD, DEF/MR) scale with the number of **distinct roles** (Tank, Bruiser/Fighter, Mage, Marksman, Support/Artisan):
  - **1–2 Distinct Roles:** +0%
  - **3 Distinct Roles:** +5% All Stats
  - **4 Distinct Roles:** +12% All Stats
  - **5 Distinct Roles (Rainbow Archetype):** **+22% All Stats + 10 Tenacity** (CC duration reduction).
  *Purpose: reward diverse MOBA lineups, eliminate single-class blobs, and incentivize balanced frontline/backline drafting.*

### 4.6 Damage Model

- **Stats & mitigation:** ATK = physical power; AP = magic power; DEF = armor → **DR = DEF/(DEF+100)**; MR = magic resist → same formula. ASPD = attacks/sec; move speed = hexes/sec.
- **Damage types:**
  - **Physical** — ATK-sourced (basic attacks + physical abilities), mitigated by DEF.
  - **Magic** — AP-sourced (spells/abilities), mitigated by MR. "Ability hit" (for `Warding Chalk`/`Warding Sigils`) = magic-source damage.
  - **True** — ignores DEF & MR, and the wall's non-siege penalty.
  - **Siege** — not a damage type but a **target category**: "siege damage" = damage to wall segments that bypasses the non-siege penalty (§4.4).
- **CDR (cooldown reduction):** ability cooldown timers complete X% faster. Multiple CDR sources stack **additively**, **cap 60%** (`Commander` +20%, `Timeless` 30%, `Time Warp` 20%, `Commander of the Five` +10% on their platoons).
- **Crit:** default crit = **×1.5** damage. Traits override the multiplier (`Precision Aim` ×1.8, `Apex Marksman` ×2.0, `Quick Hands` 150% = baseline). **Crit chance** rolls per hit (pseudo-random, no pity); "guaranteed crit" (`Golden Fervor` at max stacks, `Quick Hands` first attack) skips the roll. A crit is still one hit (pierce is a separate 2nd hit at 50%).
- **Lifesteal:** heals the attacker for the listed **% of post-mitigation damage dealt**, from **physical attacks only unless the trait says "on all damage"** (`Eternal Bloodlust`, `Soul Siphon` extend it to magic/true). Lifesteal from all sources stacks **additively, hard cap 50%** (e.g., Bloodlust 12% + Bloodlocket 12% = 24%; enrage-tripled = 36%). `Rams & Siege Towers`' lifesteal vs walls uses damage dealt to the segment.
- **Damage-reduction stacking:** all "+X% damage reduction / takes X% reduced damage" bonuses stack **multiplicatively** (20% + 10% = 1 − (0.8×0.9) = **28%**, not 30%). **Hard cap: 70% total DR from all %-DR sources** (DEF/MR DR is separate and multiplies on top) — prevents immunity builds.
- **AoE target resolution:**
  - **"Platoon Max HP" strikes** (`God's Wrath` 20%, `Stormcaller` 12%): `strike = % × (sum of living units' Max HP in the target platoon)`, then **split evenly across the platoon's living units** (each takes strike ÷ n). If any unit's HP hits 0, the strike "kills a unit".
  - **Radius effects** ("nearby enemies", shockwave, revival bursts): **radius = 1 hex** (the 6 hexes adjacent to the source; the source is not included unless the trait says so). All enemy units in the area take **full damage; no falloff**.
- **Melee vs Ranged (classification):** **melee = base range 1 → Fighter, Tanker, Assassin, Artisan**; **ranged = base range ≥ 2 → Mage, Marksman, Support, Siege** (per the class stat table). Traits referencing melee (`Shield Drills`, `Shield Wall`, `Adamantine`, `Titan's Grip`, `Heavy Plating`) and ranged (`Quick Hands`, `Suppressing Fire`, `Apex Marksman`) use this split.
- **Shred vs Halve (⟲ interaction order):** **halve first, then shred flat.** `Doom's Staff` halves the target's current DEF & MR (×0.5, 5s); `Breaker`/`Sunderblade` shred subtract **−3 per stack** (max 15, 5s, refreshed on re-apply). Example: 24 DEF → halve → 12 → 3 shred stacks → 9. **Neither can reduce DEF/MR below 0**, and neither affects the wall.

### 4.7 Crowd Control

- **CC types:** **Stun** (cannot act; 1s default) · **Root** (cannot move, can attack) · **Slow** (move-speed penalty) · **Displacement** (forced move, e.g. knockback/pull 1 hex) · **Silence** (cannot cast). The trait list creates **stuns** (`Breaker` at 15 stacks) directly; the wider set is referenced by items/units (`Vital Ward`, `Null Ward`, `Vital Shard`).
- **Duration resist:** "CC-duration resist" (`Fortress Mind` +15%, `Null Ward`, `Vital Shard`) shortens the CC's duration by the listed %. "CC resist" (chance) rolls to ignore it outright.
- **Diminishing returns:** consecutive CC on the same target **within 6s is 50% reduced** (per `UnitRoster` §2.3) — no perma-CC chains.
- **Slow stacking:** slows stack **additively** with each other and **multiplicatively** with move-speed buffs; **cap 50% slow** (e.g., `Suppressing Fire` 8%-per-hit stacks, `Gale Cut` 15%). `Iron Strider`'s slow immunity negates all slows.

### 4.8 Combat Bookkeeping

- **Kill credit:** the unit landing the **killing blow** is the killer. **Platoon-scoped** kills credit to the killer's platoon (`Golden Fervor`, `Legion's Wrath`, `Titan's Grip`); **army-scoped** kills credit to your army (`Training Grounds`' first-3-kills, `War Economy`, `War Engine`).
- **What counts as a kill:** an unqualified **"kill" = any enemy unit or monster death your army caused**. "Enemy unit kills" = PvP only (`War Engine`, `War Machinery`); "monster kills" = PvE only (`Apex Predator`, `Scrap Pickers`). A camp **clear** = all monsters in that camp/lair dead (what `Bounty Trail`'s first-clear and `Bounty Cartel`'s family-first-clear count).
- **"Highest-value unit"** (`Overlord`): **value = unit gold cost — a flat 60g base for all units under Cost Model v2** (`Data/Economy/01`; escalation does not change value). All units tie on value → **ties: higher tier → higher Max HP → formation order**. Crowned at draft; re-crowned if the crowned unit dies.
- **Buff permanence on death:** **unit-tied buffs die with the unit** (`Commander`'s champion, equipped-item bonuses, `Apex Artificer`'s permanent consumables, kill-stack damage) — no transfer. **Revived** units keep pre-death buffs. **Army-wide permanent** bonuses persist regardless of deaths (`Wallcrusher`, `Training Grounds`, `Academy of Genius`/`Scholar's Guild` level-ups, `Wax & Oil`/`Tempering` per-equip HP).

### 4.9 Economy, Progression & Services

- **Production rate (⟲ correction):** scales **passive gold and passive XP only**. It **never generates materials** (jungle exclusivity, ItemList §3.1 — materials come only from drops, the Bazaar, or trait-granted fixed amounts). The only production-scaled material source is a trait that explicitly grants a "material drip" (`Infinite Growth`). `Holy Nation` boosts gold + XP only. *(Corrects the earlier draft line and the §6 Holy Nation note.)*
- **Extra item slots:** base rule is **1 item per unit** (`Relic Affinity`, `Grand Armory`, `Armory Eternal` override it locally/army-wide; the rule never removes a slot).
- **Bazaar stock system:** the Jungle Bazaar sells **materials only, never full items** — except `Grand Bazaar`, which additionally sells full **Common** items. Stock is **fixed**: all 7 materials × 3 rarities are always listed (21 slots). Each slot holds **3 copies**; a depleted slot **refills 1 copy per minute** (the rotation). A **refresh** (base **25g**; **free** under `Bazaar Patron` and `Grand Bazaar`) instantly restocks every depleted slot. Pity prices are fixed (Common 150 / Rare 300 / Epic 500, ItemList) and modified by traits (−15% `Bazaar Contract`, −25% `Bazaar Patron`, −40% `Golden Bazaar`, −75% `Grand Bazaar`; `Bazaar Voucher`'s 20% first-buy; `Bazaar Patron`'s 10%-cheaper first buy each minute).
- **Random-item sample space:** "random item" = **uniform over the 25-item table** (ItemList §5), re-rolled until a **compatible** unit exists (per the item's max-3-class list), then auto-assigned to a compatible unit. **Quality is preserved through transform.** "Random Divine item" = **uniform over the 6 Divine items** (ItemList §5.5), granted only by Transcendence traits once their condition is met (re-rolled until a compatible carrier exists). "Random" never means "you choose" — only traits that say "your choice" (`Pandora's Genesis`, `Pandora's Bench`) let you pick. Materials "of your choice" = you pick the material type.
- **Transform & quality-upgrade** (trait-granted Arsenal actions): cost **0 gold**, **per-minute limited** as written. Transform keeps the item's quality; "upgrade one quality tier" moves Common → Rare → Epic → **Ancient**. **Ancient is the ceiling** — only **Genius+** sources may roll it, and no trait below Genius may ever create an Ancient item (ItemList §4). Quality-upgrade can never produce a **Divine** item (Divine is a separate non-upgradable lane, §5.5).
- **Card-buy scaling:** extra tempo Card Draws cost **100 / 250 / 500 / 1,000 gold** for the 1st / 2nd / 3rd / 4th+ extra buy per match (per `TextPlan/05 - Command Cards/00 - Card System (Rules + All 25 Cards).md`; resets each match). **"Scaling caps at X"** (`Monopoly` 50, `Tycoon` 100, `Merchant Discount` 150) = the price never exceeds X.
- **Facilities & efficiency:** facilities are the city's production buildings (crafting/Resource Tab, gold/XP generators, etc.). A **facility upgrade** = paying to raise a facility's level; **"maxing a facility"** (`Scholar's Blessing`) = upgrading it to its level cap. **Facility efficiency** = the facility's output multiplier — "+5% efficiency" (`Omniscient Academy`) = +5% to that facility's generation, permanently, stacking multiplicatively with production-rate bonuses.
- **Salvage:** baseline = **unlimited** at the Resource Tab, **10s channel**, **30% gold refund** (no materials). Traits modify refunds (+10% `Salvage Scrap`, +20% `Salvage Expert`, +30% `Salvage King`, full materials `Reverse Engineering`/`Perfect Understanding`/`Salvage King` 50% chance). **"Per turn" salvage** (`Perfect Understanding` "+1 per turn") = **1 extra salvage usable anywhere that minute** — the anywhere clause covers location, the +1 covers the extra action (the Tab itself stays unlimited).

### 4.10 Class-Name Reconciliation (legacy → 8-class roster)

Legacy class names from the old 15-trait pool appear in Perfect-tier upgrades; map them to the 8-class roster:

| Legacy name | Modern roster classes |
| :--- | :--- |
| **Infantry** | **Fighter + Tanker** (frontline melee) |
| **Arbalest / Marksmen** | **Marksman** (backline ranged) |
| **Siege** | **Siege** (structure damage) |

So `Iron Armor` ("Infantry & Siege units") = **Fighter, Tanker, Siege**; `Precision Aim` ("Arbalest/Marksmen") = **Marksman**. Melee/ranged classification (§4.6) then applies normally.

### 4.11 Minor Clarifications

1. **"Nearby enemies"** = enemies within **1 hex** (the 6 hexes adjacent to the source; self excluded).
2. **Pierce 2nd target** (`Precision Aim` crits): the enemy **closest to the first target** (excluding it) **within 1 hex**; takes **50% of the crit's post-mitigation damage**. No eligible target → no pierce.
3. **Slow stacking:** §4.7 — additive, cap 50%.
4. **"Starter platoon" = "first platoon"** = Platoon 1 (§4.5).
5. **`Reliquary`'s 5 items** = **1 Common + 1 Rare + 2 Epic + 1 any-quality random** (guarantees "one of each quality incl. 1 Epic") — plus 2 Siege Bombs and 1 Epic material as the full starting loadout.
6. **Camp of 5+** (`Scrap Pickers`): a camp with **≥5 monsters at engagement start** — only Common camps qualify (they are exactly 5).
7. **Courier resolution order:** scout-mission payouts resolve **at the scout window's end** (intel arrival); 2-minute ticks resolve **at their minute boundary**. If simultaneous, the **scout payout resolves first**, then the tick (whose "scout active" check then sees the resolved scout).
8. **Buff permanence:** unit-tied buffs die with the unit; army-wide permanent buffs persist (§4.8).
9. **"First 3 attacks/kills" scope:** "a **unit's** first X" = per unit (`Quick Hands`, `Weapon Drills`, `Padded Jackets`/`Warding Chalk`'s first hit received); "**the platoon's/army's** first X" = one shared pool for the group (`Drill Sergeant`'s first 3 attacks, `Training Grounds`' first 3 kills of the match, `Ladders & Hooks`' first 5 wall hits each fight).
10. **Free items are random, not chosen** (§4.9): `Standard Issue`, `Issue Equipment`, `Expedition Gear`, `War Machinery`'s per-platoon items, `War Engine`'s kill-crafts, `Relic Hoard` are all uniform-random (compatible re-roll). Only explicit "your choice" grants are chosen.

---

## 5. 🧭 Balance Audit (the fun picks & the cut candidates)

> Audit method: every trait was checked against (a) the unit stat lines (560–1200 HP, ATK 50–126, DEF/MR 14–26), (b) the monster kill-time standard (tank/support solo 60s · 6-squad ~8s · assassin solo 15s), (c) the 10g/s passive income, and (d) the anti-bloat rule (no two traits functionally identical within a tier).
>
> **Pass 2 note:** the entire list was reworked under the **no-flat-stat rule** — the previous cut candidates (Training Grounds, Fitness Regimen, Mess Hall, Assistant's Loan, Night School) all got hooks and are no longer flat. The five below are the current weakest *by feel*, not by being flat — every trait now reads as a real choice.
>
> **Pass 3 note (balance tuning — numbers verified in §6):** nerfed or conditioned the over-tuned traits so no pick overshoots its tier's power ceiling:
> - `The Undying Host` — revive 60% → **45% HP**, + adds a 30%-ATK burst on revival (condition + toned number).
> - `Eternal Bloodlust` — 25% lifesteal / 50% threshold → **20% / 40%** (buff values **+50% → +40%**).
> - `God's Wrath` — 12s / 25% → **15s / 20%** max-HP meteor.
> - `Timeless` — 35% → **30%** CDR; **+4% → +3%** damage per cast.
> - `Wallcrusher` — +6%/segment → **+4%/segment, capped at +20%** (prevents late-game +60% army snowball).
> - `Master Builder` (Perfect) — cost −10% → **−15%**, time −25% → **−30%** (was out-scaled by its own tier's Quick Crafting).
> - **Intentionally strong picks (verified not broken, fair via mirrored draft):** Unbreakable, Commander, Holy Nation (+40% production is the deliberate universal benchmark), Doom's Staff.

### ✅ Pinpointed — the FUN PICKS (benchmark targets)
| Blessing | Tier · Type | Why It's Fun & Strategic Play |
| :--- | :--- | :--- |
| **The Gilded Chrysalis** | Goddess (01) · Economy | **Hard Cashout Gamble (Q2 Confirmed):** Banks all passive gold income for 4:00. At 4:00 cashout: grants 2.5× banked gold + 2 Random Divine Items. If Platoon 1 is wiped before 4:00, cashout is forfeited (Zero safety net). |
| **Last Bastion Vow** | Transcendence (02) · Combat | **Fortress Breach Comeback:** If Outer Wall breaches, friendly units gain +25% DR and +20% ASPD in courtyard/battlefield for 3m. Provides massive comeback potential against aggressive pushes. |
| **Vault Speculation** | Imperial (03) · Economy | **Facility Gamble (Q2 Confirmed):** Lock 500g into the Golden Vault for 3:00. Yields 1,250g if intact. If destroyed, the 500g is permanently lost. High risk, high reward. |
| **Martyr's Resolve** | Exalted (04) · Combat | **Casualty Counter-Play:** When an ally dies, surviving platoon members gain +15% Tenacity and heal 10% max HP over 4s. Turns focused enemy fire into sustain for survivors. |
| **Commander** | Transcendence (02) · Combat | Randomly crowns one of YOUR 5 starter units — every match tells a different story; army-building payoff, zero deterministic cheese. |
| **Avatars of War** | Goddess (01) · Combat | Kill → shockwave → more kills — a combat loop that snowballs fights in seconds. |
| **Wallcrusher** | Goddess (01) · Combat | Every wall segment destroyed permanently buffs the whole army — structure damage that pays forever. |
| **Master of Coin** | Goddess (01) · Economy | Free crafting + a War Fund that pays you back for spending — the gold sink becomes a printer. |
| **Pandora's Genesis** | Goddess (01) · Item | Once per minute, upgrade ANY item a quality tier or turn it into any other (caps at Ancient) — perfect builds every game. |
| **Breaker** | Transcendence (02) · Combat | Shred stacks into a 1s stun — attack-speed comps turn into crowd control. |
| **Phoenix Protocol** | Imperial (03) · Combat | Revive at 40% HP that explodes on arrival — a free life that punishes the enemy for stacking. |
| **Courier Line** | Exalted (04) · Economy | Scout missions literally pay gold — the 10s scout window is a paycheck. |

### ✂️ CUT CANDIDATES (the weakest / most ignorable — flagged for the next pass)
| Trait | Tier · Type | Why it's weak |
| :--- | :--- | :--- |
| **Mess Hall** | Ordinary · Combat | 0.5% missing-HP/s is imperceptible in combat; only the out-of-combat 1.5% matters — needs a bigger in-fight kick. |
| **Field Rations** | Ordinary · Item | 2 flasks with +10% heal — small and over in minute one; weakest open in the Item lane. |
| **Long Shelf Life** | Ordinary · Item | +20% consumable duration is the flattest remaining hook in the whole list. |
| **Assistant's Loan** | Ordinary · Item | The drip is tiny and the 30s craft-window hook is too easy to satisfy — no real decision. |
| **Courier Contract** | Ordinary · Economy | +40g/2min + 10g per scout is small; fine as filler, but the weakest economy read. |

> **Recommendation:** none are strictly dominated anymore (every one has a niche), so keep them but tune in playtest — Mess Hall's in-fight regen and Long Shelf Life's numbers are the two to watch. Structure stays 10/10/10 per tier.

---

## 6. 🧪 Playtest Validation (math pass — balance to equilibrium)

> Method: simulated every number against the game's anchors — unit **1000 HP / 20 DEF / 20 MR** (DR = DEF/(DEF+100)), passive income **600g/min**, craft cost **30g + materials**, historical monster **1450 HP** (superseded by Common 1,300 / Rare 2,200 / Elite 3,800 HP in `Data/Monster/00` §2), wall 70% DR. Then verified (a) tier monotonicity per archetype family, (b) no trait overshoots its tier ceiling, (c) no two traits in a tier overlap >70%.

### A. Combat spot checks — effHP multipliers (base effHP 1200)
| Trait | Calc (HP / DEF) | effHP | ×base | Verdict |
| :--- | :--- | :---: | :---: | :--- |
| Unbreakable (Transcendence) | 1400 / 24 | 1736 | **×1.45** | ceiling — user-specified ✓ |
| Immortal Vanguard (Genius) | 1120 / 32 | 1478 | ×1.23 | ✓ |
| Iron Legion (Perfect) | 1080 / 28 | 1382 | ×1.15 | ✓ |
| Iron Constitution (Extra) | 1050 / 20 | 1260 | ×1.05 | ✓ |
| Fitness Regimen (Ordinary) | 1030 / 20 | 1236 | ×1.03 | ✓ |
> **Result: monotonic** (1.03 → 1.05 → 1.15 → 1.23 → 1.45). No tier inversion.

### B. Economy spot checks — gold/min (baseline 600g/min)
| Trait | Value | g/min | Verdict |
| :--- | :--- | :---: | :--- |
| Gilded Ledger (Ordinary) | +5% | +30 | ✓ |
| Gilded Vault (Extra) | +8% | +48 | ✓ |
| Gilded Taxes (Perfect) | +15% | +90 | ✓ |
| Gilded Monarchy (Genius) | +25% | +150 | ✓ |
| Gilded Empire (Transcendence) | +40% | +240 | ✓ |
| **Holy Nation (Perfect) +40% production** | gold comp | +240 (+XP) | **flagged:** matches Transcendence on gold while also boosting XP — *intentionally the strongest generic pick (user-designed benchmark). Fair because the mirrored draft hands both players the same tier. Materials stay jungle-exclusive (see §4.9).* |
> **Result: monotonic** (30 → 48 → 90 → 150 → 240). Holy Nation is the one deliberate outlier — accepted, documented.

### C. Interest engines at 2,000g bank (g/min)
Copper (O) 20 → Silver (E) 40 → Golden (P) 40 (+milestone bonus) → War Bonds (G) 110 → Endless (T) 370.
> **Result: monotonic.** Minor note: Silver and Golden tie at 40 in the 2,000–2,500g band — Golden only out-scales above the Silver cap (50); its milestone bonus keeps it the strictly-better read. Acceptable.

### D. Other families — monotonic ✓ (verified)
- **Bounties:** +10% → +15% → +30% → +50% → +75% (Ordinary→Transcendence).
- **Recruit discount:** −5% → −8% → −15% → −25% → −40%.
- **Item stats:** +5% → +10% → +30% → +40% → +75%.
- **Lifesteal:** Bloodlust 12% (P) → Soul Siphon 18% (G) → Eternal 20% (T). Revive: Phoenix 1×@40% (P) → Undying Legion 2×@50% (G) → Undying Host all@45%+burst (T). Siege: +4% → +8% → +10% → +35%.

### E. Degenerate-combo watch list (playtest focus)
1. **Unbreakable + Undying Host** (both Transcendence Combat) — requires 2 Transcendence slots; verdict: **allowed, symmetric** (mirrored tiers), but the top watch item for live play.
2. **Stacked econ engines** (Gilded Empire + Golden Age ×1.5) — symmetric via mirrored draft; economy races are fair.
3. **Breaker shred-to-15 vs 14–26 DEF units** — the designated tank counter; no change.
4. **Apex Predator + Bounty Empire** (material dup + bounty) — item snowball; mirrored, watch.

> **Playtest verdict:** after Pass-3 tuning the list is at equilibrium — every archetype family scales monotonically across the 5 tiers and no trait exceeds its tier's power ceiling. The remaining strong picks are either intentional flagships or symmetric-by-design under the mirrored draft. Remaining unknowns are feel-based (Mess Hall in-fight regen, Long Shelf Life duration) — flagged for live playtest, not numbers.

---

- The 150 traits were researched, drafted, audited, and playtest-math-verified before finalizing (balance numbers verified in §6).
