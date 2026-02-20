import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmed'>;

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';
const PRIMARY_SURFACE = '#E3F2FD';

export default function BookingConfirmedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [shareNeighbors, setShareNeighbors] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Ionicons name="menu" size={26} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>
          <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Carry</Text>
          <Text style={{ color: PRIMARY_DARK, fontWeight: 'bold' }}> On</Text>
        </Text>
        <Ionicons name="notifications-outline" size={24} color="#212121" />
      </View>

      {/* Map Image */}
      <Image
        source={require('../../../assets/map_background.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Share checkbox */}
        <TouchableOpacity
          style={styles.shareRow}
          onPress={() => setShareNeighbors(!shareNeighbors)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, shareNeighbors && styles.checkboxActive]}>
            {shareNeighbors && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.shareLabel}>Share delivery with neighbors</Text>
            <Text style={styles.shareSubLabel}>For extra discount</Text>
          </View>
        </TouchableOpacity>

        {/* Recipient name */}
        <Text style={styles.recipientName}>Sara</Text>
        <Text style={styles.orderInfo}>order: 560023 | #33, Brook-field, 560013</Text>

        {/* Dates */}
        <View style={styles.datesRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Dispatched</Text>
            <Text style={styles.dateValue}>4:30 pm | 23 Jan 24</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Deliver by</Text>
            <Text style={styles.dateValue}>8:30 pm | 24 Jan 24</Text>
          </View>
        </View>

        {/* Track Shipments */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.trackBtnText}>Track Shipments</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color={PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#757575" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  brandTitle: { fontSize: 22, fontWeight: 'bold' },
  mapImage: { width: '100%', height: 240 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  shareRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    borderColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  shareLabel: { fontSize: 14, fontWeight: '500', color: '#212121' },
  shareSubLabel: { fontSize: 12, color: '#757575', marginTop: 2 },
  recipientName: { fontSize: 36, fontWeight: 'bold', color: '#212121', marginBottom: 4 },
  orderInfo: { fontSize: 13, fontWeight: '600', color: '#212121', marginBottom: 20 },
  datesRow: { flexDirection: 'row', marginBottom: 24 },
  dateBlock: { flex: 1 },
  dateLabel: { fontSize: 13, fontWeight: '600', color: '#212121', marginBottom: 4 },
  dateValue: { fontSize: 13, color: '#757575' },
  trackBtn: {
    backgroundColor: PRIMARY, borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center',
  },
  trackBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navItemActive: { backgroundColor: PRIMARY_SURFACE, borderRadius: 8, marginHorizontal: 4 },
});


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
