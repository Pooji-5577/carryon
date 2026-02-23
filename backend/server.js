require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 3000;

// In-memory OTP store: email -> { otp, expiresAt }
const otpStore = new Map();

app.use(cors());
app.use(express.json());

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp/send
app.post('/api/otp/send', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const otp = generateOtp();
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min expiry

  try {
    await resend.emails.send({
      from: 'CarryOn <onboarding@resend.dev>',
      to: email,
      subject: 'Your CarryOn verification code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #2F80ED; margin-bottom: 4px;">CarryOn</h2>
          <p style="color: #333; font-size: 16px; margin-top: 0;">Your verification code is:</p>
          <div style="background: #f0f6ff; border-radius: 12px; padding: 24px; text-align: center; margin: 16px 0;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #2F80ED;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">
            This code expires in <strong>10 minutes</strong>.<br/>
            Do not share it with anyone.
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    otpStore.delete(email);
    console.error('Resend error:', err);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

// POST /api/otp/verify
app.post('/api/otp/verify', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ success: false, message: 'No code found for this email. Please request a new one.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'Code has expired. Please request a new one.' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Incorrect code. Please try again.' });
  }

  otpStore.delete(email);
  res.json({ success: true, message: 'OTP verified successfully.' });
});

app.listen(PORT, () => {
  console.log(`CarryOn backend running on http://localhost:${PORT}`);
});
