import type { AnalyticsProvider } from '@/analytics/types';

/** Default provider in dev / when analytics is disabled. Does nothing, safely. */
export class NoopProvider implements AnalyticsProvider {
  readonly name = 'noop';
  logEvent(): void {}
  logScreen(): void {}
  setUserId(): void {}
  setUserProps(): void {}
  reset(): void {}
}
