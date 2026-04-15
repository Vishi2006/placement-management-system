const Company = require('../models/Company');

// Create company (Admin only)
exports.createCompany = async (req, res) => {
    try {
        const { name, location, website, logo, description, hrEmail } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Company name is required' });
        }

        const company = await Company.create({
            name,
            location,
            website,
            logo,
            description,
            hrEmail
        });

        res.status(201).json({
            message: 'Company created successfully',
            company
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });

        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single company
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update company (Admin only)
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: 'Company updated successfully',
            company: updatedCompany
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete company (Admin only)
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        await company.deleteOne();

        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};