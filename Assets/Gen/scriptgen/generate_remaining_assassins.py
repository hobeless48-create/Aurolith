import requests
import base64
import json
import os
import sys
import time
from io import BytesIO
from PIL import Image
import numpy as np

# Force UTF-8 unbuffered output
sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)

SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
ASSASSIN_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Units\8_Assassin"
GEN_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen"
SCRIPT_DIR = os.path.join(GEN_DIR, "scriptgen")

sys.path.append(SCRIPT_DIR)
from process_unit_sprite import edge_connected_cutout
from batch_generate_80_units import validate_cutout_image

REMAINING_UNITS = [
    {
        "slug": "penumbra",
        "name": "Penumbra",
        "title": "The Void Stalker",
        "prompt": "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, eldritch shadow ambush assassin Penumbra, amorphous liquid midnight-black void body forming into a sleek predatory humanoid shape, three glowing ruby-crimson eyes on a smooth black face, razor-sharp tendril scythe blades dripping dark violet smoke and melting shadow droplets, ornate imperial gold-trimmed dark leather pauldrons, lethal ambush stalking stance, deep dramatic shadows, intense cinematic lighting, rich vibrant dark violet and crimson magic glow, obsidian liquid textures, exerting terrifying ambush power, (pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin",
        "negative_prompt": "(dark background:1.5), (black background:1.5), (colored background:1.3), (frame:1.4), (border:1.4), floor, ground shadow, bad anatomy, deformed limbs, cropped, cut off, out of frame, blurry, lowres, watermark, text"
    },
    {
        "slug": "doomblade_shade",
        "name": "Doomblade Shade",
        "title": "The Harvester",
        "prompt": "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, terrifying horned fiend demon executioner Doomblade Shade, ash-grey muscular frame, large curved black obsidian ram horns, spiked dark iron plate armor with glowing crimson death runes and imperial gold trim, carrying a massive heavy curved execution sickle scythe pulsing with dark red necrotic energy, soul chains wrapped around arms, cold merciless reaper gaze, deep dramatic shadows, intense high-contrast medieval fantasy lighting, vibrant saturated blood-crimson and violet accents, exerting overwhelming executioner power, (pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin",
        "negative_prompt": "(dark background:1.5), (black background:1.5), (colored background:1.3), (frame:1.4), (border:1.4), floor, ground shadow, bad anatomy, deformed limbs, cropped, cut off, out of frame, blurry, lowres, watermark, text"
    },
    {
        "slug": "apex_predator",
        "name": "Apex Predator",
        "title": "The Beast King",
        "prompt": "(masterpiece, best quality:1.3), 2.5D medieval fantasy video game character sprite, full body, isolated portrait, colossal sabertooth beastfolk alpha predator Apex Predator, towering ferocious muscular feline humanoid frame, vibrant orange and black striped tiger fur, long curving ivory sabertooth fangs, heavy bone-and-gold reinforced shoulder armor with ruby gemstones, colossal steel-clawed gauntlets dripping with savage power, terrifying primal roar in dominant combat stance, deep dramatic cast shadows, vivid vibrant colors, radiant gold reflections, glowing amber eyes, exerting apex predator dominance and terrifying physical power, (pure solid white background:1.5), (isolated on white background:1.4), clean silhouette, 20% safe margin",
        "negative_prompt": "(dark background:1.5), (black background:1.5), (colored background:1.3), (frame:1.4), (border:1.4), floor, ground shadow, bad anatomy, deformed limbs, cropped, cut off, out of frame, blurry, lowres, watermark, text"
    }
]

def generate_unit(unit):
    target_path = os.path.join(ASSASSIN_DIR, f"{unit['slug']}.png")
    print(f"\n=======================================================")
    print(f">>> Generating {unit['name']} ({unit['title']})...")
    print(f"Target: {target_path}")
    
    payload = {
        "prompt": unit["prompt"],
        "negative_prompt": unit["negative_prompt"],
        "width": 448,
        "height": 672,
        "steps": 14,
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
                    # Resize to standard game sprite size 512x768
                    resized = clean_img.resize((512, 768), Image.Resampling.LANCZOS)
                    resized.save(target_path, "PNG")
                    
                    valid, msg = validate_cutout_image(target_path)
                    elapsed = round(time.time() - t0, 1)
                    if valid:
                        print(f"SUCCESS: {unit['name']} generated and verified in {elapsed}s!")
                        return True
                    else:
                        print(f"Cutout validation warning: {msg}. Retrying...")
            else:
                print(f"Error status {res.status_code}: {res.text[:200]}")
        except Exception as e:
            print(f"Attempt {attempt+1} exception: {e}")
        time.sleep(3)
        
    print(f"FAILED to generate valid sprite for {unit['name']}")
    return False

def main():
    print("Starting generation of remaining 8_Assassin units with Euler a...")
    all_ok = True
    for u in REMAINING_UNITS:
        ok = generate_unit(u)
        if not ok:
            all_ok = False
            break
            
    if all_ok:
        print("\nAll remaining 8_Assassin units successfully generated!")
    else:
        print("\nSome units failed to generate.")

if __name__ == "__main__":
    main()
