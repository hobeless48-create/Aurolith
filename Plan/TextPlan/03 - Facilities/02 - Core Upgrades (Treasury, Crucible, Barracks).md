---
tags: [CoreUpgrades, PassiveEconomy, ArmyCap, Treasury, Crucible, Barracks, BaseFeature]
type: System Core
---

# 🏛️ CORE UPGRADES — Passive Economy & Army Cap (v2)

> **Design decision (review pass):** *"If it's passive, it should be a simple feature — a core upgrade instead of a facility."*
> The 3 passive/static members of the old facility pool — **Gold Mint, XP Crucible, Supply Depot** — are **no longer facilities**. They are now **Core Upgrades**: always-available base features at the Core. **No 3×3 slot, no footprint, no construction choice, no destruction risk.**
>
> **Why:** the 6 Inner Wall slots are for *interesting, active* facilities (siege weapons, buff monoliths, active production). Passive income and the army cap are baseline infrastructure every player has, so facility slots never get wasted on "a number that ticks up."
>
> **Trade-off (accepted):** Core Upgrades cannot be destroyed — the enemy can no longer kill your income directly. The economy counterplay shifts to the things that *are* attackable: **facilities** (the 6 slots), **Artisans** (kill the production), and **jungle contesting** (farm denial).

---

## 1. ⚙️ Rules

- **3 independent upgrade tracks**, all maxable in the same match (no slot, no category cap, no duplicates issue).
- **Costs unchanged** from the old facility tiers: `150 Gold` → `250 Gold + 100 XP` → `400 Gold + 250 XP` (T1/T2/T3).
- **Upgrade time** is treated as a *facility* upgrade for all discount systems (Guild Foreman −40% time, Architect Venn −25% gold, Stone Quarry −% cost, card discounts) — artisan synergies preserved.
- **No HP, no damage, no destruction.** Core Upgrades cannot be sieged.

---

## 2. 📜 The 3 Core Upgrade Tracks

### 1. 💰 Core Treasury — *"Coinpress"*
- **T1:** +5 Gold/s · **T2:** +7 Gold/s · **T3:** +10 Gold/s.
- **Scales:** this IS **passive gold** → production-rate traits (Holy Nation +40% → T3 = +14 g/s) and ×-multipliers (Midas Touch ×1.25, Golden Age ×1.5) apply.
- **Why Core:** a flat income drip is a base feature, not a build decision.

### 2. 🧪 Core Crucible — *"Crystal Basin"*
- **T1:** +3 XP/s · **T2:** +5 XP/s · **T3:** +8 XP/s (+15% to all unit level-up XP gains).
- **Scales:** passive XP → production-rate traits apply.
- **Baseline:** the modern passive is **10 XP/s** (`Data/BlessingList/00` §4.3) — the old "on the 5 XP/sec baseline" text is corrected.

### 3. 📦 Core Barracks — *"Conscription Grounds"*
- **T1:** +2 army cap (14 → 16) · **T2:** +2 (→18) · **T3:** +2 (→ **hard cap 20**) + units recruited at T3 spawn with **+10% Max HP**.
- **Recruitment Lock Rule (preserved):** if the cap is ever *reduced* (an enemy core-break effect, future mechanic) while unit count exceeds it, recruitment is locked until count drops below the cap — existing units are never destroyed.
- **Why Core:** the army cap is static baseline infrastructure; the *choice* is which units fill it, not whether to have it.

---

## 3. 📈 Economy Context (from the Audit)

Core Upgrades add the no-slot economy floor: **Treasury T3 +10 g/s** and **Crucible T3 +8 XP/s** on top of the 10 g/s + 10 XP/s baseline → **20 g/s / 18 XP/s potential with zero slots spent**. Full numbers and the interplay with the buffed Caravan Post (T3 +8.33 g/s) are in `Data/Economy/00 - Economy Per-Second Audit.md` §3.
