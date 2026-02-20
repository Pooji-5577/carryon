import Twilio from 'twilio';
import logger from './logger';

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  try {
    // In development, just log the OTP
    if (process.env.NODE_ENV === 'development') {
      logger.info(`OTP for ${phone}: ${otp}`);
      return true;
    }

    await client.messages.create({
      body: `Your CarryOn verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    logger.info(`OTP sent to ${phone}`);
    return true;
  } catch (error) {
    logger.error('Failed to send OTP:', error);
    return false;
  }
};

export const formatPhone = (phone: string): string => {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '');

  // Add country code if not present
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }

  return '+' + cleaned;
};
