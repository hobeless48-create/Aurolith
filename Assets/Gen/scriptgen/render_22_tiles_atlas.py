import os
import math
from PIL import Image, ImageDraw, ImageFont

TILES_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Tiles"
STRUCT_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Structures"
OUT_PATH = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Showcases\all_22_tiles_showcase.png"

tiles_catalog = [
    # Group 1: Field
    {"name": "1. Open Grass", "group": "Field", "path": os.path.join(TILES_DIR, "1_Field", "field_grass.jpg"), "is_prop": False},
    {"name": "2. Paved Dirt Path", "group": "Field", "path": os.path.join(TILES_DIR, "1_Field", "field_dirtpath.jpg"), "is_prop": False},
    {"name": "3. Tall Steppes Brush", "group": "Field", "path": os.path.join(TILES_DIR, "1_Field", "prop_tall_brush.png"), "is_prop": True, "base": "field_grass.jpg"},
    {"name": "4. Low Stone Fence", "group": "Field", "path": os.path.join(TILES_DIR, "1_Field", "prop_stone_fence.png"), "is_prop": True, "base": "field_grass.jpg"},
    {"name": "5. Solitary Tree", "group": "Field", "path": os.path.join(TILES_DIR, "1_Field", "prop_field_tree.png"), "is_prop": True, "base": "field_grass.jpg"},
    {"name": "6. Craggy Boulders", "group": "Field", "path": os.path.join(TILES_DIR, "1_Field", "prop_craggy_boulders.png"), "is_prop": True, "base": "field_grass.jpg"},
    
    # Group 2: Jungle
    {"name": "7. Jungle Moss Floor", "group": "Jungle", "path": os.path.join(TILES_DIR, "2_Jungle", "jungle_floor.jpg"), "is_prop": False},
    {"name": "8. Canopy Trees", "group": "Jungle", "path": os.path.join(TILES_DIR, "2_Jungle", "prop_jungle_canopy.png"), "is_prop": True, "base": "jungle_floor.jpg"},
    {"name": "9. Fern Thicket", "group": "Jungle", "path": os.path.join(TILES_DIR, "2_Jungle", "prop_fern_thicket.png"), "is_prop": True, "base": "jungle_floor.jpg"},
    {"name": "10. Shallow River Ford", "group": "Jungle", "path": os.path.join(TILES_DIR, "2_Jungle", "river_shallow.jpg"), "is_prop": False},
    {"name": "11. Deep River Chasm", "group": "Jungle", "path": os.path.join(TILES_DIR, "2_Jungle", "river_deep_chasm.jpg"), "is_prop": False},
    
    # Group 3: Boss Sanctuaries
    {"name": "12. Beast Den Nest", "group": "Neutral Boss", "path": os.path.join(TILES_DIR, "2_Jungle", "boss_beast_den.png"), "is_prop": True, "base": "jungle_floor.jpg"},
    {"name": "13. Tuskgod Stone Pit", "group": "Neutral Boss", "path": os.path.join(TILES_DIR, "2_Jungle", "boss_tuskgod_pit.png"), "is_prop": True, "base": "jungle_floor.jpg"},
    {"name": "14. Emperor Altar", "group": "Neutral Boss", "path": os.path.join(STRUCT_DIR, "boss_emperor_altar.png"), "is_prop": True, "base": "field_grass.jpg"},
    
    # Group 4: Fortress Base
    {"name": "15. Suncrest Marble", "group": "Base", "path": os.path.join(TILES_DIR, "3_Base", "courtyard_marble.jpg"), "is_prop": False},
    {"name": "16. Courtyard Gravel", "group": "Base", "path": os.path.join(TILES_DIR, "3_Base", "courtyard_gravel.jpg"), "is_prop": False},
    {"name": "17. Wall Ramparts", "group": "Base", "path": os.path.join(TILES_DIR, "3_Base", "castle_wall_rampart.jpg"), "is_prop": False},
    {"name": "18. Castle Portcullis", "group": "Base", "path": os.path.join(STRUCT_DIR, "castle_gate.png"), "is_prop": True, "base": "courtyard_marble.jpg"},
    {"name": "19. Facility Plot Pad", "group": "Base", "path": os.path.join(TILES_DIR, "3_Base", "facility_pad.png"), "is_prop": True, "base": "courtyard_marble.jpg"},
    
    # Group 5: Objectives & Borders
    {"name": "20. Inner Keep Core", "group": "Objectives", "path": os.path.join(STRUCT_DIR, "inner_keep_core.png"), "is_prop": True, "base": "courtyard_marble.jpg"},
    {"name": "21. Perimeter Cliff", "group": "Objectives", "path": os.path.join(TILES_DIR, "3_Base", "perimeter_cliff.jpg"), "is_prop": False},
    {"name": "22. Elevation Stairs", "group": "Objectives", "path": os.path.join(TILES_DIR, "1_Field", "elevation_stairs.png"), "is_prop": True, "base": "field_dirtpath.jpg"}
]

