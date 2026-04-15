/**
 * Seed Script to initialize the static admin user
 * Run: node scripts/seedAdmin.js
 * 
 * This script creates a single admin user in the database with a hashed password.
 * Admin credentials:
 * - Email: admin@pms.com
 * - Default Password: AdminPMS@123
 * 
 * IMPORTANT: Change the password after first login using the password change endpoint
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const DEFAULT_ADMIN_EMAIL = 'admin@pms.com';
const DEFAULT_ADMIN_PASSWORD = 'AdminPMS@123'; // Change this after first login
const DEFAULT_ADMIN_NAME = 'Administrator';

const seedAdmin = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGO_URL);
            console.log('Connected to MongoDB');
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL, role: 'admin' });
        if (existingAdmin) {
            console.log('❌ Admin user already exists with email:', DEFAULT_ADMIN_EMAIL);
            console.log('   If you need to reset the password, use the password change endpoint.');
            await mongoose.connection.close();
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);

        // Create admin user
        const admin = await User.create({
            name: DEFAULT_ADMIN_NAME,
            email: DEFAULT_ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Admin user created successfully with email:', DEFAULT_ADMIN_EMAIL + ' and default password: ' + DEFAULT_ADMIN_PASSWORD);

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
