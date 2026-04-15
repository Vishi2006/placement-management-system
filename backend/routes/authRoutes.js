const auth = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', auth.register);

// Login user
router.post('/login', auth.login);

// Change password - requires authentication
router.post('/change-password', protect, auth.changePassword);

module.exports = router;

