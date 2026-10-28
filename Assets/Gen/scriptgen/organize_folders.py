import os
import shutil

BASE_TILES = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Tiles"
BASE_UNITS = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Units"

tile_dirs = ["1_Field", "2_Jungle", "3_Base"]
for d in tile_dirs:
    os.makedirs(os.path.join(BASE_TILES, d), exist_ok=True)

unit_dirs = [
    "1_Fighter", "2_Tanker", "3_Mage", "4_Marksman",
    "5_Support", "6_Siege", "7_Artisan", "8_Assassin"
]
for d in unit_dirs:
    os.makedirs(os.path.join(BASE_UNITS, d), exist_ok=True)

def safe_move(src, dst):
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"Moved: {os.path.basename(src)} -> {dst}")

# Move Field tiles
safe_move(os.path.join(BASE_TILES, "hex_grass.jpg"), os.path.join(BASE_TILES, "1_Field", "hex_grass.jpg"))
safe_move(os.path.join(BASE_TILES, "local_hex_grass.png"), os.path.join(BASE_TILES, "1_Field", "local_hex_grass.png"))
safe_move(os.path.join(BASE_TILES, "hex_dirtpath.jpg"), os.path.join(BASE_TILES, "1_Field", "hex_dirtpath.jpg"))
safe_move(os.path.join(BASE_TILES, "local_hex_dirtpath.png"), os.path.join(BASE_TILES, "1_Field", "local_hex_dirtpath.png"))

# Move Base tiles
safe_move(os.path.join(BASE_TILES, "hex_marble.jpg"), os.path.join(BASE_TILES, "3_Base", "hex_marble.jpg"))

# Move Fighter units
safe_move(os.path.join(BASE_UNITS, "fighter_marrow_transparent.png"), os.path.join(BASE_UNITS, "1_Fighter", "fighter_marrow_transparent.png"))
safe_move(os.path.join(BASE_UNITS, "local_fighter_marrow.png"), os.path.join(BASE_UNITS, "1_Fighter", "local_fighter_marrow.png"))

print("All asset directories organized successfully!")
