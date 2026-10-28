import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ASSETS_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets"
TILES_DIR = os.path.join(ASSETS_DIR, "Tiles")
STRUCT_DIR = os.path.join(ASSETS_DIR, "Structures")
SHOWCASE_DIR = os.path.join(ASSETS_DIR, "Showcases")

OUT_MAP = os.path.join(SHOWCASE_DIR, "overall_map_tactical_layout.png")

# Load base textures
tex_grass = Image.open(os.path.join(TILES_DIR, "1_Field", "field_grass.jpg")).convert("RGBA").resize((256, 256))
tex_dirt = Image.open(os.path.join(TILES_DIR, "1_Field", "field_dirtpath.jpg")).convert("RGBA").resize((256, 256))
tex_marble = Image.open(os.path.join(TILES_DIR, "3_Base", "courtyard_marble.jpg")).convert("RGBA").resize((256, 256))
tex_gravel = Image.open(os.path.join(TILES_DIR, "3_Base", "courtyard_gravel.jpg")).convert("RGBA").resize((256, 256))
tex_rampart = Image.open(os.path.join(TILES_DIR, "3_Base", "castle_wall_rampart.jpg")).convert("RGBA").resize((256, 256))
tex_jungle = Image.open(os.path.join(TILES_DIR, "2_Jungle", "jungle_floor.jpg")).convert("RGBA").resize((256, 256))
tex_river = Image.open(os.path.join(TILES_DIR, "2_Jungle", "river_shallow.jpg")).convert("RGBA").resize((256, 256))
tex_cliff = Image.open(os.path.join(TILES_DIR, "3_Base", "perimeter_cliff.jpg")).convert("RGBA").resize((256, 256))

# Load structure & prop sprites
prop_tree = Image.open(os.path.join(TILES_DIR, "1_Field", "prop_field_tree.png")).convert("RGBA")
prop_canopy = Image.open(os.path.join(TILES_DIR, "2_Jungle", "prop_jungle_canopy.png")).convert("RGBA")
prop_brush = Image.open(os.path.join(TILES_DIR, "1_Field", "prop_tall_brush.png")).convert("RGBA")
prop_boulders = Image.open(os.path.join(TILES_DIR, "1_Field", "prop_craggy_boulders.png")).convert("RGBA")
prop_beast_den = Image.open(os.path.join(TILES_DIR, "2_Jungle", "boss_beast_den.png")).convert("RGBA")
prop_tuskgod = Image.open(os.path.join(TILES_DIR, "2_Jungle", "boss_tuskgod_pit.png")).convert("RGBA")
struct_altar = Image.open(os.path.join(STRUCT_DIR, "boss_emperor_altar.png")).convert("RGBA")
struct_core = Image.open(os.path.join(STRUCT_DIR, "inner_keep_core.png")).convert("RGBA")
struct_gate = Image.open(os.path.join(STRUCT_DIR, "castle_gate.png")).convert("RGBA")

def tile_rect(dest, src_tex, rect):
    x1, y1, x2, y2 = rect
    tw, th = src_tex.size
    for x in range(x1, x2, tw):
        for y in range(y1, y2, th):
            w = min(tw, x2 - x)
            h = min(th, y2 - y)
            dest.paste(src_tex.crop((0, 0, w, h)), (x, y))

