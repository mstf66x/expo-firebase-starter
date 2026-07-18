/**
 * Typed access to `EXPO_PUBLIC_*` env vars. These are inlined at build time and
 * are PUBLIC — never put secrets here. Real secrets (service accounts, signing
 * keys) stay outside the repo. See `.env.example`.
 */
const readBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
};

export const env = {
  analyticsEnabled: readBool(process.env.EXPO_PUBLIC_ANALYTICS_ENABLED, !__DEV__),
} as const;
