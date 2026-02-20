import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from './constants';

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={[styles.container, styles.success]}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View style={[styles.container, styles.error]}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View style={[styles.container, styles.info]}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  error: {
    backgroundColor: COLORS.error,
  },
  info: {
    backgroundColor: COLORS.info,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.white,
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.white,
    marginTop: 4,
  },
});
