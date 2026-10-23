"""Cut a coordinator out of their photo and save it for the cover.

Usage: python scripts/cutout.py <photo> <house-id>
Writes assets/people/<house-id>.webp (transparent, cropped to the person, ~1100px tall).
"""
import pathlib
import sys

from PIL import Image, ImageEnhance, ImageFilter
from rembg import new_session, remove

src, hid = sys.argv[1], sys.argv[2]
out = pathlib.Path(__file__).resolve().parent.parent / "assets" / "people" / f"{hid}.webp"

im = Image.open(src).convert("RGB")
cut = remove(im, session=new_session("birefnet-portrait"))
cut = cut.crop(cut.getchannel("A").point(lambda a: 255 if a > 24 else 0).getbbox())

# small screenshots get upscaled and sharpened so they hold up next to the others
target = 1100
if cut.height < target:
    k = target / cut.height
    cut = cut.resize((round(cut.width * k), target), Image.LANCZOS)
    rgb = cut.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
    cut = Image.merge("RGBA", (*rgb.split(), cut.getchannel("A")))
elif cut.height > 1400:
    cut = cut.resize((round(cut.width * 1400 / cut.height), 1400), Image.LANCZOS)

# a light, shared grade: a touch more contrast and warmth
rgb = ImageEnhance.Contrast(cut.convert("RGB")).enhance(1.05)
r, g, b = rgb.split()
rgb = Image.merge("RGB", (r.point(lambda v: min(255, v * 1.02)), g, b.point(lambda v: v * .97)))
cut = Image.merge("RGBA", (*rgb.split(), cut.getchannel("A")))

cut.save(out, "WEBP", quality=88, method=6)
print(out.name, cut.size)
