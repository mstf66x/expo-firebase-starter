import { useId } from 'react';
import { Text, TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';

import { squircle } from '@/styles';

const PLACEHOLDER_COLOR = '#a1a1aa';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
}: TextFieldProps) {
  const inputId = useId();
  return (
    <View className="gap-1.5">
      <Text nativeID={inputId} className="text-sm font-medium text-muted">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER_COLOR}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        style={squircle}
        className="h-12 rounded-field border border-border bg-card px-4 text-base text-text"
        accessibilityLabel={label}
        aria-labelledby={inputId}
      />
    </View>
  );
}
