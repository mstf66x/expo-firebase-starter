import { Redirect, Stack } from 'expo-router';

import { ROUTES } from '@/constants/routes';
import { useIsAuthenticated } from '@/stores/auth-store';

export default function AuthLayout() {
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated) return <Redirect href={ROUTES.home} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
