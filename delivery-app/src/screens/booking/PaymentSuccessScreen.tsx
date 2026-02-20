import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export default function PaymentSuccessScreen({ navigation, route }: Props) {
  const { amount = 220 } = route.params ?? {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.center}>
          {/* ── SUCCESS CIRCLE ── */}
          <View style={styles.circleOuter}>
            <View style={styles.circleInner}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>

          <Text style={styles.heading}>Payment Success</Text>

          <Text style={styles.amount}>${amount}</Text>

          <Text style={styles.subtext}>
            Your payment has been processed{'\n'}successfully
          </Text>
        </View>

        {/* ── CONTINUE BUTTON ── */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('BookingConfirmed', { totalAmount: amount })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = '#1E88E5';
const PRIMARY_SURFACE = '#E3F2FD';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, justifyContent: 'space-between', paddingBottom: 40, paddingHorizontal: 28 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  circleOuter: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: PRIMARY_SURFACE, justifyContent: 'center', alignItems: 'center',
    marginBottom: 32,
  },
  circleInner: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center',
  },
  checkMark: { fontSize: 48, color: '#fff', fontWeight: 'bold' },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#212121', marginBottom: 24 },
  amount: { fontSize: 52, fontWeight: 'bold', color: PRIMARY, marginBottom: 16 },
  subtext: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 22 },
  continueBtn: {
    backgroundColor: PRIMARY, borderRadius: 14,
    height: 54, justifyContent: 'center', alignItems: 'center',
  },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
