---
tags: [Economy, Audit, PerSecond, Facilities, Traits, Production, Scenes, Balance]
type: Data - Authoritative
---

# 📊 ECONOMY PER-SECOND AUDIT — Facilities × Traits × Production Units × Scenes

> **Purpose (per request):** "check the current economy per second in each scenario of each facility / trait / production unit in each scene" — then use the numbers to set the unit cost model (`01 - Unit Cost Model (Equal Cost + Escalation + Resign).md`).
>
> **Authority:** modern economy baseline = **10 Gold/s + 10 XP/s passive**, unit tier costs **superseded by the flat model in `01`**, monster bounty `+80 XP | +100 Gold` (`Board & Map Grid` §1 + `TechnicalPlan/01` §3). **Conflicts flagged in §7.**

---

## 1. 🕐 Baseline Economy Per Scene (Match Phase)

| Scene | Time | Passive Gold | Passive XP | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Opening** | 0:00 – 5:00 | **10 g/s** | **10 XP/s** | Siege locked; jungle uncontested; escalation ticks 2:30 & 5:00 |
| **Expansion** | 5:00 – 10:00 | **10 g/s** | **10 XP/s** | Siege online; jungle contested; ticks 7:30 & 10:00 |
| **Siege** | 10:00 – 15:00 | **10 g/s** | **10 XP/s** | Primary combat; ticks 12:30 & 15:00 (price caps at 15:00) |
| **Overtime** | 15:00 – 18:00 | **15 g/s** (+50%) | **10 XP/s** | Eco ramp; price & stat caps in effect |

**Match totals (passive only):** Gold **11,700g** (10,800 + 900 overtime) · XP **10,800 XP** (≈ L8 by 15:00, L10 reachable with XP traits).

**Per-minute baseline:** 600 g/min · 600 XP/min (Overtime: 900 g/min).

---

## 2. 🌿 Jungle Income Context (the other economy lane)

| Source | Bounty | Notes |
| :--- | :--- | :--- |
| Monster last-hit | **+80 XP | +100 Gold** | awarded to the killer's player; every jungle monster |
| Boss — Elite Camp | +120 XP | +150 Gold | spawns 2:00, 1,500 HP · Stampede Blessing |
| Boss — Alpha Camp | +200 XP | +300 Gold | spawns 8:00, 3,000 HP · Eyes of the Storm |
| Boss — Ancient Camp | +350 XP | +500 Gold | spawns 12:00, 6,000 HP · Emperor's Bastion |
| **Warlord Shutdown** | **+200 XP | +300 Gold** | Awarded when slaying an enemy unit on a killing spree (3+ kills without dying) |

**Standard farm rate (kill-time standard, `Data/Monster/00`):** Common camp = 5 monsters × 100g/80XP = **+500g / +400 XP per camp**. With a ~95–100s camp cycle (clear + travel + 40s respawn), **1 active farmer ≈ +8.3 g/s**; a 2-squad farm ≈ **+16.7 g/s**. Compare §1: passive is **10 g/s** — a single dedicated farmer roughly **doubles** a player's gold income; the jungle is the dominant early economy by design.

**Anti-Snowball Shutdown Mechanism:** Warlord Shutdowns (+300g / +200 XP) guarantee that an overextended winning team risks handing decisive comeback capital to a coordinated counter-attack if their fed carry is caught out.

---

## 3. 🏭 Facility Scenarios (per slot, per tier)

