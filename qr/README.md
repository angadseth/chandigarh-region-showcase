# QR for posters

Every file here opens https://angadseth.github.io/chandigarh-region-showcase/ . The code holds the plain URL
(no shortener, no tracking service), so it keeps working as long as the site does.

| File | Use it for |
| --- | --- |
| `out/qr-card.png` | A finished portrait card (ink and gold, masthead on top): drop it straight onto a poster or story |
| `out/qr-tile.png` | Just the code on its ivory panel, transparent corners: place it inside your own design |
| `out/qr-tile.svg` | Same tile as a vector, for large prints |
| `out/qr-tile-white.png` / `.svg` | The tile on plain white, for printers and light posters |

## Printing

- Keep the code at least **2.5 cm** wide on paper (bigger on banners: about 1/10 of the reading distance).
- Leave the cream or white panel around the code; it is the quiet zone scanners need.
- Don't recolour the dark parts lighter than they are, and don't put the code on a busy photo.

## Regenerating

```sh
python qr/make_qr.py
```

It rebuilds every file and checks each one with two decoders (OpenCV and WeChat's) at full, half, quarter and
15% size. Error correction is level H, which is what lets the logo sit in the middle.

Why the modules look "liquid": separated round dots and hand-drawn corner eyes looked nice but failed the strict
decoder, so touching modules flow into each other and the three corner eyes stay true QR modules (bronze centres).
