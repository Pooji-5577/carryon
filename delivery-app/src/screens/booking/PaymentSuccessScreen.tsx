import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

const PRIMARY = '#1E88E5';
const PRIMARY_SURFACE = '#DDEEFF';

export default function PaymentSuccessScreen({ navigation, route }: Props) {
  const { amount = 220 } = route.params ?? {};
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

        <Text style={styles.heading}>Payment Success</Text>
        <Text style={styles.subtext}>
          Your money has been successfully sent to{'\n'}Sergio Ramasis
        </Text>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.divider} />
          <Text style={styles.amountValue}>${amount}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('ThankYou')}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Continue</Text>
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
    marginBottom: 28,
  },
  badgeInner: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: PRIMARY_SURFACE,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 48, color: PRIMARY, fontWeight: 'bold' },
  heading: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtext: { fontSize: 13, color: '#757575', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  amountCard: {
    width: '100%', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, paddingVertical: 20, paddingHorizontal: 24, alignItems: 'center',
  },
  amountLabel: { fontSize: 13, color: '#757575', marginBottom: 12 },
  divider: { width: '100%', height: 1, borderWidth: 1, borderColor: '#E0E0E0', borderStyle: 'dashed', marginBottom: 12 },
  amountValue: { fontSize: 40, fontWeight: 'bold', color: '#212121' },
  btn: {
    backgroundColor: PRIMARY, borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});


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
