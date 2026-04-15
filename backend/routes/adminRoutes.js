/**
 * Admin Routes
 * All routes require authentication and admin role
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Middleware to check admin role for all routes
router.use(protect, isAdmin);

// Get admin profile
router.get('/profile', adminController.getAdminProfile);

// Get system statistics
router.get('/stats', adminController.getSystemStats);

// List all users
router.get('/users', adminController.listAllUsers);

module.exports = router;
