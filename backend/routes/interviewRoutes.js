const express = require('express');
const router = express.Router();

const interviewController = require('../controllers/interviewController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Student routes
router.get('/my', protect, interviewController.getMyInterviews);

// Admin routes
router.post('/', protect, isAdmin, interviewController.createInterview);
router.get('/', protect, isAdmin, interviewController.getAllInterviews);
router.put('/:id', protect, isAdmin, interviewController.updateInterview);
router.put('/:id/result', protect, isAdmin, interviewController.updateResult);
router.delete('/:id', protect, isAdmin, interviewController.deleteInterview);

module.exports = router;