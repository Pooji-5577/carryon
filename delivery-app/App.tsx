import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { BookingProvider } from './src/context/BookingContext';
import { SocketProvider } from './src/context/SocketContext';
import RootNavigation from './src/navigation/RootNavigation';
import { theme } from './src/utils/theme';
import { toastConfig } from './src/utils/toastConfig';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <AuthProvider>
            <SocketProvider>
              <LocationProvider>
                <BookingProvider>
                  <StatusBar style="dark" />
                  <RootNavigation />
                  <Toast config={toastConfig} />
                </BookingProvider>
              </LocationProvider>
            </SocketProvider>
          </AuthProvider>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
