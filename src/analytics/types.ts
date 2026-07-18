/** Only enums, booleans, counts or buckets — never raw amounts, notes, or names. */
export type EventProps = Record<string, string | number | boolean>;
export type UserProps = Record<string, string | number | boolean>;

/**
 * A concrete analytics backend (Firebase, PostHog, a no-op, …). Add a provider
 * by implementing this interface — call sites never change.
 */
export interface AnalyticsProvider {
  readonly name: string;
  logEvent(event: string, props: EventProps): void;
  logScreen(screenName: string): void;
  setUserId(userId: string | null): void;
  setUserProps(props: UserProps): void;
  reset(): void;
}
