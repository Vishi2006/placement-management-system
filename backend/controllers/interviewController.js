const Interview = require('../models/Interview');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');

// Schedule Interview (Admin only)
exports.createInterview = async (req, res) => {
    try {
        const { student, company, job, date, time, mode } = req.body;

        if (!student || !company) {
            return res.status(400).json({ message: 'Student and company are required' });
        }

        // Validate student (should be Student ID)
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate company
        const companyExists = await Company.findById(company);
        if (!companyExists) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Validate job (optional)
        if (job) {
            const jobExists = await Job.findById(job);
            if (!jobExists) {
                return res.status(404).json({ message: 'Job not found' });
            }
        }

        const interview = await Interview.create({
            student,
            company,
            job,
            date,
            time,
            mode
        });

        res.status(201).json({
            message: 'Interview scheduled successfully',
            interview
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all interviews (Admin)
exports.getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find()
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate('company', 'name')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json(interviews);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get my interviews (Student)
exports.getMyInterviews = async (req, res) => {
    try {
        // Find student by user ID
        const student = await Student.findOne({ user: req.user._id });
        
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const interviews = await Interview.find({ student: student._id })
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate('company', 'name')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json(interviews);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update interview (Admin)
exports.updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        const updatedInterview = await Interview.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: 'Interview updated successfully',
            interview: updatedInterview
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update result (Admin)
exports.updateResult = async (req, res) => {
    try {
        const { result } = req.body;

        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        interview.result = result || interview.result;
        await interview.save();

        res.status(200).json({
            message: 'Interview result updated',
            interview
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete interview (Admin)
exports.deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        await interview.deleteOne();

        res.status(200).json({ message: 'Interview deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
