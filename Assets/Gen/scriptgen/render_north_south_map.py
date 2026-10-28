import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ASSETS_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets"
TILES_DIR = os.path.join(ASSETS_DIR, "Tiles")
STRUCT_DIR = os.path.join(ASSETS_DIR, "Structures")
SHOWCASE_DIR = os.path.join(ASSETS_DIR, "Showcases")

OUT_MAP = os.path.join(SHOWCASE_DIR, "overall_map_north_south_tactical.png")

# Load master textures
tex_grass = Image.open(os.path.join(TILES_DIR, "1_Field", "field_grass.jpg")).convert("RGBA").resize((256, 256))
tex_dirt = Image.open(os.path.join(TILES_DIR, "1_Field", "field_dirtpath.jpg")).convert("RGBA").resize((256, 256))
tex_marble = Image.open(os.path.join(TILES_DIR, "3_Base", "courtyard_marble.jpg")).convert("RGBA").resize((256, 256))
tex_gravel = Image.open(os.path.join(TILES_DIR, "3_Base", "courtyard_gravel.jpg")).convert("RGBA").resize((256, 256))
tex_rampart = Image.open(os.path.join(TILES_DIR, "3_Base", "castle_wall_rampart.jpg")).convert("RGBA").resize((256, 256))
tex_jungle = Image.open(os.path.join(TILES_DIR, "2_Jungle", "jungle_floor.jpg")).convert("RGBA").resize((256, 256))
tex_river = Image.open(os.path.join(TILES_DIR, "2_Jungle", "river_shallow.jpg")).convert("RGBA").resize((256, 256))
tex_cliff = Image.open(os.path.join(TILES_DIR, "3_Base", "perimeter_cliff.jpg")).convert("RGBA").resize((256, 256))

# Load sprites
prop_tree = Image.open(os.path.join(TILES_DIR, "1_Field", "prop_field_tree.png")).convert("RGBA")
prop_canopy = Image.open(os.path.join(TILES_DIR, "2_Jungle", "prop_jungle_canopy.png")).convert("RGBA")
prop_brush = Image.open(os.path.join(TILES_DIR, "1_Field", "prop_tall_brush.png")).convert("RGBA")
prop_boulders = Image.open(os.path.join(TILES_DIR, "1_Field", "prop_craggy_boulders.png")).convert("RGBA")
prop_beast_den = Image.open(os.path.join(TILES_DIR, "2_Jungle", "boss_beast_den.png")).convert("RGBA")
prop_tuskgod = Image.open(os.path.join(TILES_DIR, "2_Jungle", "boss_tuskgod_pit.png")).convert("RGBA")
prop_facility = Image.open(os.path.join(TILES_DIR, "3_Base", "facility_pad.png")).convert("RGBA")
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

