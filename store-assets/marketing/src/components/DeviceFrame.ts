import type { Perspective } from "../config.ts";
import { type DeviceProfile, scaled } from "../devices/index.ts";

/**
 * Device-frame component — works for any `DeviceProfile`. The frame
 * PNG (transparent screen rectangle) sits on top of the app
 * screenshot; the whole composite is tilted by a single CSS 3D
 * transform.
 */
export function deviceFrameHtml(
  appScreenshotDataUri: string,
  framePngDataUri: string,
): string {
  return `
    <div class="device-stage">
      <div class="device">
        <img class="device-screen" src="${appScreenshotDataUri}" alt="" />
        <img class="device-bezel" src="${framePngDataUri}" alt="" />
      </div>
    </div>
  `;
}

export function deviceFrameCss(
  device: DeviceProfile,
  override: Perspective | undefined,
): string {
  const tilt = override ?? device.defaultPerspective;
  const depth = tilt.perspectivePx ?? device.defaultPerspective.perspectivePx;

  const frameW = scaled(device, device.framePngWidth);
  const frameH = scaled(device, device.framePngHeight);
  const screenW = scaled(device, device.screenWidth);
  const screenH = scaled(device, device.screenHeight);
  const screenTop = scaled(device, device.screenOffsetTop);
  const screenLeft = scaled(device, device.screenOffsetLeft);
  const screenRadius = scaled(device, device.screenCornerRadiusNative);
  const stageLeft = (device.canvas.width - frameW) / 2;

  return `
    .device-stage {
      position: absolute;
      top: ${device.layout.frameTop}px;
      left: ${stageLeft}px;
      width: ${frameW}px;
      height: ${frameH}px;
      perspective: ${depth}px;
      perspective-origin: 50% 30%;
    }

    .device {
      position: absolute;
      inset: 0;
      transform:
        rotateX(${tilt.rotateXDeg}deg)
        rotateY(${tilt.rotateYDeg}deg);
      filter: drop-shadow(0 50px 60px rgba(0,0,0,0.55));
    }

    .device-screen {
      position: absolute;
      top: ${screenTop}px;
      left: ${screenLeft}px;
      width: ${screenW}px;
      height: ${screenH}px;
      object-fit: fill;
      display: block;
      border-radius: ${screenRadius}px;
      z-index: 1;
    }

    .device-bezel {
      position: absolute;
      top: 0;
      left: 0;
      width: ${frameW}px;
      height: ${frameH}px;
      pointer-events: none;
      z-index: 2;
    }
  `;
}
