"""Find the head in each cut-out: prints [cx, cy, r] as fractions of the image (r of width).

Usage: python scripts/head.py [check-dir]
"""
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw

people = pathlib.Path(__file__).resolve().parent.parent / "assets" / "people"
check = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None


def head(im):
    a = np.array(im.getchannel("A")) > 128
    H, W = a.shape
    rows = [np.flatnonzero(r) for r in a]
    top = next(y for y, r in enumerate(rows) if len(r) > W * .02)
    best, by = 0, top
    for y in range(top, min(H, top + int(H * .6))):
        r = rows[y]
        if not len(r):
            continue
        w = r[-1] - r[0]
        if w > best:
            best, by = w, y
        elif w < best * .82 and y - top > H * .12:  # the neck: width falls away under the jaw
            break
    r = rows[by]
    cx = (r[0] + r[-1]) / 2
    rad = best / 2
    cy = top + rad * 1.3
    return round(float(cx / W), 3), round(float(cy / H), 3), round(float(rad / W), 3)


for f in sorted(people.glob("*.webp")):
    im = Image.open(f).convert("RGBA")
    cx, cy, r = head(im)
    print(f.stem, [cx, cy, r])
    if check:
        bg = Image.new("RGBA", im.size, (40, 36, 30, 255)); bg.alpha_composite(im)
        d = ImageDraw.Draw(bg); W, H = im.size
        d.ellipse([cx * W - r * W, cy * H - r * W, cx * W + r * W, cy * H + r * W], outline=(214, 179, 111), width=6)
        bg.convert("RGB").resize((W // 3, H // 3)).save(check / f"head-{f.stem}.png")
