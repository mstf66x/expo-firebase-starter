import type { DeviceProfile } from "./types.ts";

export const iphone16ProMax: DeviceProfile = {
  id: "iphone-16-pro-max",
  label: 'iPhone 16 Pro Max (6.9")',
  canvas: { width: 1290, height: 2796 },
  framePath: "assets/iphone-16-pro-max.png",
  framePngWidth: 1470,
  framePngHeight: 3000,
  screenOffsetTop: 217,
  screenOffsetLeft: 75,
  screenWidth: 1320,
  screenHeight: 2717,
  screenCornerRadiusNative: 168,
  deviceScale: 0.62,
  defaultPerspective: {
    perspectivePx: 2200,
    rotateYDeg: -16,
    rotateXDeg: 5,
  },
  layout: {
    headlineTop: 130,
    headlineMaxWidth: 980,
    badgeTop: 380,
    badgeWidth: 280,
    frameTop: 620,
  },
  defaultHeadlineSize: 96,
};
