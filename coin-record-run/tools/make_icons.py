"""Build the Coin Record Run app icons (run: python3 tools/make_icons.py)."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "icons"
BG_TOP = (58, 36, 120)
BG_BOTTOM = (26, 18, 64)
GOLD = (255, 213, 74)
GOLD_DARK = (201, 151, 26)
GOLD_LIGHT = (255, 238, 160)


def draw_icon(size: int, pad: float) -> Image.Image:
    scale = 4
    s = size * scale
    img = Image.new("RGB", (s, s), BG_BOTTOM)
    d = ImageDraw.Draw(img)
    for y in range(s):
        t = y / (s - 1)
        d.line([(0, y), (s, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOTTOM)))

    r = s * (0.36 - pad)
    cx, cy = s / 2, s / 2
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=GOLD_DARK)
    r2 = r * 0.9
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], fill=GOLD)
    r3 = r * 0.72
    d.ellipse([cx - r3, cy - r3, cx + r3, cy + r3], outline=GOLD_DARK, width=max(2, int(s * 0.012)))

    # Star in the middle of the coin.
    import math
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rad = r * (0.5 if i % 2 == 0 else 0.22)
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, fill=GOLD_LIGHT, outline=GOLD_DARK)
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    draw_icon(192, 0.0).save(OUT / "icon-192.png")
    draw_icon(512, 0.0).save(OUT / "icon-512.png")
    draw_icon(512, 0.08).save(OUT / "icon-maskable-512.png")
    print("icons written to", OUT)


if __name__ == "__main__":
    main()
