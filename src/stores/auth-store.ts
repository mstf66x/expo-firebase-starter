import { create } from 'zustand';

import { identifyUser, resetAnalytics, track } from '@/analytics';
import {
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
  subscribeToAuthState,
  type AppUser,
} from '@/services/firebase';
import { log } from '@/utils/logger';

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';

/** User-facing copy for the auth error codes we surface. English by default. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/user-not-found': 'No account found for that email.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/email-already-in-use': 'An account already exists for that email.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

const DEFAULT_AUTH_ERROR = 'Something went wrong. Please try again.';

const authErrorCode = (error: unknown): string => {
  const hasCode = typeof error === 'object' && error !== null && 'code' in error;
  if (!hasCode) return 'unknown';
  return String((error as { code: unknown }).code);
};

const messageFor = (code: string): string => AUTH_ERROR_MESSAGES[code] ?? DEFAULT_AUTH_ERROR;

interface AuthState {
  user: AppUser | null;
  status: AuthStatus;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'initializing',
  error: null,

  signIn: async (email, password) => {
    set({ error: null });
    try {
      await signInWithEmail(email, password);
      track('sign_in_succeeded', { method: 'password' });
    } catch (error) {
      const code = authErrorCode(error);
      track('auth_failed', { action: 'sign_in', code });
      set({ error: messageFor(code) });
    }
  },

  signUp: async (email, password) => {
    set({ error: null });
    try {
      await signUpWithEmail(email, password);
      track('sign_up_succeeded', { method: 'password' });
    } catch (error) {
      const code = authErrorCode(error);
      track('auth_failed', { action: 'sign_up', code });
      set({ error: messageFor(code) });
    }
  },

  signOut: async () => {
    try {
      await signOutUser();
      track('sign_out', {});
      resetAnalytics();
    } catch (error) {
      log.warn('[auth] sign out failed', error);
    }
  },

  clearError: () => set({ error: null }),
}));

let unsubscribe: (() => void) | null = null;

/**
 * Wires the store to Firebase auth. Call once at app boot. Idempotent — a second
 * call is a no-op so hot reload can't stack listeners.
 */
export const initializeAuth = (): void => {
  if (unsubscribe) return;
  unsubscribe = subscribeToAuthState((user) => {
    if (user) identifyUser(user.uid);
    useAuthStore.setState({ user, status: user ? 'authenticated' : 'unauthenticated' });
  });
};

export const useAuthUser = (): AppUser | null => useAuthStore((state) => state.user);
export const useAuthStatus = (): AuthStatus => useAuthStore((state) => state.status);
export const useIsAuthenticated = (): boolean =>
  useAuthStore((state) => state.status === 'authenticated');
export const useAuthError = (): string | null => useAuthStore((state) => state.error);
