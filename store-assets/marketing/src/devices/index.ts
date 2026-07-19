import type { DeviceProfile } from "./types.ts";
import { iphone16ProMax } from "./iphone-16-pro-max.ts";
import { ipadPro13 } from "./ipad-pro-13.ts";

export const DEVICES: ReadonlyArray<DeviceProfile> = [iphone16ProMax, ipadPro13];

export const DEFAULT_DEVICE_ID = iphone16ProMax.id;

export function findDevice(id: string): DeviceProfile {
  const found = DEVICES.find((d) => d.id === id);
  if (!found) {
    const known = DEVICES.map((d) => d.id).join(", ");
    throw new Error(`Unknown device "${id}". Known: ${known}.`);
  }
  return found;
}

export type { DeviceProfile } from "./types.ts";
export { scaled } from "./types.ts";
