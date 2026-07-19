---
name: marketing-screenshots
description: Produce App Store marketing screenshots end-to-end. Use when the user asks for "marketing SS", "ASC screenshots", "App Store screenshots", "store SS", "marketing slide", or refers to `store-assets/marketing/`. Claude authors the config, renders, self-reviews, and presents.
---

# Marketing screenshots — Claude-driven workflow

When the user wants App Store marketing screenshots, run this end-to-end. Claude
reads the brief, authors the slides config, renders, self-reviews, and presents.

## Output

- **iPhone 6.9"**: `1290 × 2796` PNG → `out/iphone/IPHONE_69_<n>.png`
- **iPad 13"**: `2064 × 2752` PNG → `out/ipad/IPAD_13_<n>.png`
- **Final destination**: `fastlane/screenshots/en-US/`. Push via
  `bundle exec fastlane ios beta`/metadata — **only with explicit user approval**.

## 1 — Confirm the brief

Use the user's brief if given ("5 slides: auth, realtime data, theming, analytics,
speed; indigo→sumi gradient spread"). Otherwise ask once with concrete options —
never invent palette/headline assumptions silently.

## 2 — Capture raw screenshots

Each slide needs a real device screenshot in `raw/iphone/<id>-name.png` (matching
the `appScreenshot` field in the slides JSON), at the device's native resolution.

```bash
# Boot the sim, run the dev build, navigate to the screen, then:
xcrun simctl io booted screenshot store-assets/marketing/raw/iphone/01-sign-in.png
```

If you can't drive navigation now, flag it and use placeholders explicitly — never
silently ship slides with mismatched raw vs headline.

## 3 — Author the slides JSON

Edit `src/templates/slides-<device>.json`. Schema is the `Slide` type in
`src/config.ts`:

```json
{
  "id": 1,
  "headline": "Two lines\nmax",
  "appScreenshot": "01-sign-in.png",
  "showLaurel": false,
  "perspective": { "rotateYDeg": -18, "rotateXDeg": 6 },
  "background": { "top": "#0f1f3d", "mid": "#15326b", "bottom": "#1a4ba0" },
  "headlineStyle": { "fontSize": 96, "fontWeight": 500, "highlight": { "bg": "#00000066" } }
}
```

**Rules:**
- Vary `perspective` across slides (e.g. rotateYDeg -22/-16/-10/-4/+14). A static
  carousel feels lazy.
- Headline ≤ 2 lines, ≤ ~30 chars/line; use `\n` for breaks.
- Reuse tokens from `src/config.ts` (`GRADIENT_PRESETS`, `PALETTE`, `TYPOGRAPHY`);
  don't hardcode a colour that already has a token.
- `showLaurel` renders a placeholder award badge — only enable it with truthful text.

## 4 — Render

```bash
cd store-assets/marketing
npm run generate:iphone
npm run generate -- --slide 1   # fast single-slide loop
```

## 5 — Self-review (read your own output)

Multimodal-Read each `out/**/*.png` and check:
- [ ] Headline clears the device frame, no orphan words.
- [ ] Tilt readable, not nauseating (|rotateY| ≤ 30°, |rotateX| ≤ 18°).
- [ ] No screen bleed past the bezel corners.
- [ ] Gradient contrasts the headline (WCAG-ish: light text on dark, dark on light).
- [ ] Captured status bar isn't clipped.

Fix `slides-<device>.json` / `config.ts`, re-render the affected slide(s), re-review.

## 6 — Present & ship

1. Show the user all PNGs (Read tool, multimodal).
2. Wait for explicit approval, then:
   ```bash
   cp out/iphone/*.png ../../fastlane/screenshots/en-US/
   ```
3. Remind that App Store Connect upload is a separate, approval-gated Fastlane step.

## What NOT to do

- ❌ Don't auto-push to App Store Connect — always wait for approval.
- ❌ Don't claim an award (laurel) the app doesn't actually hold.
- ❌ Don't fabricate a brief — ask once if the user is silent.
- ❌ Don't add Puppeteer to the app's `package.json`; it lives only in this folder.
