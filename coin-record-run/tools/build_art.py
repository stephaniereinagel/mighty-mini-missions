"""Cut generated art into transparent game assets (run: python3 tools/build_art.py SRC_DIR).

SRC_DIR holds the generated .jpg files (white backgrounds). Single images are cut out whole;
sticker sheets are split into their items, ordered top-to-bottom, left-to-right.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets"

SINGLES = {
    "coin_penny": ("coin_1", 256),
    "coin_nickel": ("coin_5", 256),
    "coin_dime": ("coin_10", 256),
    "coin_quarter": ("coin_25", 256),
    "bill_1": ("bill_100", 420),
    "bill_5": ("bill_500", 420),
    "runner_default": ("runner_default", 320),
    "runner_ninja": ("runner_ninja", 320),
    "runner_robot": ("runner_robot", 320),
    "runner_astronaut": ("runner_astronaut", 320),
    "runner_hero": ("runner_hero", 320),
    "runner_dino": ("runner_dino", 320),
    "runner_wizard": ("runner_wizard", 320),
    "jar_tithe": ("jar_tithe", 300),
    "jar_invest": ("jar_invest", 300),
    "jar_save": ("jar_save", 300),
    "jar_spend": ("jar_spend", 300),
    "shopkeeper_owl": ("owl", 300),
    "goal_puppy": ("puppy", 300),
    "goal_treehouse": ("treehouse", 300),
    "goal_racecar": ("racecar", 300),
    "goal_ufo": ("ufo", 300),
    "goal_dragon": ("dragon", 300),
    "icon_store": ("icon_store", 256),
    "icon_bank": ("icon_bank", 256),
    "icon_records": ("icon_records", 256),
    "icon_room": ("icon_room", 256),
    "badge_champion": ("badge_champion", 300),
}

SHEETS = {
    "obstacles": (["rock", "cactus"], 200, 25),
    "sheet_room": (["duck", "car", "ball", "kite", "telescope", "guitar", "rocket", "chest", "castle", "crown"], 220, 25),
    "sheet_trails": (["sparkle", "fire", "rainbow", "stars"], 160, 25),
    "sheet_causes": (["church", "missions", "food", "families"], 240, 5),
    "sheet_awards": (["giver1", "giver5", "giver10", "invest100", "invest500", "save100", "save500", "save1000"], 220, 25),
}

GLASS = {"jar_tithe", "jar_invest", "jar_save", "jar_spend", "icon_bank"}


def background_mask(rgb: np.ndarray, threshold: int) -> np.ndarray:
    """White connected to the border is background, so white details inside the art survive."""
    h, w = rgb.shape[:2]
    near_white = (rgb.min(axis=2) >= threshold).astype(np.uint8)
    flood = near_white.copy()
    mask = np.zeros((h + 2, w + 2), np.uint8)
    for x in range(w):
        for y in (0, h - 1):
            if flood[y, x] == 1:
                cv2.floodFill(flood, mask, (x, y), 2)
    for y in range(h):
        for x in (0, w - 1):
            if flood[y, x] == 1:
                cv2.floodFill(flood, mask, (x, y), 2)
    return flood == 2


def to_rgba(rgb: np.ndarray, background: np.ndarray, glass: bool = False) -> np.ndarray:
    alpha = np.where(background, 0, 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)
    if glass:
        # Clear glass reads as see-through on the dark game background.
        bright = (rgb.min(axis=2) >= 222) & (alpha > 250)
        alpha = np.where(bright, 95, alpha).astype(np.uint8)
    a = alpha.astype(np.float32)[..., None] / 255.0
    safe = np.clip(a, 0.15, 1.0)
    color = np.clip((rgb.astype(np.float32) - 255.0 * (1 - safe)) / safe, 0, 255)
    if glass:
        color = np.where((alpha == 95)[..., None], rgb.astype(np.float32), color)
    return np.dstack([color.astype(np.uint8), alpha])


def save(rgba: np.ndarray, name: str, max_side: int) -> None:
    ys, xs = np.nonzero(rgba[..., 3] > 8)
    rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    img = Image.fromarray(rgba, "RGBA")
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    img.save(OUT / f"{name}.png", optimize=True)
    print(f"{name}.png", img.size)


def single(src: Path, name: str, max_side: int, glass: bool) -> None:
    rgb = np.array(Image.open(src).convert("RGB"))
    save(to_rgba(rgb, background_mask(rgb, 246), glass), name, max_side)


def sheet(src: Path, names: list, max_side: int, merge: int) -> None:
    rgb = np.array(Image.open(src).convert("RGB"))
    bg = background_mask(rgb, 246)
    fg = (~bg).astype(np.uint8)
    # Merge each item's loose parts (sparkles, ribbons) before splitting.
    merged = cv2.dilate(fg, np.ones((merge, merge), np.uint8))
    count, labels, stats, cents = cv2.connectedComponentsWithStats(merged)
    comps = sorted(range(1, count), key=lambda i: stats[i, cv2.CC_STAT_AREA], reverse=True)[: len(names)]
    if len(comps) < len(names):
        raise SystemExit(f"{src.name}: found {len(comps)} items, expected {len(names)}")
    gap = rgb.shape[0] * 0.18
    comps.sort(key=lambda i: cents[i][1])
    rows, row = [], 0
    for n, i in enumerate(comps):
        if n and cents[i][1] - cents[comps[n - 1]][1] > gap:
            row += 1
        rows.append((row, cents[i][0], i))
    comps = [i for _, _, i in sorted(rows)]
    rgba = to_rgba(rgb, bg)
    for name, i in zip(names, comps):
        x, y, w, h = stats[i, :4]
        piece = rgba[y:y + h, x:x + w].copy()
        piece[..., 3] = np.where(labels[y:y + h, x:x + w] == i, piece[..., 3], 0)
        save(piece, name, max_side)


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    OUT.mkdir(exist_ok=True)
    for stem, (name, size) in SINGLES.items():
        single(src / f"{stem}.jpg", name, size, stem in GLASS)
    for stem, (names, size, merge) in SHEETS.items():
        sheet(src / f"{stem}.jpg", names, size, merge)


if __name__ == "__main__":
    main()
