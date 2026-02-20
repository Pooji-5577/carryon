import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { COLORS, FONTS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';

type OTPVerificationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;
type OTPVerificationRouteProp = RouteProp<RootStackParamList, 'OTPVerification'>;

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 30;

const OTPVerificationScreen: React.FC = () => {
  const navigation = useNavigation<OTPVerificationNavigationProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const { verifyOTP, sendOTP } = useAuth();
  const insets = useSafeAreaInsets();

  const { phone } = route.params;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit) && newOtp.join('').length === OTP_LENGTH) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== OTP_LENGTH) {
      Toast.show({ type: 'error', text1: 'Invalid Code', text2: `Please enter all ${OTP_LENGTH} digits` });
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(phone, code);
      if (result.success) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Verification successful!' });
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        Toast.show({ type: 'error', text1: 'Verification Failed', text2: result.message || 'Invalid code' });
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        Toast.show({ type: 'success', text1: 'Code Sent', text2: 'A new code has been sent' });
        setCountdown(RESEND_COUNTDOWN);
        setCanResend(false);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: result.message || 'Failed to resend' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message || 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }]}>
        {/* Back Arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Enter the Code</Text>
          <Text style={styles.subtitle}>A verification code has been sent to</Text>
          <Text style={styles.phoneText}>xxxxxx</Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>
                Don't receive code?  <Text style={styles.resendLink}>Resend again</Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendText}>
              Don't receive code?  <Text style={styles.resendDisabled}>Resend again ({countdown}s)</Text>
            </Text>
          )}
        </View>

        <View style={{ flex: 1 }} />

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, (otp.some((d) => !d) || isLoading) && styles.nextButtonDisabled]}
          onPress={() => handleVerify()}
          disabled={otp.some((d) => !d) || isLoading}
        >
          <Text style={styles.nextButtonText}>{isLoading ? 'Verifying...' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
  },
  header: {
    marginTop: 32,
    marginBottom: 40,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: '#212121',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#757575',
  },
  phoneText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: '#212121',
    marginTop: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
    fontSize: 24,
    color: '#212121',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#757575',
  },
  resendLink: {
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  resendDisabled: {
    fontFamily: FONTS.regular,
    color: '#C0C0C0',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default OTPVerificationScreen;
