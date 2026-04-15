const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const studentRoutes = require('./routes/studentRoutes');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');


const app = express();
const port = process.env.PORT;

// CORS Configuration for Vercel frontend deployment
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/students', studentRoutes);

// Connect to MongoDB and initialize admin user
const initializeAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@pms.com', role: 'admin' });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('AdminPMS@123', salt);
      
      await User.create({
        name: 'Administrator',
        email: 'admin@pms.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
    }
  } catch (error) {
    console.error('⚠️  Admin initialization failed:', error.message);
  }
};

connectDB().then(() => {
  initializeAdmin();
});

// This handles the main page (root route)
app.get('/', (req, res) => {
  res.send('Server is live!');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});