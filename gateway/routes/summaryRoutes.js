const express = require('express');
const router = express.Router();

const {
    saveSummary,
    getUserSummaries,
    getSummaryById,
} = require('../controllers/summaryController');

const { protect } = require('../middleware/authMiddleware'); // ✅ updated import

// ✅ Apply 'protect' middleware properly
router.post('/save', protect, saveSummary);
router.get('/user', protect, getUserSummaries);
router.get('/:id', protect, getSummaryById);

module.exports = router;
