"""Build the Monster Factory app icons from the mascot art (run: python3 tools/make_icons.py)."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "icons"
BG = (190, 170, 255, 255)


def draw_icon(size: int, pad: float) -> Image.Image:
    mascot = Image.open(ROOT / "images" / "mascot.webp").convert("RGBA")
    canvas = Image.new("RGBA", (size, size), BG)
    inner = int(size * (1 - 2 * pad))
    m = mascot.copy()
    m.thumbnail((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    return canvas.convert("RGB")


def main() -> None:
    OUT.mkdir(exist_ok=True)
    draw_icon(192, 0.06).save(OUT / "icon-192.png")
    draw_icon(512, 0.06).save(OUT / "icon-512.png")
    draw_icon(512, 0.18).save(OUT / "icon-maskable-512.png")
    print("icons written to", OUT)


if __name__ == "__main__":
    main()
