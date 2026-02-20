import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryDetails'>;

const PRIMARY = '#1E88E5';
const PRIMARY_DARK = '#1565C0';

const DeliveryDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState<'delivery' | 'ride'>('delivery');
  const { orderId = '560023' } = route.params || {};

  const handleDelivered = () => {
    navigation.navigate('Main');
  };

  const handleUnsuccessful = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <Text style={{ fontSize: 22 }}>☰</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.titleBlue}>Carry</Text>
          <Text style={styles.titleDark}> On</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Text style={{ fontSize: 20 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Delivery / Ride Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setSelectedTab('delivery')}>
          <Text style={[styles.tabLabel, selectedTab === 'delivery' && styles.tabLabelActive]}>
            Delivery
          </Text>
          <View style={[styles.tabLine, selectedTab === 'delivery' && styles.tabLineActive]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setSelectedTab('ride')}>
          <View style={styles.tabRideRow}>
            <Text style={[styles.tabLabel, selectedTab === 'ride' && styles.tabLabelActive]}>
              Ride
            </Text>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
          </View>
          <View style={[styles.tabLine, selectedTab === 'ride' && styles.tabLineActive]} />
        </TouchableOpacity>
      </View>
      <View style={styles.dividerLine} />

      <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Track your shipment */}
        <View style={styles.trackHeader}>
          <Text style={styles.trackTitle}>Track your shipment</Text>
          <View style={styles.selectBox}>
            <TextInput
              style={styles.selectInput}
              value="Select"
              editable={false}
            />
            <Text style={styles.selectArrow}>▼</Text>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={{ color: '#999', fontSize: 13 }}>🗺️ Route Map</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>13 min  ●●●</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Your Package Section */}
          <View style={styles.packageRow}>
            <Image
              source={require('../../../assets/image_3.png')}
              style={styles.packageImage}
              resizeMode="cover"
            />
            <View style={styles.packageInfo}>
              <Text style={styles.packageTitle}>Your Package</Text>
              <Text style={styles.packageOrder}>Order #{orderId}</Text>
            </View>
          </View>

          {/* Timeline Items */}
          <TimelineItem
            icon="📊"
            label="Transit"
            location="3nE.Bandung"
            date="22Dec,2021"
            time="12:30pm"
          />
          <View style={styles.timelineConnector} />
          <TimelineItem
            icon="📦"
            label="Sent Package"
            location="JnE.north BekoPf"
            date="22Dec,2021"
            time="12:30pm"
          />

          <View style={styles.sectionDivider} />

          {/* Sender / Receiver Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Sender's Name</Text>
              <Text style={styles.infoValue}>Phoebe</Text>
            </View>
            <View style={styles.infoColRight}>
              <Text style={styles.infoLabel}>Sender's Number</Text>
              <Text style={styles.infoValue}>028607329</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Receiver's Name</Text>
              <Text style={styles.infoValue}>Paul</Text>
            </View>
            <View style={styles.infoColRight}>
              <Text style={styles.infoLabel}>Receiver's Number</Text>
              <Text style={styles.infoValue}>028607329</Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* Delivery Method & Fee */}
          <View style={styles.methodRow}>
            <Text style={styles.methodLabel}>Delivery Method: </Text>
            <Text style={styles.methodValue}>COD</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Delivery Fee: </Text>
            <Text style={styles.feeValue}>150</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.unsuccessfulBtn} onPress={handleUnsuccessful}>
              <Text style={styles.unsuccessfulBtnText}>Unsuccessful</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deliveredBtn} onPress={handleDelivered}>
              <Text style={styles.deliveredBtnText}>Delivered</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 22 }}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 22 }}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={{ fontSize: 22 }}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 22 }}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

function TimelineItem({
  icon, label, location, date, time,
}: {
  icon: string; label: string; location: string; date: string; time: string;
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIcon}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={styles.timelineBody}>
        <Text style={styles.timelineLabel}>{label}</Text>
        <Text style={styles.timelineLocation}>{location}</Text>
      </View>
      <View style={styles.timelineDates}>
        <Text style={styles.timelineDate}>{date}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
  },
  menuBtn: { padding: 4 },
  titleRow: { flexDirection: 'row' },
  titleBlue: { fontSize: 24, fontWeight: 'bold', color: PRIMARY },
  titleDark: { fontSize: 24, fontWeight: 'bold', color: PRIMARY_DARK },
  bellBtn: { padding: 4 },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 4 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  tabLabel: { fontSize: 15, color: '#757575' },
  tabLabelActive: { fontWeight: '600', color: '#212121' },
  tabRideRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  newBadge: { backgroundColor: PRIMARY, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  newBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  tabLine: { height: 3, width: '100%', backgroundColor: 'transparent', borderRadius: 2, marginTop: 6 },
  tabLineActive: { backgroundColor: PRIMARY },
  dividerLine: { height: 1, backgroundColor: '#EEEEEE' },
  trackHeader: { paddingHorizontal: 16, paddingVertical: 12 },
  trackTitle: { fontSize: 18, fontWeight: 'bold', color: '#212121', marginBottom: 8 },
  selectBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, backgroundColor: '#F8F8F8', paddingHorizontal: 14 },
  selectInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#212121' },
  selectArrow: { fontSize: 12, color: '#757575' },
  mapContainer: { width: '100%', height: 180, backgroundColor: '#C8D8E8', position: 'relative' },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  timeBadge: {
    position: 'absolute', bottom: 12, left: 12, backgroundColor: '#fff',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  timeBadgeText: { fontSize: 12, fontWeight: '600', color: '#212121' },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  packageRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  packageImage: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  packageInfo: {},
  packageTitle: { fontSize: 15, fontWeight: '600', color: '#212121' },
  packageOrder: { fontSize: 12, color: '#757575' },
  timelineItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  timelineIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  timelineBody: { flex: 1 },
  timelineLabel: { fontSize: 13, fontWeight: '600', color: '#212121' },
  timelineLocation: { fontSize: 12, color: '#757575' },
  timelineDates: { alignItems: 'flex-end' },
  timelineDate: { fontSize: 12, fontWeight: '500', color: '#212121' },
  timelineTime: { fontSize: 12, color: '#757575' },
  timelineConnector: { height: 12, width: 1, backgroundColor: '#E0E0E0', marginLeft: 22, marginVertical: 2 },
  sectionDivider: { height: 1, backgroundColor: '#EEEEEE', marginVertical: 16 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  infoCol: { flex: 1 },
  infoColRight: { flex: 1, alignItems: 'flex-end' },
  infoLabel: { fontSize: 12, color: '#757575', fontWeight: '500', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#212121' },
  methodRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  methodLabel: { fontSize: 14, fontWeight: '500', color: '#212121' },
  methodValue: { fontSize: 14, fontWeight: '600', color: '#212121' },
  feeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  feeLabel: { fontSize: 14, fontWeight: '500', color: '#212121' },
  feeValue: { fontSize: 14, fontWeight: 'bold', color: PRIMARY },
  actionBtns: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  unsuccessfulBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: '#CCCCCC', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  unsuccessfulBtnText: { fontSize: 14, fontWeight: '600', color: '#757575' },
  deliveredBtn: { flex: 1, height: 50, borderRadius: 12, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  deliveredBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: 8, paddingBottom: 8 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  navItemActive: { backgroundColor: '#E3F2FD', borderRadius: 8, marginHorizontal: 4 },
});

export default DeliveryDetailsScreen;