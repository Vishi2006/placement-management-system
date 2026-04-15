const Job = require('../models/Job');
const Company = require('../models/Company');

// Create Job (Admin only)
exports.createJob = async (req, res) => {
    try {
        const { title, company, package, location, skills, description } = req.body;

        if (!title || !company) {
            return res.status(400).json({ message: 'Title and company are required' });
        }

        // Check if company exists
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const job = await Job.create({
            title,
            company,
            package,
            location,
            skills,
            description
        });

        res.status(201).json({
            message: 'Job created successfully',
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all jobs (with company details)
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('company', 'name location website')
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single job
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company', 'name location website description');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update job (Admin only)
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: 'Job updated successfully',
            job: updatedJob
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete job (Admin only)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};