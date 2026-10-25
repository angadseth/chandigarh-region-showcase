"""QR for the showcase, in the site's ink / ivory / champagne look, ready for posters.

    python qr/make_qr.py      (run from the repo root)

Writes qr/out/: qr-tile.svg + qr-tile.png (just the code on its ivory panel, transparent corners),
qr-card.png (portrait card with the masthead), and checks that both scan.
Dark modules on ivory so every phone camera reads it; error level H so the logo in the middle is safe."""
import base64
import pathlib

import cv2
import numpy as np
import segno
from playwright.sync_api import sync_playwright

URL = "https://angadseth.github.io/chandigarh-region-showcase/"
INK, IVORY, GOLD, BRONZE, BRONZE2 = "#0b0a09", "#efe8da", "#d6b36f", "#5e4518", "#241a08"
root = pathlib.Path(__file__).resolve().parent
out = root / "out"
out.mkdir(exist_ok=True)

qr = segno.make(URL, error="h", boost_error=False)
m = [list(r) for r in qr.matrix]
n = len(m)
Q = 4
S = n + 2 * Q


def finder(r, c):
    return (r < 7 and c < 7) or (r < 7 and c >= n - 7) or (r >= n - 7 and c < 7)


hole = round(n * 0.2) | 1
h0 = (n - hole) // 2


def in_hole(r, c):
    return h0 - 1 <= r <= h0 + hole and h0 - 1 <= c <= h0 + hole


def dark(r, c):
    return 0 <= r < n and 0 <= c < n and m[r][c] and not in_hole(r, c)


# "Liquid" modules: each one is round, but a corner fills back in wherever a neighbour joins it, so
# touching modules flow into one shape. Separated dots and drawn-on corner eyes looked nice, but strict
# scanners (OpenCV) failed both; the three corner squares stay true modules, the inner ones in bronze.
dots, eyes = [], []
for r in range(n):
    for c in range(n):
        if not dark(r, c):
            continue
        x, y = c + Q, r + Q
        lr, lc = (r if r < 7 else r - (n - 7)), (c if c < 7 else c - (n - 7))
        if finder(r, c) and 2 <= lr <= 4 and 2 <= lc <= 4:
            eyes.append((x, y))
            continue
        dots.append(f'<rect x="{x - .04:.2f}" y="{y - .04:.2f}" width="1.08" height="1.08" rx=".52"/>')
        for dy, dx, qx, qy in ((-1, -1, 0, 0), (-1, 1, .5, 0), (1, -1, 0, .5), (1, 1, .5, .5)):
            if dark(r + dy, c) or dark(r, c + dx):
                dots.append(f'<rect x="{x + qx - .04:.2f}" y="{y + qy - .04:.2f}" width=".58" height=".58"/>')


