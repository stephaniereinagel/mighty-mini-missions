"""Render every costume on every Boo pose to check fit (run: python3 tools/preview_costumes.py OUT.png).

Placement numbers mirror COSTUMES / GHOST_HEADS in candies.js.
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

# Head anchor per pose, as fractions of the ghost image: center x, top of head y, head width.
GHOST_HEADS = {
    "normal": (0.52, 0.06, 0.62),
    "happy": (0.505, 0.10, 0.46),
    "wobble": (0.53, 0.06, 0.60),
}

# Costume fit: width relative to head width, bottom edge relative to head top (in head widths), x nudge, behind body.
COSTUMES = {
    "witch_hat": (1.25, 0.22, 0.0, False),
    "crown": (0.80, 0.16, 0.0, False),
    "pirate_hat": (1.15, 0.22, 0.0, False),
    "wizard_hat": (1.15, 0.22, 0.0, False),
    "pumpkin_cap": (0.95, 0.30, 0.0, False),
    "cat_ears": (1.2, 0.46, 0.0, False),
    "top_hat": (0.85, 0.16, 0.0, False),
    "bat_wings": (2.4, 0.95, 0.0, True),
}


def dress(pose: str, costume: str, cell: int) -> Image.Image:
    ghost = Image.open(ROOT / f"assets/ghost_{pose}.png").convert("RGBA")
    item = Image.open(ROOT / f"assets/costume_{costume}.png").convert("RGBA")
    gw, gh = ghost.size
    cx, top, head = GHOST_HEADS[pose]
    width_k, drop_k, nudge, behind = COSTUMES[costume]
    w = int(head * gw * width_k)
    h = int(item.height * w / item.width)
    item = item.resize((w, h), Image.LANCZOS)
    x = int((cx + nudge * head) * gw - w / 2)
    y = int(top * gh + drop_k * head * gw - h)

    pad = gw
    canvas = Image.new("RGBA", (gw + 2 * pad, gh + 2 * pad), (40, 26, 80, 255))
    if behind:
        canvas.alpha_composite(item, (x + pad, y + pad))
    canvas.alpha_composite(ghost, (pad, pad))
    if not behind:
        canvas.alpha_composite(item, (x + pad, y + pad))
    canvas = canvas.crop((pad // 2, pad // 2, gw + pad * 3 // 2, gh + pad * 3 // 2))
    canvas.thumbnail((cell, cell))
    return canvas


def main() -> None:
    cell = 300
    poses = list(GHOST_HEADS)
    names = list(COSTUMES)
    sheet = Image.new("RGBA", (cell * len(names), cell * len(poses)), (20, 12, 40, 255))
    for r, pose in enumerate(poses):
        for c, name in enumerate(names):
            sheet.alpha_composite(dress(pose, name, cell), (c * cell, r * cell))
    sheet.save(sys.argv[1] if len(sys.argv) > 1 else "/tmp/costumes.png")


if __name__ == "__main__":
    main()
