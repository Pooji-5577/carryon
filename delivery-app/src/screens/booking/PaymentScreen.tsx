import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';
const PRIMARY_SURFACE = '#E3F2FD';
const SUCCESS_GREEN = '#43A047';

const PAYMENT_METHODS = [
  { id: 'VISA', icon: require('../../../assets/payment_icon_1.png') },
  { id: 'MASTERCARD', icon: require('../../../assets/payment_icon_2.png') },
  { id: 'CASH', icon: require('../../../assets/payment_icon_3.png') },
  { id: 'WALLET', icon: require('../../../assets/payment_icon.png') },
];

export default function PaymentScreen({ navigation, route }: Props) {
  const { totalAmount = 150 } = route.params ?? {};
  const [selectedMethod, setSelectedMethod] = useState('VISA');
  const [email, setEmail] = useState('');

  const handleConfirm = () => {
    navigation.navigate('PaymentSuccess', {
      amount: totalAmount,
      bookingId: `BK${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: selectedMethod,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.titleBlue}>Carry</Text>
          <Text style={styles.titleDark}> On</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.pageTitle}>Request for Ride</Text>
        <Text style={styles.pageSubtitle}>Select payment method</Text>

        {/* Visa Card Image */}
        <Image
          source={require('../../../assets/rectangle_22.png')}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Price Section */}
        <Text style={styles.priceLabel}>This is price of the package</Text>
        <Text style={styles.priceValue}>${totalAmount}</Text>

        {/* Email Field */}
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#BDBDBD"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Payment Method Icons */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.methodRow}>
          {PAYMENT_METHODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.methodCard,
                selectedMethod === m.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(m.id)}
              activeOpacity={0.8}
            >
              <Image source={m.icon} style={styles.methodIcon} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button (Green) */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleConfirm} activeOpacity={0.85}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: 22, color: '#212121' },
  titleRow: { flexDirection: 'row' },
  titleBlue: { fontSize: 22, fontWeight: 'bold', color: PRIMARY },
  titleDark: { fontSize: 22, fontWeight: 'bold', color: PRIMARY_DARK },
  bellBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  scroll: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
  pageSubtitle: { fontSize: 13, color: '#757575', marginTop: 4, marginBottom: 20 },
  cardImage: { width: '100%', height: 180, borderRadius: 16, marginBottom: 24 },
  priceLabel: { fontSize: 14, color: '#757575', marginBottom: 8 },
  priceValue: { fontSize: 28, fontWeight: 'bold', color: PRIMARY, marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: '#757575', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12,
    padding: 14, fontSize: 14, color: '#212121', backgroundColor: '#F8F8F8', marginBottom: 20,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#212121', marginBottom: 12 },
  methodRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  methodCard: {
    flex: 1, height: 70, borderRadius: 12, backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  methodCardSelected: {
    backgroundColor: PRIMARY_SURFACE,
    borderWidth: 2, borderColor: PRIMARY,
  },
  methodIcon: { width: 36, height: 36 },
  continueBtn: {
    backgroundColor: SUCCESS_GREEN, borderRadius: 14,
    height: 54, justifyContent: 'center', alignItems: 'center',
  },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});