import { MD3LightTheme } from 'react-native-paper';
import { COLORS, FONTS } from './constants';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
    onPrimary: COLORS.white,
    onSecondary: COLORS.white,
    onBackground: COLORS.textPrimary,
    onSurface: COLORS.textPrimary,
    outline: COLORS.border,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: { fontFamily: FONTS.regular },
    medium: { fontFamily: FONTS.medium },
    bold: { fontFamily: FONTS.bold },
  },
  roundness: 12,
};
