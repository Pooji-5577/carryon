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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';
const PRIMARY_SURFACE = '#E3F2FD';

const VEHICLES = [
  { id: 0, icon: require('../../../assets/group_vehicle.png'), label: 'Bike' },
  { id: 1, icon: require('../../../assets/van_vehicle.png'), label: 'Van' },
  { id: 2, icon: require('../../../assets/vector_truck.png'), label: 'Truck' },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity><Ionicons name="menu" size={26} color="#212121" /></TouchableOpacity>
        <Text style={styles.brandTitle}>
          <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Carry</Text>
          <Text style={{ color: PRIMARY_DARK, fontWeight: 'bold' }}> On</Text>
        </Text>
        <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#212121" /></TouchableOpacity>
      </View>

      <LinearGradient colors={['rgba(47,128,237,0.2)', '#FFFFFF']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Banner with background image */}
        <View style={styles.bannerWrap}>
          <Image
            source={require('../../../assets/rectangle_22.png')}
            style={styles.bannerBg}
            resizeMode="cover"
          />
          <View style={styles.bannerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerWelcome}>Welcome, Devansh</Text>
              <Text style={styles.bannerTitle}>We are Ready to{'\n'}Serve</Text>
            </View>
            <Image
              source={require('../../../assets/ellipse_4.png')}
              style={styles.bannerProfile}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Pickup Location */}
        <Text style={styles.fieldLabel}>Pickup Location</Text>
        <View style={styles.inputRow}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>📍</Text>
          <TextInput style={styles.input} placeholder="32 Samwell Sq, Chevron" value={pickup} onChangeText={setPickup} placeholderTextColor="#999" />
        </View>

        {/* Delivery Location */}
        <Text style={styles.fieldLabel}>Delivery Location</Text>
        <View style={styles.inputRow}>
          <Text style={{ fontSize: 16, marginRight: 8, color: '#43A047' }}>○</Text>
          <TextInput style={styles.input} placeholder="21b, Karimu Kotun Street, Victoria Island" value={destination} onChangeText={setDestination} placeholderTextColor="#999" />
        </View>

        {/* Vehicle Type */}
        <Text style={styles.sectionTitle}>Vehicle Type</Text>
        <View style={styles.vehicleRow}>
          {VEHICLES.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vehicleCard, selectedVehicle === v.id && styles.vehicleCardActive]}
              onPress={() => setSelectedVehicle(v.id)}
              activeOpacity={0.8}
            >
              <Image source={v.icon} style={styles.vehicleIcon} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Our services */}
        <Text style={styles.sectionTitle}>Our services</Text>
        <View style={styles.servicesRow}>
          <View style={styles.serviceItem}>
            <View style={styles.serviceImageBox}>
              <Image source={require('../../../assets/clip_path_group_1.png')} style={styles.serviceImage} resizeMode="contain" />
            </View>
            <Text style={styles.serviceTitle}>Same day{'\n'}delivery</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceImageBox}>
              <Image source={require('../../../assets/clip_path_group.png')} style={styles.serviceImage} resizeMode="contain" />
            </View>
            <Text style={styles.serviceTitle}>Overnight{'\n'}delivery</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.serviceImageBox}>
              <Image source={require('../../../assets/mask_group.png')} style={styles.serviceImage} resizeMode="contain" />
            </View>
            <Text style={styles.serviceTitle}>Express{'\n'}delivery</Text>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={() => navigation.navigate('SelectAddress' as any)}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>

      </View>
      </LinearGradient>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}><Ionicons name="search-outline" size={24} color="#757575" /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Ionicons name="chatbubbles-outline" size={24} color="#757575" /></TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}><Ionicons name="home" size={24} color={PRIMARY} /></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile' as any)}><Ionicons name="person-outline" size={24} color="#757575" /></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  brandTitle: { fontSize: 22, fontWeight: 'bold' },
  bannerWrap: { marginTop: 0, marginBottom: 6, overflow: 'hidden', height: 100 },
  bannerBg: { position: 'absolute', width: '100%', height: '100%' },
  bannerContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12 },
  bannerWelcome: { fontSize: 11, color: 'rgba(255,255,255,0.9)', marginBottom: 2 },
  bannerTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', lineHeight: 22 },
  bannerProfile: { width: 56, height: 56, borderRadius: 28 },
  fieldLabel: { fontSize: 12, color: '#757575', paddingHorizontal: 16, marginTop: 6, marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 6, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, backgroundColor: '#F8F8F8', paddingHorizontal: 12 },
  input: { flex: 1, height: 40, fontSize: 13, color: '#212121' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#212121', paddingHorizontal: 16, marginTop: 10, marginBottom: 8 },
  vehicleRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  vehicleCard: { flex: 1, height: 56, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  vehicleCardActive: { backgroundColor: PRIMARY_SURFACE, borderWidth: 2, borderColor: PRIMARY },
  vehicleIcon: { width: 28, height: 28 },
  servicesRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  serviceItem: { flex: 1, alignItems: 'center' },
  serviceImageBox: { width: 70, height: 70, borderRadius: 12, backgroundColor: 'rgba(47,128,237,0.2)', alignItems: 'center', justifyContent: 'center' },
  serviceImage: { width: 54, height: 54 },
  serviceTitle: { fontSize: 10, fontWeight: '500', color: '#212121', textAlign: 'center', lineHeight: 13, marginTop: 4 },
  nextBtn: { backgroundColor: PRIMARY, borderRadius: 14, height: 46, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 10, marginBottom: 8 },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navItemActive: { backgroundColor: PRIMARY_SURFACE, borderRadius: 8, marginHorizontal: 4 },
});

export default HomeScreen;