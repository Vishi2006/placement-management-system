const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Student routes
router.post('/apply', protect, applicationController.applyJob);
router.get('/my', protect, applicationController.getMyApplications);
router.delete('/:id', protect, applicationController.deleteApplication);

// Admin/TPO routes
router.get('/', protect, isAdmin, applicationController.getAllApplications);
router.get('/hr-approved', protect, isAdmin, applicationController.getHRApprovedApplications);
router.get('/export/all-companies', protect, isAdmin, applicationController.exportAllApplicationsAsCSV);
router.get('/export/company/:companyId', protect, isAdmin, applicationController.exportApplicationsAsCSV);
router.put('/:id', protect, isAdmin, applicationController.updateApplicationStatus);
router.put('/:applicationId/finalize', protect, isAdmin, applicationController.tpoFinalizeSelection);

// HR routes (Company HR viewing applications for their jobs)
router.get('/company/:companyId', protect, applicationController.getApplicationsForHR);
router.put('/:applicationId/select', protect, applicationController.hrSelectStudent);

module.exports = router;