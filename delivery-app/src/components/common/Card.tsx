import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = SIZES.padding,
  elevated = true,
}) => {
  const cardStyle = [
    styles.container,
    elevated && SHADOWS.small,
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
  },
});

export default Card;
