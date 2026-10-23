"""Download the monument photos for the reel from Wikimedia Commons, with their credits.

Usage: python scripts/fetch_monuments.py
Writes assets/monuments/<slug>.webp (1800px wide) and assets/monuments/credits.json.
"""
import io
import json
import pathlib
import re
import urllib.parse
import urllib.request

from PIL import Image

UA = {"User-Agent": "ChandigarhRegionShowcase/1.0 (https://angadseth.github.io/chandigarh-region-showcase/)"}
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "monuments"
OUT.mkdir(parents=True, exist_ok=True)
PICKS = [
    ("open-hand", "Open Hand Monument", "Chandigarh", "File:Open Hand monument, Chandigarh.jpg"),
    ("hawa-mahal", "Hawa Mahal", "Jaipur", "File:East facade Hawa Mahal Jaipur from ground level (July 2022) - img 01.jpg"),
    ("golden-temple", "Harmandir Sahib", "Amritsar", "File:Hamandir Sahib (Golden Temple).jpg"),
    ("city-palace", "City Palace", "Udaipur", "File:City Palace Udaipur Rajasthan India.JPG"),
    ("albert-hall", "Albert Hall Museum", "Jaipur", "File:Albert Hall (Museum).JPG"),
    ("lakshman-jhula", "Lakshman Jhula", "Rishikesh", "File:Lakshman Jhula Bridge - Hrishikesh - Uttarakhand 001.jpg"),
    ("jantar-mantar", "Jantar Mantar", "Jaipur", None),
]


def api(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))


def find(q):
    r = api({"action": "query", "list": "search", "srsearch": f"filetype:bitmap {q}", "srnamespace": 6, "srlimit": 10})
    return [h["title"] for h in r["query"]["search"]]


credits = []
for slug, name, city, title in PICKS:
    if title is None:  # first landscape, CC/PD result
        title = next(t for t in find(f"Jantar Mantar Jaipur samrat yantra") if t.lower().endswith((".jpg", ".jpeg")))
    r = api({"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1800})
    ii = next(iter(r["query"]["pages"].values()))["imageinfo"][0]
    md = ii["extmetadata"]
    artist = re.sub(r"<[^>]+>", "", md.get("Artist", {}).get("value", "")).strip()
    lic = md.get("LicenseShortName", {}).get("value", "")
    data = urllib.request.urlopen(urllib.request.Request(ii["thumburl"], headers=UA), timeout=60).read()
    im = Image.open(io.BytesIO(data)).convert("RGB")
    im.save(OUT / f"{slug}.webp", "WEBP", quality=84, method=6)
    credits.append({"slug": slug, "name": name, "city": city, "artist": artist, "license": lic, "source": ii["descriptionurl"]})
    print(slug, im.size, lic, "|", artist[:50], "|", title)
(OUT / "credits.json").write_text(json.dumps(credits, indent=2, ensure_ascii=False), encoding="utf-8")
