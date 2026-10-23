"""Turn freshly fetched <ig>-<n>.jpg files into WebP (full + -s thumb), drop near-duplicates, renumber.

Usage: python -I scripts/process_photos.py <ig> [<ig> ...]
Prints the final photo count for each post.
"""
import pathlib
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "meetups"
RAW = ROOT / "research" / "meetups-original"
RAW.mkdir(parents=True, exist_ok=True)


def ahash(im):
    g = im.convert("L").resize((16, 16))
    px = list(g.tobytes())
    m = sum(px) / len(px)
    return [v > m for v in px]


for ig in sys.argv[1:]:
    kept, hashes = [], []
    for f in sorted(SRC.glob(f"{ig}-[0-9].jpg")):
        im = Image.open(f).convert("RGB")
        (RAW / f.name).write_bytes(f.read_bytes())
        f.unlink()
        h = ahash(im)
        if any(sum(a != b for a, b in zip(h, x)) < 20 for x in hashes):
            continue
        hashes.append(h)
        kept.append(im)
    for old in SRC.glob(f"{ig}-*.webp"):
        old.unlink()
    for i, im in enumerate(kept, 1):
        full = im.copy(); full.thumbnail((1400, 1400)); full.save(SRC / f"{ig}-{i}.webp", "WEBP", quality=80, method=6)
        th = im.copy(); th.thumbnail((640, 640)); th.save(SRC / f"{ig}-{i}-s.webp", "WEBP", quality=74, method=6)
    print(ig, len(kept))
