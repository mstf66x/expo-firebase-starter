import { usePathname } from 'expo-router';
import { useEffect } from 'react';

import { trackScreen } from '@/analytics';

/**
 * Auto-fires a screen event whenever the route changes. An effect is the right
 * tool here: we react to expo-router's `pathname` changing over time.
 */
export const useScreenTracking = (): void => {
  const pathname = usePathname();
  useEffect(() => {
    trackScreen(pathname);
  }, [pathname]);
};
