// controllers/userController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Already implemented
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

// ✅ New: Update profile
exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        const updatedUser = await user.save();

        res.json({
            message: '✅ Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: '❌ Failed to update profile', error: err.message });
    }
};
