const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');
const { getDashboardStats, getAllUsers } = require('../controllers/adminController');

// GET /api/admin/stats
router.get('/stats', verifyAdmin, getDashboardStats);

// ✅ GET /api/admin/users?page=1&limit=10
router.get('/users', verifyAdmin, getAllUsers);

module.exports = router;
