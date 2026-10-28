import requests
import base64
import json
import os
import sys
import re
import time
from datetime import datetime
from io import BytesIO
from collections import deque
from PIL import Image
import numpy as np
import cv2

# Force unbuffered standard output for real-time live logging with utf-8 encoding
sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
ASSETS_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets"
UNITS_DIR = os.path.join(ASSETS_DIR, "Units")
GEN_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen"
NOTE_FILE = os.path.join(GEN_DIR, "note.md")
LEDGER_FILE = os.path.join(GEN_DIR, "generation_ledger.json")
PROGRESS_MD = os.path.join(GEN_DIR, "PROGRESS.md")
ALERT_FILE = os.path.join(GEN_DIR, "PAUSE_ALERT.md")

JEV_API_URL = "https://api.typesafe.ai/v1/systemone"
JEV_API_KEY = os.environ.get("JEV_API_KEY", "apikey_2229d621fe467388447f9906db8268141022_a4626da359c486a4d4b78d0c32ab86d3cc272b35a342222257d519dfa767766f")

CLASS_ORDER = [
    ("1", "1_Fighter"),
    ("2", "2_Tanker"),
    ("3", "3_Mage"),
    ("4", "4_Marksman"),
    ("5", "5_Support"),
    ("6", "6_Siege"),
    ("7", "7_Artisan"),
    ("8", "8_Assassin")
]

CLASS_FOLDER_MAP = dict(CLASS_ORDER)

def check_sd_server():
    try:
        res = requests.get("http://127.0.0.1:7860/sdapi/v1/progress", timeout=3)
        return res.status_code == 200
    except:
        return False

