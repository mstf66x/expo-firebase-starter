import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  /** Center content vertically (e.g. auth screens). */
  centered?: boolean;
}

export function Screen({ children, centered = false }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className={`flex-1 px-5 py-4 ${centered ? 'justify-center' : ''}`}>{children}</View>
    </SafeAreaView>
  );
}
