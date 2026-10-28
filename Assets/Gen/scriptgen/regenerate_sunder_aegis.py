import requests
import base64
import json
import os
import sys
import time
from io import BytesIO
from PIL import Image
import numpy as np

sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
FIGHTER_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Units\1_Fighter"
ARTIFACTS_DIR = r"C:\Users\s0846\.gemini\antigravity-ide\brain\b6f0a634-904a-483e-948d-4073a64060f0"
GEN_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen"
SCRIPT_DIR = os.path.join(GEN_DIR, "scriptgen")
sys.path.append(SCRIPT_DIR)
from process_unit_sprite import edge_connected_cutout

prompt = (
    "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, "
    "(centered full body game sprite:1.4), (entire dwarf stonekin warrior visible from head to boots:1.3), full length standing view, "
    "heavy shieldbreaker dwarf stonekin warrior Sunder Aegis, stocky powerfully muscular dwarf build, braided fiery copper beard, "
    "steel-crowned brow, heavy sun-forged imperial golden plate armor reinforced with carved granite shoulder plates and lion-head pauldrons, "
    "rich crimson battle sash, holding a massive two-handed barrier-shattering warhammer resting head down on ground, glowing molten magma fissure veins "
    "and crackling fiery orange impact sparks, resolute powerhouse ready stance, deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, "
    "vibrant saturated molten orange, crimson, and radiant gold tones, exerting relentless barrier-cracking blunt force, "
    "(pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin"
)

neg_prompt = (
    "(dark background:1.5), (black background:1.5), (colored background:1.3), (frame:1.4), (border:1.4), "
    "(close-up:1.6), (cropped:1.6), (cut off at edges:1.6), (out of frame:1.6), (off-center:1.6), (arm only:1.6), "
    "(weapon only:1.6), (head cropped:1.5), (feet cropped:1.5), (partial body:1.6), (limb cut off:1.6), "
    "floor, ground shadow, bad anatomy, deformed limbs, blurry, lowres, watermark, text"
)

payload = {
    "prompt": prompt,
    "negative_prompt": neg_prompt,
    "width": 384,
    "height": 576,
    "steps": 12,
    "cfg_scale": 7.0,
    "sampler_name": "Euler a",
    "override_settings": {
        "sd_model_checkpoint": "DreamShaper_8_pruned.safetensors"
    }
}

print("Generating Sunder Aegis with optimized 384x576 full-body framing...")
t0 = time.time()
res = requests.post(SD_API_URL, json=payload, timeout=600)
if res.status_code == 200:
    data = res.json()
    img_bytes = base64.b64decode(data["images"][0])
    raw_img = Image.open(BytesIO(img_bytes)).convert("RGBA")
    
    # Save raw for inspection
    raw_debug_path = os.path.join(ARTIFACTS_DIR, "sunder_aegis_raw.png")
    raw_img.save(raw_debug_path)
    
    clean_img = edge_connected_cutout(raw_img, tolerance=235)
    resized = clean_img.resize((512, 768), Image.Resampling.LANCZOS)
    
    target_path = os.path.join(FIGHTER_DIR, "sunder_aegis.png")
    resized.save(target_path, "PNG")
    
    # Copy to artifacts
    artifact_path = os.path.join(ARTIFACTS_DIR, "sunder_aegis_regenerated.png")
    resized.save(artifact_path, "PNG")
    
    arr = np.array(resized)
    alpha = arr[:, :, 3]
    non_zero = np.argwhere(alpha > 10)
    ymin, xmin = non_zero.min(axis=0)
    ymax, xmax = non_zero.max(axis=0)
    h_span = ymax - ymin
    w_span = xmax - xmin
    cx = (xmin + xmax) / 2.0
    cy = (ymin + ymax) / 2.0
    coverage = len(non_zero) / (arr.shape[0] * arr.shape[1])
    
    print(f"Generated and processed in {time.time()-t0:.2f}s!")
    print(f"BBox: X=[{xmin}, {xmax}] (W={w_span}), Y=[{ymin}, {ymax}] (H={h_span})")
    print(f"Center: ({cx:.1f}, {cy:.1f}), Coverage: {coverage*100:.1f}%")
    if h_span >= 350 and abs(cx - 256) <= 90:
        print("VERIFIED: Full body dwarf warrior generated with clean centered framing!")
    else:
        print(f"WARNING: Framing may still need adjustment (h_span={h_span}, cx={cx:.1f})")
else:
    print(f"SD Error: {res.status_code} {res.text}")
