import { ActivityIndicator, Pressable, Text } from 'react-native';

import { squircle } from '@/styles';

type Variant = 'primary' | 'secondary';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}

const BASE = 'h-12 flex-row items-center justify-center rounded-field px-5';

const CONTAINER: Record<Variant, string> = {
  primary: 'bg-brand active:opacity-90',
  secondary: 'bg-surface border border-border active:opacity-70',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-brand-fg font-semibold',
  secondary: 'text-text font-semibold',
};

const SPINNER_COLOR: Record<Variant, string> = {
  primary: '#ffffff',
  secondary: '#71717a',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={squircle}
      className={`${BASE} ${CONTAINER[variant]} ${isDisabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}>
      {loading ? (
        <ActivityIndicator color={SPINNER_COLOR[variant]} />
      ) : (
        <Text className={`text-base ${LABEL[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
