"""Draw the Word Monsters app icons (run: python3 tools/make_icons.py)."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "icons"
BG = (123, 92, 255)
BODY = (255, 120, 180)
DARK = (190, 60, 120)
INK = (43, 36, 64)


def draw_icon(size: int, pad: float) -> Image.Image:
    scale = 4
    s = size * scale
    img = Image.new("RGB", (s, s), BG)
    d = ImageDraw.Draw(img)

    def box(cx, cy, rx, ry):
        k = s * (1 - 2 * pad)
        o = s * pad
        return [o + (cx - rx) * k, o + (cy - ry) * k, o + (cx + rx) * k, o + (cy + ry) * k]

    lw = max(2, int(s * 0.012))
    d.ellipse(box(0.30, 0.22, 0.09, 0.09), fill=BODY, outline=DARK, width=lw)
    d.ellipse(box(0.70, 0.22, 0.09, 0.09), fill=BODY, outline=DARK, width=lw)
    d.ellipse(box(0.30, 0.86, 0.10, 0.05), fill=DARK)
    d.ellipse(box(0.70, 0.86, 0.10, 0.05), fill=DARK)
    d.ellipse(box(0.50, 0.55, 0.34, 0.32), fill=BODY, outline=DARK, width=lw)
    for cx in (0.39, 0.61):
        d.ellipse(box(cx, 0.48, 0.085, 0.085), fill="white", outline=INK, width=lw)
        d.ellipse(box(cx + 0.01, 0.50, 0.045, 0.045), fill=INK)
        d.ellipse(box(cx + 0.03, 0.465, 0.015, 0.015), fill="white")
    d.chord(box(0.50, 0.62, 0.12, 0.10), 0, 180, fill=INK)
    d.ellipse(box(0.50, 0.685, 0.05, 0.025), fill=(255, 111, 145))
    d.ellipse(box(0.28, 0.62, 0.05, 0.03), fill=(255, 170, 200))
    d.ellipse(box(0.72, 0.62, 0.05, 0.03), fill=(255, 170, 200))
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(exist_ok=True)
    draw_icon(192, 0.06).save(OUT / "icon-192.png")
    draw_icon(512, 0.06).save(OUT / "icon-512.png")
    draw_icon(512, 0.18).save(OUT / "icon-maskable-512.png")
    print("icons written to", OUT)


if __name__ == "__main__":
    main()
