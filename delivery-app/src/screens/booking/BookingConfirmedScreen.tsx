import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmed'>;

export default function BookingConfirmedScreen({ navigation, route }: Props) {
  const {
    bookingId = 'BK123456',
    pickupAddress = 'Jl. Sudirman 42',
    deliveryAddress = 'Jl. Gatot Subroto 12',
    vehicle = 'Mini Truck',
    paymentMethod = 'COD',
    totalAmount = 150,
  } = route.params ?? {};

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── SUCCESS CIRCLE ── */}
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        {/* ── HEADING ── */}
        <Text style={styles.heading}>Thank you</Text>
        <Text style={styles.subheading}>
          Your booking has been successfully{"\n"}confirmed. We will be sending you{"\n"}an email with all the details.
        </Text>

        {/* ── BOOKING ID CHIP ── */}
        <View style={styles.idChip}>
          <Text style={styles.idChipText}>Booking ID: {bookingId}</Text>
        </View>

        {/* ── ORDER DETAILS CARD ── */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order Details</Text>

          <DetailRow icon="📍" label="Pickup" value={pickupAddress} />
          <DetailRow icon="🏠" label="Destination" value={deliveryAddress} />
          <DetailRow icon="🚛" label="Vehicle" value={vehicle} />
          <DetailRow icon="💳" label="Payment" value={paymentMethod} />

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* ── BUTTONS ── */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ActiveShipment')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Track My Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.outlineBtnText}>Go to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';
const PRIMARY_SURFACE = '#E3F2FD';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: {
    flexGrow: 1, padding: 28, alignItems: 'center', paddingBottom: 48,
  },
  circleOuter: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: PRIMARY_SURFACE, justifyContent: 'center', alignItems: 'center',
    marginTop: 48, marginBottom: 8,
  },
  circleInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: PRIMARY, justifyContent: 'center', alignItems: 'center',
  },
  checkMark: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  heading: {
    fontSize: 26, fontWeight: 'bold', color: '#212121',
    marginTop: 20, marginBottom: 8,
  },
  subheading: {
    fontSize: 14, color: '#757575', textAlign: 'center',
    lineHeight: 22, marginBottom: 28,
  },
  idChip: {
    backgroundColor: PRIMARY_SURFACE, borderRadius: 50,
    paddingHorizontal: 18, paddingVertical: 8, marginBottom: 32,
  },
  idChipText: { fontSize: 13, fontWeight: '600', color: PRIMARY_DARK },
  detailsCard: {
    width: '100%', backgroundColor: '#F8FAFF', borderRadius: 16,
    padding: 20, elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
    marginBottom: 32,
  },
  detailsTitle: { fontSize: 15, fontWeight: 'bold', color: '#212121', marginBottom: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  detailIcon: { fontSize: 18, marginRight: 10 },
  detailLabel: { fontSize: 11, color: '#757575' },
  detailValue: { fontSize: 13, fontWeight: '500', color: '#212121' },
  divider: { height: 1, backgroundColor: '#E8EAF6', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#212121' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: PRIMARY },
  primaryBtn: {
    width: '100%', backgroundColor: PRIMARY, borderRadius: 14,
    height: 54, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  outlineBtn: {
    width: '100%', borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 14,
    height: 54, justifyContent: 'center', alignItems: 'center',
  },
  outlineBtnText: { fontSize: 16, fontWeight: '600', color: PRIMARY },
});
