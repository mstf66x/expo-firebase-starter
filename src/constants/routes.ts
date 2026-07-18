/**
 * Centralized route paths for expo-router. Import these instead of hardcoding
 * path strings at call sites so renames stay in one place. Group segments in
 * parens — (app), (auth) — are not part of the URL.
 */
export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
