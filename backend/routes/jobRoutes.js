const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Admin routes
router.post('/', protect, isAdmin, jobController.createJob);
router.put('/:id', protect, isAdmin, jobController.updateJob);
router.delete('/:id', protect, isAdmin, jobController.deleteJob);

module.exports = router;