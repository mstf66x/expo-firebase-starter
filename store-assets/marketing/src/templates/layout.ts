import type { Slide } from "../config.ts";
import type { DeviceProfile } from "../devices/index.ts";
import {
  backgroundCss,
  backgroundHtml,
} from "../components/Background.ts";
import {
  deviceFrameCss,
  deviceFrameHtml,
} from "../components/DeviceFrame.ts";
import { headlineCss, headlineHtml } from "../components/Headline.ts";
import {
  laurelBadgeCss,
  laurelBadgeHtml,
} from "../components/LaurelBadge.ts";

export type RenderArgs = {
  appScreenshotDataUri: string;
  framePngDataUri: string;
};

/**
 * Compose a full marketing screenshot HTML document for the given
 * device profile + slide. Pure string concatenation keeps the
 * renderer dependency-free; Puppeteer feeds the result straight into
 * `page.setContent`.
 */
export function renderSlideHtml(
  device: DeviceProfile,
  slide: Slide,
  args: RenderArgs,
): string {
  const css = [
    resetCss(device),
    backgroundCss(slide.background),
    headlineCss(device, slide.headlineStyle),
    laurelBadgeCss(device),
    deviceFrameCss(device, slide.perspective),
  ].join("\n");

  const body = [
    backgroundHtml(),
    headlineHtml(slide.headline, slide.headlineStyle),
    slide.showLaurel ? laurelBadgeHtml() : "",
    deviceFrameHtml(args.appScreenshotDataUri, args.framePngDataUri),
  ].join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <style>${css}</style>
</head>
<body>
  <main class="canvas">
    ${body}
  </main>
</body>
</html>`;
}

function resetCss(device: DeviceProfile): string {
  return `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #000; }
    body {
      width: ${device.canvas.width}px;
      height: ${device.canvas.height}px;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .canvas {
      position: relative;
      width: ${device.canvas.width}px;
      height: ${device.canvas.height}px;
      overflow: hidden;
    }
  `;
}
