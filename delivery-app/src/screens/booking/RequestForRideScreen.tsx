import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';
const PRIMARY_SURFACE = '#E3F2FD';

const PAYMENT_METHODS = [
  {
    id: 'visa',
    label: '**** **** **** 8970',
    sub: 'Expires: 12/26',
    icon: require('../../../assets/payment_visa.png'),
  },
  {
    id: 'mastercard',
    label: '**** **** **** 8970',
    sub: 'Expires: 12/26',
    icon: require('../../../assets/payment_mastercard.png'),
  },
  {
    id: 'paypal',
    label: 'mailaddress@mail.com',
    sub: 'Expires: 12/26',
    icon: require('../../../assets/payment_paypal.png'),
  },
  {
    id: 'cash',
    label: 'Cash',
    sub: '',
    icon: require('../../../assets/payment_cash.png'),
  },
];

const RequestForRideScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [selectedPayment, setSelectedPayment] = useState('visa');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="menu" size={26} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>
          <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Carry</Text>
          <Text style={{ color: PRIMARY_DARK, fontWeight: 'bold' }}> On</Text>
        </Text>
        <Ionicons name="notifications-outline" size={24} color="#212121" />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Page title */}
        <View style={styles.pageTitleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Request for Ride</Text>
        </View>

        {/* Route */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <Ionicons name="location" size={22} color="#E53935" style={{ marginTop: 2 }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.routeLabel}>Current location</Text>
              <Text style={styles.routeAddress}>2972 Westheimer Rd. Santa Ana, Illinois 85486</Text>
            </View>
          </View>
          {/* Dashed connector */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 22, alignItems: 'center' }}>
              <View style={styles.dashedLine} />
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View style={styles.routeRow}>
            <Ionicons name="location" size={22} color="#43A047" style={{ marginTop: 2 }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.routeLabel}>Office</Text>
              <Text style={styles.routeAddress}>1901 Thornridge Cir. Shiloh, Hawaii 81063</Text>
            </View>
            <Text style={styles.routeDistance}>1.1km</Text>
          </View>
        </View>

        {/* Car Card */}
        <View style={styles.carCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.carName}>Mustang Shelby GT</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={styles.ratingText}>4.9 (531 reviews)</Text>
            </View>
          </View>
          <Image
            source={require('../../../assets/car_mustang.png')}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Charge */}
        <Text style={styles.sectionTitle}>Charge</Text>
        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>Fair Price</Text>
          <Text style={styles.chargeValue}>$200</Text>
        </View>
        <View style={[styles.chargeRow, { marginTop: 6 }]}>
          <Text style={styles.chargeLabel}>Tax (5%)</Text>
          <Text style={styles.chargeValue}>$20</Text>
        </View>

        {/* Payment methods */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Select payment method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.paymentCard, selectedPayment === method.id && styles.paymentCardActive]}
            onPress={() => setSelectedPayment(method.id)}
            activeOpacity={0.75}
          >
            <Image source={method.icon} style={styles.paymentIcon} resizeMode="contain" />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={styles.paymentLabel}>{method.label}</Text>
              {method.sub ? <Text style={styles.paymentSub}>{method.sub}</Text> : null}
            </View>
          </TouchableOpacity>
        ))}

        {/* Continue */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('PaymentSuccess', { amount: 220 })}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  brandTitle: { fontSize: 22, fontWeight: 'bold' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: '600', color: '#212121', marginLeft: 8 },
  routeCard: { backgroundColor: '#fff', marginBottom: 16 },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
  dashedLine: {
    width: 2,
    height: 18,
    marginVertical: 2,
    borderStyle: 'dashed',
    borderLeftWidth: 2,
    borderColor: '#9E9E9E',
  },
  routeLabel: { fontSize: 14, fontWeight: '600', color: '#212121' },
  routeAddress: { fontSize: 12, color: '#757575', marginTop: 2, lineHeight: 17 },
  routeDistance: { fontSize: 13, fontWeight: '600', color: '#212121', alignSelf: 'flex-start', marginTop: 2 },
  carCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#DCE8E9', borderRadius: 12,
    backgroundColor: '#F6F9FA',
    padding: 14, marginBottom: 20,
  },
  carName: { fontSize: 16, fontWeight: '700', color: '#212121', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, color: '#757575' },
  carImage: { width: 110, height: 70 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#212121', marginBottom: 10 },
  chargeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chargeLabel: { fontSize: 14, color: '#757575' },
  chargeValue: { fontSize: 14, fontWeight: '600', color: '#212121' },
  paymentCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#DCE8E9', borderRadius: 10,
    backgroundColor: '#F6F9FA',
    padding: 14, marginBottom: 10,
  },
  paymentCardActive: { borderColor: PRIMARY, backgroundColor: PRIMARY_SURFACE },
  paymentIcon: { width: 52, height: 36 },
  paymentLabel: { fontSize: 14, fontWeight: '500', color: '#212121' },
  paymentSub: { fontSize: 12, color: '#757575', marginTop: 2 },
  continueBtn: {
    backgroundColor: PRIMARY, borderRadius: 12, height: 50,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  continueBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navItemActive: { backgroundColor: PRIMARY_SURFACE, borderRadius: 8, marginHorizontal: 4 },
});

export default RequestForRideScreen;
