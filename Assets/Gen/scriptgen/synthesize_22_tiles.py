import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

TILES_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Tiles"
STRUCT_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Structures"
SHOWCASE_DIR = r"C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Showcases"

os.makedirs(os.path.join(TILES_DIR, "1_Field"), exist_ok=True)
os.makedirs(os.path.join(TILES_DIR, "2_Jungle"), exist_ok=True)
os.makedirs(os.path.join(TILES_DIR, "3_Base"), exist_ok=True)
os.makedirs(STRUCT_DIR, exist_ok=True)
os.makedirs(SHOWCASE_DIR, exist_ok=True)

# Master textures
TEX_GRASS_PATH = os.path.join(TILES_DIR, "1_Field", "field_grass.jpg")
TEX_DIRT_PATH = os.path.join(TILES_DIR, "1_Field", "field_dirtpath.jpg")
TEX_MARBLE_PATH = os.path.join(TILES_DIR, "3_Base", "courtyard_marble.jpg")
TEX_RAMPART_PATH = os.path.join(TILES_DIR, "3_Base", "castle_wall_rampart.jpg")

tex_grass = Image.open(TEX_GRASS_PATH).convert("RGBA").resize((512, 512))
tex_dirt = Image.open(TEX_DIRT_PATH).convert("RGBA").resize((512, 512))
tex_marble = Image.open(TEX_MARBLE_PATH).convert("RGBA").resize((512, 512))
tex_rampart = Image.open(TEX_RAMPART_PATH).convert("RGBA").resize((512, 512))

print("Master textures loaded successfully.")

# -------------------------------------------------------------
# 1. BASE GROUND TEXTURES
# -------------------------------------------------------------

def synthesize_jungle_floor():
    # Jungle Floor (Moss & Roots): Deep emerald #00A86B, dark shadowed soil, twisting roots
    img = tex_grass.copy()
    np_img = np.array(img, dtype=np.float32)
    # Tone down red, boost green, darken shadows
    np_img[:, :, 0] *= 0.35 # Red
    np_img[:, :, 1] *= 0.85 # Green
    np_img[:, :, 2] *= 0.45 # Blue
    jungle_base = Image.fromarray(np.clip(np_img, 0, 255).astype(np.uint8))
    
    # Overlay twisting root patterns
    overlay = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    random.seed(42)
    for _ in range(8):
        points = []
        x = random.randint(0, 512)
        y = random.randint(0, 512)
        for _ in range(6):
            points.append((x, y))
            x += random.randint(-80, 80)
            y += random.randint(-80, 80)
        d.line(points, fill=(120, 75, 30, 180), width=random.randint(6, 14))
        d.line(points, fill=(180, 120, 50, 100), width=random.randint(2, 5))
    overlay = overlay.filter(ImageFilter.GaussianBlur(2))
    
    jungle_floor = Image.alpha_composite(jungle_base, overlay)
    out_path = os.path.join(TILES_DIR, "2_Jungle", "jungle_floor.jpg")
    jungle_floor.convert("RGB").save(out_path, quality=95)
    print("Saved:", out_path)
    return jungle_floor

def synthesize_shallow_stream():
    # Shallow Stream / River Ford: Pebble riverbed + crystal clear cyan water caustics
    base = tex_dirt.copy()
    np_dirt = np.array(base, dtype=np.float32)
    # Tint dirt cooler (submerged)
    np_dirt[:, :, 0] *= 0.6
    np_dirt[:, :, 1] *= 0.8
    np_dirt[:, :, 2] *= 0.9
    submerged = Image.fromarray(np.clip(np_dirt, 0, 255).astype(np.uint8))
    
    # Generate animated-style water caustic layer
    caustic = Image.new("RGBA", (512, 512), (0, 180, 220, 120))
    c_draw = ImageDraw.Draw(caustic)
    random.seed(101)
    for _ in range(60):
        x1 = random.randint(0, 512)
        y1 = random.randint(0, 512)
        r = random.randint(15, 45)
        c_draw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], outline=(200, 245, 255, 70), width=3)
    caustic = caustic.filter(ImageFilter.GaussianBlur(3))
    
    stream = Image.alpha_composite(submerged, caustic)
    out_path = os.path.join(TILES_DIR, "2_Jungle", "river_shallow.jpg")
    stream.convert("RGB").save(out_path, quality=95)
    print("Saved:", out_path)
    return stream

