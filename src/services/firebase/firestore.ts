import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

import { FIRESTORE_COLLECTIONS } from '@/constants/storage-keys';

/** Example domain document — swap for your own model. */
export interface Profile {
  displayName: string;
  updatedAt?: FirebaseFirestoreServerTimestamp;
}

type FirebaseFirestoreServerTimestamp = ReturnType<typeof serverTimestamp>;

const profileRef = (uid: string) => doc(getFirestore(), FIRESTORE_COLLECTIONS.profiles, uid);

export const getProfile = async (uid: string): Promise<Profile | null> => {
  const snapshot = await getDoc(profileRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as Profile;
};

export const saveProfile = async (uid: string, data: Pick<Profile, 'displayName'>): Promise<void> => {
  await setDoc(profileRef(uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const subscribeToProfile = (
  uid: string,
  listener: (profile: Profile | null) => void,
): (() => void) =>
  onSnapshot(profileRef(uid), (snapshot) =>
    listener(snapshot.exists() ? (snapshot.data() as Profile) : null),
  );
