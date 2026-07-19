import type { DeviceProfile } from "./types.ts";

/**
 * iPad Pro 13" (M4) marketing master.
 *
 * Apple accepts both 2048×2732 (iPad Pro 12.9", 6th gen) and
 * 2064×2752 (iPad Pro 13", M4) as iPad master sizes — the visual
 * difference is ~0.8% and ASC auto-derives smaller variants. We
 * render at the 12.9" master so the vendored fastlane PNG (which is
 * 12.9" 4th gen) lines up natively with no scaling drift.
 *
 * Layout values are scaled up to fit the larger iPad canvas — the
 * device naturally takes more vertical space, so headline/badge sit
 * higher than on the iPhone master.
 */
export const ipadPro13: DeviceProfile = {
  id: "ipad-pro-13",
  label: 'iPad Pro 13"',
  canvas: { width: 2048, height: 2732 },
  framePath: "assets/ipad-pro-13.png",
  framePngWidth: 2245,
  framePngHeight: 2930,
  screenOffsetTop: 102,
  screenOffsetLeft: 96,
  screenWidth: 2048,
  screenHeight: 2732,
  screenCornerRadiusNative: 36,
  deviceScale: 0.82,
  defaultPerspective: {
    perspectivePx: 3200,
    rotateYDeg: -10,
    rotateXDeg: 4,
  },
  layout: {
    headlineTop: 160,
    headlineMaxWidth: 1700,
    badgeTop: 440,
    badgeWidth: 480,
    frameTop: 700,
  },
  defaultHeadlineSize: 130,
};
