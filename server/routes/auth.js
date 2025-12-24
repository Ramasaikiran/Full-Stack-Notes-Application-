const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Helper to send email (User provided robust logic)
const sendOTPEmail = async (userEmail, otp) => {
    // Check if real email credentials exist in environment variables
    const canSendRealEmail = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    if (canSendRealEmail) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail", // Or your preferred provider
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, // Use a "Google App Password" for Gmail
                },
            });

            await transporter.sendMail({
                from: `"NoteSpace App" <${process.env.EMAIL_USER}>`,
                to: userEmail,
                subject: "NoteSpace: Password Reset OTP",
                text: `Your one-time password is: ${otp}`,
            });

            console.log(`✅ Real email sent to ${userEmail}`);
        } catch (error) {
            console.error("❌ Email failed to send!");
            console.error("   Reason:", error.message);
            console.error("   Hint: Ensure 'Less Secure Apps' is allowed OR use an 'App Password' if 2FA is on.");
        }
    }

    // ALWAYS print to console for easy testing during development
    console.log("------------------------------------------");
    console.log(`TESTING OTP for ${userEmail}: [ ${otp} ]`);
    console.log("------------------------------------------");
};

router.post('/register', async (req, res) => {
    console.log('Register attempt:', req.body);
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'Username or Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save OTP to DB
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // 3. Trigger the email/console print function
        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
