import requests
import base64
import json
import os
from io import BytesIO
from PIL import Image
import numpy as np

SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
BASE_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets"

def test_generate_ground():
    prompt = "seamless texture of deep emerald rainforest jungle floor, damp moss, twisting roots, tiny glowing magical flora, flat 2d top-down texture map, clean rpg game environment texture, highly detailed, soft ambient lighting"
    neg = "ugly, blurry, low quality, hexagon, border, frame, edges, tiles, grid, 3d perspective, dark, shadow, watermark"
    payload = {
        "prompt": prompt,
        "negative_prompt": neg,
        "width": 512,
        "height": 512,
        "steps": 20,
        "cfg_scale": 7.0,
        "tiling": True,
        "sampler_name": "DPM++ 2M Karras",
        "override_settings": {
            "sd_model_checkpoint": "DreamShaper_8_pruned.safetensors"
        }
    }
    print("Generating local seamless jungle floor...")
    res = requests.post(SD_API_URL, json=payload, timeout=600)
    data = res.json()
    img_bytes = base64.b64decode(data["images"][0])
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    out_path = os.path.join(BASE_DIR, "Tiles", "2_Jungle", "jungle_floor.jpg")
    img.save(out_path, "JPEG", quality=95)
    print(f"Saved local seamless jungle floor: {out_path}")

if __name__ == "__main__":
    test_generate_ground()
