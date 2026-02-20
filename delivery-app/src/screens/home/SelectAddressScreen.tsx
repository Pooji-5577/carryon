import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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

const RECENT_PLACES = [
  { id: 1, name: 'Hospital', address: 'Zydus Corporate Park, Scheme No. 63,Khoraj', distance: '2.7km' },
  { id: 2, name: 'Coffee shop', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', distance: '1.1km' },
  { id: 3, name: 'College', address: 'Nirma Universit ,Sarkhej - Gandhinagar Hwy, Gota', distance: '4.9km' },
];

const SelectAddressScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

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

      {/* Map */}
      <Image
        source={require('../../../assets/map_background.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Bottom Sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetTitle}>Select address</Text>

          {/* From */}
          <View style={styles.inputRow}>
            <Ionicons name="location" size={20} color="#E53935" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Form"
              placeholderTextColor={PRIMARY}
              value={from}
              onChangeText={setFrom}
            />
          </View>

          {/* To */}
          <View style={[styles.inputRow, { marginTop: 10 }]}>
            <View style={styles.greenDot} />
            <TextInput
              style={styles.input}
              placeholder="To"
              placeholderTextColor="#43A047"
              value={to}
              onChangeText={setTo}
            />
          </View>

          {/* Recent places */}
          <Text style={styles.recentTitle}>Recent places</Text>
          {RECENT_PLACES.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeRow}
              onPress={() => navigation.navigate('Details')}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={22} color={PRIMARY} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
              <Text style={styles.placeDistance}>{place.distance}</Text>
            </TouchableOpacity>
          ))}

          <View style={{ height: 20 }} />

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('Details')}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  brandTitle: { fontSize: 22, fontWeight: 'bold' },
  mapImage: { width: '100%', height: 220 },
  sheet: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    marginTop: -20, paddingHorizontal: 20, paddingTop: 12,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '600', color: '#212121', marginBottom: 16 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 10,
    paddingHorizontal: 12, height: 50,
  },
  greenDot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: '#43A047', marginRight: 10,
  },
  input: { flex: 1, fontSize: 14, color: '#212121' },
  recentTitle: { fontSize: 15, fontWeight: '600', color: '#212121', marginTop: 20, marginBottom: 10 },
  placeRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  placeName: { fontSize: 14, fontWeight: '600', color: '#212121' },
  placeAddress: { fontSize: 12, color: '#757575', marginTop: 2, lineHeight: 16 },
  placeDistance: { fontSize: 13, fontWeight: '600', color: '#212121', marginLeft: 8 },
  nextButton: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  nextButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navItemActive: { backgroundColor: PRIMARY_SURFACE, borderRadius: 8, marginHorizontal: 4 },
});

export default SelectAddressScreen;
