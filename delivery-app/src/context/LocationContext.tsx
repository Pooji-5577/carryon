import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { mapsService } from '../services/maps';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  heading?: number;
}

interface LocationContextType {
  currentLocation: LocationData | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  watchLocation: () => void;
  stopWatchingLocation: () => void;
  getAddressFromCoordinates: (lat: number, lng: number) => Promise<string | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    checkPermissionAndGetLocation();
    
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const checkPermissionAndGetLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === Location.PermissionStatus.GRANTED) {
        await getCurrentLocation();
      }
    } catch (err) {
      console.error('Location permission check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === Location.PermissionStatus.GRANTED) {
        await getCurrentLocation();
        return true;
      }
      
      setError('Location permission denied');
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to request location permission');
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: location.coords.heading ?? undefined,
      };

      // Get address for the location
      const address = await mapsService.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );
      
      if (address) {
        locationData.address = address;
      }

      setCurrentLocation(locationData);
      return locationData;
    } catch (err: any) {
      setError(err.message || 'Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const watchLocation = async () => {
    try {
      if (locationSubscription) {
        locationSubscription.remove();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            heading: location.coords.heading ?? undefined,
          };

          // Get address periodically
          if (!currentLocation?.address || 
              Math.abs(location.coords.latitude - (currentLocation?.latitude || 0)) > 0.001) {
            const address = await mapsService.reverseGeocode(
              location.coords.latitude,
              location.coords.longitude
            );
            if (address) {
              locationData.address = address;
            }
          } else {
            locationData.address = currentLocation?.address;
          }

          setCurrentLocation(locationData);
        }
      );

      setLocationSubscription(subscription);
    } catch (err: any) {
      setError(err.message || 'Failed to watch location');
    }
  };

  const stopWatchingLocation = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
    return mapsService.reverseGeocode(lat, lng);
  };

  const value: LocationContextType = {
    currentLocation,
    isLoading,
    error,
    permissionStatus,
    requestPermission,
    getCurrentLocation,
    watchLocation,
    stopWatchingLocation,
    getAddressFromCoordinates,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export default LocationContext;
