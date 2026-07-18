import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

/** Minimal, serializable user shape the app consumes (never the raw SDK user). */
export interface AppUser {
  uid: string;
  email: string | null;
}

type FirebaseUser = ReturnType<typeof getAuth>['currentUser'];

const mapUser = (user: FirebaseUser): AppUser | null => {
  if (!user) return null;
  return { uid: user.uid, email: user.email };
};

export const getCurrentUser = (): AppUser | null => mapUser(getAuth().currentUser);

export const subscribeToAuthState = (listener: (user: AppUser | null) => void): (() => void) =>
  onAuthStateChanged(getAuth(), (user) => listener(mapUser(user)));

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(getAuth(), email, password);
};

export const signUpWithEmail = async (email: string, password: string): Promise<void> => {
  await createUserWithEmailAndPassword(getAuth(), email, password);
};

export const signOutUser = async (): Promise<void> => {
  await signOut(getAuth());
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(getAuth(), email);
};
