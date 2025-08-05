const express = require('express');
const router = express.Router();
const { register, login, resetPassword, getSecurityQuestion } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/get-security-question', getSecurityQuestion);


module.exports = router;
