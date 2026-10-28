import requests
import base64
import os
from io import BytesIO
from PIL import Image
import numpy as np

SD_API_URL = "http://127.0.0.1:7860/sdapi/v1/txt2img"
BASE_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Units\1_Fighter"

def generate_marrow():
    prompt = (
        "(full body portrait of a human warrior:1.3), male paladin in sun-forged golden plate armor with subtle lion relief engraving on shoulder guards, "
        "crimson cloak trim, athletic build, holding twin steel broadswords in compact defensive battle stance, "
        "compact centered framing, head and boots and swords completely within frame, wide 20% margin around character, "
        "isolated on solid pure white background, stylized 2d fantasy video game character sprite, sharp clean outline, highly detailed"
    )
    neg = (
        "lion face, lion head, animal head, furry, beast, monster face, deformed, ugly, "
        "cut off, cropped sword, cropped weapon, cropped limbs, touching edge of frame, out of frame, "
        "blurry, low resolution, multiple characters, dark background, gradient background, floor, ground shadow"
    )
    payload = {
        "prompt": prompt,
        "negative_prompt": neg,
        "width": 512,
        "height": 768,
        "steps": 20,
        "cfg_scale": 7.5,
        "sampler_name": "DPM++ 2M Karras",
        "override_settings": {
            "sd_model_checkpoint": "DreamShaper_8_pruned.safetensors"
        }
    }
    
    print("Generating Vanguard Marrow on local DreamShaper 8...")
    res = requests.post(SD_API_URL, json=payload, timeout=600)
    data = res.json()
    img_bytes = base64.b64decode(data["images"][0])
    img = Image.open(BytesIO(img_bytes)).convert("RGBA")
    
    raw_path = os.path.join(BASE_DIR, "vanguard_marrow_raw.png")
    img.save(raw_path, "PNG")
    print(f"Saved raw image: {raw_path}")
    
    # Process transparency
    np_img = np.array(img)
    r, g, b = np_img[:, :, 0], np_img[:, :, 1], np_img[:, :, 2]
    # Identify white background pixels
    white_mask = (r > 235) & (g > 235) & (b > 235)
    np_img[:, :, 3] = np.where(white_mask, 0, 255).astype(np.uint8)
    
    trans_img = Image.fromarray(np_img)
    trans_path = os.path.join(BASE_DIR, "vanguard_marrow_transparent.png")
    trans_img.save(trans_path, "PNG")
    print(f"Saved transparent sprite: {trans_path}")

if __name__ == "__main__":
    generate_marrow()
