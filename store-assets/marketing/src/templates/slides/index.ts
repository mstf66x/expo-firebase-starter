import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import type {
  Background,
  HeadlineHighlight,
  HeadlineStyle,
  Slide,
} from "../../config.ts";
import type { DeviceProfile } from "../../devices/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "..");

/**
 * Resolves the JSON file that holds slide data for a given device:
 *   `slides-iphone-16-pro-max.json`, `slides-ipad-pro-13.json`, etc.
 * Falls back to the legacy `slides.json` for back-compat with single-
 * device installs.
 */
export function slidesPathFor(device: DeviceProfile): string {
  const namespaced = path.join(TEMPLATES_DIR, `slides-${device.id}.json`);
  if (existsSync(namespaced)) return namespaced;
  return path.join(TEMPLATES_DIR, "slides.json");
}

export async function loadSlides(device: DeviceProfile): Promise<Slide[]> {
  const filePath = slidesPathFor(device);
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${path.basename(filePath)} must be an array`);
  }
  return parsed.map(toSlide);
}

export async function saveSlides(
  device: DeviceProfile,
  slides: readonly Slide[],
): Promise<void> {
  const filePath = path.join(TEMPLATES_DIR, `slides-${device.id}.json`);
  const json = `${JSON.stringify(slides, null, 2)}\n`;
  await writeFile(filePath, json, "utf8");
}

function toSlide(value: unknown): Slide {
  if (typeof value !== "object" || value === null) {
    throw new Error(`Invalid slide entry: ${JSON.stringify(value)}`);
  }
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "number") throw new Error("slide.id must be a number");
  if (typeof v.headline !== "string") throw new Error("slide.headline must be string");
  if (typeof v.appScreenshot !== "string") {
    throw new Error("slide.appScreenshot must be string");
  }
  let slide: Slide = {
    id: v.id,
    headline: v.headline,
    appScreenshot: v.appScreenshot,
  };
  if (typeof v.showLaurel === "boolean") {
    slide = { ...slide, showLaurel: v.showLaurel };
  }
  const persp = parsePerspective(v.perspective);
  if (persp) slide = { ...slide, perspective: persp };
  const bg = parseBackground(v.background);
  if (bg) slide = { ...slide, background: bg };
  const hs = parseHeadlineStyle(v.headlineStyle);
  if (hs) slide = { ...slide, headlineStyle: hs };
  return slide;
}

function parsePerspective(value: unknown): Slide["perspective"] | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.rotateYDeg !== "number" || typeof v.rotateXDeg !== "number") {
    return null;
  }
  if (typeof v.perspectivePx === "number") {
    return {
      rotateYDeg: v.rotateYDeg,
      rotateXDeg: v.rotateXDeg,
      perspectivePx: v.perspectivePx,
    };
  }
  return { rotateYDeg: v.rotateYDeg, rotateXDeg: v.rotateXDeg };
}

function parseBackground(value: unknown): Background | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (
    typeof v.top !== "string" ||
    typeof v.mid !== "string" ||
    typeof v.bottom !== "string"
  ) {
    return null;
  }
  return { top: v.top, mid: v.mid, bottom: v.bottom };
}

function parseHeadlineStyle(value: unknown): HeadlineStyle | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  const style: HeadlineStyle = {};
  if (typeof v.fontSize === "number") style.fontSize = v.fontSize;
  if (typeof v.fontWeight === "number") style.fontWeight = v.fontWeight;
  if (typeof v.italic === "boolean") style.italic = v.italic;
  if (typeof v.color === "string") style.color = v.color;
  const hl = parseHighlight(v.highlight);
  if (hl) style.highlight = hl;
  return Object.keys(style).length > 0 ? style : null;
}

function parseHighlight(value: unknown): HeadlineHighlight | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.bg !== "string") return null;
  const out: HeadlineHighlight = { bg: v.bg };
  if (typeof v.padding === "number") out.padding = v.padding;
  if (typeof v.radius === "number") out.radius = v.radius;
  return out;
}
