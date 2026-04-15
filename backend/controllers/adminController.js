/**
 * Admin Controller
 * Handles admin-specific operations
 */

const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// Get admin profile
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await User.findById(req.user._id).select('-password');
        
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Not an admin' });
        }

        res.status(200).json({
            message: 'Admin profile retrieved',
            admin
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get system stats (admin only)
exports.getSystemStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }

        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        res.status(200).json({
            message: 'System statistics',
            stats: {
                totalUsers,
                totalStudents,
                totalAdmins
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List all users (admin only)
exports.listAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin only' });
        }

        const users = await User.find().select('-password');

        res.status(200).json({
            message: 'All users retrieved',
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
