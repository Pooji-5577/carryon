import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { useBooking } from '../../context/BookingContext';
import { RootStackParamList, Vehicle } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

type VehicleSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock vehicle data
const VEHICLES: Vehicle[] = [
  {
    id: '1',
    type: 'bike',
    name: 'Bike',
    description: 'For small packages & documents',
    capacity: 'Up to 10 kg',
    maxWeight: '10 kg',
    basePrice: 30,
    pricePerKm: 8,
    icon: '🏍️',
    image: '',
  },
  {
    id: '2',
    type: 'car',
    name: 'Car',
    description: 'For medium packages',
    capacity: 'Up to 50 kg',
    maxWeight: '50 kg',
    basePrice: 80,
    pricePerKm: 15,
    icon: '🚗',
    image: '',
  },
  {
    id: '3',
    type: 'van',
    name: 'Van',
    description: 'For large packages & furniture',
    capacity: 'Up to 500 kg',
    maxWeight: '500 kg',
    basePrice: 200,
    pricePerKm: 25,
    icon: '🚐',
    image: '',
  },
  {
    id: '4',
    type: 'truck',
    name: 'Truck',
    description: 'For bulk shipments & moving',
    capacity: 'Up to 2000 kg',
    maxWeight: '2000 kg',
    basePrice: 500,
    pricePerKm: 40,
    icon: '🚚',
    image: '',
  },
];

const VehicleSelectionScreen: React.FC = () => {
  const navigation = useNavigation<VehicleSelectionNavigationProp>();
  const insets = useSafeAreaInsets();
  const { booking, setSelectedVehicle } = useBooking();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (booking.selectedVehicle) {
      setSelectedId(booking.selectedVehicle.id);
    }
  }, []);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedId(vehicle.id);
    setSelectedVehicle(vehicle);
  };

  const handleContinue = () => {
    if (selectedId) {
      navigation.navigate('PriceEstimation');
    }
  };

  const getVehicleColor = (type: string): string => {
    switch (type) {
      case 'bike':
        return COLORS.bike;
      case 'car':
        return COLORS.car;
      case 'van':
        return COLORS.van;
      case 'truck':
        return COLORS.truck;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Select Vehicle" />

      {/* Route Summary */}
      <View style={styles.routeSummary}>
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.pickupDot]} />
          <Text style={styles.routeText} numberOfLines={1}>
            {booking.pickupLocation?.address || 'Pickup'}
          </Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.dropDot]} />
          <Text style={styles.routeText} numberOfLines={1}>
            {booking.dropLocation?.address || 'Drop'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose your vehicle</Text>

        {VEHICLES.map((vehicle) => {
          const isSelected = selectedId === vehicle.id;
          const vehicleColor = getVehicleColor(vehicle.type);

          return (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleCard,
                isSelected && styles.vehicleCardSelected,
                isSelected && { borderColor: vehicleColor },
              ]}
              onPress={() => handleSelectVehicle(vehicle)}
              activeOpacity={0.7}
            >
              <View style={[styles.vehicleIcon, { backgroundColor: `${vehicleColor}20` }]}>
                <Text style={styles.vehicleEmoji}>{vehicle.icon}</Text>
              </View>

              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.vehicleDescription}>{vehicle.description}</Text>
                <View style={styles.vehicleSpecs}>
                  <View style={styles.specItem}>
                    <Ionicons name="cube-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={styles.specText}>{vehicle.capacity}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.vehiclePrice}>
                <Text style={styles.priceLabel}>Starting at</Text>
                <Text style={[styles.priceValue, isSelected && { color: vehicleColor }]}>
                  {formatCurrency(vehicle.basePrice)}
                </Text>
              </View>

              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: vehicleColor }]}>
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  routeSummary: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
    marginBottom: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    height: 20,
    backgroundColor: COLORS.gray300,
    marginLeft: 5,
    marginVertical: 4,
  },
  routeText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  vehicleCardSelected: {
    borderWidth: 2,
  },
  vehicleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleEmoji: {
    fontSize: 32,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  vehicleDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  vehicleSpecs: {
    flexDirection: 'row',
    marginTop: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  vehiclePrice: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    ...SHADOWS.medium,
  },
});

export default VehicleSelectionScreen;
