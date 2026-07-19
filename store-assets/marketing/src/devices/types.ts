/**
 * A `DeviceProfile` bundles every dimension/asset that varies between
 * iPhone and iPad outputs. Components/layout/generator take a profile
 * instead of importing global constants — that keeps the renderer
 * device-agnostic.
 */
export type DeviceProfile = {
  /** Stable ID used as `--device <id>` and as the slides filename suffix. */
  id: string;
  /** Human label, surfaced in CLI output. */
  label: string;

  /** App Store master canvas dimensions (full output PNG). */
  canvas: { width: number; height: number };

  /** Vendored device-frame PNG (transparent screen rectangle). */
  framePath: string;
  framePngWidth: number;
  framePngHeight: number;
  /** Screen rectangle inside the frame PNG, all in PNG-pixel coordinates. */
  screenOffsetTop: number;
  screenOffsetLeft: number;
  screenWidth: number;
  screenHeight: number;
  /** Inner screen corner radius (PNG-pixel coordinates). */
  screenCornerRadiusNative: number;

  /** Scale at which the device frame renders inside the canvas. */
  deviceScale: number;

  /** Default tilt; per-slide perspective overrides this. */
  defaultPerspective: {
    perspectivePx: number;
    rotateYDeg: number;
    rotateXDeg: number;
  };

  /** Vertical positions of headline, badge, and frame inside the canvas. */
  layout: {
    headlineTop: number;
    headlineMaxWidth: number;
    badgeTop: number;
    badgeWidth: number;
    frameTop: number;
  };

  /** Default headline font-size; slides may override. */
  defaultHeadlineSize: number;
};

/**
 * Helper that resolves a numeric token through the device-scale factor
 * — components use it to keep arithmetic local + readable.
 */
export function scaled(profile: DeviceProfile, n: number): number {
  return Math.round(n * profile.deviceScale);
}
