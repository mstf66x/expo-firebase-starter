/**
 * Central logger. Never call `console.*` directly — import `log` from here.
 * Dev breadcrumbs (log/info/debug) are stripped in release; warn/error always fire.
 */
type LogArgs = readonly unknown[];

const noop = (..._args: LogArgs): void => {};

export const log = {
  log: __DEV__ ? (...args: LogArgs): void => console.log(...args) : noop,
  info: __DEV__ ? (...args: LogArgs): void => console.info(...args) : noop,
  debug: __DEV__ ? (...args: LogArgs): void => console.debug(...args) : noop,
  warn: (...args: LogArgs): void => console.warn(...args),
  error: (...args: LogArgs): void => console.error(...args),
} as const;
