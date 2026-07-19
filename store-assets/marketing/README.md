# App Store screenshot generator

Generates polished App Store marketing screenshots (device frame + headline
+ gradient) from HTML/CSS templates rendered headlessly via Puppeteer.
Ported from a real production app into this starter so you can ship store
art on day one. **No design tool, no manual dashboard.**

- **iPhone 6.9"** master → `1290 × 2796` PNG
- **iPad 13"** master → `2064 × 2752` PNG

## Usage

```bash
cd store-assets/marketing
npm install                      # one-time (pulls Puppeteer)

# 1. Drop raw app screenshots into raw/iphone/ and raw/ipad/
#    (filenames must match `appScreenshot` in the slides JSON)
#    e.g. xcrun simctl io booted screenshot raw/iphone/01-sign-in.png

# 2. Render
npm run generate:iphone          # → out/iphone/IPHONE_69_<n>.png
npm run generate:ipad            # → out/ipad/IPAD_13_<n>.png
npm run generate -- --slide 1    # single slide, fast iteration

# 3. Copy the winners into Fastlane and ship
cp out/iphone/*.png ../../fastlane/screenshots/en-US/
```

## Files

```
src/
  config.ts            — palette, gradient presets, typography, Slide schema
  devices/             — per-device canvas + frame geometry (iphone, ipad)
  components/          — Background, Headline, LaurelBadge, DeviceFrame
  templates/
    layout.ts          — master HTML composer
    slides-<device>.json — the slides (edit these!)
    slides/index.ts    — typed loader/saver
  generate.ts          — Puppeteer driver
assets/                — vendored device-frame PNGs (MIT, fastlane/frameit-frames)
raw/                   — input app screenshots (gitignored)
out/                   — generated marketing PNGs (gitignored)
```

## Tweaking

- **Headlines, per-slide gradient, tilt, highlight** → `src/templates/slides-<device>.json`.
- **Global tokens** (default palette, `GRADIENT_PRESETS`, fonts, `DEVICE_SCALE`) → `src/config.ts`.
- **Award laurel** (`showLaurel: true`) renders a placeholder badge — only
  claim an award you actually hold; edit the text in `components/LaurelBadge.ts`.

For a Claude-driven, end-to-end workflow (author → render → self-review), see
[`SKILL.md`](./SKILL.md).

## Licence

The device-frame PNGs under `assets/` are MIT-licensed via
[fastlane/frameit-frames](https://github.com/fastlane/frameit-frames).
