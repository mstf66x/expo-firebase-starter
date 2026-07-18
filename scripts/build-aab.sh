#!/usr/bin/env bash
# Regenerate the native Android project from the Expo config and build a release
# App Bundle. Requires your release keystore to be configured (see fastlane/README.md).
set -euo pipefail

cd "$(dirname "$0")/.."

npx expo prebuild --platform android --clean
cd android && ./gradlew bundleRelease
