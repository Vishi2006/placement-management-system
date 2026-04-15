const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const ExcelJS = require('exceljs');

// Apply to job (Student only)
exports.applyJob = async (req, res) => {
    try {
        const { job } = req.body;

        if (!job) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        // Check job exists
        const jobExists = await Job.findById(job);
        if (!jobExists) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Find student by user ID
        let student = await Student.findOne({ user: req.user._id });
        
        // If student profile doesn't exist, create one
        if (!student) {
            try {
                student = await Student.create({
                    user: req.user._id,
                    branch: ''
                });
            } catch (err) {
                return res.status(500).json({ message: 'Error creating student profile' });
            }
        }

        // Create application with resume URL
        const application = await Application.create({
            student: student._id, // Store Student ID, not User ID
            job,
            resumeUrl: student.resume || null // Capture resume at time of application
        });

        res.status(201).json({
            message: 'Applied successfully',
            application
        });

    } catch (error) {
        // Handle duplicate application
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You already applied to this job' });
        }
        
        res.status(500).json({ message: error.message });
    }
};


// Get all applications (Admin)
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get logged-in student's applications
exports.getMyApplications = async (req, res) => {
    try {
        // Find student by user ID
        const student = await Student.findOne({ user: req.user._id });
        
        let applications = [];
        if (student) {
            applications = await Application.find({ student: student._id })
                .populate({
                    path: 'student',
                    populate: {
                        path: 'user',
                        select: 'name email'
                    }
                })
                .populate({
                    path: 'job',
                    populate: {
                        path: 'company',
                        select: 'name'
                    }
                })
                .sort({ createdAt: -1 });
        }

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status || application.status;
        await application.save();

        res.status(200).json({
            message: 'Status updated successfully',
            application
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete application (Admin or Student who owns it)
exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id).populate('student');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if user is admin or the student who owns this application
        const isAdmin = req.user.role === 'admin' || req.user.role === 'tpo';
        const isStudentOwner = application.student?.user?.toString() === req.user._id.toString();

        if (!isAdmin && !isStudentOwner) {
            return res.status(403).json({ message: 'Not authorized to delete this application' });
        }

        await Application.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Application deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get applications for HR (Company jobs)
exports.getApplicationsForHR = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Find all jobs for this company
        const jobs = await Job.find({ company: companyId });
        const jobIds = jobs.map(j => j._id);

        // Find applications for these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .sort({ appliedDate: -1 });

        res.status(200).json({
            message: 'Applications retrieved successfully',
            applications,
            total: applications.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// HR approves/selects student for job
exports.hrSelectStudent = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { companyId } = req.body;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update application with HR approval
        application.selectedByHR = true;
        application.status = 'HR-Approved';
        application.hrApprovedAt = new Date();
        application.hrApprovedBy = companyId;

        await application.save();

        // Populate for response
        await application.populate({
            path: 'student',
            populate: {
                path: 'user',
                select: 'name email'
            }
        });
        await application.populate({
            path: 'job',
            populate: {
                path: 'company',
                select: 'name'
            }
        });

        res.status(200).json({
            message: 'Student selected successfully',
            application
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin/TPO finalizes selected student
exports.tpoFinalizeSelection = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.selectedByHR) {
            return res.status(400).json({ message: 'Student must be HR-approved before finalization' });
        }

        // Finalize the selection
        application.status = 'Finalized';
        application.tpoFinalizedAt = new Date();

        await application.save();

        // Populate for response
        await application.populate({
            path: 'student',
            populate: {
                path: 'user',
                select: 'name email'
            }
        });
        await application.populate({
            path: 'job',
            populate: {
                path: 'company',
                select: 'name'
            }
        });

        res.status(200).json({
            message: 'Selection finalized successfully',
            application
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get HR-approved applications for TPO review
exports.getHRApprovedApplications = async (req, res) => {
    try {
        const applications = await Application.find({ 
            selectedByHR: true,
            status: { $ne: 'Finalized' }
        })
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .sort({ hrApprovedAt: -1 });

        res.status(200).json({
            message: 'HR-approved applications retrieved successfully',
            applications,
            total: applications.length
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export applications for a company as Excel (TPO downloads)
exports.exportApplicationsAsCSV = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Get company details
        const Company = require('../models/Company');
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Find all jobs for this company
        const jobs = await Job.find({ company: companyId });
        const jobIds = jobs.map(j => j._id);

        // Find all applications for this company
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate({
                path: 'student',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            })
            .populate({
                path: 'job',
                select: 'title'
            })
            .sort({ appliedDate: -1 });

        if (applications.length === 0) {
            return res.status(400).json({ message: 'No applications found for this company' });
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Applications');

        // Add header row with styling
        const headers = ['Student Name', 'Email', 'Phone', 'Branch', 'CGPA', 'Applied Position', 'Applied Date', 'Status', 'Resume Link'];
        const headerRow = worksheet.addRow(headers);

        // Style header row
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
            cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        // Set column widths
        worksheet.columns = [
            { width: 20 },
            { width: 25 },
            { width: 15 },
            { width: 15 },
            { width: 10 },
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 40 }
        ];

        // Add data rows
        applications.forEach(app => {
            const row = worksheet.addRow([
                app.student?.user?.name || 'N/A',
                app.student?.user?.email || 'N/A',
                app.student?.phone || 'N/A',
                app.student?.branch || 'N/A',
                app.student?.cgpa || 'N/A',
                app.job?.title || 'N/A',
                new Date(app.appliedDate).toLocaleDateString(),
                app.status || 'Applied',
                app.resumeUrl || 'Not uploaded'
            ]);

            // Add resume link as hyperlink if exists
            if (app.resumeUrl) {
                row.getCell(9).hyperlink = app.resumeUrl;
                row.getCell(9).font = { color: { argb: 'FF0563C1' }, underline: true };
            }

            // Style data row
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
        });

        // Freeze header row
        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        // Generate Excel buffer
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Set response headers for Excel download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${company.name}_applications_${Date.now()}.xlsx"`);
        res.setHeader('Content-Length', buffer.length);
        
        // Send buffer
        res.send(buffer);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export all applications grouped by company as Excel (TPO downloads all)
exports.exportAllApplicationsAsCSV = async (req, res) => {
    try {
        const Company = require('../models/Company');
        const companies = await Company.find();

        if (companies.length === 0) {
            return res.status(400).json({ message: 'No companies found' });
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('All Applications');

        // Add header row with styling
        const headers = ['Company Name', 'Student Name', 'Email', 'Phone', 'Branch', 'CGPA', 'Applied Position', 'Applied Date', 'Status', 'Resume Link'];
        const headerRow = worksheet.addRow(headers);

        // Style header row
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
            cell.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        // Set column widths
        worksheet.columns = [
            { width: 20 },
            { width: 20 },
            { width: 25 },
            { width: 15 },
            { width: 15 },
            { width: 10 },
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 40 }
        ];

        let totalApplications = 0;

        // Iterate through each company
        for (const company of companies) {
            const jobs = await Job.find({ company: company._id });
            const jobIds = jobs.map(j => j._id);

            const applications = await Application.find({ job: { $in: jobIds } })
                .populate({
                    path: 'student',
                    populate: {
                        path: 'user',
                        select: 'name email'
                    }
                })
                .populate({
                    path: 'job',
                    select: 'title'
                })
                .sort({ appliedDate: -1 });

            totalApplications += applications.length;

            // Add rows for this company
            applications.forEach(app => {
                const row = worksheet.addRow([
                    company.name || 'N/A',
                    app.student?.user?.name || 'N/A',
                    app.student?.user?.email || 'N/A',
                    app.student?.phone || 'N/A',
                    app.student?.branch || 'N/A',
                    app.student?.cgpa || 'N/A',
                    app.job?.title || 'N/A',
                    new Date(app.appliedDate).toLocaleDateString(),
                    app.status || 'Applied',
                    app.resumeUrl || 'Not uploaded'
                ]);

                // Add resume link as hyperlink if exists
                if (app.resumeUrl) {
                    row.getCell(10).hyperlink = app.resumeUrl;
                    row.getCell(10).font = { color: { argb: 'FF0563C1' }, underline: true };
                }

                // Style data row (alternate colors for better readability)
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
            });
        }

        // Freeze header row
        worksheet.views = [{ state: 'frozen', ySplit: 1 }];

        // Generate Excel buffer
        const buffer = await workbook.xlsx.writeBuffer();
        
        // Set response headers for Excel download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="All_Applications_${Date.now()}.xlsx"`);
        res.setHeader('Content-Length', buffer.length);
        
        // Send buffer
        res.send(buffer);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
