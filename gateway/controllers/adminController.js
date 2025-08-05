const User = require('../models/User');
const Summary = require('../models/Summary');
const QuizResult = require('../models/QuizHistory');

// ✅ GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSummaries = await Summary.countDocuments();
        const totalQuizzes = await QuizResult.countDocuments();

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        res.status(200).json({
            totalUsers,
            totalSummaries,
            totalQuizzes,
            recentUsers,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error });
    }
};

// GET /api/admin/users?page=1&limit=10
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({}, '-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        res.status(200).json({
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};


module.exports = {
    getDashboardStats,
    getAllUsers,
};