| Facility | T1 | T2 | T3 | Scene value |
| :--- | :--- | :--- | :--- | :--- |
| **Core Treasury** (Core Upgrade — `TextPlan/03 - Facilities/02 - Core Upgrades (Treasury, Crucible, Barracks).md`) | +5 g/s | +7 g/s | +10 g/s | **passive gold** → scaled by production-rate traits & ×-multipliers (Holy Nation +40% → T3 = +14 g/s; Golden Age ×1.5 → +15 g/s). No slot, cannot be sieged. |
| **Core Crucible** (Core Upgrade — `TextPlan/03 - Facilities/02`) | +3 XP/s | +5 XP/s | +8 XP/s | T3 also +15% level-XP. No slot, cannot be sieged. |
| **Core Barracks** (Core Upgrade — `TextPlan/03 - Facilities/02`) | +2 cap | +2 | +2 (+10% HP recruits) | No income — cap is the economy. No slot, cannot be sieged. |
| **Caravan Post** (slot facility) | **+2.5 g/s** (150g/min) | **+5.0** (300g/min) | **+8.33** (500g/min) | **Not** passive gold (unscaled by production traits). Feeds bank-threshold traits (Interest / Bonds / Treasury) with minute lumps. |
| **Hunter's Lodge** | +15% bounties ≈ **+1.25 g/s** | +30% ≈ **+2.5 g/s** | +50% ≈ **+4.17 g/s** | Value scales with your farm rate (doubles at 2-camp/min). Stacks with bounty traits — total bounty bonus **cap +150%**. |
| **Recruit Depot** | hire −10% | −15%, respawn −25% | −20%, respawn −50%, resign lock 30s→15s | Spend-reducer on hire cost (saves 6–9–12g/unit at base 60g; 15–22.5–30g at the 150g cap) + **respawn-time reduction** (30s → 22.5s / 15s) — tempo, not gold, per `Data/Economy/01 - Unit Cost Model (Equal Cost + Escalation + Resign).md` §3. |
| **Golden Vault (Bank)** | T1: 10 / 25 / 75% | T2: 15 / 40 / 150% | T3: 25 / 60 / 200% | terms 1/2/4 min (all open at T1), interest on **locked** deposits (cap 1,000g/term, one term per copy) — a 1,000g T3-Long deposit maturing after 4 min pays +2,000g. HP 100/200/400; **vault breach on destroy = deposits forfeited**. Vaulted gold is excluded from the spendable bank. |
| War Foundry / Stone Quarry | — | — | — | Craft discount / build discount — spend-reducers, no direct g/s (full spec in `Data/FacilityList/00 - Facility Pool (18 Facilities).md`). |
| Ballista / Catapult / Arcane Barrier / Metal Wall | — | — | — | Defense value, no g/s. |
| Field of Despair / Sanctuary | — | — | — | Zone-aura value, no g/s. |
| War Banner / Transmuter / Windrider / War Room / Training Grounds / Sanctum | — | — | — | Combat / XP / respawn value, no direct g/s. |

**Core-Upgrade floor:** Treasury T3 +10 g/s + Crucible T3 +8 XP/s come free — no slot spent, cannot be sieged (see `TextPlan/03 - Facilities/02 - Core Upgrades (Treasury, Crucible, Barracks).md`). The strongest **slot** gold is now **Caravan Post T3 +8.33 g/s** — deliberately lumpy and unscaled, so it feeds bank-threshold traits instead of racing the passive lane. With production traits, Treasury T3 scales to +14 g/s (Holy Nation) / +15 g/s (Golden Age).

---

## 4. 🎴 Trait Scenarios (per trait, converted to g/s on the 10 g/s baseline)

### 4.1 Passive-gold % (scales the 10 g/s floor)

| Trait | Tier | Effect | g/s | g/min |
| :--- | :--- | :--- | :--- | :--- |
| Gilded Ledger | Ordinary | +5% | +0.5 | +30 |
| Gilded Vault | Extra | +8% | +0.8 | +48 |
| Gilded Taxes | Perfect | +15% | +1.5 | +90 |
| Gilded Monarchy | Genius | +25% | +2.5 | +150 |
| Gilded Empire | Transcendence | +40% | +4.0 | +240 |
| Midas Touch | Genius | all gold ×1.25 | +2.5 (passive) | +150 (passive; more on bounties/facilities) |
| Golden Age | Transcendence | all gold ×1.5 | +5.0 (passive) | +300 (passive) |

### 4.2 Production-rate % (passive gold + passive XP + material drip)

| Trait | Tier | Effect | g/s | XP/s |
| :--- | :--- | :--- | :--- | :--- |
| Holy Nation | Ordinary | +10% | +1.0 | +1.0 |
| Holy Nation | Extra | +20% | +2.0 | +2.0 |
| Holy Nation | Perfect | +40% | +4.0 | +4.0 |
| Infinite Growth | Genius | +2%/min → **+30%** | ramps 0 → +3.0 | ramps 0 → +3.0 |
| Eternal Growth | Transcendence | +3%/min → **+60%** | ramps 0 → +6.0 | ramps 0 → +6.0 |
| Supply Runner | Extra | +5% (holding 3+ Rares) | +0.5 | +0.5 |

*Ramps cap at 15:00 (30%/60%) — matching the unit-cost escalation cap tick.*

### 4.3 Periodic flat gold (lump payouts)

