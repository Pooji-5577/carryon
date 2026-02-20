import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  RegisterScreen,
  OTPVerificationScreen,
} from '../screens/auth';

// Home Screens
import { HomeScreen, LocationSearchScreen, ReadyToBookScreen, SelectAddressScreen } from '../screens/home';

// Booking Screens
import {
  VehicleSelectionScreen,
  PriceEstimationScreen,
  DriverMatchingScreen,
  LiveTrackingScreen,
  ActiveShipmentScreen,
  SenderReceiverScreen,
  PaymentScreen,
  PaymentSuccessScreen,
  BookingConfirmedScreen,
  DetailsScreen,
  RequestForRideScreen,
  ThankYouScreen,
} from '../screens/booking';

// Chat Screens
import { ChatScreen } from '../screens/chat';

// Orders Screens
import { OrderHistoryScreen, RatingScreen, DeliveryDetailsScreen } from '../screens/orders';

// Profile Screens
import {
  ProfileScreen,
  EditProfileScreen,
  SavedAddressesScreen,
  PaymentMethodsScreen,
} from '../screens/profile';

// Help Screens
import {
  HelpScreen,
  FAQScreen,
  SupportTicketsScreen,
  CreateTicketScreen,
} from '../screens/help';

import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'OrdersTab':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingTop: 8,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.divider,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrderHistoryScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

// Main App Stack Navigator
const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
      
      {/* Location & Booking Flow */}
      <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
      <Stack.Screen name="VehicleSelection" component={VehicleSelectionScreen} />
      <Stack.Screen name="PriceEstimation" component={PriceEstimationScreen} />
      <Stack.Screen name="DriverMatching" component={DriverMatchingScreen} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
      
      {/* Chat */}
      <Stack.Screen name="Chat" component={ChatScreen} />
      
      {/* Orders */}
      <Stack.Screen name="Rating" component={RatingScreen} />
      
      {/* Profile */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      
      {/* Help & Support */}
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="SupportTickets" component={SupportTicketsScreen} />
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
      
      {/* New UI Screens */}
      <Stack.Screen name="ReadyToBook" component={ReadyToBookScreen} />
      <Stack.Screen name="ActiveShipment" component={ActiveShipmentScreen} />
      <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
      <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />

      {/* Booking Flow */}
      <Stack.Screen name="SenderReceiver" component={SenderReceiverScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="RequestForRide" component={RequestForRideScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="ThankYou" component={ThankYouScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigation: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
