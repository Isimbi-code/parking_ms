const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// OTP configuration
const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

// Create transporter (configure in your app setup)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Generate random OTP
const generateOTP = () => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'ninahenrietterarr@gmail.com',
        to: email,
        subject: 'Your OTP for Parking Management System',
        text: `Your OTP is: ${otp}\nIt will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Verification Code</h2>
        <p style="font-size: 16px;">Here is your one-time password for account verification:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h3 style="margin: 0; font-size: 24px; letter-spacing: 3px;">${otp}</h3>
        </div>
        <p style="font-size: 14px; color: #666;">This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};

// Verify OTP against database
const verifyOTP = async (email, otp) => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { otp: true, otpExpiry: true }
    });

    if (!user || !user.otp) {
        return { isValid: false, message: 'OTP not found or expired' };
    }

    if (user.otp !== otp) {
        return { isValid: false, message: 'Invalid OTP' };
    }

    if (new Date() > new Date(user.otpExpiry)) {
        return { isValid: false, message: 'OTP has expired' };
    }

    return { isValid: true, message: 'OTP verified successfully' };
};

module.exports = { generateOTP, sendOTPEmail, verifyOTP };