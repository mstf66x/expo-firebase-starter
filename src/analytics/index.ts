import { FirebaseAnalyticsProvider } from '@/analytics/providers/firebase';
import { NoopProvider } from '@/analytics/providers/noop';
import { Tracker } from '@/analytics/tracker';
import type { AnalyticsProvider, UserProps } from '@/analytics/types';
import { features } from '@/config/features';

import type { EventMap, EventName } from '@/analytics/events';

const buildProviders = (): readonly AnalyticsProvider[] =>
  features.analyticsEnabled ? [new FirebaseAnalyticsProvider()] : [new NoopProvider()];

const tracker = new Tracker(buildProviders());

/** Type-safe event tracking. The payload shape is enforced per event name. */
export const track = <K extends EventName>(event: K, props: EventMap[K]): void => {
  tracker.track(event, props);
};

export const trackScreen = (screenName: string): void => {
  tracker.screen(screenName);
};

export const identifyUser = (userId: string, props: UserProps = {}): void => {
  tracker.identify(userId, props);
};

export const resetAnalytics = (): void => {
  tracker.reset();
};

export type { EventName } from '@/analytics/events';
