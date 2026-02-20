import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  SAVED_ADDRESSES: '@saved_addresses',
  RECENT_SEARCHES: '@recent_searches',
  PAYMENT_METHODS: '@payment_methods',
  LANGUAGE: '@language',
  THEME: '@theme',
};

// Generic storage functions
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
    throw error;
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Auth storage
export const saveAuthToken = (token: string) => setItem(STORAGE_KEYS.AUTH_TOKEN, token);
export const getAuthToken = () => getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
export const removeAuthToken = () => removeItem(STORAGE_KEYS.AUTH_TOKEN);

export const saveUserData = (user: any) => setItem(STORAGE_KEYS.USER_DATA, user);
export const getUserData = () => getItem<any>(STORAGE_KEYS.USER_DATA);
export const removeUserData = () => removeItem(STORAGE_KEYS.USER_DATA);

// Onboarding
export const setOnboardingCompleted = () => setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
export const isOnboardingCompleted = () => getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);

// Saved addresses
export const saveSavedAddresses = (addresses: any[]) => setItem(STORAGE_KEYS.SAVED_ADDRESSES, addresses);
export const getSavedAddresses = () => getItem<any[]>(STORAGE_KEYS.SAVED_ADDRESSES);

// Recent searches
export const saveRecentSearches = (searches: any[]) => setItem(STORAGE_KEYS.RECENT_SEARCHES, searches);
export const getRecentSearches = () => getItem<any[]>(STORAGE_KEYS.RECENT_SEARCHES);

// Payment methods
export const savePaymentMethods = (methods: any[]) => setItem(STORAGE_KEYS.PAYMENT_METHODS, methods);
export const getPaymentMethods = () => getItem<any[]>(STORAGE_KEYS.PAYMENT_METHODS);

// Settings
export const saveLanguage = (language: string) => setItem(STORAGE_KEYS.LANGUAGE, language);
export const getLanguage = () => getItem<string>(STORAGE_KEYS.LANGUAGE);

export const saveTheme = (theme: string) => setItem(STORAGE_KEYS.THEME, theme);
export const getTheme = () => getItem<string>(STORAGE_KEYS.THEME);

export default STORAGE_KEYS;
