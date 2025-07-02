const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/adminAuth');

// Public
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protected: get current user
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