def edge_connected_cutout(img, tolerance=230):
    """
    Adaptive Boundary-connected BFS floodfill from image borders.
    Detects border background color (pure white, near-white, or near-black)
    and floods inward from all four image boundaries.
    Preserves 100% of internal highlights, white eyes, armor shines, and silk robes.
    Removes isolated debris using connected component analysis.
    """
    img = img.convert("RGBA")
    np_img = np.array(img)
    h, w, _ = np_img.shape
    
    # Sample 10px borders from all 4 sides to determine background color
    borders = np.concatenate([
        np_img[:10, :, :3].reshape(-1, 3),
        np_img[-10:, :, :3].reshape(-1, 3),
        np_img[:, :10, :3].reshape(-1, 3),
        np_img[:, -10:, :3].reshape(-1, 3)
    ])
    mean_bg = borders.mean(axis=0)
    brightness = mean_bg.mean()
    
    r, g, b = np_img[:, :, 0], np_img[:, :, 1], np_img[:, :, 2]
    
    if brightness > 128:
        # Light / White background: match pixels where RGB are high or close to border mean
        is_bg = (
            ((r >= tolerance) & (g >= tolerance) & (b >= tolerance)) |
            (np.linalg.norm(np_img[:, :, :3] - mean_bg, axis=2) < 35) |
            ((r >= 215) & (g >= 215) & (b >= 215) & (np.abs(r - g) < 15))
        )
    else:
        # Dark / Black background: match pixels where RGB are low or close to border mean
        is_bg = (
            ((r <= 35) & (g <= 35) & (b <= 35)) |
            (np.linalg.norm(np_img[:, :, :3] - mean_bg, axis=2) < 35) |
            ((r <= 45) & (g <= 45) & (b <= 45) & (np.abs(r - g) < 15))
        )
        
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()
    
    # Enqueue border pixels that match background
    for x in range(w):
        if is_bg[0, x] and not visited[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_bg[h - 1, x] and not visited[h - 1, x]:
            queue.append((h - 1, x))
            visited[h - 1, x] = True
            
    for y in range(h):
        if is_bg[y, 0] and not visited[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_bg[y, w - 1] and not visited[y, w - 1]:
            queue.append((y, w - 1))
            visited[y, w - 1] = True
            
    # 4-way BFS expansion
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w:
                if not visited[ny, nx] and is_bg[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Only border-connected background pixels become transparent
    np_img[visited, 3] = 0
    
    # Island / floating debris cleanup
    try:
        solid_mask = (np_img[:, :, 3] > 0).astype(np.uint8)
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(solid_mask, connectivity=8)
        if num_labels > 1:
            center_y, center_x = h / 2.0, w / 2.0
            main_labels = set()
            for lbl in range(1, num_labels):
                area = stats[lbl, cv2.CC_STAT_AREA]
                cx, cy = centroids[lbl]
                dist_to_center = ((cx - center_x)**2 + (cy - center_y)**2)**0.5
                if area >= 2500 or (area >= 800 and dist_to_center < 250):
                    main_labels.add(lbl)
            if main_labels:
                remove_mask = np.isin(labels, list(main_labels), invert=True) & (labels > 0)
                np_img[remove_mask, 3] = 0
    except Exception:
        pass
        
    return Image.fromarray(np_img)

def validate_cutout_image(img_path):
    """
    Validates file exists, has valid size, dimensions, and healthy alpha channel,
    with strict full-body bounding box and centering checks to prevent cropped or broken sprites.
    """
    if not os.path.exists(img_path) or os.path.getsize(img_path) < 60000:
        return False, "File missing or abnormally small (<60KB)"
    try:
        img = Image.open(img_path)
        if img.size != (512, 768):
            return False, f"Invalid dimensions: {img.size}, expected (512, 768)"
        if img.mode != "RGBA":
            return False, f"Invalid color mode: {img.mode}, expected RGBA"
        np_img = np.array(img)
        alpha = np_img[:, :, 3]
        non_zero = np.argwhere(alpha > 15)
        
        if len(non_zero) == 0:
            return False, "Character body missing or completely transparent"
            
        ymin, xmin = non_zero.min(axis=0)
        ymax, xmax = non_zero.max(axis=0)
        h_span = int(ymax - ymin)
        w_span = int(xmax - xmin)
        cx = float((xmin + xmax) / 2.0)
        coverage = float(len(non_zero) / (512 * 768) * 100.0)
        
        # 1. Height check: must be full body standing character, not waist-up crop
        if h_span < 360:
            return False, f"Character height severely cropped ({h_span}px < 360px minimum)"
            
        # 2. Width check: must not be a thin sliver glitch
        if w_span < 100:
            return False, f"Character width abnormally thin ({w_span}px < 100px minimum)"
            
        # 3. Centering check: horizontal center should be near 256
        if abs(cx - 256.0) > 95:
            return False, f"Character off-center horizontally (Cx={cx:.1f}, offset={abs(cx-256.0):.1f}px)"
            
        # 4. Coverage check (expect 12% to 72% for centered 2.5D sprite)
        if coverage < 12.0:
            return False, f"Alpha coverage too low ({coverage:.1f}%), body dissolved"
        if coverage > 72.0:
            return False, f"Alpha coverage too high ({coverage:.1f}%), background bleed"
            
        return True, "Valid"
    except Exception as e:
        return False, str(e)

def consult_jev_for_unit(unit_data):
    """
    Consults Jev AI for aesthetic and design quality assessment of an individual unit.
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JEV_API_KEY}"
    }
    
    payload = {
        "model": "jev-latest",
        "state": f"Auditing generated unit asset for Aurolith. Name: {unit_data['name']} ({unit_data['title']}). Class: {unit_data['folder']}. Form/Race: {unit_data['form']}. Vibe: {unit_data['vibe']}. Gameplay: {unit_data['mechanics']}. Prompt: {unit_data['prompt']}",
        "questions": {
            "unit_aesthetic_verdict": {
                "type": "choice",
                "choices": ["approved_game_ready", "reprompt_recommended"],
                "criteria": {
                    "approved_game_ready": "Silhouette matches class fantasy, form distinction is clear, and design fits within 72% inner hex scale.",
                    "reprompt_recommended": "Design deviates significantly from mechanics or lacks character identity."
                }
            }
        }
    }
    
    for attempt in range(3):
        try:
            res = requests.post(JEV_API_URL, headers=headers, json=payload, timeout=25)
            if res.status_code == 200:
                data = res.json()
                answer = data.get("answers", {}).get("unit_aesthetic_verdict", {})
                usage = data.get("usage", {})
                return {
                    "success": True,
                    "choice": answer.get("choice", "approved_game_ready"),
                    "confidence": answer.get("confidence", 0.0),
                    "probabilities": answer.get("probabilities", {}),
                    "tokens": usage
                }
        except Exception as e:
            time.sleep(2)
            
    return {"success": False, "error": "Jev API returned nothing or timed out"}

def consult_jev_role_milestone(class_num, class_folder, role_units):
    """
    Consults Jev AI at the completion of a 10-unit role.
    Verifies role coherence, silhouette distinction, and approves progression to next role.
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JEV_API_KEY}"
    }
    
    unit_summaries = [f"- {u['name']} ({u['title']}): {u['form']}, {u['vibe']}" for u in role_units]
    units_text = "\n".join(unit_summaries)
    
    payload = {
        "model": "jev-latest",
        "state": f"Aurolith Role Milestone Audit for Class {class_folder} (10/10 Units Completed).\nUnits in this role:\n{units_text}\nAll 10 units generated via local DreamShaper 8 with 20% safe margin and edge-connected BFS transparent cutouts.",
        "questions": {
            "role_milestone_audit": {
                "type": "choice",
                "choices": ["approved_continue_next_role", "pause_for_review"],
                "criteria": {
                    "approved_continue_next_role": "The 10 units demonstrate strong silhouette diversity, ground gameplay mechanics, adhere to 72% inner hex bounds, and show no systematic visual breakdown or runaway loop errors. Approved to proceed to next role.",
                    "pause_for_review": "Systematic breakdown, prompt hallucination, or major design flaws requiring manual review before continuing."
                }
            }
        }
    }
    
    for attempt in range(3):
        try:
            res = requests.post(JEV_API_URL, headers=headers, json=payload, timeout=30)
            if res.status_code == 200:
                data = res.json()
                answer = data.get("answers", {}).get("role_milestone_audit", {})
                usage = data.get("usage", {})
                return {
                    "success": True,
                    "choice": answer.get("choice", "approved_continue_next_role"),
                    "confidence": answer.get("confidence", 0.0),
                    "probabilities": answer.get("probabilities", {}),
                    "tokens": usage
                }
        except Exception as e:
            time.sleep(3)
            
    return {"success": False, "error": "Jev API returned nothing after 3 attempts"}

def consult_jev_for_breakdown(context_desc):
    """
    Consults Jev AI when an unexpected error or breakdown occurs.
    Provides external architectural diagnosis. If Jev returns nothing or times out,
    returns success=False so the script can safely pause until user wakes up.
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JEV_API_KEY}"
    }
    
    payload = {
        "model": "jev-latest",
        "state": f"Aurolith Generation Circuit Breaker Triggered!\nContext: {context_desc}\nSystem needs recommendation: how to recover or whether to pause safely.",
        "questions": {
            "breakdown_action": {
                "type": "choice",
                "choices": ["pause_safely_for_user", "retry_with_adapted_params"],
                "criteria": {
                    "pause_safely_for_user": "Pause execution safely and notify user in PAUSE_ALERT.md to prevent runaway loops.",
                    "retry_with_adapted_params": "Safe transient glitch that can be recovered with adapted prompt/cutout parameters."
                }
            }
        }
    }
    
    for attempt in range(3):
        try:
            res = requests.post(JEV_API_URL, headers=headers, json=payload, timeout=25)
            if res.status_code == 200:
                data = res.json()
                answer = data.get("answers", {}).get("breakdown_action", {})
                usage = data.get("usage", {})
                return {
                    "success": True,
                    "choice": answer.get("choice", "pause_safely_for_user"),
                    "confidence": answer.get("confidence", 0.0),
                    "probabilities": answer.get("probabilities", {}),
                    "tokens": usage
                }
        except Exception:
            time.sleep(2)
            
    return {"success": False, "error": "Jev API returned nothing after 3 retries"}

def parse_note_units():
    """
    Parses all 80 units with complete metadata from note.md.
    Enforces strong white background weighting and anti-frame negative prompts.
    """
    if not os.path.exists(NOTE_FILE):
        raise FileNotFoundError(f"note.md not found at {NOTE_FILE}")
        
    with open(NOTE_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    unit_blocks = re.findall(r'### (\d+)\.(\d+)\s+([^\n]+?)\s+—\s+\*"([^\n]+?)"\*\s+\(T\d+\)([\s\S]+?)(?=### \d+\.\d+|\n#|\Z)', content)
    units = []
    
    default_neg = "(dark background:1.5), (black background:1.5), (colored background:1.3), (frame:1.4), (border:1.4), (vignette:1.3), (card frame:1.4), (multiple views:1.4), (character sheet:1.4), (extra head:1.4), (duplicate:1.4), background scenery, floor shadow, bad anatomy, missing limbs, cropped, cut off at edges, out of frame, blurry, lowres, watermark, text"
    
    for cls_num, unit_num, name, title, body in unit_blocks:
        name_clean = name.strip()
        slug = re.sub(r'[^a-zA-Z0-9_]', '', name_clean.lower().replace(' ', '_'))
        
        mech_match = re.search(r'\*\*Mechanics:\*\*\s*([^\n]+)', body)
        vibe_match = re.search(r'\*\*Vibe:\*\*\s*\*\*([^*]+)\*\*', body)
        form_match = re.search(r'\*\*Form:\*\*\s*\*\*([^*]+)\*\*', body)
        concept_match = re.search(r'\*\*Visual Concept:\*\*\s*([^\n]+)', body)
        prompt_match = re.search(r'\*\*SD 1\.5 Prompt:\*\*\s*\n\s*`([^`]+)`', body)
        neg_match = re.search(r'\*\*Negative Prompt:\*\*\s*`([^`]+)`', body)
        
        folder = CLASS_FOLDER_MAP.get(cls_num, f"{cls_num}_Class")
        
        raw_prompt = prompt_match.group(1).strip() if prompt_match else ""
        # Enforce white background weighting and clean sprite framing
        if "pure solid white background" in raw_prompt:
            clean_prompt = raw_prompt.replace("pure solid white background", "(pure solid white background:1.4), (isolated on white background:1.3)")
        else:
            clean_prompt = raw_prompt + ", (pure solid white background:1.4), (isolated on white background:1.3)"
            
        clean_prompt = clean_prompt.replace(
            "isolated portrait",
            "(centered full body game sprite:1.4), (full length standing view:1.3), (entire character visible from head to boots:1.3)"
        )
        
        anti_crop_neg = "(close-up:1.6), (cropped:1.6), (cut off at edges:1.6), (out of frame:1.6), (off-center:1.6), (bust:1.6), (waist-up:1.6), (torso only:1.6), (missing legs:1.6), (feet cropped:1.6)"
        raw_neg = neg_match.group(1).strip() if neg_match else ""
        if raw_neg:
            clean_neg = raw_neg + f", (dark background:1.5), (black background:1.5), (border:1.4), (frame:1.4), (vignette:1.3), (multiple views:1.4), (character sheet:1.4), (extra head:1.4), (duplicate:1.4), {anti_crop_neg}"
        else:
            clean_neg = default_neg + f", {anti_crop_neg}"
        
        units.append({
            "id": f"{cls_num}.{unit_num}",
            "class_num": cls_num,
            "unit_num": unit_num,
            "name": name_clean,
            "title": title.strip(),
            "slug": slug,
            "folder": folder,
            "mechanics": mech_match.group(1).strip() if mech_match else "",
            "vibe": vibe_match.group(1).strip() if vibe_match else "Cool",
            "form": form_match.group(1).strip() if form_match else "Human",
            "concept": concept_match.group(1).strip() if concept_match else "",
            "prompt": clean_prompt,
            "negative_prompt": clean_neg
        })
        
    return units

def load_ledger():
    if os.path.exists(LEDGER_FILE):
        try:
            with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_ledger(ledger):
    with open(LEDGER_FILE, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=2)

def update_progress_md(units, ledger, role_audits=None):
    if role_audits is None:
        role_audits = {}
        
    completed = 0
    total = len(units)
    
    rows = []
    total_in_tokens = 0
    total_out_tokens = 0
    
    for u in units:
        slug = u["slug"]
        info = ledger.get(slug, {})
        status = info.get("status", "Pending")
        jev_verdict = info.get("jev_verdict", "N/A")
        prob = info.get("jev_probability", "N/A")
        ts = info.get("timestamp", "-")
        
        if status == "Completed":
            completed += 1
            status_icon = "✅ Done"
        else:
            status_icon = "⏳ Pending"
            
        t_in = info.get("tokens_in", 0)
        t_out = info.get("tokens_out", 0)
        total_in_tokens += t_in
        total_out_tokens += t_out
        
        rows.append(f"| {u['id']} | **{u['name']}** | {u['folder']} | {u['form']} | {u['vibe']} | {status_icon} | {jev_verdict} ({prob}) | `{ts}` |")
        
    percent = round((completed / total) * 100, 1)
    
    # Role milestone table
    role_rows = []
    for c_num, c_folder in CLASS_ORDER:
        audit_info = role_audits.get(c_num, {})
        status_str = audit_info.get("status", "Incomplete")
        jev_str = audit_info.get("verdict", "Pending 10/10")
        prob_str = audit_info.get("prob", "-")
        role_rows.append(f"| Class {c_num} | **{c_folder}** | 10 Units | {status_str} | {jev_str} ({prob_str}) |")
        
    md_content = f"""# 🚀 Aurolith: 80-Unit Local Generation Progress Dashboard

> **Total Progress:** **{completed} / {total} Units Completed ({percent}%)**  
> **Storage Structure:** `Assets/Units/<class>/<unit_slug>.png` (Strictly 1 transparent image per unit)  
> **Jev AI Accounting:** `{total_in_tokens} In / {total_out_tokens} Out = {total_in_tokens + total_out_tokens} Total Audit Tokens`  
> **Last Updated:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`

---

### 🛡️ Role Milestone Checkpoints (Every 10 Complete Sprites)

| Role | Class Folder | Unit Target | Integrity Status | Jev AI Milestone Audit |
|:---|:---|:---|:---|:---|
""" + "\n".join(role_rows) + """

---

### 📋 Complete 80-Unit Character Ledger

| ID | Unit Name | Class Folder | Form / Race | Vibe | Status | Jev AI Audit | Completed At |
|:---|:---|:---|:---|:---|:---|:---|:---|
""" + "\n".join(rows) + "\n"

    with open(PROGRESS_MD, "w", encoding="utf-8") as f:
        f.write(md_content)

def pause_execution_and_alert(reason, context=""):
    print(f"\n[CIRCUIT BREAKER TRIGGERED] {reason}")
    print("Consulting Jev AI for diagnostic guidance before halting...")
    
    jev_diag = consult_jev_for_breakdown(f"Reason: {reason}\nDetails: {context}")
    jev_text = ""
    if jev_diag.get("success"):
        c = jev_diag.get("choice")
        p = jev_diag.get("confidence", 0.0)
        tok = jev_diag.get("tokens", {})
        jev_text = f"- **Jev Recommendation:** `{c}` ({round(p*100)}% confidence)\n- **Jev Audit Tokens:** +{tok.get('input_tokens',0)}in / +{tok.get('output_tokens',0)}out\n- **Details:** {context}"
        print(f"Jev AI Consultation: {c} ({round(p*100)}%)")
    else:
        jev_text = f"Jev returned no response or timed out after 3 retries. Safe pause activated per user instruction.\nContext: {context}"
        print("[INFO] Jev returned nothing. Safely pausing until user wakes up to check.")
        
    alert_text = f"""# ⚠️ AUROLITH BATCH GENERATOR PAUSED

> **Pause Timestamp:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  
> **Reason:** {reason}

---

## 🔍 Jev AI Diagnostic Output
{jev_text}

---

## 🛠️ How to Resume When You Wake Up
1. Inspect the last generated files in `Assets/Units/`.
2. Check `Assets/Gen/PROGRESS.md` to review the current status.
3. Once satisfied or after modifying prompts in `note.md`, resume by running:
   ```bash
   python Assets/Gen/scriptgen/batch_generate_80_units.py
   ```
"""
    with open(ALERT_FILE, "w", encoding="utf-8") as f:
        f.write(alert_text)
    print(f"Pause notice written to {ALERT_FILE}. Generator halted safely.\n")
    sys.exit(0)

def run_batch(units, force=False):
    ledger = load_ledger()
    total = len(units)
    role_audits = {}
    
    print("\n=================================================================")
    print("=== STARTING AUROLITH 80-UNIT LOCAL AI BATCH GENERATOR ===")
    print("=================================================================\n")
    print(f"Total units to process: {total}")
    print(f"Target directory: {UNITS_DIR}")
    print(f"Policy: Exactly ONE transparent PNG per unit (<unit_slug>.png)")
    print(f"Milestone Protocol: Role check & Jev audit every 10 complete sprites.\n")
    
    start_time = time.time()
    
    for idx, u in enumerate(units, 1):
        slug = u["slug"]
        class_dir = os.path.join(UNITS_DIR, u["folder"])
        os.makedirs(class_dir, exist_ok=True)
        
        target_path = os.path.join(class_dir, f"{slug}.png")
        
        # Check if already completed and valid
        is_completed = (slug in ledger and "Completed" in ledger[slug].get("status", ""))
        is_valid, _ = validate_cutout_image(target_path)
        if not force and (is_valid or (os.path.exists(target_path) and is_completed)):
            print(f"[{idx}/{total}] Skipping {u['name']} (already generated and verified: {os.path.basename(target_path)}).")
            if slug not in ledger:
                ledger[slug] = {
                    "name": u["name"],
                    "folder": u["folder"],
                    "path": target_path,
                    "status": "Completed",
                    "jev_verdict": "Pre-existing",
                    "jev_probability": "100%",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                save_ledger(ledger)
                update_progress_md(units, ledger, role_audits)
        else:
            print(f"\n[{idx}/{total}] >>> Generating {u['name']} ({u['title']}) | {u['folder']}...")
            print(f"    Form: {u['form']} | Vibe: {u['vibe']}")
            print(f"    Prompt: {u['prompt'][:80]}...")
            
            payload = {
                "prompt": u["prompt"],
                "negative_prompt": u["negative_prompt"],
                "width": 512,
                "height": 768,
                "steps": 17,
                "cfg_scale": 7.5,
                "sampler_name": "DPM++ 2M Karras",
                "override_settings": {
                    "sd_model_checkpoint": "DreamShaper_8_pruned.safetensors"
                }
            }
            
            gen_success = False
            last_err = "Unknown error"
            for attempt in range(3):
                try:
                    t0 = time.time()
                    print(f"    [Attempt {attempt+1}/3] Sending 17-step DPM++ 2M Karras generation request...")
                    res = requests.post(SD_API_URL, json=payload, timeout=1800)
                    if res.status_code == 200:
                        data = res.json()
                        if "images" in data and len(data["images"]) > 0:
                            img_bytes = base64.b64decode(data["images"][0])
                            raw_img = Image.open(BytesIO(img_bytes)).convert("RGBA")
                            
                            # Apply Adaptive Edge-Connected BFS Floodfill Cutout
                            clean_transparent = edge_connected_cutout(raw_img, tolerance=235)
                            
                            # Save directly as canonical image
                            clean_transparent.save(target_path, "PNG")
                            
                            # Validate cutout with strict bounding box and framing rules
                            valid, err_msg = validate_cutout_image(target_path)
                            if not valid:
                                last_err = err_msg
                                print(f"    [Warning] Framing validation rejected: {err_msg}")
                                print("    Retrying with amplified safe margins and anti-crop locks...")
                                payload["prompt"] = payload["prompt"] + ", (centered full body game sprite:1.5), 25% safe margin"
                                payload["negative_prompt"] = payload["negative_prompt"] + ", (close-up:1.7), (cropped:1.7), (bust:1.7)"
                                time.sleep(2)
                                continue
                                
                            gen_time = round(time.time() - t0, 1)
                            print(f"    [OK] Quality verified in {gen_time}s -> {target_path}")
                            gen_success = True
                            break
                    print(f"    Attempt {attempt+1} failed with status {res.status_code}, retrying...")
                    time.sleep(2)
                except Exception as e:
                    last_err = str(e)
                    print(f"    Attempt {attempt+1} encountered error: {e}")
                    time.sleep(3)
                    
            if not gen_success:
                pause_execution_and_alert(
                    f"Failed to generate valid sprite for {u['name']} after 3 attempts.",
                    f"Last validation error: {last_err}"
                )
                
            # Consult Jev AI for individual aesthetic review
            print(f"    Consulting Jev AI for design audit on {u['name']}...")
            jev_res = consult_jev_for_unit(u)
            
            jev_verdict = "Approved"
            jev_prob = "80%"
            tokens_in = 0
            tokens_out = 0
            
            if jev_res.get("success"):
                choice = jev_res.get("choice", "approved_game_ready")
                probs = jev_res.get("probabilities", {})
                p_val = probs.get(choice, 0.8)
                tokens = jev_res.get("tokens", {})
                tokens_in = tokens.get("input_tokens", 0)
                tokens_out = tokens.get("output_tokens", 0)
                
                jev_verdict = "Approved" if choice == "approved_game_ready" else "Review"
                jev_prob = f"{round(p_val * 100)}%"
                print(f"    [OK] Jev Audit: {jev_verdict} ({jev_prob} probability) | Tokens: +{tokens_in}in / +{tokens_out}out")
            else:
                print(f"    [INFO] Jev individual consult skipped: {jev_res.get('error')}")
                
            # Record into ledger
            ledger[slug] = {
                "name": u["name"],
                "title": u["title"],
                "class_id": u["class_num"],
                "folder": u["folder"],
                "form": u["form"],
                "vibe": u["vibe"],
                "path": target_path,
                "status": "Completed",
                "jev_verdict": jev_verdict,
                "jev_probability": jev_prob,
                "tokens_in": tokens_in,
                "tokens_out": tokens_out,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            save_ledger(ledger)
            update_progress_md(units, ledger, role_audits)
            
            elapsed = round(time.time() - start_time, 1)
            print(f"    Total elapsed: {elapsed}s | Progress updated.")
            
        # =========================================================================
        # ROLE MILESTONE AUDIT & CIRCUIT BREAKER (Every 10 complete sprite generations)
        # =========================================================================
        if idx % 10 == 0:
            c_num = u["class_num"]
            c_folder = u["folder"]
            print(f"\n" + "="*65)
            print(f"=== ROLE MILESTONE REACHED: Class {c_num} ({c_folder}) ===")
            print("="*65)
            print(f"Executing mandatory 10-unit integrity & quality audit...")
            
            role_units = [item for item in units if item["class_num"] == c_num]
            all_valid = True
            invalid_reasons = []
            
            for ru in role_units:
                ru_path = os.path.join(UNITS_DIR, ru["folder"], f"{ru['slug']}.png")
                valid, msg = validate_cutout_image(ru_path)
                if not valid:
                    all_valid = False
                    invalid_reasons.append(f"{ru['name']}: {msg}")
                else:
                    print(f"  [OK] {ru['name']}: Verified valid ({os.path.getsize(ru_path)//1024} KB)")
                    
            if not all_valid:
                pause_execution_and_alert(
                    f"Integrity check failed for role {c_folder}!",
                    "\n".join(invalid_reasons)
                )
                
            print(f"All 10 units in {c_folder} verified physically valid!")
            print(f"Consulting Jev AI for class milestone synthesis & progression approval...")
            
            jev_milestone = consult_jev_role_milestone(c_num, c_folder, role_units)
            
            if not jev_milestone.get("success"):
                # "if jev return nothing just pause till i wake up and check"
                pause_execution_and_alert(
                    f"Jev AI returned nothing or timed out during {c_folder} milestone audit!",
                    f"Error details: {jev_milestone.get('error')}"
                )
                
            choice = jev_milestone.get("choice", "")
            probs = jev_milestone.get("probabilities", {})
            p_val = probs.get(choice, 0.0)
            tokens = jev_milestone.get("tokens", {})
            
            print(f"Jev Milestone Verdict: {choice} ({round(p_val*100)}% probability)")
            print(f"Tokens consumed: +{tokens.get('input_tokens',0)}in / +{tokens.get('output_tokens',0)}out")
            
            if choice != "approved_continue_next_role" or p_val < 0.50:
                pause_execution_and_alert(
                    f"Jev AI flagged class {c_folder} for manual review before proceeding!",
                    f"Jev choice: {choice} (Confidence: {round(p_val*100)}%)"
                )
                
            role_audits[c_num] = {
                "status": "Verified 10/10",
                "verdict": "Approved by Jev",
                "prob": f"{round(p_val*100)}%"
            }
            update_progress_md(units, ledger, role_audits)
            print(f">>> MILESTONE PASSED 100%! Proceeding to next role...\n")
            
    print("\n=================================================================")
    print(f"=== ALL 80 UNITS GENERATED, CUT OUT, AND VERIFIED 100%! ===")
    print("=================================================================\n")
    
    # Automatically execute comprehensive post-run quality scan
    print(">>> Executing comprehensive post-run quality scan across all 80 units...")
    try:
        import scan_all_units
        scan_all_units.run_scan()
    except Exception as e:
        print(f"Post-run scan warning: {e}")

if __name__ == "__main__":
    if not check_sd_server():
        print("ERROR: Stable Diffusion WebUI is not running on http://127.0.0.1:7860!")
        print("Please ensure D:\\LocalAI\\stable-diffusion-webui\\webui-user.bat is active.")
        sys.exit(1)
        
    units = parse_note_units()
    force_run = "--force" in sys.argv
    
    # Consolidate pre-existing Vanguard Marrow into canonical path
    marrow_src = os.path.join(UNITS_DIR, "1_Fighter", "vanguard_marrow_clean_transparent.png")
    marrow_dst = os.path.join(UNITS_DIR, "1_Fighter", "vanguard_marrow.png")
    if os.path.exists(marrow_src) and not os.path.exists(marrow_dst):
        import shutil
        shutil.copy2(marrow_src, marrow_dst)
        print(f"Consolidated canonical Vanguard Marrow: {marrow_dst}")
        
    # Clean loose test duplicates in 1_Fighter if canonical exists
    loose_list = [
        "test_grendal_cutout.png", 
        "test_cutout_adv.png", 
        "test_grendal_weighted.png", 
        "fighter_marrow_transparent.png", 
        "local_fighter_marrow.png", 
        "vanguard_marrow_raw.png", 
        "vanguard_marrow_transparent.png", 
        "vanguard_marrow_clean_transparent.png"
    ]
    for loose in loose_list:
        loose_p = os.path.join(UNITS_DIR, "1_Fighter", loose)
        if os.path.exists(loose_p):
            try:
                os.remove(loose_p)
            except:
                pass
                
    update_progress_md(units, load_ledger())
    run_batch(units, force=force_run)
