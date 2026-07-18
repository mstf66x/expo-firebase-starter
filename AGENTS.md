# Conventions

Guidelines for humans and AI agents working in this repo. Keep the foundation
clean so it stays a good starting point.

## Golden rules

- **Expo changes fast.** Check the versioned docs at
  <https://docs.expo.dev/versions/v57.0.0/> before using an unfamiliar API.
- **Run `npm run typecheck` after every change.** Strict mode, no `any`.
- **Never commit secrets** — `.env`, `google-services.json`,
  `GoogleService-Info.plist`, and signing keys are gitignored.

## Architecture boundaries

- **Firebase SDK lives only in `src/services/firebase/`.** Components, stores,
  and hooks import from that module — never `@react-native-firebase/*` directly.
- **Analytics goes through `@/analytics`.** Call the typed `track()` / `trackScreen()`
  facade; add event names to `src/analytics/events.ts` and backends by
  implementing `AnalyticsProvider`. Never import an analytics SDK at a call site.
- **Never call `console.*`** — import `log` from `src/utils/logger.ts`.
- **Shared state is Zustand** (`src/stores/`). Expose derived values as selector
  hooks; put side effects in action handlers, not effects.

## Styling

- **NativeWind `className` only** — colors/spacing/radii come from the design
  tokens in `src/global.css` + `tailwind.config.js`. No inline hex or px.
- Spread the `squircle` token (`src/styles`) on rounded surfaces; don't inline
  `borderCurve`.
- Every interactive element ships `accessibilityRole` + `accessibilityLabel`.

## Constants

- No hardcoded routes or storage keys — use `src/constants/`.
- No magic numbers — hoist semantic literals to named constants.
