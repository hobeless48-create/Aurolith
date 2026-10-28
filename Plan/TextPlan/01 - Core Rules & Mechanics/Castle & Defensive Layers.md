---
tags: [Rules, Castle, Walls, ElevationBonus, Mechanics]
type: System Core
---

# 🏰 CASTLE & DEFENSIVE LAYERS SPECIFICATION

> [!NOTE]
> Segmented 6-hex wall fortresses (**3,000 HP Outer / 4,500 HP Inner** — v3.2 rebalance, see §2), a 10-row Outer Courtyard and 8-row Inner Keep within each 48-column castle, Fortress Shroud masking, and **+1 Hex Wall Elevation Range Bonus**.

---

## 1. 🏹 Wall Elevation Range Bonus & Defense Stationing Doctrine

Stationing units under the `D` (Defense) command executes role-based defensive positioning:

- **Ranged Units (Marksmen, Mages, Ballista Facilities) — Wall Ramparts:** Stationed on top of intact Wall Segments to gain tactical high ground:
  - **+1 Hex Attack Range Bonus:** Ranged attack range increases by **+1 Hex** (e.g. Marksmen 4 → 5 Hexes) while firing from intact walls.
  - **Extended High-Ground Vision:** Extended line-of-sight vision over adjacent fog-of-war battlefield hexes.
- **Melee Units (Tankers, Fighters) — Courtyard Gate Guard:** Melee units (Range 1) station at the **base / courtyard breach mouth** directly beneath the wall segments rather than standing uselessly on the ramparts. They form a protective bottleneck intercept line to immediately engage any enemy breaching the perimeter.

---

## 2. 🛡️ Segmented Fortress HP & Breach Rules

- **Spatial Fortress Bounds (North P1 vs South P2):**
  - **North Fortress (Player 1):** Spans Columns `c: 51–98`, Rows `r: 0–19`. The frontal wall faces the King's Highway at `r: 19`.
  - **South Fortress (Player 2):** Spans Columns `c: 51–98`, Rows `r: 70–89`. The frontal wall faces the King's Highway at `r: 70`.
  - **Protected sides and rear:** The outer columns `c: 0–50` and `c: 99–149` beside either fortress are impassable cloud zones. Castle side and rear perimeter hexes are blocked. Initial three-hex front gates center at `c: 59`, `75`, `91` north and `c: 58`, `74`, `90` south; later siege rules may breach front wall segments. No side or rear breach route exists.
- **Outer Wall:** 5 Segments (6 Hexes wide each) @ `3,000 HP` per segment with 3 Portcullis Gates (West, Center Highway, East).
- **Segment placement on the 48-column front:** each castle has five discrete 6-hex outer segments that can be breached. The north segments occupy columns **62–67, 52–57, 68–73, 77–82, 84–89** on row 19; the south segments are their 180-degree mirror on row 70. Frontal wall tiles outside those segments and the three gate openings remain permanent blockers. The five-segment count and six-hex width remain intact after the castle resize. Jev favored preserving them at 100% confidence in that layout decision.
- **Inner Wall:** 5 Segments (6 Hexes wide each) @ `4,500 HP` per segment shielding the Suncrest Marble keep.
- **Inner wall placement:** the north inner front is row **8** and the south inner front is row **81**. Its five six-hex segments use the same north columns as the outer layer and 180-degree mirrored south columns. The three 3-hex gate openings use the matching north/south gate centers above. This leaves the north inner keep at rows 0–7, the outer courtyard at rows 9–18, and their south mirrors.
- **Portcullis behavior for Stage 2:** Friendly units may pass their own outer and inner gates. Enemy units cannot pass those gates and must breach a wall segment in each layer to reach the core. Gate durability is not specified in the canonical data, so the gate openings are not extra damageable segments. Jev favored this interpretation at **81% confidence** in the choice among the supplied gate models.
- **Opening siege lock:** Castle walls and cores take no structural damage before Expansion begins at **5:00**; field combat and jungle fighting continue. This applies the timeline's “Siege activation locked” rule. Jev favored the lock at **76% confidence** in that reading.
- **Castle Core:** Single Core Keep @ `4,500 HP` (Final match objective).
- **Minimum 3-Hex Breach Corridor Invariant (ADR-001):** Destroying any 6-hex wall segment clears an open rubble corridor at least **3 hexes wide ($W \ge 3$)**, guaranteeing that attacking 5-man platoons can fan out without 1-hex accordion bottleneck jams.
- **Non-Siege Damage Resistance & Demolition Sapping (Reconciled to TechPlan/05 & Jev Confirmed):** Non-siege units deal **-70% reduced damage** (7,000 BPS) to intact walls and structures. To prevent indefinite stalemates against fortresses, **Demolition Sapping** activates: for every continuous 15 seconds a non-siege unit attacks the same wall segment without breaking engagement, the penalty decays by **500 BPS (5%)**, capping at an authoritative minimum floor of **-40% (4,000 BPS) after 90 seconds** of sustained assault. Furthermore, breaking engagement does not cause an immediate reset; resistance recovers gradually at **500 BPS (5%) every 10 seconds of absence** back to the 7,000 BPS baseline. Siege units deal 100% full damage at all times.

---

## 2.1 ⚡ Castle Core Desperation Battery (Facility-Linked Counter-Play - Q3 Confirmed)

- **Desperation Battery Activation:** When the Castle Core drops below **50% HP (`2,250 HP`)**, its defensive **Arcane Obelisk** activates, discharging concentrated lightning bolts at the nearest attacking enemy unit within **6 hexes** for **150 True Damage every 4.0 seconds**.
- **Courtyard Facility Power Tether:** The Arcane Obelisk is directly powered by the courtyard's **Arcane Barrier** (or **Sanctuary** facility if constructed).
- **Tactical Counter-Play & Disabling:**
  - **Attackers** can permanently power down the Obelisk by demolishing that specific 3×3 courtyard facility.
  - **Defenders** have a critical defensive objective to protect and repair that facility (via Artisans or defensive stances) to keep the core's automated defense firing during breach invasions.

---

## 3. 🏃 Emergency Fortress Retreat Acceleration (`R` Command)

- **Home-Turf Acceleration:** When a commander issues the **`R` (Retreat)** command, all friendly units moving back toward their own Core Courtyard gain **+50% Movement Speed** until entering the Outer Courtyard perimeter.
- **Strategic Impact:** Enables a squad that just completed a boss kill or jungle skirmish to rapidly sprint back to defend their breaches before an enemy assault squad can punch through the high-durability inner keep.

---

> **v3.2 wall-HP rebalance (+50%):** Outer 2,000→**3,000** · Inner 3,000→**4,500** · Core 3,000→**4,500** — absorbs the platoon composition bonus (up to +30% basic stats), Ancient/Divine items, and the 30s respawn rule so the Siege window (10:00–15:00) and Overtime (15:00–18:00) stay meaningful. Rationale in `01 - Core Rules & Mechanics/Numerical Baseline & Balance.md` §1.
