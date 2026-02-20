import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  removeUserData,
  isOnboardingCompleted,
  setOnboardingCompleted as markOnboardingCompleted,
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  sendOTP: (phone: string) => Promise<{ success: boolean; message?: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const [token, onboardingDone] = await Promise.all([
        getAuthToken(),
        isOnboardingCompleted(),
      ]);

      setHasCompletedOnboarding(!!onboardingDone);

      if (token) {
        // Try to get user data from storage first
        const cachedUser = await getUserData();
        if (cachedUser) {
          setUser(cachedUser);
        }

        // Refresh user data from server
        try {
          const response = await apiService.getProfile();
          if (response.success && response.user) {
            setUser(response.user);
            await saveUserData(response.user);
          }
        } catch (error) {
          // If refresh fails, use cached data
          console.log('Failed to refresh user data:', error);
        }
      }
    } catch (error) {
      console.error('Auth state check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.sendOTP(phone);
      return { success: response.success, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.verifyOTP(phone, otp);
      if (response.success && response.token && response.user) {
        await saveAuthToken(response.token);
        await saveUserData(response.user);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: 'Verification failed' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.loginWithEmail(email, password);
      if (response.success && response.token && response.user) {
        await saveAuthToken(response.token);
        await saveUserData(response.user);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = async (): Promise<void> => {
    await removeAuthToken();
    await removeUserData();
    setUser(null);
  };

  const updateUser = async (data: Partial<User>): Promise<void> => {
    try {
      const response = await apiService.updateProfile(data);
      if (response.success && response.user) {
        setUser(response.user);
        await saveUserData(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const completeOnboarding = async (): Promise<void> => {
    await markOnboardingCompleted();
    setHasCompletedOnboarding(true);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiService.getProfile();
      if (response.success && response.user) {
        setUser(response.user);
        await saveUserData(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasCompletedOnboarding,
    sendOTP,
    verifyOTP,
    loginWithEmail,
    logout,
    updateUser,
    completeOnboarding,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
