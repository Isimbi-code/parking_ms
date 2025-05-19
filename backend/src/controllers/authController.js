const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken, hashPassword, comparePasswords, logAction } = require('../utils/auth');
const { generateOTP, sendOTPEmail, verifyOTP } = require('../utils/otp');

// Register a new user (only creates regular users, admins must be created directly in DB)
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash password and generate otp
        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry


        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
                otp,
                otpExpiry,
            },
        });

        await sendOTPEmail(email, otp);

        // Log action
        // await logAction(user.id, 'USER_REGISTER');




        res.status(201).json({
            status: 'success',
            message: 'OTP sent to your email for verification',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Verify OTP and activate account
exports.verifyAccount = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Verify OTP
        const verification = await verifyOTP(email, otp);
        if (!verification.isValid) {
            return res.status(400).json({ error: verification.message });
        }

        // Mark user as verified
        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                otp: null,
                otpExpiry: null
            }
        });

        res.status(200).json({
            status: 'success',
            message: 'Account verified successfully'
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Account verification failed' });
    }
};



// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if account is verified
        if (!user.isVerified) {
            // Generate new OTP if needed
            const otp = generateOTP();
            const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

            await prisma.user.update({
                where: { email },
                data: { otp, otpExpiry }
            });

            await sendOTPEmail(email, otp);

            return res.status(403).json({
                error: 'Account not verified - new OTP sent',
                requiresVerification: true,
                email: user.email
            });
        }



        // Check password
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Log action
        // await logAction(user.id, 'USER_LOGIN');

        // Generate token
        const token = generateToken(user.id, user.role);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Account already verified' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiry }
        });

        await sendOTPEmail(email, otp);

        res.status(200).json({
            status: 'success',
            message: 'New OTP sent to your email'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
};

// Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};