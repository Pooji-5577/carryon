import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { apiService } from '../../services/api';
import { RootStackParamList, Order, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';

type OrderHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pending', color: COLORS.warning, icon: 'time-outline' },
  confirmed: { label: 'Confirmed', color: COLORS.info, icon: 'checkmark-circle-outline' },
  driver_assigned: { label: 'Driver Assigned', color: COLORS.info, icon: 'person-outline' },
  driver_arrived: { label: 'Driver Arrived', color: COLORS.primary, icon: 'location-outline' },
  pickup_complete: { label: 'Picked Up', color: COLORS.primary, icon: 'cube-outline' },
  in_transit: { label: 'In Transit', color: COLORS.primary, icon: 'car-outline' },
  delivered: { label: 'Delivered', color: COLORS.success, icon: 'checkmark-done-outline' },
  cancelled: { label: 'Cancelled', color: COLORS.error, icon: 'close-circle-outline' },
};

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<OrderHistoryNavigationProp>();
  const insets = useSafeAreaInsets();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await apiService.getOrders();
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Mock data for demo
      setOrders([
        {
          id: '1',
          userId: 'user1',
          pickupLocation: {
            id: '1',
            label: 'Office',
            address: 'Tech Park, Sector 62, Noida',
            latitude: 28.6280,
            longitude: 77.3649,
            type: 'work',
          },
          dropLocation: {
            id: '2',
            label: 'Home',
            address: '123 Main Street, New Delhi',
            latitude: 28.6139,
            longitude: 77.2090,
            type: 'home',
          },
          vehicleType: 'bike',
          distance: 15000,
          duration: 2400,
          baseFare: 30,
          distanceFare: 120,
          discount: 0,
          totalFare: 150,
          status: 'delivered',
          statusHistory: [],
          paymentMethod: 'upi',
          paymentStatus: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          rating: 5,
        },
        {
          id: '2',
          userId: 'user1',
          pickupLocation: {
            id: '3',
            label: 'Mall',
            address: 'Select Citywalk Mall, Saket',
            latitude: 28.5285,
            longitude: 77.2192,
            type: 'other',
          },
          dropLocation: {
            id: '4',
            label: 'Friend House',
            address: 'Green Park, New Delhi',
            latitude: 28.5569,
            longitude: 77.2066,
            type: 'other',
          },
          vehicleType: 'car',
          distance: 8000,
          duration: 1800,
          baseFare: 80,
          distanceFare: 120,
          discount: 20,
          totalFare: 180,
          status: 'in_transit',
          statusHistory: [],
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setIsRefreshing(false);
  };

  const getFilteredOrders = () => {
    switch (activeFilter) {
      case 'active':
        return orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
      case 'completed':
        return orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));
      default:
        return orders;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusConfig = STATUS_CONFIG[item.status];

    return (
      <Card
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>#{item.id.slice(0, 8)}</Text>
            <Text style={styles.orderDate}>{formatDateTime(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
            <Ionicons name={statusConfig.icon as any} size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderRoute}>
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, styles.pickupDot]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {item.pickupLocation.address}
            </Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeItem}>
            <View style={[styles.routeDot, styles.dropDot]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {item.dropLocation.address}
            </Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleEmoji}>
              {item.vehicleType === 'bike' ? '🏍️' : 
               item.vehicleType === 'car' ? '🚗' : 
               item.vehicleType === 'van' ? '🚐' : '🚚'}
            </Text>
            <Text style={styles.vehicleType}>
              {item.vehicleType.charAt(0).toUpperCase() + item.vehicleType.slice(1)}
            </Text>
          </View>
          <Text style={styles.orderFare}>{formatCurrency(item.totalFare)}</Text>
        </View>

        {item.status === 'delivered' && !item.rating && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() => navigation.navigate('Rating', { orderId: item.id })}
          >
            <Ionicons name="star-outline" size={16} color={COLORS.warning} />
            <Text style={styles.rateButtonText}>Rate this delivery</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading orders..." />;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
      <Header title="My Orders" showBack={false} />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'active', 'completed'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
        />
      ) : (
        <EmptyState
          icon="receipt-outline"
          title="No Orders Found"
          message={
            activeFilter === 'all'
              ? "You haven't made any orders yet"
              : `No ${activeFilter} orders found`
          }
          actionLabel="Book a Delivery"
          onAction={() => navigation.navigate('Home')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: SIZES.padding,
  },
  orderCard: {
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderIdContainer: {},
  orderId: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  orderDate: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xs,
    marginLeft: 4,
  },
  orderRoute: {
    marginBottom: 16,
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleEmoji: {
    fontSize: 20,
  },
  vehicleType: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  orderFare: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.lg,
    color: COLORS.textPrimary,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  rateButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.warning,
    marginLeft: 6,
  },
});

export default OrderHistoryScreen;
