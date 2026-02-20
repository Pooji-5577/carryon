import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { useBooking } from '../../context/BookingContext';
import { useSocket } from '../../context/SocketContext';
import { RootStackParamList } from '../../types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

type DriverMatchingNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DriverMatchingScreen: React.FC = () => {
  const navigation = useNavigation<DriverMatchingNavigationProp>();
  const insets = useSafeAreaInsets();
  const { booking, createOrder, cancelOrder, setCurrentOrder } = useBooking();
  const { joinOrderRoom, onDriverAssigned, offDriverAssigned } = useSocket();

  const [status, setStatus] = useState<'searching' | 'found' | 'no_drivers'>('searching');
  const [searchTime, setSearchTime] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSearchAnimation();
    startSearch();

    // Timer
    const timer = setInterval(() => {
      setSearchTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopSearchAnimation();
    };
  }, []);

  useEffect(() => {
    // Listen for driver assignment
    const handleDriverAssigned = (data: { driver: any }) => {
      setStatus('found');
      // Navigate to live tracking after short delay
      setTimeout(() => {
        if (booking.currentOrder) {
          navigation.replace('LiveTracking', { orderId: booking.currentOrder.id });
        }
      }, 2000);
    };

    onDriverAssigned(handleDriverAssigned);

    return () => {
      offDriverAssigned(handleDriverAssigned);
    };
  }, [booking.currentOrder]);

  const startSearchAnimation = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSearchAnimation = () => {
    pulseAnim.stopAnimation();
    rotateAnim.stopAnimation();
  };

  const startSearch = async () => {
    try {
      const order = await createOrder();
      if (order) {
        setCurrentOrder(order);
        joinOrderRoom(order.id);

        // Simulate driver found after random time (for demo)
        setTimeout(() => {
          if (Math.random() > 0.2) {
            setStatus('found');
            setTimeout(() => {
              navigation.replace('LiveTracking', { orderId: order.id });
            }, 2000);
          } else {
            setStatus('no_drivers');
          }
        }, 5000 + Math.random() * 5000);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      setStatus('no_drivers');
    }
  };

  const handleCancel = async () => {
    await cancelOrder('User cancelled while searching');
    navigation.goBack();
  };

  const handleRetry = () => {
    setStatus('searching');
    setSearchTime(0);
    startSearchAnimation();
    startSearch();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {status === 'searching' && (
          <>
            <View style={styles.animationContainer}>
              <Animated.View
                style={[
                  styles.pulseCircle,
                  styles.pulseCircle3,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.pulseCircle,
                  styles.pulseCircle2,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.pulseCircle,
                  styles.pulseCircle1,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ rotate: spin }] },
                ]}
              >
                <Text style={styles.vehicleIcon}>{booking.selectedVehicle?.icon || '🚗'}</Text>
              </Animated.View>
            </View>

            <Text style={styles.title}>Finding your driver...</Text>
            <Text style={styles.subtitle}>
              Please wait while we find the best driver near you
            </Text>

            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.timerText}>{formatTime(searchTime)}</Text>
            </View>
          </>
        )}

        {status === 'found' && (
          <>
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={60} color={COLORS.white} />
              </View>
            </View>

            <Text style={styles.title}>Driver Found!</Text>
            <Text style={styles.subtitle}>
              Your driver is on the way to pickup location
            </Text>
          </>
        )}

        {status === 'no_drivers' && (
          <>
            <View style={styles.errorContainer}>
              <View style={styles.errorIcon}>
                <Ionicons name="car-outline" size={60} color={COLORS.gray500} />
              </View>
            </View>

            <Text style={styles.title}>No Drivers Available</Text>
            <Text style={styles.subtitle}>
              Sorry, no drivers are available in your area right now. Please try again later.
            </Text>

            <View style={styles.retryContainer}>
              <Button title="Try Again" onPress={handleRetry} style={styles.retryButton} />
            </View>
          </>
        )}

        {/* Order Summary */}
        {status === 'searching' && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={[styles.dot, styles.pickupDot]} />
                <Text style={styles.summaryText} numberOfLines={1}>
                  {booking.pickupLocation?.address}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={[styles.dot, styles.dropDot]} />
                <Text style={styles.summaryText} numberOfLines={1}>
                  {booking.dropLocation?.address}
                </Text>
              </View>
            </View>
          </Card>
        )}
      </View>

      {/* Cancel Button */}
      {status === 'searching' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'no_drivers' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  animationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  pulseCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  pulseCircle1: {
    width: 120,
    height: 120,
    opacity: 0.3,
  },
  pulseCircle2: {
    width: 160,
    height: 160,
    opacity: 0.2,
  },
  pulseCircle3: {
    width: 200,
    height: 200,
    opacity: 0.1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  vehicleIcon: {
    fontSize: 40,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  timerText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  successContainer: {
    marginBottom: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    marginBottom: 40,
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryContainer: {
    width: '100%',
    marginTop: 24,
  },
  retryButton: {
    width: '100%',
  },
  summaryCard: {
    position: 'absolute',
    bottom: 100,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  summaryRow: {},
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dot: {
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
  summaryText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.error,
  },
});

export default DriverMatchingScreen;
