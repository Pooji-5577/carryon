import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else if (hasCompletedOnboarding) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        }
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.deliveryIcon}>🏃‍♂️📦</Text>
        <Text style={styles.appName}>CARRY ON</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  deliveryIcon: {
    fontSize: 100,
    marginBottom: 24,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    color: '#1565C0',
    letterSpacing: 4,
  },
});

export default SplashScreen;