| Trait | Tier | Effect | g/s | g/min |
| :--- | :--- | :--- | :--- | :--- |
| Courier Contract | Ordinary | +40g/2min | +0.33 | +20 (+10/scout) |
| Courier Line | Extra | +60g/2min | +0.5 | +30 (+30 scout-active) |
| Prospector's Luck | Perfect | +120g/2min | +1.0 | +60 (+15% free card) |
| War Bonds | Genius | +50g + 3% bank, per min | +0.83 + 3% bank | +50 + 3% bank |
| Endless Treasury | Transcendence | +250g + 6% bank, per min | +4.17 + 6% bank | +250 + 6% bank |
| Royal Charter | Genius | no direct g/s — grants the **Imperial Gate** teleport facility (`Data/FacilityList/00 - Facility Pool (18 Facilities).md` §7) | tempo value | tempo value |
| Speculative Genius | Transcendence | +200g / +50g, per min | 0.83–3.33 | 50–200 |

### 4.4 Interest (bank-based, per minute)

| Trait | Tier | Effect | Cap (g/s) |
| :--- | :--- | :--- | :--- |
| Copper Interest | Ordinary | +1g/min per 100g bank | +30/min = +0.5 |
| Silver Interest | Extra | +2g/min per 100g bank | +50/min = +0.83 |
| Golden Interest | Perfect | +2g/min per 100g bank | +60/min +30g = +1.5 |

### 4.5 Windfalls (one-time, amortized over their window)

| Trait | Tier | Effect | Amortized g/s |
| :--- | :--- | :--- | :--- |
| Golden Hour | Genius | +800g at 10:00 (+25g/pre-10 camp) | +1.33 (over 0–10:00) |
| Golden Millennium | Transcendence | +1,500g at 10:00 + 1 Epic item | +2.5 (over 0–10:00) |

### 4.6 Bounty % & kill gold (scales the §2 farm lane)

| Trait | Tier | Effect | g/s @ 1 camp/min |
| :--- | :--- | :--- | :--- |
| Bounty Trail | Ordinary | +10% bounties | +0.83 |
| Bounty Hunter | Extra | +15% bounties + 50g/5 camps | +1.25 (+milestones) |
| Rapid Bounty | Perfect | +30% bounties | +2.5 |
| Bounty Cartel | Genius | +50% bounties | +4.17 (+Rare/family) |
| Bounty Empire | Transcendence | +75% bounties | +6.25 (2× Elite material) |
| Scrap Pickers | Ordinary | +5g/monster +15g/camp-of-5 | +0.4 |
| Spoils of War | Extra | +3g/kill (cap 15/engagement) +50/10th kill | fight-dependent |
| War Economy | Perfect | +5g/kill +8g/monster +100/10-kill-min | fight-dependent |

### 4.7 Recruit & craft discounts (spend-reducers — interact with the new cost model)

| Vector | Values |
| :--- | :--- |
| Recruit cost −% | −5 (Haggler's Eye) / −8 (Merchant's Bargain) / −15 (Merchant Discount) / −25 (Tycoon) / −40 (Monopoly); + conditional −10 (War Bonds / Royal Treasury bank thresholds); free-Nth-recruit riders (5th/10th/1st-per-minute) |
| Craft / upgrade −% | −5 (Penny Pincher) / −8 (Frugal Engineer) / −15 (Master Builder) / −25 (Forge Baron) / −50 (Omniscient Academy); 100% (Master of Coin) |

### 4.8 Passive-XP traits

| Trait | Tier | Effect | XP/s |
| :--- | :--- | :--- | :--- |
| Night School | Ordinary | +10% | +1.0 |
| Scholar's Guild | Extra | +15% | +1.5 |
| Scholar's Blessing | Perfect | +25% | +2.5 |
| Academy of Genius | Genius | +40% | +4.0 |
| Omniscient Academy | Transcendence | +50% | +5.0 |

---

## 5. 🛠️ Production-Unit Scenarios (Artisans, alive-gated)

| Artisan | Tier | Economy line | g/s / value |
| :--- | :--- | :--- | :--- |
| **Goldsmith Aurelia** | T2 | Ledger +0.2 g/s (stack to +0.6 g/s max across econ artisans) + Tax Tithe 22g/90s | **≈ +0.44 g/s** solo · **≈ +0.84 g/s** at cap · ~340g/match (PVR 0.97, top of band) |
| Guild Foreman | T2 | build time −40% (cap 40%) | no g/s — tempo (earlier Treasury/Crucible = earlier income) |
| Architect Venn | T3 | facility gold −25% (cap 40% w/ Foreman) | spend-reducer (saves ~37.5g on a 150g build) |
| Stonewright Marble | T3 | repair 3× standard (6 HP/s) + 600 HP scaffold | prevents wall loss; no income |
| Quartermaster Sable | T3 | craft time −50%, gold −30% (army-wide) | spend-reducer; conditional |
| Master Enchanter Odette | T4 | item effects +50% (army-wide) | value-in-kind; conditional |
| Civil Engineer Markus | T4 | roads 30g/hex | spend, not income |
| Lumberjack Bodhi / Trapsmith Vern | T2 | barricades / traps | map control |
| Salvager Rook | T1 | facility/wall refund 75% vs 50% | losing-conditional (+25% refund) |

