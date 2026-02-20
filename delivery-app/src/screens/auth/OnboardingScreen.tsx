import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const { completeOnboarding } = useAuth();
  const insets = useSafeAreaInsets();

  const handleCreateAccount = async () => {
    await completeOnboarding();
    navigation.navigate('Register' as any);
  };

  const handleLogin = async () => {
    await completeOnboarding();
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={{ fontSize: 22 }}>☰</Text>
        <View style={styles.titleRow}>
          <Text style={styles.titleBlue}>Carry</Text>
          <Text style={styles.titleDark}> On</Text>
        </View>
        <Text style={{ fontSize: 20 }}>🔔</Text>
      </View>

      {/* Truck Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/welcome_truck.png')}
          style={styles.truckImage}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeSubtitle}>
          Have a Better Experience with{' '}
          <Text style={styles.carryText}>Carry</Text>
          <Text style={styles.onText}> On</Text>
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
          <Text style={styles.createAccountText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 22 }}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 22 }}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={{ fontSize: 22 }}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={{ fontSize: 22 }}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleRow: { flexDirection: 'row' },
  titleBlue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  titleDark: { fontSize: 24, fontWeight: 'bold', color: '#1565C0' },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  truckImage: {
    width: '100%',
    height: 220,
  },
  textContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  welcomeTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#212121',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: '#757575',
    lineHeight: 24,
  },
  carryText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.primary,
  },
  onText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: '#1565C0',
  },
  buttonContainer: {
    gap: 16,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  createAccountButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  createAccountText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  loginButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.primary,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginHorizontal: 4,
  },
});

export default OnboardingScreen;
