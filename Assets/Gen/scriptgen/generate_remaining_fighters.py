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

DEFAULT_NEG = (
    "(dark background:1.5), (black background:1.5), (colored background:1.3), (frame:1.4), (border:1.4), "
    "(close-up:1.6), (cropped:1.6), (cut off at edges:1.6), (out of frame:1.6), (off-center:1.6), (arm only:1.6), "
    "(weapon only:1.6), (head cropped:1.5), (feet cropped:1.5), (partial body:1.6), (limb cut off:1.6), "
    "floor, ground shadow, bad anatomy, deformed limbs, blurry, lowres, watermark, text"
)

FIGHTERS = [
    {
        "slug": "duelist_valen",
        "name": "Duelist Valen",
        "title": "The Honorbound Fencer",
        "prompt": (
            "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, "
            "(centered full body game sprite:1.4), (entire noble fencer visible from head to boots:1.3), full length standing view, "
            "imperial noble master fencer Duelist Valen, tall athletic noble swordsman with sleek dark hair and aristocratic focus, "
            "refined sun-forged imperial golden half-plate armor over a royal midnight-blue and crimson velvet doublet, sculpted lion-crest pauldron, "
            "ornate dueling cape draped over one shoulder, wielding a masterwork gold-hilted rapier-longsword with glowing silver and gold parrying blade trails, "
            "formal honorable 1v1 dueling poise ready for a lightning-fast lunge, deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, "
            "rich vibrant crimson, royal blue, and polished gold reflections, exerting supreme single-target dueling precision and lethal elegance, "
            "(pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin"
        )
    },
    {
        "slug": "gravewalker_corvin",
        "name": "Gravewalker Corvin",
        "title": "The Revenant Knight",
        "prompt": (
            "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, "
            "(centered full body game sprite:1.4), (entire spectral knight visible from head to boots:1.3), full length standing view, "
            "spectral revenant knight Gravewalker Corvin, gaunt intimidating hollow knight in dark-gilt blackened iron and gold plate armor with snarling lion pauldrons, "
            "tattered dark-crimson cloak shredded at hem, glowing ethereal turquoise-cyan soul-flame radiating from hollow eye sockets and leaking through chest armor ribs, "
            "wielding a massive curved soul-reaping spectral scythe-blade alight with swirling turquoise soul-mist and dark necrotic wisps, ominous poised combat stance, "
            "deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, rich vivid cyan soul-fire, obsidian black, and dark gold accents, "
            "exerting terrifying undead spectral dominance and soul-harvesting power, "
            "(pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin"
        )
    },
    {
        "slug": "chainbreaker_rhuk",
        "name": "Chainbreaker Rhuk",
        "title": "The Half-Orc Bruiser",
        "prompt": (
            "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, "
            "(centered full body game sprite:1.4), (entire half-orc bruiser visible from head to boots:1.3), full length standing view, "
            "colossal scarred half-orc bruiser Chainbreaker Rhuk, massive muscular frame with olive-grey skin, jutting lower tusks, fierce amber eyes, "
            "battle-worn sun-forged golden plate cuirass with heavy iron reinforcement, roaring lion pauldrons, shattered iron slave manacles still bolted around thick wrists, "
            "wielding a colossal barbed iron hook on a heavy coiled tether chain wrapped around his forearm, kinetic tension ready to drag enemies into melee range, "
            "wide menacing combat stance, deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, rich vibrant dark crimson, burnished iron, and radiant gold tones, "
            "exerting brutal physical pulling force and unstoppable brawling savagery, "
            "(pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin"
        )
    },
    {
        "slug": "phoenixblade_sera",
        "name": "Phoenixblade Sera",
        "title": "The Solar Champion",
        "prompt": (
            "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, "
            "(centered full body game sprite:1.4), (entire solar champion blade-dancer visible from head to boots:1.3), full length standing view, "
            "radiant solar champion Phoenixblade Sera, regal athletic female blade-dancer with flowing golden-red hair and blazing amber-gold eyes, "
            "wearing radiant sunburst golden plate armor with sculpted phoenix-lion crest pauldrons, flowing royal crimson cape trimmed in gold filigree, "
            "wielding twin curved phoenix-wing blades enveloped in roaring golden-orange solar fire and rising phoenix spark feathers, dynamic graceful bladesong combat pose, "
            "deep dramatic cast shadows, intense high-contrast medieval fantasy lighting, vibrant saturated sunfire orange, radiant crimson, and brilliant imperial gold, "
            "exerting triumphant solar power and blazing melee hypercarry dominance, "
            "(pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin"
        )
    }
]

