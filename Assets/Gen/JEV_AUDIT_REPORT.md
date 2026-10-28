# ⚖️ Jev AI System One — Unit Roster Skill & Prompt Alignment Audit

> **Audit Engine:** TypeSafe AI System One (`jev-1.13.0` via `jev-latest`)  
> **Date & Time:** 2026-09-23 13:57:31  
> **Scope:** All 8 Classes (80 Units) — Comparing Gameplay Skills, Active Abilities, Passives & Paragons in `Plan/Data/UnitRoster/` against SD 1.5 Prompts in `Assets/Gen/note.md`.

---

## 🌟 Global Roster Meta-Audit Determination

| Metric | Determination | Confidence | Probabilities |
| :--- | :--- | :--- | :--- |
| Cross Class Role Clarity | **`crystal_clear_role_distinction`** | 62.0% | crystal_clear_role_distinction: 75.0%, minor_role_overlap: 25.0%, confusing_role_overlap: 0.0% |
| Overall Medieval Style Cohesion | **`masterpiece_cohesion`** | 94.0% | masterpiece_cohesion: 96.0%, acceptable_cohesion: 4.0%, stylistically_fractured: 0.0% |
| Roster Commercial Readiness | **`production_ready_to_generate`** | 34.0% | minor_prompt_tweaks_recommended: 44.0%, production_ready_to_generate: 55.0%, requires_major_rework: 1.0% |

---

## 📊 Summary by Class (80 Units)

| Class | Strongly Aligned | Mostly Aligned | Misaligned | Silhouette Diversity | Power Exertion | Total Units |
| :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| **1. Fighters** | 5/10 | 5/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **2. Tankers** | 2/10 | 8/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **3. Mages** | 10/10 | 0/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **4. Marksmen** | 5/10 | 5/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **5. Supports** | 8/10 | 2/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **6. Siege** | 6/10 | 4/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **7. Artisans** | 3/10 | 7/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **8. Assassins** | 6/10 | 4/10 | 0/10 | `high_silhouette_diversity` | `exemplary_power_exertion` | 10 |
| **ROSTER TOTAL** | **45/80** | **35/80** | **0/80** | — | — | **80/80** |

---

### Class 1: Fighters

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 60.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 100.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 1.1 | **Vanguard Marrow** | *"Blade Cyclone"* | T2 | 🟢 `strongly_aligned` | 34.0% | stro: 55%, misa: 1%, most: 44% |
| 1.2 | **Ironclaw Grendal** | *"Executioner"* | T3 | 🟡 `mostly_aligned` | 62.0% | stro: 24%, misa: 1%, most: 75% |
| 1.3 | **Stormdancer Kael** | *"Tempest"* | T4 | 🟡 `mostly_aligned` | 46.0% | stro: 35%, misa: 1%, most: 64% |
| 1.4 | **Warcry Beserka** | *"Frenzy"* | T2 | 🟡 `mostly_aligned` | 68.0% | stro: 20%, most: 78%, misa: 2% |
| 1.5 | **Sunder Aegis** | *"Shieldbreaker"* | T1 | 🟢 `strongly_aligned` | 38.0% | stro: 59%, misa: 1%, most: 40% |
| 1.6 | **Duelist Valen** | *"Rival's Mark"* | T3 | 🟡 `mostly_aligned` | 40.0% | stro: 39%, misa: 1%, most: 60% |
| 1.7 | **Pugilist Oni** | *"Combo Count"* | T3 | 🟡 `mostly_aligned` | 65.0% | stro: 23%, misa: 1%, most: 76% |
| 1.8 | **Gravewalker Corvin** | *"Soul Form"* | T4 | 🟢 `strongly_aligned` | 48.0% | stro: 65%, misa: 1%, most: 34% |
| 1.9 | **Chainbreaker Rhuk** | *"Iron Tether"* | T1 | 🟢 `strongly_aligned` | 65.0% | stro: 76%, misa: 1%, most: 23% |
| 1.10 | **Phoenixblade Sera** | *"Phoenix Rotation"* | T5 | 🟢 `strongly_aligned` | 55.0% | stro: 70%, misa: 1%, most: 29% |

