import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseArgs } from "node:util";
import puppeteer, { type Browser } from "puppeteer";

import type { Slide } from "./config.ts";
import {
  type DeviceProfile,
  DEFAULT_DEVICE_ID,
  findDevice,
} from "./devices/index.ts";
import { renderSlideHtml } from "./templates/layout.ts";
import { loadSlides } from "./templates/slides/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "..");

const FONT_LOAD_GRACE_MS = 800;

async function main(): Promise<void> {
  const { slideId, deviceId } = parseCli();
  const device = findDevice(deviceId);
  const dirs = resolveDirs(device);

  const all = await loadSlides(device);
  const slides = slideId === null ? all : all.filter((s) => s.id === slideId);
  if (slides.length === 0) {
    console.error(`No slide with id ${slideId} found for ${device.label}.`);
    process.exit(1);
  }

  await mkdir(dirs.outDir, { recursive: true });
  const framePngDataUri = await loadAsDataUri(
    path.join(PACKAGE_ROOT, device.framePath),
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--font-render-hinting=none"],
  });
  try {
    for (const slide of slides) {
      await renderOne(browser, device, dirs, slide, framePngDataUri);
    }
  } finally {
    await browser.close();
  }
}

type Dirs = { rawDir: string; outDir: string };

function resolveDirs(device: DeviceProfile): Dirs {
  const slug = device.id.includes("ipad") ? "ipad" : "iphone";
  return {
    rawDir: path.join(PACKAGE_ROOT, "raw", slug),
    outDir: path.join(PACKAGE_ROOT, "out", slug),
  };
}

function parseCli(): { slideId: number | null; deviceId: string } {
  const { values } = parseArgs({
    options: {
      slide: { type: "string" },
      device: { type: "string" },
    },
    allowPositionals: false,
  });
  const slideId = values.slide ? Number.parseInt(values.slide, 10) : null;
  const deviceId = values.device ?? DEFAULT_DEVICE_ID;
  return { slideId, deviceId };
}

async function renderOne(
  browser: Browser,
  device: DeviceProfile,
  dirs: Dirs,
  slide: Slide,
  framePngDataUri: string,
): Promise<void> {
  const rawPath = resolveRawPath(dirs.rawDir, slide.appScreenshot);
  if (!existsSync(rawPath)) {
    console.warn(
      `[${device.id} slide ${slide.id}] missing raw at ${rawPath} — skipping.`,
    );
    return;
  }

  const appScreenshotDataUri = await loadAsDataUri(rawPath);
  const html = renderSlideHtml(device, slide, {
    appScreenshotDataUri,
    framePngDataUri,
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: device.canvas.width,
    height: device.canvas.height,
    deviceScaleFactor: 1,
  });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, FONT_LOAD_GRACE_MS));

  const outName = outputFilename(device, slide);
  const outPath = path.join(dirs.outDir, outName);
  await page.screenshot({
    path: outPath,
    type: "png",
    omitBackground: false,
    clip: {
      x: 0,
      y: 0,
      width: device.canvas.width,
      height: device.canvas.height,
    },
  });
  await page.close();

  console.log(`[${device.id}] slide ${slide.id} → ${path.relative(PACKAGE_ROOT, outPath)}`);
}

function outputFilename(device: DeviceProfile, slide: Slide): string {
  const prefix = device.id.includes("ipad") ? "IPAD_13" : "IPHONE_69";
  return `${prefix}_${slide.id}.png`;
}

/**
 * Looks for the raw screenshot in the per-device folder first, then
 * falls back to the legacy flat `raw/` location for backwards
 * compatibility with the old single-device layout.
 */
function resolveRawPath(rawDir: string, filename: string): string {
  const namespaced = path.join(rawDir, filename);
  if (existsSync(namespaced)) return namespaced;
  return path.join(PACKAGE_ROOT, "raw", filename);
}

async function loadAsDataUri(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const base64 = buffer.toString("base64");
  return `data:image/png;base64,${base64}`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
