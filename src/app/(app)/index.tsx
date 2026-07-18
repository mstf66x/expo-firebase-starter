import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { track } from '@/analytics';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useProfile } from '@/hooks/use-profile';
import { saveProfile } from '@/services/firebase';
import { useAuthStore, useAuthUser } from '@/stores/auth-store';
import { useSettingsStore, useThemeMode, type ThemeMode } from '@/stores/settings-store';
import { squircle } from '@/styles';

const THEME_MODES: readonly ThemeMode[] = ['system', 'light', 'dark'];

export default function HomeScreen() {
  const user = useAuthUser();
  const signOut = useAuthStore((state) => state.signOut);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const themeMode = useThemeMode();

  const { profile, loading } = useProfile(user?.uid ?? null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = displayName.trim().length > 0 && !saving && Boolean(user);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    await saveProfile(user.uid, { displayName: displayName.trim() });
    track('profile_saved', {});
    setDisplayName('');
    setSaving(false);
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-text">Home</Text>
          <Text className="text-base text-muted">{user?.email ?? 'Signed in'}</Text>
        </View>

        <View style={squircle} className="gap-3 rounded-card border border-border bg-card p-4">
          <Text className="text-sm font-medium text-muted">Firestore profile</Text>
          <Text className="text-lg text-text">
            {loading ? 'Loading…' : (profile?.displayName ?? 'No display name yet')}
          </Text>
          <TextField
            label="Set display name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Ada Lovelace"
            autoCapitalize="words"
          />
          <Button label="Save profile" onPress={save} loading={saving} disabled={!canSave} />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-muted">Theme</Text>
          <View className="flex-row gap-2">
            {THEME_MODES.map((mode) => {
              const selected = mode === themeMode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => setThemeMode(mode)}
                  style={squircle}
                  className={`flex-1 items-center rounded-field border py-2.5 ${
                    selected ? 'border-brand bg-brand' : 'border-border bg-surface'
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={`${mode} theme`}
                  accessibilityState={{ selected }}>
                  <Text
                    className={`text-sm font-semibold capitalize ${
                      selected ? 'text-brand-fg' : 'text-text'
                    }`}>
                    {mode}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Button label="Sign out" onPress={signOut} variant="secondary" />
        </View>
      </ScrollView>
    </Screen>
  );
}