def synthesize_deep_chasm():
    # Deep River Channel / Chasm: Dark indigo/obsidian depths with rushing water edges
    chasm = Image.new("RGBA", (512, 512), (10, 15, 25, 255))
    d = ImageDraw.Draw(chasm)
    # Layered rushing deep blue waves
    for y in range(0, 512, 12):
        d.line([(0, y), (512, y)], fill=(20, 50, 90, 180), width=6)
        d.line([(0, y + 4), (512, y + 4)], fill=(10, 25, 50, 200), width=4)
    # Foam highlights
    random.seed(88)
    for _ in range(50):
        fx = random.randint(0, 512)
        fy = random.randint(0, 512)
        d.ellipse([fx, fy, fx + random.randint(10, 30), fy + 4], fill=(220, 240, 255, 140))
    chasm = chasm.filter(ImageFilter.GaussianBlur(2))
    
    out_path = os.path.join(TILES_DIR, "2_Jungle", "river_deep_chasm.jpg")
    chasm.convert("RGB").save(out_path, quality=95)
    print("Saved:", out_path)
    return chasm

def synthesize_courtyard_gravel():
    # Outer Courtyard Packed Gravel: Clean imperial military staging ground (pale limestone gravel)
    base = tex_dirt.copy()
    enh = ImageEnhance.Color(base)
    desat = enh.enhance(0.3) # desaturate dirt
    bright = ImageEnhance.Brightness(desat).enhance(1.25)
    out_path = os.path.join(TILES_DIR, "3_Base", "courtyard_gravel.jpg")
    bright.convert("RGB").save(out_path, quality=95)
    print("Saved:", out_path)
    return bright

def synthesize_perimeter_cliff():
    # Map Perimeter Cliff / Mountain Edge: Rugged impassable stone strata
    base = tex_rampart.copy()
    np_r = np.array(base, dtype=np.float32)
    # Darken and add deep obsidian crevices
    np_r[:, :, 0] *= 0.4
    np_r[:, :, 1] *= 0.45
    np_r[:, :, 2] *= 0.5
    cliff = Image.fromarray(np.clip(np_r, 0, 255).astype(np.uint8))
    cliff = ImageEnhance.Contrast(cliff).enhance(1.6)
    out_path = os.path.join(TILES_DIR, "3_Base", "perimeter_cliff.jpg")
    cliff.convert("RGB").save(out_path, quality=95)
    print("Saved:", out_path)
    return cliff

# -------------------------------------------------------------
# 2. PROPS, OBSTACLES & STRUCTURES (Transparent Cutouts)
# -------------------------------------------------------------

