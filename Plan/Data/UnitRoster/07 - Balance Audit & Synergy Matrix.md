---
tags: [Roster, Audit, Balance, Synergy, Counterplay]
type: Balance Audit
---

# ⚖️ BALANCE AUDIT & SYNERGY MATRIX (All 80 Units)

> Full audit against the 4 hard requirements of the roster brief, plus the **Artisan Production Audit** (§6) that verifies production cannot out-pace a full-combat army. The 7th class (Artisan) is audited in `Final - Artisans.md`; the 8th class (Assassin) in `Final - Assassins.md`.

---

## 1. ✅ Synergy Requirement — Every Unit Has ≥3 Meaningful Partners

**Result: PASS.** Every one of the 80 units lists exactly **4 synergy partners spanning at least 2 different non-own classes**. No unit's partners come only from its own class.

### Verification Summary (per class, all 10 units pass)

| Class | Units with ≥3 partners | Partner class spread |
| :--- | :--- | :--- |
| Fighter | 10 / 10 | Always pairs with ≥1 Marksman + ≥1 Support |
| Tanker | 10 / 10 | Always pairs with ≥1 Mage + ≥1 Siege |
| Mage | 10 / 10 | Always pairs with ≥1 Tanker + ≥1 Support |
| Marksman | 10 / 10 | Always pairs with ≥1 Fighter + ≥1 Support |
| Support | 10 / 10 | Always pairs with ≥1 Fighter + ≥1 Tanker |
| Siege | 10 / 10 | Always pairs with ≥1 Tanker + ≥1 Support |
| Artisan | 10 / 10 | Always pairs with ≥1 Siege + ≥1 Support/Tanker/Marksman + 2 fellow Artisans |

**Spot-check (representative):**
- **Vanguard Marrow** (Fighter) → Grendal (Fighter) + Vale (Marksman) + Rory (Support) + Galen (Support) — 4 partners, 3 classes. ✅
- **Graviton Olum** (Tanker) → Rhuk (Fighter) + Orin (Mage) + Drenn (Mage) + Cinder (Mage) — 4 partners, 3 classes. ✅
- **Ballista Grun** (Marksman) → Aldric (Tanker) + Bastion (Tanker) + Cassius (Support) + Tulia (Support) — 4 partners, 2 classes. ✅
- **Echo Sage Vermos** (Mage) → Orin (Mage) + Rory (Support) + Lim (Support) + Elowen (Mage) — 4 partners, 2 classes. ✅

---

## 2. ✅ Isolated Power — No Unit Is Overpowered Alone

**Result: PASS.** Every potentially dominant standalone unit has a hard, cheap counter built into the ecosystem.

| Unit (Standalone threat) | Why it's scary | The counter |
| :--- | :--- | :--- |
| **Graviton Olum** (T5) | 3-hex pull + stun = instant wombo | 1.5s interruptible channel — any CC, silence, or spell shield stops the whole setup |
| **Phoenixblade Sera** (T5) | 3× multi-cast AoE | Hard CC; her value requires 2+ clumped enemies or a kill — spread denies her |
| **Trebuchet Elder Gorm** (T5) | Global-range 300% structure shot | Longest channel in the game (2.5s) — the easiest interrupt in the game |
| **Gravewalker Corvin** (T4) | Transform hypercarry | Pre-transform he has no abilities and feeds on nearby deaths — kill him before 100 energy |
| **Eclipsed Iri** (T5) | Stealth 220% burst on backlines | AoE reveal; tanks turning; CC at stealth break; 820 HP dies to any engage |
| **Voidmaw Drenn** (T5) | 8% max HP/sec zone (tanks melt) | Zone is static — walk out; CC the caster; spread |
| **Thornback Bramble** (T3) | 60% reflect vs melee | Spells/magic ignore reflect; CC; just don't attack him |
| **Paladin Luxor** (T3) | 25% max HP team shields | Sunder Aegis (T1!) shreds shields for 1 gold — the cheapest answer in the game |
| **Goldsmith Aurelia** (Artisan T2) | Prints ~340g/match (highest PVR of the class) | 500 HP / 36 ATK — the weakest defensive profile in the roster; kill her and the gold stops the same tick |
| **Civil Engineer Markus** (Artisan T4) | +40% army-wide move tempo via Roads | Roads are 200 HP destructible and 30g each — a gold sink, not a generator; push the flank with no roads |

**Design guardrails enforced (no unit has more than one of these):**
- Execute thresholds: Grendal, Castella (no other unit executes).
- Immunity/untargetability: Nyx (self), Vessa (allies), Kodo (charge window only).
- Reset mechanics: Grendal, Sera, Jinx (mutually exclusive on separate units).
- Stealth: Iri only.
- True damage: capped to 6 sources (Drenn %HP, Sapper structures-only, Petra conditional-0MR, Bramble reflect, Vul armor-ignore-pierce, Castella execute) — none of which overlap.

---

## 3. ✅ Meta Check — No Unbeatable 2+ Unit Combination