def create_hex_polygon(center_x, center_y, radius):
    points = []
    for i in range(6):
        angle_deg = 60 * i + 30
        angle_rad = math.radians(angle_deg)
        x = center_x + radius * math.cos(angle_rad)
        y = center_y + radius * math.sin(angle_rad)
        points.append((x, y))
    return points

def render_atlas():
    # 22 tiles in a 6 columns x 4 rows grid
    cols = 6
    rows = 4
    cell_w, cell_h = 240, 260
    
    total_w = cols * cell_w + 80
    total_h = rows * cell_h + 160
    
    canvas = Image.new("RGBA", (total_w, total_h), (13, 15, 20, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Header
    draw.text((40, 30), "AUROLITH MASTER CATALOG: ALL 22 TILES & PROPS", fill=(212, 175, 55, 255))
    draw.text((40, 58), "Full functional 22-tile set synthesized directly from core master assets (World-UV Ground + Transparent Overhang Props)", fill=(180, 180, 190, 255))
    
    # Master base cache
    base_cache = {
        "field_grass.jpg": Image.open(os.path.join(TILES_DIR, "1_Field", "field_grass.jpg")).convert("RGBA").resize((256, 256)),
        "field_dirtpath.jpg": Image.open(os.path.join(TILES_DIR, "1_Field", "field_dirtpath.jpg")).convert("RGBA").resize((256, 256)),
        "courtyard_marble.jpg": Image.open(os.path.join(TILES_DIR, "3_Base", "courtyard_marble.jpg")).convert("RGBA").resize((256, 256)),
        "jungle_floor.jpg": Image.open(os.path.join(TILES_DIR, "2_Jungle", "jungle_floor.jpg")).convert("RGBA").resize((256, 256))
    }
    
    hex_radius = 80
    
    for idx, t in enumerate(tiles_catalog):
        c = idx % cols
        r = idx // cols
        
        cx = 40 + c * cell_w + cell_w // 2
        cy = 110 + r * cell_h + 100
        
        poly = create_hex_polygon(cx, cy, hex_radius)
        mask = Image.new("L", (total_w, total_h), 0)
        ImageDraw.Draw(mask).polygon(poly, fill=255)
        
        # Ground layer
        if not t["is_prop"]:
            img = Image.open(t["path"]).convert("RGBA").resize((int(hex_radius * 2.2), int(hex_radius * 2.2)))
            temp_ground = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
            temp_ground.paste(img, (int(cx - hex_radius * 1.1), int(cy - hex_radius * 1.1)))
            canvas.paste(temp_ground, (0, 0), mask)
        else:
            base_tex = base_cache[t["base"]]
            temp_ground = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
            temp_ground.paste(base_tex, (int(cx - hex_radius * 1.1), int(cy - hex_radius * 1.1)))
            canvas.paste(temp_ground, (0, 0), mask)
            
            # Prop overlay on top (can overhang naturally!)
            prop_img = Image.open(t["path"]).convert("RGBA")
            prop_scaled = prop_img.resize((int(hex_radius * 1.8), int(hex_radius * 1.8)), Image.Resampling.LANCZOS)
            canvas.paste(prop_scaled, (int(cx - prop_scaled.width / 2), int(cy - prop_scaled.height / 2)), prop_scaled)
            
        # Draw elegant golden hairline hex outline
        draw.polygon(poly, outline=(212, 175, 55, 180), width=2)
        
        # Label text
        label_y = cy + hex_radius + 10
        draw.text((cx - 85, label_y), t["name"], fill=(230, 230, 240, 255))
        draw.text((cx - 85, label_y + 18), f"[{t['group']}]", fill=(140, 140, 160, 255))
        
    canvas.save(OUT_PATH)
    print("Saved Master 22-Tile Atlas to:", OUT_PATH)

if __name__ == "__main__":
    render_atlas()
