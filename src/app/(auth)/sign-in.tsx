import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useAuthError, useAuthStore } from '@/stores/auth-store';

type Mode = 'sign_in' | 'sign_up';

const COPY: Record<Mode, { title: string; cta: string; switchPrompt: string; switchAction: string }> = {
  sign_in: {
    title: 'Welcome back',
    cta: 'Sign in',
    switchPrompt: "Don't have an account?",
    switchAction: 'Create one',
  },
  sign_up: {
    title: 'Create your account',
    cta: 'Sign up',
    switchPrompt: 'Already have an account?',
    switchAction: 'Sign in',
  },
};

export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const clearError = useAuthStore((state) => state.clearError);
  const error = useAuthError();

  const copy = COPY[mode];
  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  const submit = async () => {
    setSubmitting(true);
    const action = mode === 'sign_in' ? signIn : signUp;
    await action(email.trim(), password);
    setSubmitting(false);
  };

  const toggleMode = () => {
    clearError();
    setMode((current) => (current === 'sign_in' ? 'sign_up' : 'sign_in'));
  };

  return (
    <Screen centered>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="gap-6">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-text">{copy.title}</Text>
          <Text className="text-base text-muted">Expo · Firebase · TypeScript starter</Text>
        </View>

        <View className="gap-4">
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />
        </View>

        {error ? (
          <Text className="text-sm text-danger" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <Button label={copy.cta} onPress={submit} loading={submitting} disabled={!canSubmit} />

        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-muted">{copy.switchPrompt}</Text>
          <Pressable onPress={toggleMode} accessibilityRole="button" accessibilityLabel={copy.switchAction}>
            <Text className="text-sm font-semibold text-brand">{copy.switchAction}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
