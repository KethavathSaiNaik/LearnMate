// middleware/verifyAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization; // Direct token, no 'Bearer' split
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
};

module.exports = verifyAdmin;