def generate_prop_tree(out_path, is_jungle=False):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    
    # Ground shadow
    shadow = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.ellipse([cx - 160, cy - 130, cx + 180, cy + 170], fill=(0, 0, 0, 110))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    canvas.paste(shadow, (0, 0), shadow)
    
    # Foliage discs
    random.seed(77)
    base_color = (0, 130, 60) if is_jungle else (50, 160, 40)
    for _ in range(45):
        ox = random.randint(-110, 110)
        oy = random.randint(-110, 110)
        r = random.randint(40, 85)
        # Gradient lighting
        shade = random.randint(-30, 40)
        col = (
            max(0, min(255, base_color[0] + shade)),
            max(0, min(255, base_color[1] + shade)),
            max(0, min(255, base_color[2] + shade // 2)),
            245
        )
        d.ellipse([cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r], fill=col)
        
    # Highlights
    for _ in range(15):
        ox = random.randint(-70, 70)
        oy = random.randint(-80, 50)
        r = random.randint(20, 40)
        d.ellipse([cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r], fill=(120, 220, 80, 190))
        
    canvas = canvas.filter(ImageFilter.GaussianBlur(1))
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_prop_brush(out_path, is_jungle=False):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    
    # Shadow
    s_draw = ImageDraw.Draw(canvas)
    s_draw.ellipse([cx - 140, cy - 110, cx + 140, cy + 130], fill=(0, 0, 0, 70))
    
    random.seed(55)
    blade_col = (0, 168, 107) if is_jungle else (190, 170, 60) # Emerald jungle or amber-gold field steppes
    for _ in range(120):
        angle = random.uniform(0, math.pi * 2)
        length = random.uniform(50, 170)
        ex = cx + length * math.cos(angle)
        ey = cy + length * math.sin(angle)
        d.line([(cx + random.randint(-40, 40), cy + random.randint(-40, 40)), (ex, ey)],
               fill=(blade_col[0] + random.randint(-20, 20),
                     blade_col[1] + random.randint(-20, 30),
                     blade_col[2] + random.randint(-15, 15), 230),
               width=random.randint(4, 9))
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_prop_boulders(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    cx, cy = 256, 256
    # Shadow
    d = ImageDraw.Draw(canvas)
    d.ellipse([cx - 150, cy - 100, cx + 170, cy + 140], fill=(0, 0, 0, 110))
    
    # 3 major boulders
    boulders = [
        (cx - 50, cy - 20, 85),
        (cx + 60, cy - 10, 70),
        (cx, cy + 50, 65)
    ]
    for bx, by, r in boulders:
        # Polygons for faceted stone
        pts = []
        for i in range(8):
            ang = i * (math.pi / 4)
            dist = r + random.randint(-15, 15)
            pts.append((bx + dist * math.cos(ang), by + dist * math.sin(ang)))
        d.polygon(pts, fill=(120, 125, 135, 255), outline=(60, 65, 75, 255))
        # Highlight facets
        d.line([pts[0], pts[2], pts[4]], fill=(190, 195, 205, 200), width=3)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_prop_stone_fence(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Cast shadow below
    d.rectangle([cx - 180, cy + 20, cx + 180, cy + 60], fill=(0, 0, 0, 90))
    # Wall blocks
    for i in range(-3, 4):
        bx = cx + i * 50
        by = cy - 20
        d.rectangle([bx - 22, by - 25, bx + 22, by + 25], fill=(200, 195, 185, 255), outline=(100, 95, 85, 255), width=2)
        # Gold cap
        d.rectangle([bx - 22, by - 30, bx + 22, by - 25], fill=(212, 175, 55, 255))
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_beast_den(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Excavated dark dirt circle
    d.ellipse([cx - 150, cy - 150, cx + 150, cy + 150], fill=(70, 45, 25, 180), outline=(130, 80, 40, 220), width=4)
    # Claw scratch marks
    for _ in range(4):
        ox = random.randint(-60, 60)
        oy = random.randint(-60, 60)
        d.line([(cx + ox - 30, cy + oy - 20), (cx + ox + 30, cy + oy + 20)], fill=(30, 15, 10, 220), width=4)
    # Bone scraps (white lines)
    for _ in range(6):
        bx = cx + random.randint(-80, 80)
        by = cy + random.randint(-80, 80)
        d.line([(bx, by), (bx + 15, by + 8)], fill=(240, 240, 230, 240), width=3)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_tuskgod_pit(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Megalithic ring
    d.ellipse([cx - 170, cy - 170, cx + 170, cy + 170], fill=(50, 50, 55, 160), outline=(180, 140, 60, 255), width=6)
    d.ellipse([cx - 120, cy - 120, cx + 120, cy + 120], fill=(30, 30, 35, 190), outline=(212, 175, 55, 200), width=3)
    # Ritual pillars around the perimeter
    for i in range(8):
        ang = i * (math.pi / 4)
        px = cx + 170 * math.cos(ang)
        py = cy + 170 * math.sin(ang)
        d.rectangle([px - 14, py - 14, px + 14, py + 14], fill=(160, 130, 80, 255), outline=(230, 200, 100, 255), width=2)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_emperor_altar(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Grand golden dais
    d.ellipse([cx - 180, cy - 180, cx + 180, cy + 180], fill=(245, 245, 230, 240), outline=(212, 175, 55, 255), width=8)
    d.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], fill=(212, 175, 55, 200), outline=(255, 230, 100, 255), width=4)
    # Sunburst rays in center
    for i in range(12):
        ang = i * (math.pi / 6)
        d.line([(cx, cy), (cx + 90 * math.cos(ang), cy + 90 * math.sin(ang))], fill=(255, 255, 255, 220), width=4)
    d.ellipse([cx - 35, cy - 35, cx + 35, cy + 35], fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=3)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_castle_gate(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Two massive flank towers
    d.rectangle([cx - 180, cy - 80, cx - 110, cy + 80], fill=(230, 225, 215, 255), outline=(180, 140, 50, 255), width=4)
    d.rectangle([cx + 110, cy - 80, cx + 180, cy + 80], fill=(230, 225, 215, 255), outline=(180, 140, 50, 255), width=4)
    # Gate passage floor
    d.rectangle([cx - 110, cy - 40, cx + 110, cy + 40], fill=(50, 50, 60, 240))
    # Iron portcullis bars
    for x in range(cx - 95, cx + 105, 20):
        d.line([(x, cy - 38), (x, cy + 38)], fill=(180, 185, 195, 255), width=5)
    # Golden top lintel arch
    d.rectangle([cx - 120, cy - 70, cx + 120, cy - 40], fill=(212, 175, 55, 255), outline=(255, 230, 100, 255), width=2)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_facility_pad(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Octagonal foundation slab
    pts = []
    r = 160
    for i in range(8):
        ang = i * (math.pi / 4) + math.pi / 8
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    d.polygon(pts, fill=(220, 215, 205, 230), outline=(160, 120, 40, 255), width=5)
    # Construction blueprint grid
    d.line([(cx - 100, cy), (cx + 100, cy)], fill=(0, 229, 255, 180), width=2)
    d.line([(cx, cy - 100), (cx, cy + 100)], fill=(0, 229, 255, 180), width=2)
    d.rectangle([cx - 60, cy - 60, cx + 60, cy + 60], outline=(0, 229, 255, 180), width=2)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_inner_keep_core(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # Grand citadel core keep
    d.ellipse([cx - 190, cy - 190, cx + 190, cy + 190], fill=(235, 230, 220, 255), outline=(212, 175, 55, 255), width=8)
    d.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], fill=(212, 175, 55, 240), outline=(255, 225, 80, 255), width=6)
    # Radiant core gem
    d.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], fill=(0, 229, 255, 255), outline=(255, 255, 255, 255), width=4)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

def generate_elevation_stairs(out_path):
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(canvas)
    cx, cy = 256, 256
    # 7 stone ascending steps
    step_w = 260
    for i in range(7):
        sy = cy - 120 + i * 38
        shade = 170 + i * 12
        d.rectangle([cx - step_w // 2, sy, cx + step_w // 2, sy + 34], fill=(shade, shade - 5, shade - 15, 245), outline=(80, 75, 70, 255), width=2)
        # Gold step edge
        d.line([(cx - step_w // 2, sy), (cx + step_w // 2, sy)], fill=(212, 175, 55, 200), width=3)
    canvas.save(out_path, "PNG")
    print("Saved:", out_path)
    return canvas

# -------------------------------------------------------------
# EXECUTE FULL CATALOG SYNTHESIS
# -------------------------------------------------------------

def main():
    print("=== SYNTHESIZING ALL REMAINING TILES ===")
    
    # 1. Base Grounds
    synthesize_jungle_floor()
    synthesize_shallow_stream()
    synthesize_deep_chasm()
    synthesize_courtyard_gravel()
    synthesize_perimeter_cliff()
    
    # 2. Props & Obstacles - Field
    generate_prop_brush(os.path.join(TILES_DIR, "1_Field", "prop_tall_brush.png"), is_jungle=False)
    generate_prop_stone_fence(os.path.join(TILES_DIR, "1_Field", "prop_stone_fence.png"))
    generate_prop_tree(os.path.join(TILES_DIR, "1_Field", "prop_field_tree.png"), is_jungle=False)
    generate_prop_boulders(os.path.join(TILES_DIR, "1_Field", "prop_craggy_boulders.png"))
    generate_elevation_stairs(os.path.join(TILES_DIR, "1_Field", "elevation_stairs.png"))
    
    # 3. Props & Obstacles - Jungle
    generate_prop_tree(os.path.join(TILES_DIR, "2_Jungle", "prop_jungle_canopy.png"), is_jungle=True)
    generate_prop_brush(os.path.join(TILES_DIR, "2_Jungle", "prop_fern_thicket.png"), is_jungle=True)
    generate_beast_den(os.path.join(TILES_DIR, "2_Jungle", "boss_beast_den.png"))
    generate_tuskgod_pit(os.path.join(TILES_DIR, "2_Jungle", "boss_tuskgod_pit.png"))
    
    # 4. Base & Structures
    generate_facility_pad(os.path.join(TILES_DIR, "3_Base", "facility_pad.png"))
    generate_castle_gate(os.path.join(STRUCT_DIR, "castle_gate.png"))
    generate_emperor_altar(os.path.join(STRUCT_DIR, "boss_emperor_altar.png"))
    generate_inner_keep_core(os.path.join(STRUCT_DIR, "inner_keep_core.png"))
    
    print("\nALL 22 TILES ARE FULLY SYNTHESIZED AND INSTALLED!")

if __name__ == "__main__":
    main()
