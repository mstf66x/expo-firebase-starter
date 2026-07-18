import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useScreenTracking } from '@/hooks/use-screen-tracking';
import { initializeAuth, useAuthStatus } from '@/stores/auth-store';

SplashScreen.preventAutoHideAsync();

// Boot-time side effect: wire the auth store to Firebase before the first frame.
initializeAuth();

export default function RootLayout() {
  const status = useAuthStatus();
  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useScreenTracking();

  // Keep the native splash up until Firebase reports the initial auth state.
  if (status === 'initializing') return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={hideSplash}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
