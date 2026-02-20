import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { useBooking } from '../../context/BookingContext';
import { RootStackParamList } from '../../types';
import { formatCurrency, formatDistance, formatDuration } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';

type PriceEstimationNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PriceEstimationScreen: React.FC = () => {
  const navigation = useNavigation<PriceEstimationNavigationProp>();
  const insets = useSafeAreaInsets();
  const {
    booking,
    isCalculatingFare,
    calculateFare,
    applyPromoCode,
    removePromoCode,
    setPaymentMethod,
  } = useBooking();

  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    calculateFare();
  }, []);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    const result = await applyPromoCode(promoInput.trim());
    setIsApplyingPromo(false);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Promo Applied',
        text2: 'Discount has been applied to your order',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Promo',
        text2: result.message || 'This promo code is not valid',
      });
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoInput('');
  };

  const handleConfirmBooking = () => {
    navigation.navigate('DriverMatching');
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: 'cash-outline' },
    { id: 'upi', label: 'UPI', icon: 'qr-code-outline' },
    { id: 'card', label: 'Card', icon: 'card-outline' },
    { id: 'wallet', label: 'Wallet', icon: 'wallet-outline' },
  ];

  if (isCalculatingFare && booking.totalFare === 0) {
    return <Loading fullScreen text="Calculating fare..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Price Estimation" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.tripInfo}>
            <View style={styles.tripRoute}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, styles.pickupDot]} />
                <View style={styles.routeTextContainer}>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  <Text style={styles.routeAddress} numberOfLines={1}>
                    {booking.pickupLocation?.address}
                  </Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, styles.dropDot]} />
                <View style={styles.routeTextContainer}>
                  <Text style={styles.routeLabel}>Drop</Text>
                  <Text style={styles.routeAddress} numberOfLines={1}>
                    {booking.dropLocation?.address}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tripStats}>
              <View style={styles.statItem}>
                <Ionicons name="navigate-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statValue}>{formatDistance(booking.distance)}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statValue}>{formatDuration(booking.duration)}</Text>
                <Text style={styles.statLabel}>ETA</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Vehicle Info */}
        <Card style={styles.vehicleCard}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleEmoji}>{booking.selectedVehicle?.icon || '🚗'}</Text>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>{booking.selectedVehicle?.name}</Text>
              <Text style={styles.vehicleCapacity}>{booking.selectedVehicle?.capacity}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Promo Code */}
        <Card style={styles.promoCard}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          {booking.promoCode ? (
            <View style={styles.appliedPromo}>
              <View style={styles.promoTag}>
                <Ionicons name="pricetag" size={16} color={COLORS.success} />
                <Text style={styles.promoTagText}>{booking.promoCode}</Text>
              </View>
              <Text style={styles.discountText}>
                -{formatCurrency(booking.discount)} applied
              </Text>
              <TouchableOpacity onPress={handleRemovePromo}>
                <Ionicons name="close-circle" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                placeholderTextColor={COLORS.gray500}
                value={promoInput}
                onChangeText={setPromoInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyButton, !promoInput && styles.applyButtonDisabled]}
                onPress={handleApplyPromo}
                disabled={!promoInput || isApplyingPromo}
              >
                <Text style={styles.applyButtonText}>
                  {isApplyingPromo ? 'Applying...' : 'Apply'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Payment Method */}
        <Card style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  booking.paymentMethod === method.id && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod(method.id as any)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={booking.paymentMethod === method.id ? COLORS.primary : COLORS.gray600}
                />
                <Text
                  style={[
                    styles.paymentLabel,
                    booking.paymentMethod === method.id && styles.paymentLabelSelected,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Fare Breakdown */}
        <Card style={styles.fareCard}>
          <Text style={styles.sectionTitle}>Fare Breakdown</Text>
          
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Base Fare</Text>
            <Text style={styles.fareValue}>{formatCurrency(booking.baseFare)}</Text>
          </View>
          
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>
              Distance ({formatDistance(booking.distance)})
            </Text>
            <Text style={styles.fareValue}>{formatCurrency(booking.distanceFare)}</Text>
          </View>
          
          {booking.discount > 0 && (
            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, styles.discountLabel]}>Promo Discount</Text>
              <Text style={[styles.fareValue, styles.discountValue]}>
                -{formatCurrency(booking.discount)}
              </Text>
            </View>
          )}
          
          <View style={styles.fareDivider} />
          
          <View style={styles.fareRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(booking.totalFare)}</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Total Fare</Text>
          <Text style={styles.footerPriceValue}>{formatCurrency(booking.totalFare)}</Text>
        </View>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          style={styles.confirmButton}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  summaryCard: {
    marginBottom: 12,
  },
  tripInfo: {},
  tripRoute: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
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
    height: 24,
    backgroundColor: COLORS.gray300,
    marginLeft: 5,
    marginVertical: 4,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  routeAddress: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.divider,
  },
  vehicleCard: {
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleEmoji: {
    fontSize: 40,
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  vehicleCapacity: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  changeText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
  promoCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.gray100,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  applyButton: {
    marginLeft: 12,
    paddingHorizontal: 20,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  applyButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.white,
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: 12,
    borderRadius: SIZES.radius,
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promoTagText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.success,
    marginLeft: 4,
  },
  discountText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.success,
    marginLeft: 12,
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    backgroundColor: COLORS.gray100,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionSelected: {
    backgroundColor: `${COLORS.primary}10`,
    borderColor: COLORS.primary,
  },
  paymentLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  paymentLabelSelected: {
    color: COLORS.primary,
  },
  fareCard: {
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fareLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  fareValue: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  discountLabel: {
    color: COLORS.success,
  },
  discountValue: {
    color: COLORS.success,
  },
  fareDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 8,
  },
  totalLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  footerPrice: {
    marginRight: 16,
  },
  footerPriceLabel: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  footerPriceValue: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xl,
    color: COLORS.primary,
  },
  confirmButton: {
    flex: 1,
  },
});

export default PriceEstimationScreen;
