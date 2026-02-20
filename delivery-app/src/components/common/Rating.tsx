import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../utils/constants';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: number;
  showValue?: boolean;
  color?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 5,
  size = 16,
  showValue = false,
  color = COLORS.warning,
}) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;

  for (let i = 0; i < maxValue; i++) {
    if (i < fullStars) {
      stars.push(
        <Ionicons key={i} name="star" size={size} color={color} />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Ionicons key={i} name="star-half" size={size} color={color} />
      );
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={size} color={color} />
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{stars}</View>
      {showValue && <Text style={styles.value}>{value.toFixed(1)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  value: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});

export default Rating;
