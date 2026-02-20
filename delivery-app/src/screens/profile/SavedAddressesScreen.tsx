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
import { RootStackParamList, Address } from '../../types';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';

type SavedAddressesNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ADDRESS_ICONS: Record<string, string> = {
  home: 'home-outline',
  work: 'briefcase-outline',
  other: 'location-outline',
};

const SavedAddressesScreen: React.FC = () => {
  const navigation = useNavigation<SavedAddressesNavigationProp>();
  const insets = useSafeAreaInsets();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await apiService.getSavedAddresses();
      if (response.success) {
        setAddresses(response.addresses);
      }
    } catch (error) {
      // Mock data for demo
      setAddresses([
        {
          id: '1',
          label: 'Home',
          address: '123 Main Street, Apartment 4B, New Delhi 110001',
          latitude: 28.6139,
          longitude: 77.2090,
          type: 'home',
        },
        {
          id: '2',
          label: 'Office',
          address: 'Tech Park, Tower B, Sector 62, Noida 201301',
          latitude: 28.6280,
          longitude: 77.3649,
          type: 'work',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteAddress(addressId);
              setAddresses((prev) => prev.filter((a) => a.id !== addressId));
              Toast.show({
                type: 'success',
                text1: 'Address Deleted',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete address',
              });
            }
          },
        },
      ]
    );
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <Card style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={ADDRESS_ICONS[item.type] as any}
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.addressInfo}>
          <Text style={styles.addressLabel}>{item.label}</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {item.address}
          </Text>
        </View>
      </View>
      
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {}}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          <Text style={[styles.actionText, { color: COLORS.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loading fullScreen text="Loading addresses..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Saved Addresses" />

      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="location-outline"
          title="No Saved Addresses"
          message="Add frequently used addresses for faster booking"
          actionLabel="Add Address"
          onAction={() => navigation.navigate('LocationSearch')}
        />
      )}

      {/* Add Address Button */}
      <TouchableOpacity
        style={[styles.addButton, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate('LocationSearch')}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
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
  addressCard: {
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    marginBottom: 16,
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
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  addressText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  addressActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
});

export default SavedAddressesScreen;
