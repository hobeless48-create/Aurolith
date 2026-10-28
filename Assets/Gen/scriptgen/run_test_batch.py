import time
import sys
import os

sys.path.append(r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets")
from generate_local_assets import generate_and_save, check_sd_server

def main():
    print("==================================================")
    print("   AUROLITH LOCAL AI BATCH TEST (1 UNIT + 3 TILES)")
    print("   Engine: Local DreamShaper 8 (Port 7860)")
    print("   Token Cost: 0 Tokens (100% Free & Local)")
    print("==================================================")

    if not check_sd_server():
        print("ERROR: Stable Diffusion WebUI is not reachable at http://127.0.0.1:7860")
        sys.exit(1)

    batch_tasks = [
        {
            "subfolder": "Units",
            "filename": "local_fighter_marrow",
            "prompt": "full-body 2.5D game character sprite, Vanguard Fighter warrior in compact ready-guard stance, sun-forged golden plate armor with lion-head pauldrons, polished steel gauntlets, crimson red cloak draped behind back, dual golden swords held vertically close to torso, heroic determination, centered pose, feet planted on ground plane, solid plain pure white background, sharp edges, fantasy game asset, clean silhouette, 8k resolution, masterpiece, highly detailed",
            "negative_prompt": "wide splayed arms, splayed swords, cut off, cropped, text, watermark, bad anatomy, deformed limbs, blurry, noisy, busy background, landscape",
            "width": 512,
            "height": 768,
            "steps": 15,
            "make_transparent": True
        },
        {
            "subfolder": "Tiles",
            "filename": "local_hex_grass",
            "prompt": "top-down bird-eye view of a single flat hexagonal game tile texture, lush vibrant green meadow grass turf, tiny golden wildflower specks, flat 2D overhead perspective, no 3D perspective, no cliff sides, no dirt base, pure green grass filling hexagonal face, clean sharp geometric hex border, isolated on black background, stylized fantasy strategy game art, high quality",
            "negative_prompt": "3D perspective, cliff, dirt sides, pedestal, cube, isometric slant, blurry, text, watermark",
            "width": 512,
            "height": 512,
            "steps": 15,
            "make_transparent": False
        },
        {
            "subfolder": "Tiles",
            "filename": "local_hex_dirtpath",
            "prompt": "top-down bird-eye view of a single flat hexagonal game tile texture, natural light brown packed earth, fine dirt road trail texture, tiny scattered smooth pebbles and gravel, flat 2D overhead perspective, no 3D perspective, no cliff sides, pure packed dirt filling hexagonal face, clean sharp geometric hex border, isolated on black background, stylized fantasy strategy game art, high quality",
            "negative_prompt": "3D perspective, cliff, pedestal, grass, cube, isometric slant, blurry, text, watermark",
            "width": 512,
            "height": 512,
            "steps": 15,
            "make_transparent": False
        },
        {
            "subfolder": "Tiles",
            "filename": "local_hex_marble",
            "prompt": "top-down bird-eye view of a single flat hexagonal game tile texture, luxury imperial palace courtyard paving, polished sun-gilded white marble flagstones with elegant gold-inlaid geometric starburst seams, flat 2D overhead perspective, no 3D perspective, no cliff sides, clean sharp geometric hex border, isolated on black background, stylized fantasy strategy game art, high quality",
            "negative_prompt": "3D perspective, cliff, pedestal, dirt, cube, isometric slant, blurry, text, watermark",
            "width": 512,
            "height": 512,
            "steps": 15,
            "make_transparent": False
        }
    ]

    total = len(batch_tasks)
    start_total = time.time()

    for i, t in enumerate(batch_tasks, 1):
        print(f"\n[{i}/{total}] Starting: {t['filename']} ({t['subfolder']})...")
        t_start = time.time()
        try:
            generate_and_save(
                prompt=t["prompt"],
                out_subfolder=t["subfolder"],
                filename=t["filename"],
                negative_prompt=t["negative_prompt"],
                width=t["width"],
                height=t["height"],
                steps=t["steps"],
                make_transparent=t["make_transparent"]
            )
            elapsed = time.time() - t_start
            print(f"--> [{i}/{total}] Completed {t['filename']} in {elapsed:.1f}s!")
        except Exception as e:
            print(f"--> [{i}/{total}] FAILED {t['filename']}: {e}")

    total_elapsed = time.time() - start_total
    print(f"\n==================================================")
    print(f"   ALL {total} LOCAL ASSETS COMPLETED IN {total_elapsed/60:.2f} MINUTES!")
    print(f"==================================================")

if __name__ == "__main__":
    main()