def render_map():
    # Map Dimensions: 1800 x 1080 (Aspect ratio 150:90 = 5:3)
    W, H = 1800, 1080
    map_img = Image.new("RGBA", (W, H), (10, 12, 16, 255))
    
    # 1. Base Zonal Tiles (West to East)
    # Zone 1: Jungle A (0 to 360 px -> c: 0-29)
    tile_rect(map_img, tex_jungle, (0, 0, 360, H))
    
    # Zone 2: Battlefield (360 to 1440 px -> c: 30-119)
    tile_rect(map_img, tex_grass, (360, 0, 1440, H))
    
    # Zone 3: Jungle B (1440 to 1800 px -> c: 120-149)
    tile_rect(map_img, tex_jungle, (1440, 0, 1800, H))
    
    # 2. Player 1 Fortress (West: x = 360 to 580)
    # Outer Courtyard Gravel (x = 440 to 560)
    tile_rect(map_img, tex_gravel, (440, 240, 560, H - 240))
    # Inner Courtyard Marble (x = 370 to 440)
    tile_rect(map_img, tex_marble, (370, 300, 440, H - 300))
    # Outer Wall Battlement Line (x = 560 to 585)
    tile_rect(map_img, tex_rampart, (560, 220, 585, H - 220))
    
    # 3. Player 2 Fortress (East: x = 1220 to 1440)
    # Outer Wall Battlement Line (x = 1215 to 1240)
    tile_rect(map_img, tex_rampart, (1215, 220, 1240, H - 220))
    # Outer Courtyard Gravel (x = 1240 to 1360)
    tile_rect(map_img, tex_gravel, (1240, 240, 1360, H - 240))
    # Inner Courtyard Marble (x = 1360 to 1430)
    tile_rect(map_img, tex_marble, (1360, 300, 1430, H - 300))
    
    # 4. Central Lanes (Dirt Highways: Top, Mid, Bot)
    # Mid Lane (Straight horizontal highway: y = 510 to 570)
    tile_rect(map_img, tex_dirt, (585, 510, 1215, 570))
    # Top Lane (Diagonal/Arced road)
    d_draw = ImageDraw.Draw(map_img)
    tile_rect(map_img, tex_dirt, (585, 180, 1215, 240))
    # Bot Lane
    tile_rect(map_img, tex_dirt, (585, 840, 1215, 900))
    # Cross connector roads
    tile_rect(map_img, tex_dirt, (750, 240, 800, 840))
    tile_rect(map_img, tex_dirt, (1000, 240, 1050, 840))
    
    # 5. Central River Divider (c: 74-75 -> x = 880 to 920)
    tile_rect(map_img, tex_river, (885, 0, 915, H))
    # River Fords (Dirt bridges crossing river at Top, Mid, Bot lanes)
    tile_rect(map_img, tex_dirt, (875, 180, 925, 240))
    tile_rect(map_img, tex_dirt, (875, 510, 925, 570))
    tile_rect(map_img, tex_dirt, (875, 840, 925, 900))
    
    # 6. Map Perimeter Mountains
    tile_rect(map_img, tex_cliff, (0, 0, W, 40))          # North Border
    tile_rect(map_img, tex_cliff, (0, H - 40, W, H))      # South Border
    tile_rect(map_img, tex_cliff, (0, 0, 40, H))          # West Border
    tile_rect(map_img, tex_cliff, (W - 40, 0, W, H))      # East Border
    
    # 7. Scatter Props & Objectives
    # Cores
    c1 = struct_core.resize((90, 90))
    map_img.paste(c1, (390, 540 - 45), c1) # P1 Core Keep
    map_img.paste(c1, (1320, 540 - 45), c1) # P2 Core Keep
    
    # Gates in Walls
    g = struct_gate.resize((45, 60))
    map_img.paste(g, (550, 510), g) # P1 Mid Gate
    map_img.paste(g, (550, 210), g) # P1 Top Gate
    map_img.paste(g, (550, 810), g) # P1 Bot Gate
    map_img.paste(g, (1205, 510), g) # P2 Mid Gate
    map_img.paste(g, (1205, 210), g) # P2 Top Gate
    map_img.paste(g, (1205, 810), g) # P2 Bot Gate
    
    # Ancient Emperor Altar (Board Center: 900, 540)
    altar = struct_altar.resize((120, 120))
    map_img.paste(altar, (900 - 60, 540 - 60), altar)
    
    # Tuskgod Boss Pit (Jungle A & B)
    tg = prop_tuskgod.resize((100, 100))
    map_img.paste(tg, (180 - 50, 320 - 50), tg)
    map_img.paste(tg, (1620 - 50, 760 - 50), tg)
    
    # Beast Creep Dens
    bd = prop_beast_den.resize((80, 80))
    map_img.paste(bd, (150, 700), bd)
    map_img.paste(bd, (230, 160), bd)
    map_img.paste(bd, (1580, 160), bd)
    map_img.paste(bd, (1650, 480), bd)
    
    # Jungle Canopy Trees & Ferns
    j_tree = prop_canopy.resize((70, 70))
    random.seed(123)
    for _ in range(35):
        jx = random.randint(45, 300)
        jy = random.randint(45, H - 110)
        map_img.paste(j_tree, (jx, jy), j_tree)
    for _ in range(35):
        jx = random.randint(1445, 1720)
        jy = random.randint(45, H - 110)
        map_img.paste(j_tree, (jx, jy), j_tree)
        
    # Field Trees, Boulders & Brush
    f_tree = prop_tree.resize((65, 65))
    f_boulder = prop_boulders.resize((65, 65))
    f_brush = prop_brush.resize((65, 65))
    for _ in range(16):
        fx = random.randint(620, 1160)
        fy = random.randint(70, H - 140)
        # Avoid roads
        if not (160 < fy < 260 or 490 < fy < 590 or 820 < fy < 920):
            item = random.choice([f_tree, f_boulder, f_brush])
            map_img.paste(item, (fx, fy), item)
            
    # 8. Tactical Annotations, Overlay & Labels
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Zone Dividing Dotted Lines
    d.line([(360, 0), (360, H)], fill=(212, 175, 55, 180), width=3)
    d.line([(1440, 0), (1440, H)], fill=(212, 175, 55, 180), width=3)
    d.line([(900, 0), (900, H)], fill=(0, 229, 255, 160), width=2)
    
    # Zone Labels (Top Header Banners)
    d.rectangle([50, 45, 350, 95], fill=(15, 20, 25, 230), outline=(0, 168, 107, 255), width=2)
    d.text((70, 55), "JUNGLE ZONE A (30x90)", fill=(0, 230, 130, 255))
    d.text((70, 73), "Creep Camps • Tuskgod • 50% Canopy LoS", fill=(180, 180, 190, 255))
    
    d.rectangle([680, 45, 1120, 95], fill=(15, 20, 25, 230), outline=(212, 175, 55, 255), width=2)
    d.text((740, 55), "SHARED BATTLEFIELD (90x90 HEXES)", fill=(255, 215, 0, 255))
    d.text((740, 73), "Top / Mid / Bot Dirt Highways (+10% Move) • River Fords", fill=(200, 200, 210, 255))
    
    d.rectangle([1450, 45, 1750, 95], fill=(15, 20, 25, 230), outline=(0, 168, 107, 255), width=2)
    d.text((1470, 55), "JUNGLE ZONE B (30x90)", fill=(0, 230, 130, 255))
    d.text((1470, 73), "Creep Camps • Flank Gank Routes", fill=(180, 180, 190, 255))
    
    # Anchor Labels
    d.rectangle([370, 600, 530, 640], fill=(15, 20, 25, 220), outline=(0, 229, 255, 255), width=2)
    d.text((385, 612), "PLAYER 1 FORTRESS", fill=(0, 229, 255, 255))
    
    d.rectangle([1270, 600, 1430, 640], fill=(15, 20, 25, 220), outline=(255, 68, 68, 255), width=2)
    d.text((1285, 612), "PLAYER 2 FORTRESS", fill=(255, 100, 100, 255))
    
    # Objective Callout: Emperor Altar
    d.rectangle([800, 430, 1000, 470], fill=(15, 20, 25, 220), outline=(255, 215, 0, 255), width=2)
    d.text((820, 442), "12:00 ANCIENT EMPEROR", fill=(255, 215, 0, 255))
    
    # Coordinate Ruler
    d.text((60, H - 35), "c: 0 (West)", fill=(200, 200, 200, 255))
    d.text((365, H - 35), "c: 30", fill=(200, 200, 200, 255))
    d.text((885, H - 35), "c: 75 (Midline)", fill=(0, 229, 255, 255))
    d.text((1420, H - 35), "c: 120", fill=(200, 200, 200, 255))
    d.text((1700, H - 35), "c: 149 (East)", fill=(200, 200, 200, 255))
    
    # Final Composite
    final_map = Image.alpha_composite(map_img, overlay)
    final_map.save(OUT_MAP, "PNG")
    print("Saved overall tactical map to:", OUT_MAP)

if __name__ == "__main__":
    render_map()
