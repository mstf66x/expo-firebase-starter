/**
 * The event catalog. Each event name maps to its fully-typed payload, so
 * `track('sign_in_succeeded', …)` is checked at compile time. Names are the
 * ONLY place event strings live — group by domain, snake_case, past tense.
 */
type NoProps = Record<string, never>;

interface AuthEvents {
  sign_in_succeeded: { method: 'password' };
  sign_up_succeeded: { method: 'password' };
  sign_out: NoProps;
  auth_failed: { action: 'sign_in' | 'sign_up'; code: string };
}

interface ProfileEvents {
  profile_saved: NoProps;
}

export interface EventMap extends AuthEvents, ProfileEvents {}

export type EventName = keyof EventMap;
