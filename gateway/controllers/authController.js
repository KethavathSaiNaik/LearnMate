const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Simple regex validators
const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

// @desc Register a new user
exports.register = async (req, res) => {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    try {
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters long, and include letters and numbers',
            });
        }

        if (!securityQuestion || !securityAnswer) {
            return res.status(400).json({ message: 'Security question and answer are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            securityQuestion,
            securityAnswer
        });

        res.status(201).json({ message: '✅ Registered successfully. Please login to continue.' });
    } catch (err) {
        res.status(500).json({ message: '❌ Registration failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // ✅ Optional: later you can check securityAnswer match here if needed
        // if (req.body.securityAnswer && user.securityAnswer !== req.body.securityAnswer) {
        //   return res.status(401).json({ message: 'Incorrect security answer' });
        // }

        const token = generateToken(user);
        res.status(200).json({
            message: '✅ Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: '❌ Login failed', error: err.message });
    }
};

// @desc Forgot password using email + security answer
exports.resetPassword = async (req, res) => {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Case-insensitive check
        if (user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()) {
            return res.status(401).json({ message: 'Incorrect security answer.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: '✅ Password reset successful. Please login.' });
    } catch (err) {
        res.status(500).json({ message: '❌ Password reset failed', error: err.message });
    }
};

exports.getSecurityQuestion = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ securityQuestion: user.securityQuestion }); // ✅ return only the question
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};