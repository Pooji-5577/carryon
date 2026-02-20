import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginNavigationProp>();
  const { loginWithEmail } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        Toast.show({ type: 'error', text1: 'Login Failed', text2: result.message || 'Invalid credentials' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View style={styles.welcomeRow}>
            <Text style={styles.welcomeText}>Welcome to </Text>
            <Text style={styles.carryOnText}>Carry On</Text>
            <Text style={styles.welcomeText}>!</Text>
          </View>
          <Text style={styles.subtitle}>Hello there, Sign in to Continue</Text>
        </View>

        {/* Email Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#C0C0C0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#C0C0C0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
              <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>{isLoading ? 'Logging in...' : 'Log In'}</Text>
        </TouchableOpacity>

        {/* Or Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIcon}>🍎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconG}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconF}>f</Text>
          </TouchableOpacity>
        </View>

        {/* Continue as Guest */}
        <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
          <Text style={styles.guestButtonText}>Continue as a Guest</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>Don't have an Account ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register' as any)}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: '#212121',
  },
  carryOnText: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: '#212121',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: '#212121',
    paddingVertical: 16,
    flex: 1,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.primary,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 28,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#757575',
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 28,
  },
  socialIconG: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DB4437',
  },
  socialIconF: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4267B2',
  },
  guestButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  guestButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.primary,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  signUpText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#757575',
  },
  signUpLink: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default LoginScreen;
