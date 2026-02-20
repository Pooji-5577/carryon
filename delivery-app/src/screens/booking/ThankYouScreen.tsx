import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ThankYou'>;

const PRIMARY = '#1E88E5';
const PRIMARY_SURFACE = '#DDEEFF';

export default function ThankYouScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.center}>
        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeInner}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        <Text style={styles.heading}>Thank you</Text>
        <Text style={styles.subtext}>
          Your booking has been placed sent to{'\n'}Md. Sharif Ahmed
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('BookingConfirmed', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>View Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 28 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  badge: {
    width: 130, height: 130, borderRadius: 34,
    backgroundColor: PRIMARY_SURFACE,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 36,
    transform: [{ rotate: '0deg' }],
  },
  badgeInner: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: PRIMARY_SURFACE,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 48, color: PRIMARY, fontWeight: 'bold' },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 14 },
  subtext: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 22 },
  btn: {
    backgroundColor: PRIMARY, borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
