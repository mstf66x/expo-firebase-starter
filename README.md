# Expo + Firebase Starter Kit

> A production-ready **Expo (React Native) + Firebase** boilerplate for **solo developers** — native **Firestore, Auth & Analytics**, **Expo Router**, **TypeScript**, **NativeWind (Tailwind CSS)**, **Zustand**, and **Fastlane**. No EAS required.

<p>
  <img alt="Expo SDK 57" src="https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black">
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-native-FFCA28?logo=firebase&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg">
</p>

Stop re-wiring the same auth, analytics, and release plumbing on every new app.
This starter gives you a **typed, opinionated foundation** so you can ship the
idea, not the boilerplate — built for **indie hackers and solo devs** who own the
whole stack.

## ✨ Features

- 🔐 **Firebase Auth** — email/password sign-in & sign-up with a clean, guarded routing flow
- 🗄️ **Cloud Firestore** — typed document helpers + a live-subscribing profile example
- 📊 **Provider-agnostic analytics** — a single typed `track()` facade fanning out to swappable providers (Firebase Analytics included, no-op in dev)
- 🧭 **Expo Router** — file-based, typed routes with protected `(app)` / `(auth)` groups
- 🎨 **NativeWind (Tailwind CSS)** — token-driven light/dark theming from a single source of truth
- 🐻 **Zustand** — minimal state with persisted settings (`AsyncStorage`)
- 🚀 **Fastlane** — local TestFlight & Google Play lanes, **no EAS**
- 🧱 **TypeScript strict** + centralized constants, logger, and feature flags

## 🧰 Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 57 · React Native 0.86 · React 19 |
| Routing | Expo Router (typed routes) |
| Backend | Firebase — `@react-native-firebase` (Auth, Firestore, Analytics) |
| Styling | NativeWind v4 (Tailwind CSS) with CSS-variable design tokens |
| State | Zustand + `zustand/persist` |
| Language | TypeScript (strict) |
| Release | Fastlane (local prebuild → TestFlight / Play) |

## ⚠️ Requires a dev build (not Expo Go)

This starter uses **native Firebase modules**, which Expo Go cannot load. You run
it on a **development build** via `expo run:ios` / `expo run:android` — no EAS, all
local.

## 🚀 Quick start

```bash
# 1. Use this template (GitHub) or clone
git clone https://github.com/mstf66x/expo-firebase-starter.git
cd expo-firebase-starter
npm install

# 2. Configure env + Firebase (see below)
cp .env.example .env

# 3. Build & run the dev client
npm run ios        # or: npm run android
```

### Firebase setup

1. Create a Firebase project and register an **iOS** and **Android** app using the
   bundle id / package `com.example.expofirebasestarter` (change it in `app.json`).
2. Download the config files and drop them in the project root:
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
   > Templates are provided as `*.example`. The real files are **gitignored** — never commit them.
3. Enable **Email/Password** under Authentication, and create a **Firestore** database.
4. `npm run ios` — the prebuild step wires the native SDKs automatically.

## 📁 Project structure

```
src/
├── app/                    # Expo Router routes (file-based)
│   ├── _layout.tsx         # root: boots auth, splash, screen tracking
│   ├── (auth)/             # signed-out group (sign-in / sign-up)
│   └── (app)/              # protected group (home, profile demo)
├── analytics/              # provider-agnostic analytics
│   ├── index.ts            # typed track() / trackScreen() facade
│   ├── events.ts           # the event catalog (names live here only)
│   ├── tracker.ts          # composite fan-out chokepoint
│   └── providers/          # firebase.ts · noop.ts (swap/add freely)
├── services/firebase/      # the ONLY place the Firebase SDK is imported
│   ├── auth.ts             # sign in/up/out, auth-state subscription
│   └── firestore.ts        # typed document helpers + Profile example
├── stores/                 # Zustand: auth-store, settings-store (persisted)
├── components/ui/          # Button, TextField, Screen (NativeWind + a11y)
├── constants/              # routes, storage keys, collections
├── config/                 # env + feature flags
├── hooks/                  # use-profile, use-screen-tracking
├── styles/                 # shared style tokens
├── utils/logger.ts         # central logger (never call console directly)
└── global.css              # Tailwind directives + color design tokens
```

## 📊 Analytics architecture

The app never touches an analytics SDK directly. It calls a single typed facade:

```ts
import { track } from '@/analytics';

track('sign_in_succeeded', { method: 'password' }); // payload is type-checked
```

`track()` → the composite **`Tracker`** → fans out to every registered provider,
isolating failures so one broken backend can't break another. Swap Firebase for
PostHog (or add both) by implementing the `AnalyticsProvider` interface — **call
sites never change**. Event names live only in `events.ts`, and payloads carry
only enums/booleans/counts (privacy-preserving by default).

## 🚀 Release with Fastlane (no EAS)

Local lanes regenerate the native projects with `expo prebuild`, then build:

```bash
npm run ios:beta          # → TestFlight
npm run android:internal  # → Play internal track
```

See [`fastlane/README.md`](fastlane/README.md) for the required env vars.

## 🖼️ App Store screenshots included

A headless **App Store screenshot generator** ships in
[`store-assets/marketing/`](store-assets/marketing/) — device frame + headline +
gradient, rendered from HTML/CSS via Puppeteer. Drop raw screenshots into `raw/`,
edit the slides JSON, and render 1290×2796 (iPhone) / 2064×2752 (iPad) store art:

```bash
cd store-assets/marketing && npm install
npm run generate:iphone   # → out/iphone/IPHONE_69_<n>.png
```

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run ios` / `android` | Build & launch the dev client |
| `npm start` | Start Metro (dev client) |
| `npm run prebuild` | Regenerate native `ios/` & `android/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint via `expo lint` |

## 🤝 Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md).

## 📄 License

[MIT](LICENSE) — free for personal and commercial use.

---

<sub>Keywords: expo firebase starter, react native firebase boilerplate, expo router
typescript template, nativewind tailwind starter, zustand, firestore auth analytics,
fastlane no eas, solo developer mobile starter kit.</sub>
