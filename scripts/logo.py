"""Turn the region logo (gold C on black) into a transparent mark, a favicon and a touch icon.

    python scripts/logo.py <logo.png>

The black background is keyed out by brightness, so the mark sits on any dark surface.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src = Image.open(sys.argv[1]).convert("RGB")
rgb = np.asarray(src).astype(np.float32)
lum = rgb.max(axis=2)
lo, hi = 34.0, 82.0
a = np.clip((lum - lo) / (hi - lo), 0, 1)
# un-mix the black so the edges keep their colour instead of going muddy
out = np.where(a[..., None] > 0, np.clip(rgb / np.maximum(a[..., None], 1e-3), 0, 255), 0)
rgba = np.dstack([out, a * 255]).astype(np.uint8)
mark = Image.fromarray(rgba, "RGBA")
mark = mark.crop(mark.getbbox())

# square it up so it centres in round slots
side = max(mark.size)
sq = Image.new("RGBA", (side, side))
sq.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))

dst = Path(__file__).resolve().parent.parent / "assets" / "img"
sq.save(dst / "logo.webp", quality=92, method=6)
sq.resize((64, 64), Image.LANCZOS).save(dst / "favicon.png", optimize=True)
# the touch icon needs a solid ground: iOS fills transparency with black anyway
touch = Image.new("RGBA", (180, 180), (11, 10, 9, 255))
m = sq.resize((150, 150), Image.LANCZOS)
touch.alpha_composite(m, (15, 15))
touch.convert("RGB").save(dst / "apple-touch-icon.png", optimize=True)
print(sq.size, "->", dst / "logo.webp")
