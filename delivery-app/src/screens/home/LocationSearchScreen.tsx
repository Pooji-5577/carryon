import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { useLocation } from '../../context/LocationContext';
import { useBooking } from '../../context/BookingContext';
import { mapsService, PlacePrediction, PlaceDetails } from '../../services/maps';
import { RootStackParamList, Address } from '../../types';
import { debounce } from '../../utils/helpers';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';

type LocationSearchNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;
type LocationSearchRouteProp = RouteProp<RootStackParamList, 'LocationSearch'>;

const LocationSearchScreen: React.FC = () => {
  const navigation = useNavigation<LocationSearchNavigationProp>();
  const route = useRoute<LocationSearchRouteProp>();
  const insets = useSafeAreaInsets();
  
  const { type } = route.params;
  const { currentLocation } = useLocation();
  const { setPickupLocation, setDropLocation } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      address: '123 Main Street, New Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      type: 'home',
    },
    {
      id: '2',
      label: 'Office',
      address: 'Tech Park, Sector 62, Noida',
      latitude: 28.6280,
      longitude: 77.3649,
      type: 'work',
    },
  ]);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      searchPlaces(searchQuery);
    } else {
      setPredictions([]);
    }
  }, [searchQuery]);

  const searchPlaces = debounce(async (query: string) => {
    setIsLoading(true);
    try {
      const results = await mapsService.searchPlaces(
        query,
        currentLocation
          ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
          : undefined
      );
      setPredictions(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSelectPlace = async (prediction: PlacePrediction) => {
    Keyboard.dismiss();
    setIsLoading(true);
    
    try {
      const details = await mapsService.getPlaceDetails(prediction.placeId);
      if (details) {
        const address: Address = {
          id: prediction.placeId,
          label: prediction.mainText,
          address: details.address,
          latitude: details.latitude,
          longitude: details.longitude,
          placeId: details.placeId,
          type: 'other',
        };

        if (type === 'pickup') {
          setPickupLocation(address);
        } else {
          setDropLocation(address);
        }
        
        navigation.goBack();
      }
    } catch (error) {
      console.error('Get place details error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedAddress = (address: Address) => {
    if (type === 'pickup') {
      setPickupLocation(address);
    } else {
      setDropLocation(address);
    }
    navigation.goBack();
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      const address: Address = {
        id: 'current',
        label: 'Current Location',
        address: currentLocation.address || 'Current Location',
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        type: 'other',
      };

      if (type === 'pickup') {
        setPickupLocation(address);
      } else {
        setDropLocation(address);
      }
      navigation.goBack();
    }
  };

  const renderPredictionItem = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      style={styles.predictionItem}
      onPress={() => handleSelectPlace(item)}
    >
      <View style={styles.predictionIcon}>
        <Ionicons name="location-outline" size={20} color={COLORS.gray600} />
      </View>
      <View style={styles.predictionText}>
        <Text style={styles.predictionMain} numberOfLines={1}>
          {item.mainText}
        </Text>
        <Text style={styles.predictionSecondary} numberOfLines={1}>
          {item.secondaryText}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSavedAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={styles.savedItem}
      onPress={() => handleSelectSavedAddress(item)}
    >
      <View style={[styles.savedIcon, item.type === 'home' && styles.homeIcon, item.type === 'work' && styles.workIcon]}>
        <Ionicons
          name={item.type === 'home' ? 'home' : item.type === 'work' ? 'briefcase' : 'location'}
          size={20}
          color={COLORS.white}
        />
      </View>
      <View style={styles.savedText}>
        <Text style={styles.savedLabel}>{item.label}</Text>
        <Text style={styles.savedAddress} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={type === 'pickup' ? 'Pickup Location' : 'Drop Location'} />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location"
            placeholderTextColor={COLORS.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray500} />
            </TouchableOpacity>
          )}
        </View>

        {/* Current Location Button */}
        {type === 'pickup' && currentLocation && (
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleUseCurrentLocation}
          >
            <View style={styles.currentLocationIcon}>
              <Ionicons name="locate" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.currentLocationText}>
              <Text style={styles.currentLocationTitle}>Use current location</Text>
              <Text style={styles.currentLocationAddress} numberOfLines={1}>
                {currentLocation.address || 'Getting address...'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Loading */}
        {isLoading && <Loading text="Searching..." />}

        {/* Search Results */}
        {predictions.length > 0 && !isLoading && (
          <FlatList
            data={predictions}
            renderItem={renderPredictionItem}
            keyExtractor={(item) => item.placeId}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Saved Addresses */}
        {searchQuery.length === 0 && recentSearches.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderSavedAddress}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
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
    paddingHorizontal: SIZES.padding,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: SIZES.inputHeight,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationText: {
    flex: 1,
    marginLeft: 12,
  },
  currentLocationTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.primary,
  },
  currentLocationAddress: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  predictionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionText: {
    flex: 1,
    marginLeft: 12,
  },
  predictionMain: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  predictionSecondary: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  savedSection: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  savedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: {
    backgroundColor: COLORS.primary,
  },
  workIcon: {
    backgroundColor: COLORS.info,
  },
  savedText: {
    flex: 1,
    marginLeft: 12,
  },
  savedLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  savedAddress: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default LocationSearchScreen;
