/**
 * Keys for on-device persistence (Zustand `persist`, AsyncStorage). Defined once
 * so a rename can never silently orphan stored data.
 */
export const STORAGE_KEYS = {
  settings: 'app.settings',
} as const;

export const FIRESTORE_COLLECTIONS = {
  profiles: 'profiles',
} as const;
