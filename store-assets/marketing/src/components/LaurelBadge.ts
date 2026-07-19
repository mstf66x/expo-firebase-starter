import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { TYPOGRAPHY } from "../config.ts";
import type { DeviceProfile } from "../devices/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAUREL_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "assets",
  "laurel-wreath.svg",
);

/**
 * Vendored laurel wreath SVG (BSD-3, siriusbontea/roman-empire).
 * Loaded once at module import — the file rarely changes and inlining
 * keeps the component dependency-free at render time.
 */
const LAUREL_DATA_URI = (() => {
  const buf = readFileSync(LAUREL_PATH);
  return `data:image/svg+xml;base64,${buf.toString("base64")}`;
})();

/**
 * Award-laurel badge: a gold laurel wreath with a caption nested in the
 * wreath's opening. Text is PLACEHOLDER — only claim an award you actually
 * hold. Edit the two spans below (or wire them to slide config).
 */
export function laurelBadgeHtml(): string {
  return `
    <div class="laurel" aria-hidden="true">
      <img class="laurel-wreath" src="${LAUREL_DATA_URI}" alt="" />
      <div class="laurel-text">
        <span class="laurel-kicker">Your</span>
        <span class="laurel-main">Award</span>
      </div>
    </div>
  `;
}

export function laurelBadgeCss(device: DeviceProfile): string {
  return `
    .laurel {
      position: absolute;
      top: ${device.layout.badgeTop}px;
      left: 50%;
      transform: translateX(-50%);
      width: ${device.layout.badgeWidth}px;
      aspect-ratio: 256 / 228;
      display: grid;
      place-items: center;
    }

    .laurel-wreath {
      grid-area: 1 / 1;
      width: 100%;
      height: 100%;
      display: block;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
    }

    .laurel-text {
      grid-area: 1 / 1;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-family: ${TYPOGRAPHY.badgeFamily};
      color: #ffffff;
      line-height: 1;
      text-shadow:
        0 2px 8px rgba(0, 0, 0, 0.55),
        0 0 24px rgba(0, 0, 0, 0.35);
      width: 65%;
      transform: translateY(6%);
    }

    .laurel-kicker {
      font-size: ${TYPOGRAPHY.badgeKickerSize}px;
      font-style: italic;
      letter-spacing: 0.3px;
      opacity: 0.95;
    }

    .laurel-main {
      font-size: ${TYPOGRAPHY.badgeMainSize}px;
      font-weight: 600;
      letter-spacing: -0.5px;
      white-space: nowrap;
    }
  `;
}
