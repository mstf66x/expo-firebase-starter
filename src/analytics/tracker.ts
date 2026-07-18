import type { AnalyticsProvider, EventProps, UserProps } from '@/analytics/types';
import { log } from '@/utils/logger';

type ProviderAction = (provider: AnalyticsProvider) => void;

/**
 * Composite tracker: fans every call out to all providers, isolating failures so
 * one broken backend can never break another (or the app). This is the single
 * chokepoint — the app talks to `Tracker`, never to a provider directly.
 */
export class Tracker {
  private readonly providers: readonly AnalyticsProvider[];

  constructor(providers: readonly AnalyticsProvider[]) {
    this.providers = providers;
  }

  private fanOut(action: ProviderAction): void {
    this.providers.forEach((provider) => {
      try {
        action(provider);
      } catch (error) {
        log.warn(`[analytics] ${provider.name} failed`, error);
      }
    });
  }

  track(event: string, props: EventProps): void {
    this.fanOut((provider) => provider.logEvent(event, props));
  }

  screen(screenName: string): void {
    this.fanOut((provider) => provider.logScreen(screenName));
  }

  identify(userId: string, props: UserProps): void {
    this.fanOut((provider) => {
      provider.setUserId(userId);
      provider.setUserProps(props);
    });
  }

  reset(): void {
    this.fanOut((provider) => provider.reset());
  }
}
