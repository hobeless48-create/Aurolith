import requests
import base64
import json
import os
import sys
import re
from io import BytesIO
from collections import deque
from PIL import Image
import numpy as np

SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
ASSETS_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets"
NOTE_FILE = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\note.md"

CLASS_FOLDER_MAP = {
    "1": "Units/1_Fighter",
    "2": "Units/2_Tanker",
    "3": "Units/3_Mage",
    "4": "Units/4_Marksman",
    "5": "Units/5_Support",
    "6": "Units/6_Siege",
    "7": "Units/7_Artisan",
    "8": "Units/8_Assassin"
}

def check_sd_server():
    try:
        res = requests.get("http://127.0.0.1:7860/sdapi/v1/progress", timeout=3)
        return res.status_code == 200
    except:
        return False

def edge_connected_cutout(img, tolerance=235):
    """
    Boundary-connected BFS floodfill from image borders.
    Removes outer background while preserving internal white specular highlights and clothing.
    """
    img = img.convert("RGBA")
    np_img = np.array(img)
    h, w, _ = np_img.shape
    
    r, g, b = np_img[:, :, 0], np_img[:, :, 1], np_img[:, :, 2]
    is_white = (r >= tolerance) & (g >= tolerance) & (b >= tolerance)
    
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()
    
    # Push all outer border white pixels
    for x in range(w):
        if is_white[0, x] and not visited[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_white[h - 1, x] and not visited[h - 1, x]:
            queue.append((h - 1, x))
            visited[h - 1, x] = True
            
    for y in range(h):
        if is_white[y, 0] and not visited[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_white[y, w - 1] and not visited[y, w - 1]:
            queue.append((y, w - 1))
            visited[y, w - 1] = True
            
    # 4-way BFS expansion
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w:
                if not visited[ny, nx] and is_white[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    # Only border-connected pixels become transparent
    np_img[visited, 3] = 0
    return Image.fromarray(np_img)

def generate_and_save(prompt, out_subfolder, filename, negative_prompt="text, watermark, low quality, deformed", width=512, height=768, steps=20, make_transparent=True):
    payload = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": width,
        "height": height,
        "steps": steps,
        "cfg_scale": 7.0,
        "sampler_name": "DPM++ 2M Karras",
        "override_settings": {
            "sd_model_checkpoint": "DreamShaper_8_pruned.safetensors"
        }
    }
    
    print(f"--> [Local SD 1.5] Generating: {filename}...")
    response = requests.post(SD_API_URL, json=payload, timeout=600)
    data = response.json()
    
    if "images" not in data or len(data["images"]) == 0:
        raise Exception(f"Failed to generate: {data}")
        
    img_bytes = base64.b64decode(data["images"][0])
    img = Image.open(BytesIO(img_bytes)).convert("RGBA")
    
    target_dir = os.path.join(ASSETS_DIR, out_subfolder)
    os.makedirs(target_dir, exist_ok=True)
    
    raw_path = os.path.join(target_dir, f"{filename}.png")
    img.save(raw_path, "PNG")
    print(f"    Saved raw: {raw_path}")
    
    if make_transparent:
        transparent_img = edge_connected_cutout(img, tolerance=235)
        trans_path = os.path.join(target_dir, f"{filename}_transparent.png")
        transparent_img.save(trans_path, "PNG")
        print(f"    Saved transparent cutout (Edge-Connected BFS): {trans_path}")

def parse_note_units():
    """
    Parses all 80 units, their class, slug, prompt, and negative prompt from note.md.
    """
    if not os.path.exists(NOTE_FILE):
        raise FileNotFoundError(f"note.md not found at {NOTE_FILE}")
        
    with open(NOTE_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    unit_blocks = re.findall(r'### (\d+)\.(\d+)\s+([^\n]+?)\s+—\s+\*"([^\n]+?)"\*\s+\(T\d+\)([\s\S]+?)(?=### \d+\.\d+|\n#|\Z)', content)
    units = []
    
    default_neg = "bad hands, missing limbs, cropped, cut off at edges, out of frame, background scenery, floor shadow, dark background, complex background, blurry, lowres, watermark, text"
    
    for cls_num, unit_num, name, title, body in unit_blocks:
        name_clean = name.strip()
        slug = re.sub(r'[^a-zA-Z0-9_]', '', name_clean.lower().replace(' ', '_'))
        
        prompt_match = re.search(r'\*\*SD 1\.5 Prompt:\*\*\s*\n\s*`([^`]+)`', body)
        prompt = prompt_match.group(1).strip() if prompt_match else ""
        
        neg_match = re.search(r'\*\*Negative Prompt:\*\*\s*`([^`]+)`', body)
        neg_prompt = neg_match.group(1).strip() if neg_match else default_neg
        
        folder = CLASS_FOLDER_MAP.get(cls_num, f"Units/{cls_num}_Class")
        
        units.append({
            "class_num": cls_num,
            "unit_num": unit_num,
            "name": name_clean,
            "title": title.strip(),
            "slug": slug,
            "folder": folder,
            "prompt": prompt,
            "negative_prompt": neg_prompt
        })
        
    return units

if __name__ == "__main__":
    is_online = check_sd_server()
    print("=======================================================")
    print("=== AUROLITH: LOCAL SD 1.5 CHARACTER ASSET RUNNER ===")
    print("=======================================================")
    print(f"WebUI Daemon Status: {'[ONLINE]' if is_online else '[OFFLINE]'}")
    
    units = parse_note_units()
    print(f"Loaded {len(units)} units from {os.path.basename(NOTE_FILE)}.")
    
    if len(sys.argv) > 1:
        arg = sys.argv[1].lower()
        if arg == "--status":
            print(f"Server is {'ready at ' + SD_API_URL if is_online else 'not accessible'}.")
        elif arg == "--test":
            if not is_online:
                print("ERROR: WebUI daemon is offline! Launch webui-user.bat first.")
            else:
                test_unit = units[0]  # Vanguard Marrow
                print(f"Running test generation for: {test_unit['name']}")
                generate_and_save(test_unit["prompt"], test_unit["folder"], test_unit["slug"], test_unit["negative_prompt"])
        elif arg == "--all":
            if not is_online:
                print("ERROR: WebUI daemon is offline! Launch webui-user.bat first.")
            else:
                for idx, u in enumerate(units):
                    print(f"[{idx+1}/80] Generating {u['name']} ({u['folder']})...")
                    generate_and_save(u["prompt"], u["folder"], u["slug"], u["negative_prompt"])
        elif arg == "--class" and len(sys.argv) > 2:
            target_cls = sys.argv[2]
            matched = [u for u in units if u["class_num"] == target_cls or target_cls.lower() in u["folder"].lower()]
            print(f"Generating {len(matched)} units for class {target_cls}...")
            if not is_online:
                print("ERROR: WebUI daemon is offline!")
            else:
                for u in matched:
                    generate_and_save(u["prompt"], u["folder"], u["slug"], u["negative_prompt"])
        elif arg == "--unit" and len(sys.argv) > 2:
            query = sys.argv[2].lower()
            matched = [u for u in units if query in u["name"].lower() or query in u["slug"]]
            if not matched:
                print(f"No unit matched query '{query}'.")
            else:
                u = matched[0]
                print(f"Found unit: {u['name']}")
                if is_online:
                    generate_and_save(u["prompt"], u["folder"], u["slug"], u["negative_prompt"])
                else:
                    print("ERROR: WebUI daemon is offline!")
    else:
        print("\nUsage:")
        print("  python generate_local_assets.py --status")
        print("  python generate_local_assets.py --test            (Generate 1 test unit: Vanguard Marrow)")
        print("  python generate_local_assets.py --class 1_Fighter (Generate all 10 Fighters)")
        print("  python generate_local_assets.py --unit \"Grendal\"   (Generate Ironclaw Grendal)")
        print("  python generate_local_assets.py --all             (Queue all 80 units sequentially)")
