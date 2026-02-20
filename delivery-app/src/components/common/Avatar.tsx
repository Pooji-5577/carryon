import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({ source, name, size = 48, style }) => {
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const textSize = size * 0.4;

  if (source) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={[styles.image, containerStyle]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.placeholder, containerStyle, style]}>
      <Text style={[styles.initials, { fontSize: textSize }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
  },
});

export default Avatar;
