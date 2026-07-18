#!/usr/bin/env bash
# Regenerate the native iOS project from the Expo config and install pods.
# Fastlane's iOS `build` lane runs this, then calls gym to produce the IPA.
set -euo pipefail

cd "$(dirname "$0")/.."

npx expo prebuild --platform ios --clean
cd ios && pod install
