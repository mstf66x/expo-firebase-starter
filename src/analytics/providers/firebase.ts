import {
  getAnalytics,
  logEvent,
  logScreenView,
  resetAnalyticsData,
  setUserId,
  setUserProperty,
} from '@react-native-firebase/analytics';

import type { AnalyticsProvider, EventProps, UserProps } from '@/analytics/types';

/**
 * Firebase Analytics backend. The ONLY file in the app allowed to import the
 * Firebase Analytics SDK — everything else goes through the analytics facade.
 * The composite Tracker wraps every call in try/catch, so this stays lean.
 */
export class FirebaseAnalyticsProvider implements AnalyticsProvider {
  readonly name = 'firebase';

  logEvent(event: string, props: EventProps): void {
    logEvent(getAnalytics(), event, props);
  }

  logScreen(screenName: string): void {
    logScreenView(getAnalytics(), { screen_name: screenName, screen_class: screenName });
  }

  setUserId(userId: string | null): void {
    setUserId(getAnalytics(), userId);
  }

  setUserProps(props: UserProps): void {
    const analytics = getAnalytics();
    Object.entries(props).forEach(([key, value]) => setUserProperty(analytics, key, String(value)));
  }

  reset(): void {
    resetAnalyticsData(getAnalytics());
  }
}