### Class 2: Tankers

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 66.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 78.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 2.1 | **Aegis Bastion** | *"Fortress"* | T3 | 🟡 `mostly_aligned` | 45.0% | misa: 1%, most: 63%, stro: 36% |
| 2.2 | **Stoneheart Gol** | *"Earthbind"* | T2 | 🟡 `mostly_aligned` | 81.0% | misa: 1%, most: 88%, stro: 11% |
| 2.3 | **Tidecaller Nami** | *"Watery Grave"* | T1 | 🟡 `mostly_aligned` | 57.0% | misa: 1%, most: 72%, stro: 27% |
| 2.4 | **Thornback Bramble** | *"Thorn Aura"* | T3 | 🟢 `strongly_aligned` | 28.0% | misa: 1%, most: 47%, stro: 52% |
| 2.5 | **Bonecage Maldr** | *"Necrotic Link"* | T4 | 🟡 `mostly_aligned` | 38.0% | misa: 1%, most: 59%, stro: 40% |
| 2.6 | **Bulwark Aldric** | *"Interceptor"* | T1 | 🟡 `mostly_aligned` | 66.0% | misa: 1%, most: 77%, stro: 22% |
| 2.7 | **Frostward Ymir** | *"Glacial Aura"* | T4 | 🟡 `mostly_aligned` | 30.0% | misa: 1%, most: 53%, stro: 46% |
| 2.8 | **Graviton Olum** | *"Black Hole"* | T5 | 🟢 `strongly_aligned` | 42.0% | misa: 1%, most: 37%, stro: 62% |
| 2.9 | **Voidshell Krask** | *"Adaptive Plating"* | T2 | 🟡 `mostly_aligned` | 83.0% | misa: 2%, most: 89%, stro: 9% |
| 2.10 | **Paladin Luxor** | *"Divine Bulwark"* | T3 | 🟡 `mostly_aligned` | 39.0% | misa: 1%, most: 59%, stro: 40% |

### Class 3: Mages

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 90.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 100.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 3.1 | **Astralweaver Orin** | *"Starfall"* | T4 | 🟢 `strongly_aligned` | 41.0% | most: 39%, misa: 1%, stro: 60% |
| 3.2 | **Frostcaller Lyra** | *"Crystal Nova"* | T1 | 🟢 `strongly_aligned` | 61.0% | most: 25%, misa: 1%, stro: 74% |
| 3.3 | **Pyromancer Cinder** | *"Inferno Field"* | T2 | 🟢 `strongly_aligned` | 34.0% | most: 43%, stro: 56%, misa: 1% |
| 3.4 | **Stormcaller Zeph** | *"Chain Lightning"* | T3 | 🟢 `strongly_aligned` | 61.0% | most: 25%, misa: 1%, stro: 74% |
| 3.5 | **Voidmaw Drenn** | *"Reality Rift"* | T5 | 🟢 `strongly_aligned` | 65.0% | most: 22%, misa: 1%, stro: 77% |
| 3.6 | **Timewarp Elowen** | *"Chrono Lock"* | T4 | 🟢 `strongly_aligned` | 41.0% | most: 38%, misa: 1%, stro: 61% |
| 3.7 | **Hexkeeper Mira** | *"Hex Curse"* | T2 | 🟢 `strongly_aligned` | 63.0% | most: 24%, stro: 75%, misa: 1% |
| 3.8 | **Sylphweaver Auriel** | *"Arcane Gust"* | T3 | 🟢 `strongly_aligned` | 54.0% | most: 30%, misa: 1%, stro: 69% |
| 3.9 | **Venomancer Slyth** | *"Poison Cloud"* | T1 | 🟢 `strongly_aligned` | 66.0% | most: 22%, misa: 1%, stro: 77% |
| 3.10 | **Echo Sage Vermos** | *"Resonance"* | T5 | 🟢 `strongly_aligned` | 28.0% | most: 48%, misa: 1%, stro: 51% |

