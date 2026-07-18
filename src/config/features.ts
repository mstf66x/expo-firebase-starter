import { env } from '@/config/env';

/**
 * Feature flags — the single switchboard for turning subsystems on/off.
 * Keep values boolean and derive them from `env` or build type, never scatter
 * `__DEV__` / env checks across the app.
 */
export const features = {
  analyticsEnabled: env.analyticsEnabled,
} as const satisfies Record<string, boolean>;
