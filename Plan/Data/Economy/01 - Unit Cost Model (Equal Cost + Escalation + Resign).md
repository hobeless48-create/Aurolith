---
tags: [Economy, UnitCost, EqualCost, Escalation, Resign, Balance]
type: Data - Authoritative
---

# 🪙 UNIT COST MODEL v2 — EQUAL COST + 2:30 ESCALATION + RESIGN

> **Decision (per request):** the commander chose **Option 1 — every unit costs the same.** The known flaw of equal cost (late-game sign-and-hire = army spam) is closed by three companion rules: **(a) a 2:30 price escalation** (units get pricier AND stronger as the match runs), **(b) Resign** (sell a hired unit back for 70%, with a 30s slot lock), and **(c) the respawn rule** — dead units respawn after a **30s timer** instead of being lost, so losses cost tempo, not a rehire bill (see §3). Stats and skills are then balanced around the rule **"no flawless unit"** — equal cost means every unit must have a real weakness (see §6 audit note).
>
> **Supersedes:** the tier gold-cost column (T1–T5 = 1–5g, `Data/UnitRoster/00` §2.1) **and** the legacy archetype prices (80–150g, `TextPlan`). Tier still exists — it gates **stats and shop odds only, never cost**.

---

## 1. ⚖️ The Flat Base Cost

- **Base hire price: `60 Gold`** for **all 80 units**, all tiers, all classes.
- **Why 60:** anchored to the 10 g/s passive (1 unit = 6s of income at match start). A full 20-unit army = **1,200g** (2 min of passive). At the escalation cap (150g) the same army costs **3,000g** — fielding a full 20-unit board late game is the most expensive action in the game, exactly the anti-army-spam pressure requested (under the respawn rule, §3, losses cost the 30s respawn tempo instead of a rehire bill). The 60g step keeps every escalated price an integer (60→75→90→105→120→135→150).
- **One cost, all lanes:** this is the number every trait discount (recruit −5%…−40%, Recruit Depot −10/15/20%) and every facility rider multiplies against.

---

## 2. ⏱️ The 2:30 Escalation

**Rule:** every **2:30 minutes** (match time 2:30 / 5:00 / 7:30 / 10:00 / 12:30 / 15:00 — the existing card-cadence boundaries), the **hire price of every unit rises +25%** and the **combat stats of every unit rise +10%**.

- **Price:** additive per tick on the base price. **Cap: +150% total → 2.5× base = 150g**, reached at tick 6 (15:00).
- **Stats:** additive per tick on base stats. **Cap: +60% total → 1.6× base**, reached at tick 6 (15:00).
- **Both caps land on the 15:00 tick** (Overtime start) — the two escalations are locked in step by design.
- **Scope of stat scaling:** **HP, ATK, AP, DEF, MR, ASPD** all scale ×1.6 at cap. **Move speed does NOT scale** (movement economy stays fixed). **Flat-value effects do not scale** (shields, barriers, item flats like Grove Barrier +300 HP); **% effects scale automatically** (lifesteal, %max-HP damage, auras). Level-up bonuses are separate from and unaffected by the tick scaling.

### Escalation table (both players, global tick)

| Tick | Time | Price | Price × | Stat × |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 0:00 | 60g | ×1.0 | ×1.0 |
| 1 | 2:30 | 75g | ×1.25 | ×1.1 |
| 2 | 5:00 | 90g | ×1.5 | ×1.2 |
| 3 | 7:30 | 105g | ×1.75 | ×1.3 |
| 4 | 10:00 | 120g | ×2.0 | ×1.4 |
| 5 | 12:30 | 135g | ×2.25 | ×1.5 |
| 6 | 15:00 | **150g (cap)** | **×2.5 (cap)** | **×1.6 (cap)** |

> **Interpretation note:** "+25% … max 150%" is implemented as **+25% of base per tick, cumulative, cap +150% total (2.5×)** — i.e. the cap figure is the *increment*, matching "+60%" for stats (1.6×). If the intended reading was a *multiplier* cap (1.5× price / 1.6× stats), the only edit needed is capping price at 90g (tick 2); the whole doc is built on this single constant.

---

## 3. 💀 Death, Respawn & Resign

### 3.1 The Respawn Rule — units don't permanently die

- **Death → Graveyard, not loss.** A dead unit enters the Graveyard queue and **respawns automatically after a 30-second timer** — free, at the Core (or the Imperial Gate if built, T2+). It keeps its level; items were already lossless (they return to the Arsenal).
- **A dead unit holds its army slot** while in the queue — you cannot hire a replacement until it respawns or is Resigned. A wiped army is off the board for the full 30s: **death costs tempo, not gold.**
- **The respawn timer is flat 30s** (tuning knob). Recruit Depot reduces it (−25% / −50%); Sanctum of Restoration makes one death per window instant (bypasses the timer).
- **Revive interplay:** in-fight revives (Undying Host, banner revives, Undying Will card) return the unit during the fight; if the revived unit dies again, its next respawn is **doubled (60s — the cap)** until it survives 30s (per the Undying Will card).
- **Kill-counting unchanged:** deaths still count as kills for kill-tracking traits and combos.

### 3.2 Resign (the only permanent removal)

