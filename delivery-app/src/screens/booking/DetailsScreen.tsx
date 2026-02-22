import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
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

const DetailsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [itemType, setItemType] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [payer, setPayer] = useState<'me' | 'recipient'>('me');
  const [paymentType, setPaymentType] = useState('');
  const [recipientName, setRecipientName] = useState('Donald Duck');
  const [recipientPhone, setRecipientPhone] = useState('08123456789');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="menu" size={26} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>
          <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Carry</Text>
          <Text style={{ color: PRIMARY_DARK, fontWeight: 'bold' }}> On</Text>
        </Text>
        <Ionicons name="notifications-outline" size={24} color="#212121" />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Back + Title */}
        <View style={styles.pageTitleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#212121" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Details</Text>
        </View>

        {/* What are you sending */}
        <Text style={styles.fieldLabel}>What are you sending</Text>
        <Text style={styles.fieldSub}>Select type of item (e.g gadget, document)</Text>
        <View style={styles.selectBox}>
          <Text style={itemType ? styles.selectText : styles.placeholderText}>
            {itemType || 'Select'}
          </Text>
        </View>

        {/* Warning */}
        <View style={styles.warningRow}>
          <Ionicons name="help-circle" size={18} color="#E53935" style={{ marginRight: 6, marginTop: 1 }} />
          <Text style={styles.warningText}>
            Our Prohibited Items include: blah, blah, blah, blah, blah, blah, blah, blah, blah, blah, blah, blah, blah, blah
          </Text>
        </View>

        {/* Quantity */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Quantity</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Select who pays */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Select who pays</Text>
        <View style={styles.radioRow}>
          <TouchableOpacity style={styles.radioItem} onPress={() => setPayer('me')}>
            <View style={[styles.radioCircle, payer === 'me' && styles.radioCircleActive]}>
              {payer === 'me' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioItem} onPress={() => setPayer('recipient')}>
            <View style={[styles.radioCircle, payer === 'recipient' && styles.radioCircleActive]}>
              {payer === 'recipient' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Recipient</Text>
          </TouchableOpacity>
        </View>

        {/* Payment type */}
        <View style={[styles.selectBox, { marginTop: 12 }]}>
          <Text style={styles.placeholderText}>Payment type</Text>
          <Ionicons name="chevron-down" size={18} color="#757575" />
        </View>

        {/* Recipient Names */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Recipient Names</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholderTextColor="#999"
          />
        </View>

        {/* Recipient contact */}
        <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Recipient contact number</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* Camera box */}
        <TouchableOpacity style={styles.cameraBox} activeOpacity={0.7}>
          <View style={styles.cameraIconCircle}>
            <Image
              source={require('../../../assets/camera_icon.png')}
              style={styles.cameraIconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cameraText}>Take a picture of the package</Text>
        </TouchableOpacity>

        {/* Continue */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('RequestForRide')}
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
  backBtn: { padding: 4 },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: '600', color: '#212121', marginLeft: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: '#212121', marginBottom: 6 },
  fieldSub: { fontSize: 12, color: '#757575', marginBottom: 8, marginTop: -4 },
  selectBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F6F9FA', borderRadius: 8, paddingHorizontal: 14, height: 52,
    borderWidth: 1, borderColor: '#DCE8E9',
  },
  selectText: { fontSize: 14, color: '#212121' },
  placeholderText: { fontSize: 14, color: '#9E9E9E' },
  warningRow: {
    flexDirection: 'row', marginTop: 8,
    backgroundColor: '#FFF8F8', borderRadius: 6, padding: 10,
  },
  warningText: { fontSize: 12, color: '#757575', flex: 1, lineHeight: 17 },
  inputBox: {
    backgroundColor: '#F6F9FA', borderRadius: 8, paddingHorizontal: 14, height: 52,
    justifyContent: 'center', borderWidth: 1, borderColor: '#DCE8E9',
  },
  inputText: { fontSize: 14, color: '#212121' },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 8 },
  radioItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2,
    borderColor: '#BDBDBD', alignItems: 'center', justifyContent: 'center',
  },
  radioCircleActive: { borderColor: PRIMARY },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY },
  radioLabel: { fontSize: 14, color: '#212121', fontWeight: '500' },
  cameraBox: {
    borderWidth: 1, borderColor: '#DCE8E9', borderStyle: 'dashed',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 22, marginTop: 18, backgroundColor: '#F6F9FA',
  },
  cameraIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#D6EAF8', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  cameraIconImage: { width: 26, height: 26 },
  cameraText: { fontSize: 13, color: '#757575' },
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

export default DetailsScreen;
