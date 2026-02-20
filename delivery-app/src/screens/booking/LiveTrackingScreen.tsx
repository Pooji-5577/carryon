import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { useBooking } from '../../context/BookingContext';
import { useSocket } from '../../context/SocketContext';
import { RootStackParamList, Driver, OrderStatus } from '../../types';
import { formatDuration } from '../../utils/helpers';
import { mapsService } from '../../services/maps';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Rating from '../../components/common/Rating';
import Button from '../../components/common/Button';

type LiveTrackingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LiveTracking'>;
type LiveTrackingRouteProp = RouteProp<RootStackParamList, 'LiveTracking'>;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: COLORS.warning },
  confirmed: { label: 'Confirmed', color: COLORS.info },
  driver_assigned: { label: 'Driver Assigned', color: COLORS.info },
  driver_arrived: { label: 'Driver Arrived', color: COLORS.primary },
  pickup_complete: { label: 'Package Picked Up', color: COLORS.primary },
  in_transit: { label: 'In Transit', color: COLORS.primary },
  delivered: { label: 'Delivered', color: COLORS.success },
  cancelled: { label: 'Cancelled', color: COLORS.error },
};

const LiveTrackingScreen: React.FC = () => {
  const navigation = useNavigation<LiveTrackingNavigationProp>();
  const route = useRoute<LiveTrackingRouteProp>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const { orderId } = route.params;
  const { booking, currentOrder } = useBooking();
  const {
    joinOrderRoom,
    leaveOrderRoom,
    onDriverLocationUpdate,
    onOrderStatusUpdate,
    onETAUpdate,
    offDriverLocationUpdate,
    offOrderStatusUpdate,
    offETAUpdate,
  } = useSocket();

  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('driver_assigned');
  const [eta, setEta] = useState(15 * 60); // 15 minutes in seconds
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  // Mock driver data
  const driver: Driver = {
    id: '1',
    name: 'Rahul Kumar',
    phone: '+91 98765 43210',
    avatar: null,
    rating: 4.8,
    totalRides: 1250,
    vehicleType: 'car',
    vehicleNumber: 'DL 01 AB 1234',
    vehicleModel: 'Maruti Swift',
    latitude: 28.6139,
    longitude: 77.2090,
    isOnline: true,
  };

  useEffect(() => {
    // Join order room
    joinOrderRoom(orderId);

    // Set initial driver location
    if (booking.pickupLocation) {
      setDriverLocation({
        latitude: booking.pickupLocation.latitude + 0.005,
        longitude: booking.pickupLocation.longitude + 0.003,
      });
    }

    // Get route
    fetchRoute();

    // Set up listeners
    const handleDriverLocation = (data: { latitude: number; longitude: number }) => {
      setDriverLocation(data);
    };

    const handleOrderStatus = (data: { status: string }) => {
      setOrderStatus(data.status as OrderStatus);
      
      if (data.status === 'delivered') {
        setTimeout(() => {
          navigation.replace('Rating', { orderId });
        }, 2000);
      }
    };

    const handleETAUpdate = (data: { eta: number }) => {
      setEta(data.eta);
    };

    onDriverLocationUpdate(handleDriverLocation);
    onOrderStatusUpdate(handleOrderStatus);
    onETAUpdate(handleETAUpdate);

    // Simulate driver movement
    const interval = setInterval(() => {
      setDriverLocation((prev) => {
        if (!prev || !booking.pickupLocation) return prev;
        
        const targetLat = orderStatus === 'in_transit' 
          ? booking.dropLocation?.latitude || prev.latitude
          : booking.pickupLocation.latitude;
        const targetLng = orderStatus === 'in_transit'
          ? booking.dropLocation?.longitude || prev.longitude
          : booking.pickupLocation.longitude;

        const newLat = prev.latitude + (targetLat - prev.latitude) * 0.1;
        const newLng = prev.longitude + (targetLng - prev.longitude) * 0.1;

        return { latitude: newLat, longitude: newLng };
      });

      setEta((prev) => Math.max(0, prev - 30));
    }, 3000);

    return () => {
      leaveOrderRoom(orderId);
      offDriverLocationUpdate(handleDriverLocation);
      offOrderStatusUpdate(handleOrderStatus);
      offETAUpdate(handleETAUpdate);
      clearInterval(interval);
    };
  }, [orderId, orderStatus]);

  const fetchRoute = async () => {
    if (!booking.pickupLocation || !booking.dropLocation) return;

    const directions = await mapsService.getDirections(
      { lat: booking.pickupLocation.latitude, lng: booking.pickupLocation.longitude },
      { lat: booking.dropLocation.latitude, lng: booking.dropLocation.longitude }
    );

    if (directions) {
      const coords = mapsService.decodePolyline(directions.polyline);
      setRouteCoordinates(coords);
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${driver.phone}`);
  };

  const handleChat = () => {
    navigation.navigate('Chat', { orderId, driverId: driver.id });
  };

  const fitMapToMarkers = () => {
    if (!mapRef.current || !booking.pickupLocation || !booking.dropLocation) return;

    const coordinates = [
      { latitude: booking.pickupLocation.latitude, longitude: booking.pickupLocation.longitude },
      { latitude: booking.dropLocation.latitude, longitude: booking.dropLocation.longitude },
    ];

    if (driverLocation) {
      coordinates.push(driverLocation);
    }

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
      animated: true,
    });
  };

  useEffect(() => {
    const timer = setTimeout(fitMapToMarkers, 1000);
    return () => clearTimeout(timer);
  }, [booking.pickupLocation, booking.dropLocation, driverLocation]);

  const statusInfo = STATUS_LABELS[orderStatus];

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: booking.pickupLocation?.latitude || 28.6139,
          longitude: booking.pickupLocation?.longitude || 77.2090,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={COLORS.primary}
            strokeWidth={4}
          />
        )}

        {/* Pickup Marker */}
        {booking.pickupLocation && (
          <Marker
            coordinate={{
              latitude: booking.pickupLocation.latitude,
              longitude: booking.pickupLocation.longitude,
            }}
            title="Pickup"
          >
            <View style={[styles.marker, styles.pickupMarker]}>
              <Ionicons name="location" size={24} color={COLORS.white} />
            </View>
          </Marker>
        )}

        {/* Drop Marker */}
        {booking.dropLocation && (
          <Marker
            coordinate={{
              latitude: booking.dropLocation.latitude,
              longitude: booking.dropLocation.longitude,
            }}
            title="Drop"
          >
            <View style={[styles.marker, styles.dropMarker]}>
              <Ionicons name="flag" size={20} color={COLORS.white} />
            </View>
          </Marker>
        )}

        {/* Driver Marker */}
        {driverLocation && (
          <Marker coordinate={driverLocation} title="Driver">
            <View style={styles.driverMarker}>
              <Text style={styles.driverEmoji}>🚗</Text>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>
      </View>

      {/* ETA Banner */}
      <View style={styles.etaBanner}>
        <Ionicons name="time-outline" size={20} color={COLORS.white} />
        <Text style={styles.etaText}>
          Arriving in {formatDuration(eta)}
        </Text>
      </View>

      {/* Bottom Card */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 10 }]}>
        <Card style={styles.driverCard}>
          {/* Driver Info */}
          <View style={styles.driverInfo}>
            <Avatar source={driver.avatar} name={driver.name} size={56} />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <View style={styles.ratingContainer}>
                <Rating value={driver.rating} size={14} />
                <Text style={styles.ratingText}>{driver.rating}</Text>
                <Text style={styles.ridesText}>• {driver.totalRides} rides</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleChat}>
                <Ionicons name="chatbubble-outline" size={22} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={handleCall}>
                <Ionicons name="call" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vehicle Info */}
          <View style={styles.vehicleInfo}>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleNumber}>{driver.vehicleNumber}</Text>
              <Text style={styles.vehicleModel}>{driver.vehicleModel}</Text>
            </View>
          </View>

          {/* Route Summary */}
          <View style={styles.routeSummary}>
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.pickupDot]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {booking.pickupLocation?.address}
              </Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeItem}>
              <View style={[styles.routeDot, styles.dropDot]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {booking.dropLocation?.address}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  statusBadge: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.white,
  },
  etaBanner: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    ...SHADOWS.medium,
  },
  etaText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.white,
    marginLeft: 8,
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  pickupMarker: {
    backgroundColor: COLORS.primary,
  },
  dropMarker: {
    backgroundColor: COLORS.success,
  },
  driverMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  driverEmoji: {
    fontSize: 28,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding,
  },
  driverCard: {
    borderRadius: 20,
    ...SHADOWS.large,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  ridesText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: COLORS.success,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  vehicleDetails: {
    alignItems: 'center',
  },
  vehicleNumber: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  vehicleModel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  routeSummary: {
    paddingTop: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  pickupDot: {
    backgroundColor: COLORS.primary,
  },
  dropDot: {
    backgroundColor: COLORS.success,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.gray300,
    marginLeft: 4,
    marginVertical: 2,
  },
  routeText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default LiveTrackingScreen;