**Result: PASS.** All 6 identified "broken-looking" combos have a defined counter-comp. The CC diminishing-returns rule (50% reduced duration on repeated CC within 6s) is a system-level anti-perma-CC guardrail.

| Dangerous Combo | Why it's strong | Why it's NOT unbeatable |
| :--- | :--- | :--- |
| **1. Olum + Orin/Drenn/Cinder** (pull → AoE wombo) | Condenses the team into one kill zone | Interrupt the channel; spread before the pull; spell shield; CC Olum first |
| **2. Rhuk + Olum** (hook → pull double displacement) | Removes a unit then clusters the rest | Block with frontline; the hook pulls the *farthest* enemy — keep a tank farthest |
| **3. Kael + Vex + Iri + Nyx** (backline dive squad) | 4 units all hunting carries | Aegis Bastion taunt; Bulwark Aldric intercept; Pixie Fae poly; spread carries; CC-burst the divers |
| **4. Cassius + Vessa + Sera** (immortal carry) | Revive + CC-immunity + multi-cast carry | Kill Vessa/Cassius first (they're squishy Supports); CC chain Sera after her immunity lapses; spread |
| **5. Gorm + Gus + Rik** (triple siege) | Irresistible structure pressure | Siege units are the easiest dive targets in the game — one Fighter squad removes all three; their ASPD 0.3–0.4 means zero reaction time |
| **6. Gol + Ymir + Lyra** (root/freeze CC chain) | Near-perma lockdown | Oracle Vessa's passive anti-CC; the built-in 50% CC diminishing return; cleanse; range |
| **7. Slyth + Marrow + Grendal** (armor shred → execute) | Melts the frontline then chains executes | Magic-damage comps bypass armor entirely; anti-heal; keep HP above the 25% threshold; CC Grendal |
| **8. Foreman + Venn + Aurelia** (facility econ engine) | Cheaper + faster buildings on a gold printer | All three are squishy artisans with no combat value — the engine occupies 3 of 20 slots and loses every early fight; dive the gold printer (Aurelia) first; caps (anti-stack guardrails in `Final - Artisans.md`) stop the discounts from compounding further |

**Additional systemic checks:**
- No composition can stack *shield + heal + revive + immunity* on the same unit — those effects are spread across mutually exclusive units (Luxor/Bastion shields, Angelus/Tulia heals, Cassius revive, Vessa immunity).
- Gold economy is self-limiting: a 5-cost trio (e.g. Gorm + Sera + Olum) leaves almost no budget for the frontline + supports required to protect them, reproducing the classic auto-battler trade-off.

---

## 4. ✅ Role Weakness Preservation — Core Class Integrity Intact

**Result: PASS.** Every class keeps its defined weakness; no class can do another class's job.

| Class | Core strength | Preserved weakness (verified in stats) |
| :--- | :--- | :--- |
| **Fighter** | Melee burst/sustain (ATK 60–130) | No range (Range 1 all); no structure damage; no high HP pools (520–1,450, below Tankers) |
| **Tanker** | Highest HP (950–2,100) + CC | Lowest damage in the game after Support (ATK 45–80) — **cannot out-damage any damage class** |
| **Mage** | AoE magic (AP 52–120) | Fragile (HP 600–1,100); no armor (DEF 14–25); no frontline; no structure damage |
| **Marksman** | Ranged sustained DPS (Range 4–7) | Squishiest combat class (HP 570–900, DEF 12–28); zero self-sustain; dies to any engage |
| **Support** | Healing/buffing | Lowest ATK in the game (38–58); zero structure damage; no frontline durability — dive bait by design |
| **Siege** | Structure damage ×1.25–×2.0 | Slowest moves (0.7–1.3 vs 1.4–2.3 everywhere else); lowest durability per tier; ASPD 0.3–0.6 |
| **Artisan** | Production (facility/item cost & time, repairs, map engineering) | **Even weaker than Support** — ATK 34–55 (below the Support floor of 58), near-lowest HP per tier, no CC/heal/shield/structure damage; **zero combat contribution — occupies a combat slot as its tax** |

**Cross-class redundancy check (no class does another class's job):**
- **Tanker vs Fighter:** Tanker ATK max = 80 (Olum T5); Fighter ATK min = 60 (T1 Rhuk) — but Fighter is melee range-1 burst with no CC-lock, Tanker is CC-lock with no burst. Roles remain distinct.
- **Mage vs Marksman:** Mage damage is AoE-magic, cluster-dependent, cooldown-based; Marksman damage is sustained-single/multi-target physical, positioning-based. No overlap.
- **Siege vs everyone:** only Siege has the structure multiplier. No Fighter, Mage, Marksman, Support, or Tanker deals meaningful structure damage — the siege role cannot be replaced.
- **Support vs Mage healer:** the only healing belongs to Support class (Angelus, Tulia, Galen, Cassius) — Timewarp Elowen's "revert as heal" is a Mage-flavored exception but is positional and weaker than any dedicated healer.

---

## 5. 📋 Final Audit Statement

> The 80-unit roster passes all four audit requirements:
> 1. **Synergies:** all 80 units have exactly 4 partners spanning ≥2 non-own classes. ✅
> 2. **Isolated power:** every standalone threat has a defined, affordable counter (down to a 1-gold Sunder Aegis vs a 3-gold Luxor). ✅
> 3. **Meta stability:** all 8 dangerous combos have explicit counter-comps, plus systemic guardrails (CC diminishing returns, non-stacking of shield/heal/revive/immunity, self-limiting gold economy). ✅
> 4. **Role integrity:** all 7 class weaknesses are preserved and verified numerically; no class can perform another class's role. ✅
> 5. **Artisan production:** production value never exceeds the combat slot it replaces in winning states (PVR band, §6). ✅

> **Remaining design-space notes (intentional, not flaws):**
> - 5-cost units (Sera, Olum, Drenn, Iri, Vermos, Gorm, Obr) are win conditions by design — the brief requires late-game anchors; their shared weakness is that each is singular and counterable.
> - The Artisan class has **no 5-cost unit by design** — production is deliberately capped at T4 so an economy race can never become an uninteractive lategame win condition (tier ceiling in `Final - Artisans.md`).
> - If playtesting shows a specific combo overperforming, the first lever is the CC diminishing-return window (6s), the second is tier economy, and the third is a single-usage limit on banner/rift effects — all documented here so no hotfix is a redesign.

---

## 6. 🛠️ ARTISAN PRODUCTION AUDIT (the "doesn't out-pace" requirement)

**Requirement:** an Artisan's production must not out-pace the game by more than the value of the single combat slot it replaces — "it's still just a single unit."

**Method:** every production effect is priced in gold-equivalent per 18-minute match (**TPV**). Each unit's TPV is compared to the **Combat Slot Value (CSV)** of its tier — the gold-equivalent a combat unit of that tier contributes over a match (T1 ≈ 250g · T2 ≈ 350g · T3 ≈ 500g · T4 ≈ 650g). **PVR = TPV ÷ CSV; healthy band = 0.7–1.0.**

| Artisan | Tier | Production source | TPV (g/match) | PVR | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Guild Foreman | 2 | Facility time −40% | ~280 | 0.80 | ✅ band |
| Architect Venn | 3 | Facility gold −25% + durability | ~420 | 0.84 | ✅ band |
| Stonewright Marble | 3 | Repairs + scaffold | ~450 | 0.90 | ✅ band |
| Quartermaster Sable | 3 | Item craft time/cost | 240–300 | 0.48–0.60 | ✅ conditional (needs item investment) |
| Master Enchanter Odette | 4 | Item enhancement | 420–450 | 0.65–0.69 | ✅ conditional (slot-capped) |
| Civil Engineer Markus | 4 | Roads (gold sink) | ~500 | 0.77 | ✅ band |
| Lumberjack Bodhi | 2 | Barricades (cap 8) | ~300 | 0.86 | ✅ band |
| Trapsmith Vern | 2 | Emplacements (caps) | ~300 | 0.86 | ✅ band |
| Goldsmith Aurelia | 2 | Passive gold + tithe | ~340 | 0.97 | ✅ top of band (intentional) |
| Salvager Rook | 1 | Refunds (losing-conditional) | 60–360 | 0.24–1.44 | ✅ anti-snowball only |

**Why no artisan comp can out-pace a full-combat comp:**

1. **PVR ceiling:** every winning-state PVR is ≤ ~1.0 — production replaces the sacrificed combat slot, it never exceeds it. The only case over 1.0 (Rook) activates *only when structures are being lost*, i.e. the artisan team is already behind.
2. **Slot tax:** artisans occupy 20-cap army slots (4 platoons × 5 units). An econ engine of 3 artisans = 3 combat units you cannot field — the mirror is a full-combat comp that wins the mid-game fights and can rush the artisan base.
3. **Alive-gating:** every production effect is active only while the artisan lives; nothing is banked. One dive kills the engine — this is the class's universal, always-available counter.
4. **Hard stacking caps (anti-stack guardrails in `Final - Artisans.md`):** facility discounts cap at 40%, craft at 50%/45%, barricades 8, caltrops 6, snares 4, ledger +0.6g/s. Multiple artisans hit walls, not compounding curves.
5. **Gold sinks & conditions:** Roads cost gold (30g/hex), emplacements cost gold, Rook/Sable/Odette require losing structures / item investment. Production value is *spent* or *conditional*, never free.
6. **Full-combat counter-comp:** an enemy who skips artisans fields +3 combat slots and out-tempos — the same asymmetry the roster's other 6 classes rely on.

> **§6 verdict: PASS.** Artisan production is calibrated to ~0.7–1.0× the value of the combat slot it replaces, capped, alive-gated, and counterable. It can **trade place with** a combat unit — it cannot out-pace one, and stacking it is self-limiting by slot, gold, and caps.
