const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Register user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, branch, cgpa, skills, github, profilePhoto } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user - ALWAYS register as student (admin is static)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student' // Force role to student - no admin registration allowed
        });

        // Create Student profile if registering as student
        if (user.role === 'student') {
            if (!phone || !branch || cgpa === undefined || cgpa === null || cgpa === '') {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({ message: 'Phone, branch, and CGPA are required for student registration' });
            }
            const cgpaNumber = Number(cgpa);
            if (Number.isNaN(cgpaNumber) || cgpaNumber < 0 || cgpaNumber > 10) {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({ message: 'CGPA must be a number between 0 and 10' });
            }

            const normalizedSkills = Array.isArray(skills)
                ? skills
                : (skills || '').split(',').map(s => s.trim()).filter(Boolean);

            await Student.create({
                user: user._id,
                phone,
                branch,
                cgpa: cgpaNumber,
                skills: normalizedSkills,
                github: github || '',
                profilePhoto: profilePhoto || ''
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change password - Only authenticated users can change their password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        // Check if old password is same as new password
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: 'New password must be different from the old password' });
        }

        // Get user with password field (since we select -password in middleware)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
