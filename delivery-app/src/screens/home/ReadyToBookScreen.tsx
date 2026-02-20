import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

type ReadyToBookNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ReadyToBookScreen: React.FC = () => {
  const navigation = useNavigation<ReadyToBookNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleLetsRide = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={26} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.brandTitle}>
          <Text style={styles.brandCarry}>Carry</Text>
          <Text style={styles.brandOn}> On</Text>
        </Text>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      {/* Vehicle Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/vehicle_truck_new.png')}
          style={styles.vehicleImage}
          resizeMode="contain"
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContent}>
        <Text style={styles.heading}>You are ready to Book</Text>
        <Text style={styles.subtitle}>
          Your account is now activated. Lets book your first load
        </Text>
      </View>

      <View style={styles.spacer} />

      {/* Lets Ride Button */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.letsRideBtn} onPress={handleLetsRide}>
          <Text style={styles.letsRideBtnText}>Lets Ride</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color="#1E88E5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#757575" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0,
  },
  menuBtn: {
    padding: 4,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  brandCarry: {
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  brandOn: {
    color: '#1565C0',
    fontWeight: 'bold',
  },
  bellBtn: {
    padding: 4,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxHeight: 260,
  },
  vehicleImage: {
    width: '100%',
    height: 220,
  },
  textContent: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#757575',
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 24,
  },
  letsRideBtn: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  letsRideBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

export default ReadyToBookScreen;
