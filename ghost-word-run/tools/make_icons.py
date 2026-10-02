"""Build the Ghost Word Run app icons from Boo's art (run: python3 tools/make_icons.py)."""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "icons"
GHOST = ROOT / "assets" / "ghost_happy.png"
BG_TOP = (58, 36, 120)
BG_BOTTOM = (23, 16, 47)
MOON = (255, 236, 170)


def draw_icon(size: int, pad: float) -> Image.Image:
    scale = 4
    s = size * scale
    img = Image.new("RGB", (s, s), BG_BOTTOM)
    d = ImageDraw.Draw(img)
    for y in range(s):
        t = y / (s - 1)
        d.line([(0, y), (s, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(BG_TOP, BG_BOTTOM)))
    r = s * (0.13 - pad * 0.2)
    cx, cy = s * (0.8 - pad * 0.9), s * (0.2 + pad * 0.9)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=MOON)

    ghost = Image.open(GHOST).convert("RGBA")
    box = s * (1 - 2 * pad) * 1.12
    k = box / max(ghost.size)
    ghost = ghost.resize((round(ghost.width * k), round(ghost.height * k)), Image.LANCZOS)
    gx = (s - ghost.width) // 2
    gy = int(s * 0.55 - ghost.height / 2)
    img.paste(ghost, (gx, gy), ghost)
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    draw_icon(192, 0.06).save(OUT / "icon-192.png")
    draw_icon(512, 0.06).save(OUT / "icon-512.png")
    draw_icon(512, 0.16).save(OUT / "icon-maskable-512.png")
    print("icons written to", OUT)


if __name__ == "__main__":
    main()