def generate_fighter(fighter):
    target_path = os.path.join(FIGHTER_DIR, f"{fighter['slug']}.png")
    artifact_path = os.path.join(ARTIFACTS_DIR, f"{fighter['slug']}.png")
    
    print(f"\n=======================================================")
    print(f">>> Generating {fighter['name']} ({fighter['title']})...")
    print(f"Target: {target_path}")
    
    payload = {
        "prompt": fighter["prompt"],
        "negative_prompt": DEFAULT_NEG,
        "width": 384,
        "height": 576,
        "steps": 12,
        "cfg_scale": 7.0,
        "sampler_name": "Euler a",
        "override_settings": {
            "sd_model_checkpoint": "DreamShaper_8_pruned.safetensors"
        }
    }
    
    for attempt in range(3):
        try:
            t0 = time.time()
            print(f"Sending txt2img request (attempt {attempt+1}/3)...")
            res = requests.post(SD_API_URL, json=payload, timeout=600)
            if res.status_code == 200:
                data = res.json()
                if "images" in data and len(data["images"]) > 0:
                    img_bytes = base64.b64decode(data["images"][0])
                    raw_img = Image.open(BytesIO(img_bytes)).convert("RGBA")
                    
                    # Cutout background
                    clean_img = edge_connected_cutout(raw_img, tolerance=235)
                    resized = clean_img.resize((512, 768), Image.Resampling.LANCZOS)
                    resized.save(target_path, "PNG")
                    resized.save(artifact_path, "PNG")
                    
                    arr = np.array(resized)
                    alpha = arr[:, :, 3]
                    non_zero = np.argwhere(alpha > 10)
                    if len(non_zero) == 0:
                        print("Validation failed: completely transparent!")
                        continue
                    ymin, xmin = non_zero.min(axis=0)
                    ymax, xmax = non_zero.max(axis=0)
                    h_span = ymax - ymin
                    w_span = xmax - xmin
                    cx = (xmin + xmax) / 2.0
                    coverage = len(non_zero) / (arr.shape[0] * arr.shape[1])
                    elapsed = round(time.time() - t0, 1)
                    
                    print(f"Generated in {elapsed}s! BBox: W={w_span}, H={h_span}, Center=({cx:.1f}), Coverage={coverage*100:.1f}%")
                    if h_span >= 350 and abs(cx - 256) <= 90:
                        print(f"SUCCESS: {fighter['name']} verified and saved!")
                        return True
                    else:
                        print(f"Warning: Framing suboptimal (h_span={h_span}, cx={cx:.1f}). Retrying...")
            else:
                print(f"SD API error {res.status_code}: {res.text[:200]}")
        except Exception as e:
            print(f"Exception during generation: {e}")
        time.sleep(3)
        
    print(f"FAILED to generate {fighter['name']}")
    return False

def main():
    print("Generating remaining 4 Fighter units to complete 1_Fighter class (10/10)...")
    for f in FIGHTERS:
        ok = generate_fighter(f)
        if not ok:
            print(f"Stopping batch due to failure on {f['name']}")
            sys.exit(1)
    print("\n=======================================================")
    print("ALL 10/10 FIGHTERS SUCCESSFULLY GENERATED AND VERIFIED!")

if __name__ == "__main__":
    main()