**Universal counterplay:** all artisan value is alive-gated — kill the artisan, the economy line dies same-tick. This is what keeps Artisans inside the 0.7–1.0 PVR band (`Final - Artisans.md`).

---

## 6. 🗺️ Scene Composition Matrix (illustrative builds)

| Scene | Example income stack | g/s | Notes |
| :--- | :--- | :--- | :--- |
| **Opening 0–5:00** | base 10 + Core Treasury T1 +5 + 1 farmer +8.3 + (trait: Gilded Ledger +0.5) | **≈ 23.8** | Treasury pays for itself in ~30s; farm dominates. |
| **Expansion 5–10:00** | base 10 + Treasury T2 +7 + Caravan T2 +5.0 + 2-squad farm +16.7 + (Holy Nation Extra +2) | **≈ 40.7** | Siege online — income must fund facility T3s (400g+250XP) and army hires. |
| **Siege 10–15:00** | base 10 + Treasury T3 +10 + Crucible T3 +8 XP/s + Hunter's Lodge T3 +4.17 + (Gilded Monarchy +2.5 + bounty trait +2.5) | **≈ 29.2** (gold) + 8 XP/s | Farm falls off (contested); facilities carry. Unit price 120g → 150g. |
| **Overtime 15–18:00** | base 15 + Treasury T3 +10 + Caravan T3 +8.33 + Hunter's T3 +4.17 + (Gilded Empire +4 + Golden Age ×1.5) | **≈ 41.5 → 62** (×1.5) | All caps active: unit price 150g, stats ×1.6. Losses cost the 30s respawn tempo — army building is the expensive action late. |

---

## 7. ⚠️ Audit Findings & Data Conflicts

1. **Jungle out-scales passive (by design, now quantified):** one farmer ≈ +8.3 g/s vs 10 g/s passive. Every economy conversion above that touches bounties (Hunter's Lodge, bounty traits, kill gold) scales on the farm rate — **the farm rate is the primary balance lever**, not the passive floor. A 2-squad farm (+16.7 g/s) exceeds Core Treasury T3 (+10 g/s).
2. **Conflict — monster XP (fixed):** `Data/BlessingList/00` §4.3 previously said *5 XP/monster, 20 XP/Elite*; `Board & Map Grid` + `TechnicalPlan/01` say *+80 XP | +100 Gold* per monster. **Resolution: +80 XP | +100 Gold wins** (2 sources agree). ✅ **Applied** — `Data/BlessingList/00` §4.3 now reads *+80 XP | +100 Gold per monster last-hit kill*; bounty table added to `Data/Monster/00` §7.
3. **Conflict — XP baseline:** `TextPlan` Numerical Baseline says 5 XP/s; modern `Data` baseline is **10 XP/s**. 10 wins. The Core Crucible's "(on the 5 XP/sec baseline)" parenthetical is corrected to 10.
4. **Conflict — unit costs:** legacy 80–150g (TextPlan) vs tier 1–5g (Data) — **both superseded by the flat model in `01`** (60g base, escalating).
5. **Stacking exposure — RESOLVED (Wave 0 decision):** the **total passive-lane gold-income multiplier cap = ×2.0** is now set. Applied to **passive gold income only**: after summing all flat additions (base + Core Treasury + Caravan + Hunter's Lodge + trait flats) and applying all ×-multipliers (Midas ×1.25, Golden Age ×1.5, Gilded Monarchy, etc.), passive gold income is clamped to ≤ 2× the scene baseline (10 g/s → ≤20 g/s; Overtime 15 g/s → ≤30 g/s). The bounty/kill-gold lane has its own +150% cap and is exempt. Recorded canonically in `TextPlan/09 - Glossary of Game Terms & Attributes.md` §8.
6. **Bounty stacking cap set:** facility + trait bounty bonuses **cap at +150% total** (Hunter's Lodge T3 +50% + Bounty Empire +75% = +125%, still under cap).
7. **Overtime ramp applies to gold only** (10 → 15 g/s). XP stays flat at 10 XP/s.
