import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../utils/constants';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  onBackPress,
  rightComponent,
  transparent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 10 },
        transparent && styles.transparent,
        style,
      ]}
    >
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={transparent ? COLORS.white : COLORS.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.centerContainer}>
        {title && (
          <Text
            style={[styles.title, transparent && styles.titleTransparent]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>
      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  leftContainer: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  titleTransparent: {
    color: COLORS.white,
  },
});

export default Header;