### Class 4: Marksmen

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 90.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 99.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 4.1 | **Hawkeye Vale** | *"Marked Prey"* | T2 | 🟡 `mostly_aligned` | 58.0% | most: 72%, misa: 0%, stro: 28% |
| 4.2 | **Gunslinger Wren** | *"Fan the Hammer"* | T3 | 🟢 `strongly_aligned` | 80.0% | most: 13%, misa: 1%, stro: 86% |
| 4.3 | **Sniper Castella** | *"Deadeye"* | T4 | 🟢 `strongly_aligned` | 39.0% | most: 40%, misa: 1%, stro: 59% |
| 4.4 | **Twinblade Vex** | *"Ricochet"* | T1 | 🟢 `strongly_aligned` | 49.0% | most: 32%, misa: 2%, stro: 66% |
| 4.5 | **Phantom Dart Nyx** | *"Phase Shift"* | T3 | 🟡 `mostly_aligned` | 46.0% | most: 64%, misa: 1%, stro: 35% |
| 4.6 | **Gunmage Petra** | *"Hex Rounds"* | T2 | 🟡 `mostly_aligned` | 51.0% | most: 67%, misa: 1%, stro: 32% |
| 4.7 | **Longshot Bren** | *"Piercing Bolt"* | T1 | 🟡 `mostly_aligned` | 27.0% | most: 52%, misa: 1%, stro: 47% |
| 4.8 | **Stormrider Jinx** | *"Rapidfire Rocket"* | T4 | 🟡 `mostly_aligned` | 27.0% | most: 51%, misa: 1%, stro: 48% |
| 4.9 | **Eclipsed Iri** | *"Moonlight Shot"* | T5 | 🟢 `strongly_aligned` | 25.0% | most: 50%, misa: 1%, stro: 49% |
| 4.10 | **Ballista Grun** | *"Siege Stance"* | T3 | 🟢 `strongly_aligned` | 30.0% | most: 46%, misa: 1%, stro: 53% |

### Class 5: Supports

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 93.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 98.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 5.1 | **Seraph Angelus** | *"Healing Light"* | T2 | 🟢 `strongly_aligned` | 53.0% | stro: 68%, misa: 1%, most: 31% |
| 5.2 | **Oracle Vessa** | *"Foresight"* | T4 | 🟡 `mostly_aligned` | 56.0% | stro: 29%, misa: 1%, most: 70% |
| 5.3 | **Battlechanter Rory** | *"War Chant"* | T3 | 🟢 `strongly_aligned` | 61.0% | stro: 74%, misa: 1%, most: 25% |
| 5.4 | **Timekeeper Nora** | *"Haste"* | T1 | 🟢 `strongly_aligned` | 56.0% | stro: 71%, misa: 1%, most: 28% |
| 5.5 | **Bard of Echoes Lim** | *"Resonance Note"* | T5 | 🟢 `strongly_aligned` | 52.0% | stro: 68%, misa: 1%, most: 31% |
| 5.6 | **Penitent Lucian** | *"Sacrificial Transfusion"* | T2 | 🟢 `strongly_aligned` | 90.0% | stro: 93%, misa: 1%, most: 6% |
| 5.7 | **Warden of Oath Galen** | *"Oathbind"* | T3 | 🟢 `strongly_aligned` | 85.0% | stro: 90%, misa: 1%, most: 9% |
| 5.8 | **Pixie Trickster Fae** | *"Pixie Dust"* | T2 | 🟢 `strongly_aligned` | 77.0% | stro: 84%, misa: 1%, most: 15% |
| 5.9 | **Bannerlord Cassius** | *"Standard of Gilded"* | T4 | 🟡 `mostly_aligned` | 26.0% | stro: 49%, misa: 1%, most: 50% |
| 5.10 | **Nyx Oracle Kira** | *"Silence Field"* | T2 | 🟢 `strongly_aligned` | 57.0% | stro: 72%, misa: 0%, most: 28% |

### Class 6: Siege

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 91.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 98.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 6.1 | **Titan Mortar Gus** | *"Bombardment"* | T4 | 🟢 `strongly_aligned` | 59.0% | misa: 1%, most: 27%, stro: 72% |
| 6.2 | **Rammaster Kodo** | *"Battering Ram"* | T2 | 🟢 `strongly_aligned` | 27.0% | misa: 1%, most: 48%, stro: 51% |
| 6.3 | **Catapult Weyr** | *"Siege Toss"* | T3 | 🟢 `strongly_aligned` | 31.0% | misa: 1%, most: 45%, stro: 54% |
| 6.4 | **Sapper Drox** | *"Demolition Charge"* | T1 | 🟡 `mostly_aligned` | 33.0% | misa: 1%, most: 55%, stro: 44% |
| 6.5 | **Cannoncer Brik** | *"Cannonball"* | T3 | 🟡 `mostly_aligned` | 31.0% | misa: 1%, most: 54%, stro: 45% |
| 6.6 | **Trebuchet Elder Gorm** | *"Cataclysm"* | T5 | 🟡 `mostly_aligned` | 38.0% | misa: 1%, most: 59%, stro: 40% |
| 6.7 | **Breacher Krag** | *"Melt Wall"* | T2 | 🟡 `mostly_aligned` | 55.0% | misa: 2%, most: 71%, stro: 27% |
| 6.8 | **Ballista Vul** | *"Bolt Volley"* | T1 | 🟢 `strongly_aligned` | 75.0% | misa: 1%, most: 16%, stro: 83% |
| 6.9 | **Blastengine Rik** | *"Rocket Barrage"* | T4 | 🟢 `strongly_aligned` | 81.0% | misa: 1%, most: 12%, stro: 87% |
| 6.10 | **Colossus Obr** | *"Mega Slam"* | T5 | 🟢 `strongly_aligned` | 50.0% | misa: 1%, most: 32%, stro: 67% |

