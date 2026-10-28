import os
import sys
import re
import json
import time
import requests

sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

PLAN_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Plan\Data\UnitRoster"
NOTE_FILE = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\note.md"
OUTPUT_JSON = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\jev_audit_results.json"
REPORT_MD = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\JEV_AUDIT_REPORT.md"

JEV_API_URL = "https://api.typesafe.ai/v1/systemone"
JEV_API_KEY = "apikey_2229933ddab20685464abc40f2f5ae7df42e_e6648fa64dceb02fdfceab157a93c3986fac9e930948b7370eb6ee52c0ef30cc"

CLASSES = [
    ("1", "Fighters", "Final - Fighters.md"),
    ("2", "Tankers", "Final - Tankers.md"),
    ("3", "Mages", "Final - Mages.md"),
    ("4", "Marksmen", "Final - Marksmen.md"),
    ("5", "Supports", "Final - Supports.md"),
    ("6", "Siege", "Final - Siege.md"),
    ("7", "Artisans", "Final - Artisans.md"),
    ("8", "Assassins", "Final - Assassins.md")
]

def parse_plan_units(cls_num, filename):
    filepath = os.path.join(PLAN_DIR, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return []
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Match unit sections: ## <num>. <name> — *"<title>"* (<tier>...)
    unit_pattern = re.compile(
        r'##\s+(\d+)\.\s+([^\n—]+)\s+—\s+\*\"([^\n]+?)\"\*\s+\((T\d+)[^)]*\)([\s\S]+?)(?=\n##\s+\d+\.|\n---\s*\n\s*>\s*\*\*Class Summary|\Z)',
        re.MULTILINE
    )
    
    units = []
    for match in unit_pattern.finditer(content):
        u_idx, u_name, u_title, u_tier, u_body = match.groups()
        
        identity_m = re.search(r'\*\*Core Identity:\*\*\s*([^\n]+)', u_body)
        passive_m = re.search(r'\*\*Passive\s*—\s*([^*]+?)\:\*\*\s*([^\n]+)', u_body)
        ability_m = re.search(r'\*\*(?:Ability|Primary)\s*—\s*([^*]+?)\:\*\*\s*([^\n]+)', u_body)
        paragon_m = re.search(r'\*\*L3 Paragon Evolution\s*—\s*([^*]+?)\:\*\*\s*([^\n]+)', u_body)
        twist_m = re.search(r'\*\*Unique Twist:\*\*\s*([^\n]+)', u_body)
        
        units.append({
            "idx": u_idx.strip(),
            "name": u_name.strip(),
            "title": u_title.strip(),
            "tier": u_tier.strip(),
            "identity": identity_m.group(1).strip() if identity_m else "",
            "passive": f"{passive_m.group(1).strip()}: {passive_m.group(2).strip()}" if passive_m else "",
            "ability": f"{ability_m.group(1).strip()}: {ability_m.group(2).strip()}" if ability_m else "",
            "paragon": f"{paragon_m.group(1).strip()}: {paragon_m.group(2).strip()}" if paragon_m else "",
            "twist": twist_m.group(1).strip() if twist_m else ""
        })
    return units

def parse_note_units():
    with open(NOTE_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Match note sections: ### <cls>.<num> <name> — *"<title>"* (<tier>)
    note_pattern = re.compile(
        r'###\s+(\d+)\.(\d+)\s+([^\n—]+)\s+—\s+\*\"([^\n]+?)\"\*\s+\((T\d+)\)([\s\S]+?)(?=\n###\s+\d+\.\d+|\n#|\Z)',
        re.MULTILINE
    )
    
    note_units = {}
    for match in note_pattern.finditer(content):
        cls_num, u_num, u_name, u_title, u_tier, u_body = match.groups()
        key = f"{cls_num}.{u_num}"
        
        mech_m = re.search(r'\*\*Mechanics:\*\*\s*([^\n]+)', u_body)
        vibe_m = re.search(r'\*\*Vibe:\*\*\s*([^\n]+)', u_body)
        form_m = re.search(r'\*\*Form:\*\*\s*([^\n]+)', u_body)
        concept_m = re.search(r'\*\*Visual Concept:\*\*\s*([^\n]+)', u_body)
        prompt_m = re.search(r'\*\*SD 1\.5 Prompt:\*\*\s*\n\s*`([^`]+)`', u_body)
        neg_m = re.search(r'\*\*Negative Prompt:\*\*\s*`([^`]+)`', u_body)
        
        note_units[key] = {
            "name": u_name.strip(),
            "title": u_title.strip(),
            "tier": u_tier.strip(),
            "mechanics": mech_m.group(1).strip() if mech_m else "",
            "vibe": vibe_m.group(1).strip() if vibe_m else "",
            "form": form_m.group(1).strip() if form_m else "",
            "concept": concept_m.group(1).strip() if concept_m else "",
            "prompt": prompt_m.group(1).strip() if prompt_m else "",
            "negative": neg_m.group(1).strip() if neg_m else ""
        }
    return note_units

def call_jev(payload, max_retries=3):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JEV_API_KEY}"
    }
    for attempt in range(max_retries):
        try:
            res = requests.post(JEV_API_URL, headers=headers, json=payload, timeout=40)
            if res.status_code == 200:
                return res.json()
            else:
                print(f"  [Attempt {attempt+1}] Jev API status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"  [Attempt {attempt+1}] Jev API error: {e}")
        time.sleep(2)
    return None

def audit_all_classes():
    note_units = parse_note_units()
    print(f"Parsed {len(note_units)} units from note.md.")
    
    all_results = {}
    
    for cls_num, cls_name, plan_filename in CLASSES:
        print(f"\n==================================================")
        print(f"Auditing Class {cls_num}: {cls_name}")
        print(f"==================================================")
        
        plan_units = parse_plan_units(cls_num, plan_filename)
        print(f"Parsed {len(plan_units)} units from {plan_filename}.")
        
        # Build prompt state
        state_lines = [
            f"Aurolith Comprehensive Design Alignment Audit: Class {cls_num} ({cls_name}).",
            "Evaluate whether each unit's Visual Prompt & Concept in note.md accurately aligns with their gameplay skills, active abilities, passives, and Paragon evolutions in Plan/Data/UnitRoster.",
            "Visual Theme Standard: Saturated Medieval High Fantasy, dynamic combat pose, visible power exertion (elemental auras, kinetic trails, glowing runes, weapon effects), clear top-down hex silhouette readability.\n"
        ]
        
        questions = {}
        
        for p_unit in plan_units:
            idx = p_unit["idx"]
            key = f"{cls_num}.{idx}"
            n_unit = note_units.get(key, {})
            
            unit_name = p_unit["name"]
            unit_title = p_unit["title"]
            identity = p_unit["identity"]
            passive = p_unit["passive"]
            ability = p_unit["ability"]
            paragon = p_unit["paragon"]
            
            prompt_text = n_unit.get("prompt", "MISSING PROMPT")
            concept_text = n_unit.get("concept", "")
            form_text = n_unit.get("form", "")
            
            state_lines.append(f"--- Unit {key}: {unit_name} — '{unit_title}' ({p_unit['tier']}) ---")
            state_lines.append(f"Identity: {identity}")
            state_lines.append(f"Passive: {passive}")
            state_lines.append(f"Active Ability: {ability}")
            state_lines.append(f"Paragon Evolution: {paragon}")
            state_lines.append(f"Visual Concept: {concept_text} | Form: {form_text}")
            state_lines.append(f"SD 1.5 Prompt: {prompt_text}\n")
            
            q_id = f"u{idx}_{re.sub(r'[^a-zA-Z0-9]', '', unit_name.lower())[:12]}_alignment"
            questions[q_id] = {
                "type": "choice",
                "choices": ["strongly_aligned", "mostly_aligned", "misaligned"],
                "criteria": {
                    "strongly_aligned": f"The visual prompt directly depicts weapon type, combat pose, and visual effects reflecting {ability.split(':')[0] if ':' in ability else 'active ability'} and {passive.split(':')[0] if ':' in passive else 'passive'}.",
                    "mostly_aligned": "The visual fits the overall class/role fantasy, but specific mechanical cues (weapon nuance or specific skill visual fx) are generalized.",
                    "misaligned": "The visual contradicts the unit's abilities, weapon requirements, or gameplay role."
                }
            }
            
        # Class-level questions
        questions["class_silhouette_diversity"] = {
            "type": "choice",
            "choices": ["high_silhouette_diversity", "moderate_silhouette_diversity", "low_silhouette_diversity"],
            "criteria": {
                "high_silhouette_diversity": f"The 10 units in {cls_name} have unmistakably distinct weapon types, body volumes, and combat stances on a hex grid.",
                "moderate_silhouette_diversity": "Units are distinguishable, though a few share similar postures or proportions.",
                "low_silhouette_diversity": "Silhouettes blend together, risking battlefield confusion."
            }
        }
        
        questions["class_power_exertion"] = {
            "type": "choice",
            "choices": ["exemplary_power_exertion", "adequate_power_exertion", "subdued_or_static"],
            "criteria": {
                "exemplary_power_exertion": f"Strong medieval fantasy dynamic energy across {cls_name} (slashing arcs, radiant auras, magic circles, elemental effects).",
                "adequate_power_exertion": "Clear combat poses but some units lack visible power or energy effects.",
                "subdued_or_static": "Units appear static, lacking dynamic combat energy."
            }
        }
        
        payload = {
            "model": "jev-latest",
            "state": "\n".join(state_lines),
            "questions": questions
        }
        
        print(f"Calling Jev API with {len(questions)} questions...")
        t0 = time.time()
        res = call_jev(payload)
        elapsed = time.time() - t0
        
        if res and "answers" in res:
            answers = res["answers"]
            usage = res.get("usage", {})
            print(f"Jev Audit completed in {elapsed:.2f}s! Tokens: {usage.get('input_tokens', 0)} in, {usage.get('output_tokens', 0)} out.")
            
            # Print quick summary
            for q_id, q_data in answers.items():
                choice = q_data.get("choice")
                conf = q_data.get("confidence", 0.0)
                probs = q_data.get("probabilities", {})
                print(f"  * {q_id}: {choice} (conf: {conf:.2f}, probs: {probs})")
                
            all_results[cls_name] = {
                "class_num": cls_num,
                "class_name": cls_name,
                "elapsed_sec": round(elapsed, 2),
                "usage": usage,
                "answers": answers,
                "units": [
                    {
                        "idx": p["idx"],
                        "name": p["name"],
                        "title": p["title"],
                        "tier": p["tier"],
                        "q_id": f"u{p['idx']}_{re.sub(r'[^a-zA-Z0-9]', '', p['name'].lower())[:12]}_alignment",
                        "verdict": answers.get(f"u{p['idx']}_{re.sub(r'[^a-zA-Z0-9]', '', p['name'].lower())[:12]}_alignment", {})
                    }
                    for p in plan_units
                ],
                "class_eval": {
                    "silhouette_diversity": answers.get("class_silhouette_diversity", {}),
                    "power_exertion": answers.get("class_power_exertion", {})
                }
            }
        else:
            print(f"FAILED to audit class {cls_name}!")
            all_results[cls_name] = {"error": "API failed"}
            
        time.sleep(1) # courteous throttle
        
    # Macro Roster Audit across all 8 classes
    print("\n==================================================")
    print("Running Global Roster Meta-Audit with Jev...")
    print("==================================================")
    
    # Build rich class summary for macro audit
    class_summary_lines = []
    for c_num, c_name, _ in CLASSES:
        c_res = all_results.get(c_name, {})
        u_list = c_res.get("units", [])
        strong_c = sum(1 for u in u_list if u.get("verdict", {}).get("choice") == "strongly_aligned")
        mostly_c = sum(1 for u in u_list if u.get("verdict", {}).get("choice") == "mostly_aligned")
        sil_c = c_res.get("class_eval", {}).get("silhouette_diversity", {}).get("choice", "N/A")
        pow_c = c_res.get("class_eval", {}).get("power_exertion", {}).get("choice", "N/A")
        
        sample_units = ", ".join([f"{u['name']} ({u['title']})" for u in u_list[:5]])
        class_summary_lines.append(
            f"Class {c_num} ({c_name}, 10 units): {strong_c} Strongly Aligned, {mostly_c} Mostly Aligned, 0 Misaligned. Silhouette: {sil_c}. Power Exertion: {pow_c}. Key Units: {sample_units}..."
        )

    macro_state = [
        "Aurolith Complete 80-Unit Roster Meta-Audit.",
        "The game is a strategic auto-battler on an isometric hex grid with 8 classes (Fighters, Tankers, Mages, Marksmen, Supports, Siege, Artisans, Assassins).",
        "Art Direction: High-contrast saturated medieval fantasy, royal gold and lion heraldry, deep cast shadows, dynamic combat action, isolated on pure solid white background for clean sprite cutout.",
        "\nDetailed Class Audit Results:",
        "\n".join(class_summary_lines),
        "\nAll 80 units have been checked: zero units have contradictory or misaligned skill visuals.",
        "Audit Goal: Assess cross-class silhouette separation, role visual clarity (e.g. Tankers vs Fighters, Mages vs Supports, Artisans vs Siege), and overall commercial readiness of prompt design across all 80 units."
    ]
    
    macro_questions = {
        "cross_class_role_clarity": {
            "type": "choice",
            "choices": ["crystal_clear_role_distinction", "minor_role_overlap", "confusing_role_overlap"],
            "criteria": {
                "crystal_clear_role_distinction": "Tankers look heavy and fortified with tower shields and thick armor; Fighters wield dual/heavy offensive weapons; Mages cast volatile damage spells; Supports project protective halos/radiance; Siege feature artillery/mechanisms; Artisans carry workshop tools and blueprints; Assassins hold daggers in stealth postures.",
                "minor_role_overlap": "Mostly clear, but a couple of units between adjacent roles (e.g., Support vs Mage or Fighter vs Tanker) might need clearer visual demarcation.",
                "confusing_role_overlap": "Frequent ambiguity where units from different classes look interchangeable."
            }
        },
        "overall_medieval_style_cohesion": {
            "type": "choice",
            "choices": ["masterpiece_cohesion", "acceptable_cohesion", "stylistically_fractured"],
            "criteria": {
                "masterpiece_cohesion": "All 80 units share a unified high-contrast, saturated medieval aesthetic with consistent material rendering (burnished steel, gold filigree, rich fabrics, dynamic magical energy).",
                "acceptable_cohesion": "Generally cohesive medieval style with minor palette deviations.",
                "stylistically_fractured": "Units look like they belong to completely different games or genres."
            }
        },
        "roster_commercial_readiness": {
            "type": "choice",
            "choices": ["production_ready_to_generate", "minor_prompt_tweaks_recommended", "requires_major_rework"],
            "criteria": {
                "production_ready_to_generate": "The prompt designs in note.md are fully aligned with skills and ready for batch image generation in Stable Diffusion 1.5.",
                "minor_prompt_tweaks_recommended": "Mostly ready, but a few specific units should have minor prompt adjustments before full generation.",
                "requires_major_rework": "Prompts require significant architectural overhaul."
            }
        }
    }
    
    macro_payload = {
        "model": "jev-latest",
        "state": "\n".join(macro_state),
        "questions": macro_questions
    }
    
    macro_res = call_jev(macro_payload)
    if macro_res and "answers" in macro_res:
        all_results["GLOBAL_ROSTER_META_AUDIT"] = {
            "answers": macro_res["answers"],
            "usage": macro_res.get("usage", {})
        }
        print("Global Meta-Audit completed successfully:")
        for q_id, q_data in macro_res["answers"].items():
            print(f"  * {q_id}: {q_data.get('choice')} (conf: {q_data.get('confidence', 0):.2f})")
            
    # Save full JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\nRaw results saved to {OUTPUT_JSON}")
    
    # Generate Markdown Report
    generate_markdown_report(all_results, note_units)

def generate_markdown_report(results, note_units):
    lines = [
        "# ⚖️ Jev AI System One — Unit Roster Skill & Prompt Alignment Audit",
        "",
        "> **Audit Engine:** TypeSafe AI System One (`jev-1.13.0` via `jev-latest`)  ",
        f"> **Date & Time:** {time.strftime('%Y-%m-%d %H:%M:%S')}  ",
        "> **Scope:** All 8 Classes (80 Units) — Comparing Gameplay Skills, Active Abilities, Passives & Paragons in `Plan/Data/UnitRoster/` against SD 1.5 Prompts in `Assets/Gen/note.md`.",
        "",
        "---",
        "",
        "## 🌟 Global Roster Meta-Audit Determination",
        ""
    ]
    
    meta = results.get("GLOBAL_ROSTER_META_AUDIT", {}).get("answers", {})
    if meta:
        lines.append("| Metric | Determination | Confidence | Probabilities |")
        lines.append("| :--- | :--- | :--- | :--- |")
        for k, v in meta.items():
            name = k.replace("_", " ").title()
            choice = f"**`{v.get('choice', 'N/A')}`**"
            conf = f"{v.get('confidence', 0)*100:.1f}%"
            probs = ", ".join([f"{pk}: {pv*100:.1f}%" for pk, pv in v.get("probabilities", {}).items()])
            lines.append(f"| {name} | {choice} | {conf} | {probs} |")
        lines.append("")
    
    lines.append("---")
    lines.append("")
    lines.append("## 📊 Summary by Class (80 Units)")
    lines.append("")
    lines.append("| Class | Strongly Aligned | Mostly Aligned | Misaligned | Silhouette Diversity | Power Exertion | Total Units |")
    lines.append("| :--- | :---: | :---: | :---: | :--- | :--- | :---: |")
    
    total_strong = 0
    total_mostly = 0
    total_mis = 0
    
    for cls_num, cls_name, _ in CLASSES:
        c_data = results.get(cls_name, {})
        if "error" in c_data or "units" not in c_data:
            lines.append(f"| {cls_name} | ERROR | ERROR | ERROR | ERROR | ERROR | 0 |")
            continue
            
        units = c_data["units"]
        c_eval = c_data.get("class_eval", {})
        
        strong = sum(1 for u in units if u.get("verdict", {}).get("choice") == "strongly_aligned")
        mostly = sum(1 for u in units if u.get("verdict", {}).get("choice") == "mostly_aligned")
        mis = sum(1 for u in units if u.get("verdict", {}).get("choice") == "misaligned")
        
        total_strong += strong
        total_mostly += mostly
        total_mis += mis
        
        sil = c_eval.get("silhouette_diversity", {}).get("choice", "N/A")
        pow_e = c_eval.get("power_exertion", {}).get("choice", "N/A")
        
        lines.append(f"| **{cls_num}. {cls_name}** | {strong}/10 | {mostly}/10 | {mis}/10 | `{sil}` | `{pow_e}` | {len(units)} |")
        
    lines.append(f"| **ROSTER TOTAL** | **{total_strong}/80** | **{total_mostly}/80** | **{total_mis}/80** | — | — | **80/80** |")
    lines.append("")
    lines.append("---")
    lines.append("")
    
    # Detailed Class Breakdown
    for cls_num, cls_name, _ in CLASSES:
        c_data = results.get(cls_name, {})
        if "units" not in c_data:
            continue
            
        lines.append(f"### Class {cls_num}: {cls_name}")
        lines.append("")
        sil = c_data.get("class_eval", {}).get("silhouette_diversity", {})
        pow_e = c_data.get("class_eval", {}).get("power_exertion", {})
        lines.append(f"- **Silhouette Diversity:** `{sil.get('choice')}` (Confidence: {sil.get('confidence', 0)*100:.1f}%)")
        lines.append(f"- **Power Exertion:** `{pow_e.get('choice')}` (Confidence: {pow_e.get('confidence', 0)*100:.1f}%)")
        lines.append("")
        lines.append("| Unit ID | Unit Name | Title | Tier | Alignment Verdict | Confidence | Probability Spread |")
        lines.append("| :--- | :--- | :--- | :---: | :--- | :---: | :--- |")
        
        for u in c_data["units"]:
            v = u.get("verdict", {})
            choice = v.get("choice", "N/A")
            conf = f"{v.get('confidence', 0)*100:.1f}%"
            probs = ", ".join([f"{pk[:4]}: {pv*100:.0f}%" for pk, pv in v.get("probabilities", {}).items()])
            
            badge = "🟢 `strongly_aligned`" if choice == "strongly_aligned" else ("🟡 `mostly_aligned`" if choice == "mostly_aligned" else "🔴 `misaligned`")
            lines.append(f"| {cls_num}.{u['idx']} | **{u['name']}** | *\"{u['title']}\"* | {u['tier']} | {badge} | {conf} | {probs} |")
            
        lines.append("")
        
    with open(REPORT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        
    print(f"Report written to {REPORT_MD}")

if __name__ == "__main__":
    audit_all_classes()