- **Action:** the commander may **Resign** any hired unit → the unit leaves the board **permanently**, the slot frees, and the commander receives a refund.
- **Refund = 70% of the price actually paid at hire time for that unit instance** (e.g. a 60g hire refunds 42g; a 150g hire refunds 105g).
- **Anti-arbitrage rule (critical):** the refund uses the *paid* price, **never the current price**. Buying a unit cheap at 0:00 and resigning it at 15:00 must **lose** 30% of what was paid — early-buy / late-resign can never profit.
- **30-second slot lock (Atomic Server Reservation):** after a Resign, **that slot cannot be hired again for 30s**. To prevent client-server race conditions where a client clicks recruit with 0.1s left, the slot lock is enforced strictly by authoritative server timestamp (`lockExpiresAtTick = currentTick + 300`). Client UI shows an active countdown badge and disables the recruit button until the server broadcasts an authoritative `slot-unlocked` event.
- **Resign a fallen unit:** a unit still in its Graveyard timer can be Resigned early — you trade its eventual return for 70% refund + slot lock (the tempo-for-gold decision).
- **Interactions:** Recruit Depot T3 shortens the lock to 15s. Sanctum of Restoration no longer refunds gold (respawn is free by rule) — it shortens the Graveyard queue instead (instant respawn per window).

### 3.3 Comeback Wage Subsidy (Anti-Death Spiral)

- **The Problem:** At late ticks (10:00–15:00), escalated hiring costs (120g–150g) make rebuilding new unit slots or replacing resigned units difficult if a player fell behind in active army size.
- **The Subsidy:** If a player's active fielded army count is **fewer than half of the enemy player's active fielded army**, the player receives a **+5 g/s Emergency War Subsidy** and their recruit shop offers receive a **flat −30% Comeback Discount** until their fielded roster reaches parity. Dead units awaiting the 30s respawn timer are free to recover and retain their items, but this subsidy ensures active roster expansions remain viable.

### Why this design holds together

| Exploit vector | Closure |
| :--- | :--- |
| Late-game sign+hire army spam | price 2.5× at cap gates building; 30% loss per Resign cycle + 30s lock gates churn |
| Resign arbitrage (buy early, sell late) | refund = paid price, not current price |
| Death-spam / double-army | respawn is the only return path; the dead unit holds its slot — no replacement stack |
| Fast-loss recovery | 30s respawn tempo + Sanctum/Recruit-Depot reductions + Comeback Subsidy |
| Equal-cost = no strength cost signal | "no flawless unit" audit rule (§6) — every unit carries a real weakness |

---

## 4. 🔗 Interactions With Existing Systems

- **Trait recruit discounts** (−5 / −8 / −15 / −25 / −40%, bank-conditional −10%) apply to the **current escalated price** (e.g. Monopoly −40% at 15:00 = 150g → 90g). Free-Nth-recruit riders (Monopoly 5th, Tycoon 10th, Haggler's Eye 1st-per-minute) are unchanged.
- **Overlord** ("highest-value unit", `Data/BlessingList/00` §4.8): value = **base flat cost (60g) for all units** → every unit ties on value; ties break by **higher tier → higher Max HP → formation order** (existing rule). Re-crowned if the crowned unit dies.
- **Card-buy scaling** (100/250/500/1000g) and its trait caps are unchanged — they sit on the card lane, not the unit lane.
- **Core Barracks / army cap:** unchanged (14→20) — the army cap is now a Core Upgrade (`TextPlan/03 - Facilities/02 - Core Upgrades (Treasury, Crucible, Barracks).md`), so **no facility slot is spent on it**. The 20-unit army now has a *dynamic* price tag (1,200g early → 3,000g at cap).
- **Items / crafting:** unchanged — the item lane (30g + materials) is separate and not part of the unit price.

---

## 5. 📈 Economy Check Against the Audit

From `Data/Economy/00`: passive gold = 11,700g/match · full early army 1,200g (≈10% of match income) · escalated full army 3,000g (≈26%) — hiring stays affordable but never trivial; facility T3s (400g+250XP) remain the bigger single purchases. The escalation curve (60→150g) tracks the income curve (10→15 g/s) closely enough that hire is never *hard-locked* out of reach, while army-building late stays expensive — and losses cost the 30s respawn tempo (free to return, never free to replace).

---

## 6. ⚠️ "No Flawless Unit" Audit Note (equal-cost caveat)

Equal cost means strength is expressed in **stats and skills**, not price — so the roster must hold the rule: **every unit has a real, exploitable weakness**. From the current stat tables, the following need a tuning-pass review before they are safe under equal cost (flagged, not rebalanced here):

- **Ballista Grun** (T3 Marksman): 900 HP / 28 DEF / 20 MR on a *ranged* class (×0.8 HP contract) — effectively a tanky gunner; range 5→9 and 0.6 ASPD is the only counterweight.
- **Bulwark Aldric** (T1 Tanker): 1050 HP / 50 DEF / 40 MR — the extreme T1 wall; needs a clear counter (he has none listed).
- **Bannerlord Cassius** (T4 Support): 950 HP / 58 ATK / 28 DEF — fighter-grade stats on a support; his aura must be modest to justify it.
- **Assassin header prices** (750–1600g in `Final - Assassins.md`) are obsolete under the flat cost — see the supersession note added to that file.
- **General rules that already protect equal cost:** Mage AP-only (physical shred is useless vs them), Siege lowest mobility + longest CDs (7–14s), Artisan lowest ATK in game + zero combat, Support lowest ATK multiplier (×0.55), Assassin lowest HP pool in the game.

**Verdict:** equal cost ships now; the §6 flagged units get follow-up stat/skill passes in the next tuning round.
