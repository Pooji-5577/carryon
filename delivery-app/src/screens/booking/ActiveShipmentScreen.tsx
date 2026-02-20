import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types';

type ActiveShipmentNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ActiveShipmentScreen: React.FC = () => {
  const navigation = useNavigation<ActiveShipmentNavigationProp>();
  const insets = useSafeAreaInsets();
  const [shareWithNeighbors, setShareWithNeighbors] = useState(true);

  const handleTrackShipments = () => {
    navigation.navigate('DeliveryDetails', { orderId: '560023' });
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

      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Image
            source={require('../../../assets/vehicle_truck_new.png')}
            style={styles.mapPlaceholder}
            resizeMode="cover"
          />
          {/* Time badge overlay */}
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>13 min  ···</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Share with neighbors */}
          <View style={styles.shareRow}>
            <TouchableOpacity
              style={[styles.checkbox, shareWithNeighbors && styles.checkboxChecked]}
              onPress={() => setShareWithNeighbors(!shareWithNeighbors)}
            >
              {shareWithNeighbors && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </TouchableOpacity>
            <View style={styles.shareTextContainer}>
              <Text style={styles.shareTitle}>Share delivery with neighbors</Text>
              <Text style={styles.shareSubtitle}>For extra discount</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Customer Name */}
          <Text style={styles.customerName}>Sara</Text>

          {/* Order Info */}
          <Text style={styles.orderInfo}>
            order: 560023 | #33, Brook-field, 560013
          </Text>

          {/* Dispatched / Deliver by */}
          <View style={styles.datesRow}>
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>Dispatched</Text>
              <Text style={styles.dateValue}>4:30 pm | 23 Jan 24</Text>
            </View>
            <View style={styles.dateColumnRight}>
              <Text style={styles.dateLabelRight}>Deliver by</Text>
              <Text style={styles.dateValueRight}>8:30 pm | 24 Jan 24</Text>
            </View>
          </View>

          {/* Track Shipments Button */}
          <TouchableOpacity style={styles.trackBtn} onPress={handleTrackShipments}>
            <Text style={styles.trackBtnText}>Track Shipments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#757575" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => navigation.navigate('Main')}
        >
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
  },
  menuBtn: { padding: 4 },
  brandTitle: { fontSize: 24, fontWeight: 'bold' },
  brandCarry: { color: '#1E88E5', fontWeight: 'bold' },
  brandOn: { color: '#1565C0', fontWeight: 'bold' },
  bellBtn: { padding: 4 },
  scrollView: { flex: 1 },
  mapContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#C8D8E8',
    position: 'relative',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  timeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  shareTextContainer: {},
  shareTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  shareSubtitle: {
    fontSize: 11,
    color: '#757575',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 6,
  },
  orderInfo: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 20,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  dateColumn: {},
  dateColumnRight: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  dateLabelRight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    color: '#757575',
  },
  dateValueRight: {
    fontSize: 13,
    color: '#757575',
  },
  trackBtn: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  trackBtnText: {
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

export default ActiveShipmentScreen;
