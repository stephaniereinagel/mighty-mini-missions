"""Cut generated art out of its white background (run: python3 tools/cutout.py SRC.jpg OUT.png [max_side] [threshold]).

Use a threshold near 249 for Boo art: his body is almost white and lower values eat into it.
"""
import sys

import cv2
import numpy as np
from PIL import Image


def cutout(src: str, out: str, max_side: int = 460, threshold: int = 246) -> None:
    rgb = np.array(Image.open(src).convert("RGB"))
    h, w = rgb.shape[:2]
    near_white = (rgb.min(axis=2) >= threshold).astype(np.uint8)

    # Only white connected to the border is background, so white details inside the art survive.
    mask = np.zeros((h + 2, w + 2), np.uint8)
    fill = near_white.copy()
    for x in range(w):
        for y in (0, h - 1):
            if fill[y, x] == 1:
                cv2.floodFill(fill, mask, (x, y), 2)
    for y in range(h):
        for x in (0, w - 1):
            if fill[y, x] == 1:
                cv2.floodFill(fill, mask, (x, y), 2)
    background = fill == 2

    alpha = np.where(background, 0, 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)

    # Pull the white halo out of soft edge pixels.
    a = alpha.astype(np.float32)[..., None] / 255.0
    color = rgb.astype(np.float32)
    safe = np.clip(a, 0.15, 1.0)
    color = np.clip((color - 255.0 * (1 - safe)) / safe, 0, 255)

    rgba = np.dstack([color.astype(np.uint8), alpha])
    ys, xs = np.nonzero(alpha > 8)
    rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

    img = Image.fromarray(rgba, "RGBA")
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    img.save(out, optimize=True)
    print(out, img.size)


if __name__ == "__main__":
    cutout(
        sys.argv[1],
        sys.argv[2],
        int(sys.argv[3]) if len(sys.argv) > 3 else 460,
        int(sys.argv[4]) if len(sys.argv) > 4 else 246,
    )