### Class 7: Artisans

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 94.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 39.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 7.1 | **Guild Foreman** | *"Site Runner"* | T2 | 🟡 `mostly_aligned` | 80.0% | stro: 13%, misa: 0%, most: 87% |
| 7.2 | **Architect Venn** | *"Blueprints"* | T3 | 🟡 `mostly_aligned` | 58.0% | stro: 27%, misa: 1%, most: 72% |
| 7.3 | **Stonewright Marble** | *"Wall Mender"* | T3 | 🟢 `strongly_aligned` | 50.0% | stro: 67%, misa: 1%, most: 32% |
| 7.4 | **Quartermaster Sable** | *"Rationeering"* | T3 | 🟡 `mostly_aligned` | 86.0% | stro: 8%, misa: 1%, most: 91% |
| 7.5 | **Master Enchanter Odette** | *"Gilding Touch"* | T4 | 🟡 `mostly_aligned` | 41.0% | stro: 39%, misa: 1%, most: 60% |
| 7.6 | **Civil Engineer Markus** | *"Roadbuilder"* | T4 | 🟢 `strongly_aligned` | 76.0% | stro: 85%, misa: 0%, most: 15% |
| 7.7 | **Lumberjack Bodhi** | *"Timberline"* | T2 | 🟡 `mostly_aligned` | 46.0% | stro: 35%, misa: 1%, most: 64% |
| 7.8 | **Trapsmith Vern** | *"Emplacement"* | T2 | 🟡 `mostly_aligned` | 26.0% | stro: 49%, misa: 1%, most: 50% |
| 7.9 | **Goldsmith Aurelia** | *"Mint"* | T2 | 🟢 `strongly_aligned` | 25.0% | stro: 50%, misa: 1%, most: 49% |
| 7.10 | **Salvager Rook** | *"Scrapwright"* | T1 | 🟡 `mostly_aligned` | 69.0% | stro: 20%, misa: 1%, most: 79% |

### Class 8: Assassins

- **Silhouette Diversity:** `high_silhouette_diversity` (Confidence: 82.0%)
- **Power Exertion:** `exemplary_power_exertion` (Confidence: 97.0%)

| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| 8.1 | **Jungle Stalker** | *"Pounce"* | T1 | 🟡 `mostly_aligned` | 57.0% | misa: 1%, most: 71%, stro: 28% |
| 8.2 | **Cutter** | *"Rend"* | T2 | 🟢 `strongly_aligned` | 64.0% | misa: 1%, most: 23%, stro: 76% |
| 8.3 | **Viper** | *"Venom Lash"* | T2 | 🟢 `strongly_aligned` | 50.0% | misa: 1%, most: 33%, stro: 66% |
| 8.4 | **Nightblade** | *"Shadow Blink"* | T3 | 🟡 `mostly_aligned` | 49.0% | misa: 1%, most: 66%, stro: 33% |
| 8.5 | **Ghost Dagger** | *"Spectral Slash"* | T3 | 🟢 `strongly_aligned` | 45.0% | misa: 1%, most: 35%, stro: 64% |
| 8.6 | **Scoutmaster Silas** | *"Shadow Cipher"* | T3 | 🟡 `mostly_aligned` | 46.0% | misa: 1%, most: 64%, stro: 35% |
| 8.7 | **Umbral Knife** | *"Lacerate"* | T3 | 🟢 `strongly_aligned` | 81.0% | misa: 1%, most: 12%, stro: 87% |
| 8.8 | **Penumbra** | *"Duskfall"* | T4 | 🟡 `mostly_aligned` | 39.0% | misa: 2%, most: 59%, stro: 39% |
| 8.9 | **Doomblade Shade** | *"Death Sentence"* | T4 | 🟢 `strongly_aligned` | 38.0% | misa: 1%, most: 40%, stro: 59% |
| 8.10 | **Apex Predator** | *"Alpha Strike"* | T5 | 🟢 `strongly_aligned` | 28.0% | misa: 1%, most: 47%, stro: 52% |
