import os
import sys
import re
import json
from datetime import datetime
from PIL import Image
import numpy as np
import cv2

sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

GEN_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen"
UNITS_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Units"
NOTE_FILE = os.path.join(GEN_DIR, "note.md")
REPORT_FILE = os.path.join(GEN_DIR, "QUALITY_AUDIT_REPORT.md")

CLASS_FOLDERS = [
    ("1", "1_Fighter"),
    ("2", "2_Tanker"),
    ("3", "3_Mage"),
    ("4", "4_Marksman"),
    ("5", "5_Support"),
    ("6", "6_Siege"),
    ("7", "7_Artisan"),
    ("8", "8_Assassin")
]

def parse_all_units():
    if not os.path.exists(NOTE_FILE):
        print(f"Error: note.md not found at {NOTE_FILE}")
        return []
    with open(NOTE_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    unit_blocks = re.findall(r'### (\d+)\.(\d+)\s+([^\n]+?)\s+—\s+\*"([^\n]+?)"\*\s+\(T\d+\)([\s\S]+?)(?=### \d+\.\d+|\n#|\Z)', content)
    units = []
    class_map = dict(CLASS_FOLDERS)
    
    for cls_num, unit_num, name, title, body in unit_blocks:
        name_clean = name.strip()
        slug = re.sub(r'[^a-zA-Z0-9_]', '', name_clean.lower().replace(' ', '_'))
        folder = class_map.get(cls_num, f"{cls_num}_Class")
        
        units.append({
            "id": f"{cls_num}.{unit_num}",
            "class_num": cls_num,
            "unit_num": unit_num,
            "name": name_clean,
            "title": title.strip(),
            "slug": slug,
            "folder": folder
        })
    return units

def evaluate_sprite_quality(path):
    """
    Performs deep morphological, framing, and contrast inspection on a unit sprite.
    """
    if not os.path.exists(path):
        return {
            "status": "FAIL",
            "code": "MISSING",
            "message": "File does not exist on disk"
        }
        
    file_size_kb = os.path.getsize(path) / 1024.0
    if file_size_kb < 60:
        return {
            "status": "FAIL",
            "code": "FILE_TOO_SMALL",
            "message": f"File size ({file_size_kb:.1f} KB) is abnormally small"
        }
        
    try:
        img = Image.open(path)
    except Exception as e:
        return {
            "status": "FAIL",
            "code": "CORRUPTED",
            "message": f"Cannot open image: {e}"
        }
        
    if img.size != (512, 768):
        return {
            "status": "FAIL",
            "code": "INVALID_DIMENSIONS",
            "message": f"Dimensions are {img.size}, expected (512, 768)"
        }
        
    if img.mode != "RGBA":
        return {
            "status": "FAIL",
            "code": "NOT_RGBA",
            "message": f"Color mode is {img.mode}, expected RGBA"
        }
        
    arr = np.array(img)
    alpha = arr[:, :, 3]
    non_zero = np.argwhere(alpha > 15)
    
    if len(non_zero) == 0:
        return {
            "status": "FAIL",
            "code": "EMPTY_ALPHA",
            "message": "Entire image is transparent"
        }
        
    ymin, xmin = non_zero.min(axis=0)
    ymax, xmax = non_zero.max(axis=0)
    h_span = int(ymax - ymin)
    w_span = int(xmax - xmin)
    cx = float((xmin + xmax) / 2.0)
    cy = float((ymin + ymax) / 2.0)
    coverage = float(len(non_zero) / (512 * 768) * 100.0)
    
    # Calculate sharpness / contrast inside non-zero mask
    rgb = arr[:, :, :3]
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    
    issues = []
    
    # 1. Height check: must be full body standing character, not waist-up
    if h_span < 400:
        issues.append(f"Severely cropped height ({h_span}px < 400px minimum)")
    elif h_span < 480:
        issues.append(f"Suboptimal height span ({h_span}px)")
        
    # 2. Centering check: horizontal center should be near 256
    cx_offset = abs(cx - 256.0)
    if cx_offset > 80:
        issues.append(f"Off-center horizontally (Cx={cx:.1f}, offset={cx_offset:.1f}px)")
        
    # 3. Border clipping: character should not be sliced against frame borders
    if ymin <= 4:
        issues.append(f"Head/Top touches border (Ymin={ymin})")
    if ymax >= 764:
        issues.append(f"Feet/Bottom touches border (Ymax={ymax})")
    if xmin <= 2 or xmax >= 509:
        issues.append(f"Weapon/Side touches horizontal edge (X=[{xmin}, {xmax}])")
        
    # 4. Coverage check
    if coverage < 20.0:
        issues.append(f"Abnormally low sprite coverage ({coverage:.1f}%)")
    elif coverage > 60.0:
        issues.append(f"Excessive coverage ({coverage:.1f}%), background bleed possible")
        
    # 5. Sharpness check
    if laplacian_var < 80.0:
        issues.append(f"Low contrast / blurry texture (Laplacian={laplacian_var:.1f})")
        
    # Determine Status
    if any("Severely cropped" in iss or "Head/Top touches border" in iss for iss in issues):
        status = "FAIL"
    elif len(issues) > 0:
        status = "WARN"
    else:
        status = "PASS"
        
    return {
        "status": status,
        "file_size_kb": file_size_kb,
        "h_span": h_span,
        "w_span": w_span,
        "bbox_y": (int(ymin), int(ymax)),
        "bbox_x": (int(xmin), int(xmax)),
        "cx": cx,
        "cy": cy,
        "coverage": coverage,
        "sharpness": laplacian_var,
        "issues": issues,
        "message": "; ".join(issues) if issues else "All quality invariants verified"
    }

def run_scan():
    print("=" * 80)
    print("=== AUROLITH ASSET PIPELINE: FULL 80-UNIT QUALITY SCANNER ===")
    print("=" * 80)
    
    units = parse_all_units()
    print(f"Loaded {len(units)} units defined in note.md.")
    
    results = []
    class_stats = {}
    
    for u in units:
        cls_num = u["class_num"]
        folder = u["folder"]
        if folder not in class_stats:
            class_stats[folder] = {"total": 0, "pass": 0, "warn": 0, "fail": 0, "missing": 0}
            
        class_stats[folder]["total"] += 1
        
        path = os.path.join(UNITS_DIR, folder, f"{u['slug']}.png")
        eval_res = evaluate_sprite_quality(path)
        eval_res.update(u)
        eval_res["path"] = path
        results.append(eval_res)
        
        st = eval_res["status"]
        if st == "PASS":
            class_stats[folder]["pass"] += 1
            icon = "🟢"
        elif st == "WARN":
            class_stats[folder]["warn"] += 1
            icon = "🟡"
        else:
            class_stats[folder]["fail"] += 1
            if eval_res.get("code") == "MISSING":
                class_stats[folder]["missing"] += 1
            icon = "🔴"
            
        print(f"[{icon} {st:<4}] {u['id']:<5} {u['name']:<22} | {folder:<12} | {eval_res.get('message')}")
        
    # Compile markdown audit report
    total_units = len(units)
    total_pass = sum(s["pass"] for s in class_stats.values())
    total_warn = sum(s["warn"] for s in class_stats.values())
    total_fail = sum(s["fail"] for s in class_stats.values())
    total_missing = sum(s["missing"] for s in class_stats.values())
    total_present = total_units - total_missing
    
    summary_lines = []
    summary_lines.append("# 🛡️ AUROLITH 80-UNIT ASSET QUALITY AUDIT REPORT\n")
    summary_lines.append(f"> **Audit Timestamp:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  ")
    summary_lines.append(f"> **Total Defined Units:** `{total_units}` | **Generated & Present:** `{total_present} / {total_units}`  ")
    summary_lines.append(f"> **Quality Grade:** **{total_pass} PASS 🟢** | **{total_warn} WARNING 🟡** | **{total_fail} FAIL 🔴**\n")
    summary_lines.append("---\n")
    
    summary_lines.append("## 📊 Class-by-Class Health Matrix\n")
    summary_lines.append("| Class Folder | Total | Present | 🟢 Pass | 🟡 Warn | 🔴 Fail | Missing | Integrity % |")
    summary_lines.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    for folder, s in class_stats.items():
        pass_pct = (s["pass"] / s["total"] * 100.0) if s["total"] > 0 else 0
        summary_lines.append(f"| **{folder}** | {s['total']} | {s['total'] - s['missing']} | {s['pass']} | {s['warn']} | {s['fail']} | {s['missing']} | {pass_pct:.0f}% |")
        
    summary_lines.append("\n---\n")
    summary_lines.append("## 🔍 Detailed Unit-by-Unit Inspection\n")
    summary_lines.append("| ID | Unit Name | Class | Status | Size | Height Span | Alpha Cov. | Quality Notes |")
    summary_lines.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    
    for r in results:
        st_icon = "🟢 PASS" if r["status"] == "PASS" else ("🟡 WARN" if r["status"] == "WARN" else "🔴 FAIL")
        sz_str = f"{r.get('file_size_kb', 0):.1f} KB" if "file_size_kb" in r else "N/A"
        h_str = f"{r.get('h_span', 0)}px" if "h_span" in r else "N/A"
        cov_str = f"{r.get('coverage', 0):.1f}%" if "coverage" in r else "N/A"
        notes = r.get("message", "-")
        summary_lines.append(f"| {r['id']} | **{r['name']}** | {r['folder']} | {st_icon} | {sz_str} | {h_str} | {cov_str} | {notes} |")
        
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(summary_lines) + "\n")
        
    print("\n" + "=" * 80)
    print(f"Audit completed! Report saved to {REPORT_FILE}")
    print(f"Summary: {total_pass} PASS, {total_warn} WARN, {total_fail} FAIL ({total_missing} missing)")
    print("=" * 80)
    
    return total_fail == 0

if __name__ == "__main__":
    run_scan()
