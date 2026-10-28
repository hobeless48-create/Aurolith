import sys, os
from PIL import Image
import numpy as np
from collections import deque
import cv2

def edge_connected_cutout(img, tolerance=235):
    """
    Adaptive Boundary-connected BFS floodfill from image borders.
    """
    img = img.convert("RGBA")
    np_img = np.array(img)
    h, w, _ = np_img.shape
    
    # Sample borders
    borders = np.concatenate([
        np_img[:10, :, :3].reshape(-1, 3),
        np_img[-10:, :, :3].reshape(-1, 3),
        np_img[:, :10, :3].reshape(-1, 3),
        np_img[:, -10:, :3].reshape(-1, 3)
    ])
    mean_bg = borders.mean(axis=0)
    brightness = mean_bg.mean()
    
    r, g, b = np_img[:, :, 0], np_img[:, :, 1], np_img[:, :, 2]
    
    if brightness > 128:
        is_bg = (
            ((r >= tolerance) & (g >= tolerance) & (b >= tolerance)) |
            (np.linalg.norm(np_img[:, :, :3] - mean_bg, axis=2) < 40) |
            ((r >= 210) & (g >= 210) & (b >= 210) & (np.abs(r - g) < 20) & (np.abs(r - b) < 20))
        )
    else:
        is_bg = (
            ((r <= 35) & (g <= 35) & (b <= 35)) |
            (np.linalg.norm(np_img[:, :, :3] - mean_bg, axis=2) < 40) |
            ((r <= 45) & (g <= 45) & (b <= 45) & (np.abs(r - g) < 20))
        )
        
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()
    
    for x in range(w):
        if is_bg[0, x] and not visited[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_bg[h - 1, x] and not visited[h - 1, x]:
            queue.append((h - 1, x))
            visited[h - 1, x] = True
            
    for y in range(h):
        if is_bg[y, 0] and not visited[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_bg[y, w - 1] and not visited[y, w - 1]:
            queue.append((y, w - 1))
            visited[y, w - 1] = True
            
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w:
                if not visited[ny, nx] and is_bg[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))
                    
    np_img[visited, 3] = 0
    
    # Island / debris cleanup
    try:
        solid_mask = (np_img[:, :, 3] > 0).astype(np.uint8)
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(solid_mask, connectivity=8)
        if num_labels > 1:
            center_y, center_x = h / 2.0, w / 2.0
            main_labels = set()
            for lbl in range(1, num_labels):
                area = stats[lbl, cv2.CC_STAT_AREA]
                cx, cy = centroids[lbl]
                dist_to_center = ((cx - center_x)**2 + (cy - center_y)**2)**0.5
                if area >= 2500 or (area >= 800 and dist_to_center < 300):
                    main_labels.add(lbl)
            if main_labels:
                remove_mask = np.isin(labels, list(main_labels), invert=True) & (labels > 0)
                np_img[remove_mask, 3] = 0
    except Exception:
        pass
        
    return Image.fromarray(np_img)

def process_sprite(raw_path, target_path, tolerance=235):
    img = Image.open(raw_path)
    cutout = edge_connected_cutout(img, tolerance=tolerance)
    resized = cutout.resize((512, 768), Image.Resampling.LANCZOS)
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    resized.save(target_path, "PNG")
    
    np_arr = np.array(resized)
    alpha = np_arr[:, :, 3]
    trans_ratio = (alpha == 0).mean()
    solid_ratio = (alpha == 255).mean()
    print(f"Processed: {os.path.basename(target_path)} | Size: {resized.size} | Trans: {trans_ratio*100:.1f}% | Solid: {solid_ratio*100:.1f}%")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_unit_sprite.py <raw_image_path> <target_png_path> [tolerance]")
        sys.exit(1)
    raw_p = sys.argv[1]
    tgt_p = sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 235
    process_sprite(raw_p, tgt_p, tol)
