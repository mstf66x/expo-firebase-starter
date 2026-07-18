# Contributing

Thanks for helping improve this starter kit! 🙌

## Development setup

```bash
git clone https://github.com/mstf66x/expo-firebase-starter.git
cd expo-firebase-starter
npm install
cp .env.example .env            # fill in your values
# add google-services.json + GoogleService-Info.plist (see README → Firebase)
npx expo run:ios                # or: npx expo run:android
```

> This project uses **native Firebase**, so it runs on a **dev build**, not Expo
> Go. See the README for the one-time native setup.

## Before you open a PR

- `npm run typecheck` — must pass
- `npm run lint` — must pass
- Keep changes focused; one concern per PR.
- Never commit `.env`, `google-services.json`, or `GoogleService-Info.plist`.

## Conventions

- TypeScript strict mode, no `any`.
- Styling via NativeWind `className` + design tokens (no inline hex/px).
- Side effects (analytics, logging) go through the service modules in
  `src/services/` — components never import Firebase directly.
- State lives in Zustand stores under `src/stores/`.

## Commit messages

Short, imperative, present tense: `add auth guard to protected routes`.
