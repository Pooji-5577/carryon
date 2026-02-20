import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const styles: ViewStyle[] = [baseStyles.button];

    // Size
    switch (size) {
      case 'small':
        styles.push(baseStyles.buttonSmall);
        break;
      case 'large':
        styles.push(baseStyles.buttonLarge);
        break;
      default:
        styles.push(baseStyles.buttonMedium);
    }

    // Variant
    switch (variant) {
      case 'secondary':
        styles.push(baseStyles.buttonSecondary);
        break;
      case 'outline':
        styles.push(baseStyles.buttonOutline);
        break;
      case 'ghost':
        styles.push(baseStyles.buttonGhost);
        break;
      default:
        styles.push(baseStyles.buttonPrimary);
    }

    // Full width
    if (fullWidth) {
      styles.push(baseStyles.fullWidth);
    }

    // Disabled
    if (disabled || loading) {
      styles.push(baseStyles.buttonDisabled);
    }

    return styles;
  };

  const getTextStyle = (): TextStyle[] => {
    const styles: TextStyle[] = [baseStyles.text];

    // Size
    switch (size) {
      case 'small':
        styles.push(baseStyles.textSmall);
        break;
      case 'large':
        styles.push(baseStyles.textLarge);
        break;
      default:
        styles.push(baseStyles.textMedium);
    }

    // Variant
    switch (variant) {
      case 'outline':
      case 'ghost':
        styles.push(baseStyles.textOutline);
        break;
      case 'secondary':
        styles.push(baseStyles.textSecondary);
        break;
      default:
        styles.push(baseStyles.textPrimary);
    }

    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  buttonSmall: {
    height: 40,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    height: SIZES.buttonHeight,
    paddingHorizontal: 24,
  },
  buttonLarge: {
    height: 60,
    paddingHorizontal: 32,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.small,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: FONTS.semiBold,
  },
  textSmall: {
    fontSize: SIZES.sm,
  },
  textMedium: {
    fontSize: SIZES.md,
  },
  textLarge: {
    fontSize: SIZES.lg,
  },
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.primary,
  },
});

export default Button;
