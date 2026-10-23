"""Pull photos + captions for every meetup post from Instagram's public embed page.

Usage: python -I scripts/fetch_instagram.py
Writes assets/meetups/<ig>-<n>.jpg and research/ig-captions.json.
"""
import json
import pathlib
import sys

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "meetups"
OUT.mkdir(parents=True, exist_ok=True)
MAX_PER_POST = 5

posts = json.loads((ROOT / "data" / "meetups.json").read_text(encoding="utf-8"))
only = set(sys.argv[1:])
captions = {}

with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1280, "height": 1400})
    page = ctx.new_page()
    for post in posts:
        ig = post["ig"]
        if only and ig not in only:
            continue
        page.goto(f"https://www.instagram.com/p/{ig}/embed/captioned/", wait_until="networkidle")
        page.wait_for_timeout(1500)
        cap = page.locator(".Caption").first
        captions[ig] = cap.inner_text() if cap.count() else ""
        seen = []
        for _ in range(MAX_PER_POST):
            srcs = page.eval_on_selector_all(
                "img.EmbeddedMediaImage, .EmbeddedMedia img, ul img",
                "els => els.filter(e => e.naturalWidth > 300).map(e => e.currentSrc || e.src)",
            )
            for s in srcs:
                if s not in seen:
                    seen.append(s)
            nxt = page.locator("button[aria-label='Next'], .coreSpriteRightChevron").first
            if not nxt.count() or len(seen) >= MAX_PER_POST:
                break
            try:
                nxt.click(timeout=2000)
                page.wait_for_timeout(700)
            except Exception:
                break
        n = 0
        for s in seen[:MAX_PER_POST]:
            r = ctx.request.get(s)
            if r.ok:
                n += 1
                (OUT / f"{ig}-{n}.jpg").write_bytes(r.body())
        print(ig, post["place"], "->", n, "photos", flush=True)
    browser.close()

(ROOT / "research" / "ig-captions.json").write_text(
    json.dumps(captions, ensure_ascii=False, indent=1), encoding="utf-8"
)
