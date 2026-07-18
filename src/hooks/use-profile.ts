import { useEffect, useState } from 'react';

import { subscribeToProfile, type Profile } from '@/services/firebase';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
}

/** Live-subscribes to the current user's Firestore profile document. */
export const useProfile = (uid: string | null): ProfileState => {
  // The only writer is the async snapshot callback; loading/profile for the
  // current uid are derived at render, so no synchronous setState in the effect.
  const [result, setResult] = useState<{ uid: string | null; profile: Profile | null }>({
    uid: null,
    profile: null,
  });

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = subscribeToProfile(uid, (profile) => setResult({ uid, profile }));
    return unsubscribe;
  }, [uid]);

  const settledForUid = result.uid === uid;
  return {
    profile: settledForUid ? result.profile : null,
    loading: uid !== null && !settledForUid,
  };
};
