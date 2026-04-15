const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompanyById);

// Admin
router.post('/', protect, isAdmin, companyController.createCompany);
router.put('/:id', protect, isAdmin, companyController.updateCompany);
router.delete('/:id', protect, isAdmin, companyController.deleteCompany);

module.exports = router;