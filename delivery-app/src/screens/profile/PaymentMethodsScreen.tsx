import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../utils/constants';
import { apiService } from '../../services/api';
import { RootStackParamList, PaymentMethod } from '../../types';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';

type PaymentMethodsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PAYMENT_ICONS: Record<string, string> = {
  card: 'card-outline',
  upi: 'phone-portrait-outline',
  wallet: 'wallet-outline',
  cash: 'cash-outline',
};

const PaymentMethodsScreen: React.FC = () => {
  const navigation = useNavigation<PaymentMethodsNavigationProp>();
  const insets = useSafeAreaInsets();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await apiService.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.paymentMethods);
      }
    } catch (error) {
      // Mock data for demo
      setPaymentMethods([
        {
          id: '1',
          type: 'card',
          name: 'HDFC Credit Card',
          details: '**** **** **** 4567',
          isDefault: true,
        },
        {
          id: '2',
          type: 'upi',
          name: 'Google Pay',
          details: 'user@okaxis',
          isDefault: false,
        },
        {
          id: '3',
          type: 'wallet',
          name: 'CarryOn Wallet',
          details: 'Balance: ₹250',
          isDefault: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      setPaymentMethods((prev) =>
        prev.map((m) => ({
          ...m,
          isDefault: m.id === methodId,
        }))
      );
      Toast.show({
        type: 'success',
        text1: 'Default payment method updated',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update default payment method',
      });
    }
  };

  const handleDelete = (methodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
              Toast.show({
                type: 'success',
                text1: 'Payment method removed',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove payment method',
              });
            }
          },
        },
      ]
    );
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <Card
      style={[styles.methodCard, item.isDefault && styles.defaultCard]}
      onPress={() => handleSetDefault(item.id)}
    >
      <View style={styles.methodHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={PAYMENT_ICONS[item.type] as any}
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodName}>{item.name}</Text>
          <Text style={styles.methodDetails}>{item.details}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      
      <View style={styles.methodActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Text style={styles.actionText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={[styles.actionText, { color: COLORS.error }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loading fullScreen text="Loading payment methods..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Payment Methods" />

      {paymentMethods.length > 0 ? (
        <FlatList
          data={paymentMethods}
          renderItem={renderPaymentMethod}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          }
        />
      ) : (
        <EmptyState
          icon="card-outline"
          title="No Payment Methods"
          message="Add a payment method for faster checkout"
          actionLabel="Add Payment Method"
          onAction={() => {}}
        />
      )}

      {/* Add Options */}
      <View style={[styles.addOptions, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="card-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Add Debit/Credit Card</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="phone-portrait-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Link UPI ID</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  methodCard: {
    marginBottom: 12,
  },
  defaultCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  methodDetails: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xs,
    color: COLORS.white,
  },
  methodActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 16,
  },
  actionButton: {},
  actionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
  },
  addOptions: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  addButtonText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
});

export default PaymentMethodsScreen;
