import type { ViewStyle } from 'react-native';

/** iOS continuous (squircle) corners; a no-op on Android. Spread onto rounded surfaces. */
export const squircle: Pick<ViewStyle, 'borderCurve'> = { borderCurve: 'continuous' };