def render_north_south_map():
    W, H = 1800, 1080
    map_img = Image.new("RGBA", (W, H), (10, 12, 16, 255))
    
    # 1. Base Zonal Grounds
    # West Jungle (x = 0 to 450)
    tile_rect(map_img, tex_jungle, (0, 0, 450, H))
    
    # Central Field (x = 450 to 1350)
    tile_rect(map_img, tex_grass, (450, 0, 1350, H))
    
    # East Jungle (x = 1350 to 1800)
    tile_rect(map_img, tex_jungle, (1350, 0, 1800, H))
    
    # 2. Top Fortress: Player 1 (North: y = 0 to 220, x = 450 to 1350)
    # Inner Courtyard Marble (y = 40 to 120, x = 550 to 1250)
    tile_rect(map_img, tex_marble, (550, 40, 1250, 120))
    # Outer Courtyard Gravel (y = 120 to 195, x = 500 to 1300)
    tile_rect(map_img, tex_gravel, (500, 120, 1300, 195))
    # Outer Wall Ramparts (y = 195 to 225, x = 480 to 1320)
    tile_rect(map_img, tex_rampart, (480, 195, 1320, 225))
    
    # 3. Bottom Fortress: Player 2 (South: y = 860 to 1080, x = 450 to 1350)
    # Outer Wall Ramparts (y = 855 to 885, x = 480 to 1320)
    tile_rect(map_img, tex_rampart, (480, 855, 1320, 885))
    # Outer Courtyard Gravel (y = 885 to 960, x = 500 to 1300)
    tile_rect(map_img, tex_gravel, (500, 885, 1300, 960))
    # Inner Courtyard Marble (y = 960 to 1040, x = 550 to 1250)
    tile_rect(map_img, tex_marble, (550, 960, 1250, 1040))
    
    # 4. Central Grand King's Highway (+10% Move Speed Road)
    # Direct North-to-South spine running between gates
    # We draw an organic curving road with dirt texture
    road_mask = Image.new("L", (W, H), 0)
    rm_draw = ImageDraw.Draw(road_mask)
    
    # Main North-South Highway centerline points with gentle organic bend
    road_points = [
        (900, 220),
        (900, 320),
        (940, 420),
        (900, 540), # Center Altar Plaza
        (860, 660),
        (900, 760),
        (900, 860)
    ]
    rm_draw.line(road_points, fill=255, width=95)
    # Lateral Cross-paths into West and East Jungles
    rm_draw.line([(220, 540), (1580, 540)], fill=255, width=65)
    # Top Jungle connect paths
    rm_draw.line([(280, 300), (900, 320), (1520, 300)], fill=255, width=45)
    # Bottom Jungle connect paths
    rm_draw.line([(280, 780), (900, 760), (1520, 780)], fill=255, width=45)
    
    road_mask = road_mask.filter(ImageFilter.GaussianBlur(3))
    
    world_dirt = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tile_rect(world_dirt, tex_dirt, (0, 0, W, H))
    map_img.paste(world_dirt, (0, 0), road_mask)
    
    # 5. Perimeter Cliff Borders
    tile_rect(map_img, tex_cliff, (0, 0, W, 40))          # North Border
    tile_rect(map_img, tex_cliff, (0, H - 40, W, H))      # South Border
    tile_rect(map_img, tex_cliff, (0, 0, 40, H))          # West Border
    tile_rect(map_img, tex_cliff, (W - 40, 0, W, H))      # East Border
    
    # 6. Structures & Objective Placement
    # Top Player 1 Core Keep (x = 900, y = 80)
    c1 = struct_core.resize((90, 90))
    map_img.paste(c1, (900 - 45, 80 - 45), c1)
    
    # Bottom Player 2 Core Keep (x = 900, y = 1000)
    map_img.paste(c1, (900 - 45, 1000 - 45), c1)
    
    # Facility Plots in P1 & P2 Courtyards
    fac = prop_facility.resize((65, 65))
    map_img.paste(fac, (700, 60), fac)
    map_img.paste(fac, (1035, 60), fac)
    map_img.paste(fac, (700, 960), fac)
    map_img.paste(fac, (1035, 960), fac)
    
    # Fortified Gates
    gate_horiz = struct_gate.resize((70, 45))
    map_img.paste(gate_horiz, (900 - 35, 190), gate_horiz)  # P1 Main Gate
    map_img.paste(gate_horiz, (900 - 35, 845), gate_horiz)  # P2 Main Gate
    
    # Secondary Flank Gates
    map_img.paste(gate_horiz, (620 - 35, 190), gate_horiz)  # P1 West Gate
    map_img.paste(gate_horiz, (1180 - 35, 190), gate_horiz) # P1 East Gate
    map_img.paste(gate_horiz, (620 - 35, 845), gate_horiz)  # P2 West Gate
    map_img.paste(gate_horiz, (1180 - 35, 845), gate_horiz) # P2 East Gate
    
    # Dead Center: 12:00 Ancient Emperor Altar (x = 900, y = 540)
    altar = struct_altar.resize((140, 140))
    map_img.paste(altar, (900 - 70, 540 - 70), altar)
    
    # West Jungle: 2:00 Tuskgod Elite Boss Arena (x = 220, y = 540)
    tg = prop_tuskgod.resize((120, 120))
    map_img.paste(tg, (220 - 60, 540 - 60), tg)
    
    # East Jungle: 8:00 Stormwing Boss Arena (x = 1580, y = 540)
    map_img.paste(tg, (1580 - 60, 540 - 60), tg)
    
    # Creep Dens in Jungles
    bd = prop_beast_den.resize((85, 85))
    map_img.paste(bd, (140, 220), bd)
    map_img.paste(bd, (320, 360), bd)
    map_img.paste(bd, (140, 840), bd)
    map_img.paste(bd, (320, 700), bd)
    
    map_img.paste(bd, (1660, 220), bd)
    map_img.paste(bd, (1480, 360), bd)
    map_img.paste(bd, (1660, 840), bd)
    map_img.paste(bd, (1480, 700), bd)
    
    # Jungle Canopy Trees
    j_tree = prop_canopy.resize((75, 75))
    random.seed(999)
    for _ in range(45):
        jx = random.randint(45, 410)
        jy = random.randint(45, H - 120)
        if not (160 < jx < 280 and 480 < jy < 600): # preserve boss pit
            map_img.paste(j_tree, (jx, jy), j_tree)
            
    for _ in range(45):
        jx = random.randint(1370, 1720)
        jy = random.randint(45, H - 120)
        if not (1520 < jx < 1640 and 480 < jy < 600):
            map_img.paste(j_tree, (jx, jy), j_tree)
            
    # Field Obstacles (Steppes Brush, Boulders, Solitary Trees)
    f_tree = prop_tree.resize((70, 70))
    f_boulder = prop_boulders.resize((70, 70))
    f_brush = prop_brush.resize((70, 70))
    
    # Ambush brush placed right along highway bends!
    map_img.paste(f_brush, (830, 410), f_brush)
    map_img.paste(f_brush, (980, 650), f_brush)
    map_img.paste(f_brush, (760, 520), f_brush)
    map_img.paste(f_brush, (1040, 520), f_brush)
    
    # Boulders and solitary trees in open meadows
    for _ in range(12):
        fx = random.randint(520, 1280)
        fy = random.randint(250, 820)
        if not (830 < fx < 970): # keep road clear
            item = random.choice([f_tree, f_boulder])
            map_img.paste(item, (fx, fy), item)
            
    # 7. Tactical Annotations & Callouts
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    
    # Zone Vertical Dividing Lines
    d.line([(450, 0), (450, H)], fill=(0, 168, 107, 180), width=3)
    d.line([(1350, 0), (1350, H)], fill=(0, 168, 107, 180), width=3)
    
    # Tactical Arrows along Central Highway (Clash Vector)
    d.polygon([(900, 360), (885, 335), (915, 335)], fill=(0, 229, 255, 220)) # P1 March South
    d.polygon([(900, 720), (885, 745), (915, 745)], fill=(255, 68, 68, 220))  # P2 March North
    
    # Flank Invasion Dotted Lines
    d.line([(450, 540), (220, 540)], fill=(212, 175, 55, 200), width=2)
    d.line([(1350, 540), (1580, 540)], fill=(212, 175, 55, 200), width=2)
    
    # Labels
    # Top P1 Base
    d.rectangle([700, 10, 1100, 42], fill=(15, 20, 25, 240), outline=(0, 229, 255, 255), width=2)
    d.text((740, 18), "NORTH ANCHOR: PLAYER 1 IMPERIAL CASTLE", fill=(0, 229, 255, 255))
    
    # Bottom P2 Base
    d.rectangle([700, H - 42, 1100, H - 10], fill=(15, 20, 25, 240), outline=(255, 68, 68, 255), width=2)
    d.text((740, H - 34), "SOUTH ANCHOR: PLAYER 2 IMPERIAL CASTLE", fill=(255, 100, 100, 255))
    
    # West Jungle
    d.rectangle([60, 50, 390, 100], fill=(15, 20, 25, 240), outline=(0, 168, 107, 255), width=2)
    d.text((80, 60), "WEST JUNGLE (Creep Farming / Flank)", fill=(0, 230, 130, 255))
    d.text((80, 78), "Neutral Beast Dens • 2:00 Tuskgod Boss Pit", fill=(180, 180, 190, 255))
    
    # East Jungle
    d.rectangle([1410, 50, 1740, 100], fill=(15, 20, 25, 240), outline=(0, 168, 107, 255), width=2)
    d.text((1430, 60), "EAST JUNGLE (Creep Farming / Gank)", fill=(0, 230, 130, 255))
    d.text((1430, 78), "Neutral Beast Dens • 8:00 Stormwing Boss Pit", fill=(180, 180, 190, 255))
    
    # Center Highway Callout
    d.rectangle([650, 480, 1150, 515], fill=(15, 20, 25, 240), outline=(212, 175, 55, 255), width=2)
    d.text((670, 490), "CENTRAL KING'S HIGHWAY (+10% Move Speed) — PRIMARY CLASH SPINE", fill=(255, 215, 0, 255))
    
    # Emperor Altar Callout
    d.rectangle([780, 610, 1020, 642], fill=(15, 20, 25, 240), outline=(255, 215, 0, 255), width=2)
    d.text((800, 620), "12:00 ANCIENT EMPEROR ALTAR", fill=(255, 215, 0, 255))
    
    final_map = Image.alpha_composite(map_img, overlay)
    final_map.save(OUT_MAP, "PNG")
    print("Saved North-South Tactical Map to:", OUT_MAP)

if __name__ == "__main__":
    render_north_south_map()
