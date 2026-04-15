const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  uploadResume,
  getStudentProfile,
  updateStudentProfile,
  deleteResume
} = require('../controllers/studentController');

// Routes

// Get student profile
router.get('/profile', protect, getStudentProfile);

// Update student profile
router.put('/profile', protect, updateStudentProfile);

// Upload resume
router.post('/resume/upload', protect, upload.single('resume'), uploadResume);

// Delete resume
router.delete('/resume', protect, deleteResume);

module.exports = router;