# each eye's 3x3 centre as one rounded bronze square
centres = {}
for x, y in eyes:
    k = ((x - Q) // 7, (y - Q) // 7)
    centres.setdefault(k, []).append((x, y))
eye_svg = "".join(
    f'<rect x="{min(p[0] for p in v)}" y="{min(p[1] for p in v)}" width="3.02" height="3.02" rx=".9" fill="url(#bronze)"/>'
    for v in centres.values())


logo = base64.b64encode((root.parent / "assets/img/logo.webp").read_bytes()).decode()
c0 = S / 2
R = hole / 2 + .35
tile = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="1600" height="1600">
<defs>
<linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{BRONZE}"/><stop offset="1" stop-color="{BRONZE2}"/></linearGradient>
<radialGradient id="paper" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#f6f0e4"/><stop offset="1" stop-color="{IVORY}"/></radialGradient>
</defs>
<rect width="{S}" height="{S}" rx="{S * .06:.2f}" fill="url(#paper)"/>
<rect x=".9" y=".9" width="{S - 1.8}" height="{S - 1.8}" rx="{S * .05:.2f}" fill="none" stroke="{GOLD}" stroke-width=".14"/>
<g fill="{INK}">{"".join(dots)}</g>
{eye_svg}
<circle cx="{c0}" cy="{c0}" r="{R}" fill="{INK}"/>
<circle cx="{c0}" cy="{c0}" r="{R - .35}" fill="none" stroke="{GOLD}" stroke-width=".16"/>
<image href="data:image/webp;base64,{logo}" x="{c0 - R * .74}" y="{c0 - R * .74}" width="{R * 1.48}" height="{R * 1.48}"/>
</svg>'''
(out / "qr-tile.svg").write_text(tile, encoding="utf8")

card = f'''<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500&display=block">
<style>
*{{margin:0;box-sizing:border-box}} html,body{{background:transparent}}
.card{{width:1000px;height:1290px;position:relative;border-radius:40px;overflow:hidden;color:{IVORY};
  background:radial-gradient(70% 45% at 50% 38%,rgba(214,179,111,.16),transparent 70%),linear-gradient(180deg,#14110d,{INK});
  display:flex;flex-direction:column;align-items:center;padding:92px 90px 0}}
.card::before{{content:"";position:absolute;inset:26px;border:1px solid rgba(214,179,111,.55);border-radius:24px}}
.card::after{{content:"";position:absolute;inset:36px;border:1px solid rgba(214,179,111,.18);border-radius:18px}}
.eyebrow{{font:500 22px/1 'Geist Mono',monospace;letter-spacing:.34em;color:{GOLD};text-transform:uppercase}}
.mast{{font-family:'Instrument Serif',serif;font-size:168px;line-height:.86;margin-top:34px;text-align:center;letter-spacing:-.01em;
  background:linear-gradient(180deg,#fbf6ea,#cfc5b0);-webkit-background-clip:text;color:transparent;padding-bottom:.12em}}
.region{{font-family:'Instrument Serif',serif;font-style:italic;font-size:112px;line-height:.9;color:{GOLD};margin-top:-22px}}
.rule{{display:flex;align-items:center;gap:18px;margin:34px 0 40px;color:{GOLD};font:500 18px/1 'Geist Mono';letter-spacing:.3em}}
.rule i{{width:120px;height:1px;background:linear-gradient(90deg,transparent,{GOLD})}} .rule i+span+i{{transform:scaleX(-1)}}
.qr{{width:560px;height:560px;filter:drop-shadow(0 24px 50px rgba(0,0,0,.55)) drop-shadow(0 0 1px rgba(214,179,111,.6))}}
.qr svg{{width:100%;height:100%;display:block}}
.cta{{margin-top:46px;font-family:'Instrument Serif',serif;font-style:italic;font-size:54px;line-height:1}}
.url{{margin-top:18px;font:400 21px/1 'Geist Mono';letter-spacing:.06em;color:#a59c8c}}
</style></head><body><div class="card">
<p class="eyebrow">IIT Madras BS &middot; Tenure 2026&ndash;27</p>
<div class="mast">Chandigarh</div><div class="region">Region</div>
<div class="rule"><i></i><span>10 HOUSES &middot; 32 MEETUPS</span><i></i></div>
<div class="qr">{tile}</div>
<p class="cta">Scan to see our tenure</p>
<p class="url">angadseth.github.io/chandigarh-region-showcase</p>
</div></body></html>'''
(out / "card.html").write_text(card, encoding="utf8")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1600, "height": 1600}, device_scale_factor=1)
    pg.set_content(f'<html><body style="margin:0;background:transparent">{tile}</body></html>')
    pg.locator("svg").first.screenshot(path=str(out / "qr-tile.png"), omit_background=True)
    pg = b.new_page(viewport={"width": 1000, "height": 1290}, device_scale_factor=2)
    pg.goto((out / "card.html").as_uri(), wait_until="networkidle")
    pg.wait_for_timeout(800)
    pg.locator(".card").screenshot(path=str(out / "qr-card.png"), omit_background=True)
    b.close()

det, wx = cv2.QRCodeDetector(), cv2.wechat_qrcode_WeChatQRCode()
for f in ["qr-tile.png", "qr-card.png"]:
    im = cv2.imread(str(out / f), cv2.IMREAD_UNCHANGED)
    if im.shape[2] == 4:  # flatten transparency onto white
        a = im[..., 3:] / 255.0
        im = (im[..., :3] * a + 255 * (1 - a)).astype(np.uint8)
    res = []
    for scale in (1.0, .5, .25, .15):
        small = cv2.resize(im, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        res.append(("Y" if det.detectAndDecode(small)[0] == URL else "n") + ("Y" if URL in wx.detectAndDecode(small)[0] else "n"))
    print(f, "version", qr.version, "scan (opencv,wechat) at 100/50/25/15%:", res)
