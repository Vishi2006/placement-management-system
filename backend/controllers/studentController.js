const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const RESUME_EXPIRY_DAYS = 90;

function extractPublicIdFromUrl(fileUrl) {
  if (!fileUrl) return null;
  const cleanUrl = fileUrl.trim().split('?')[0];
  const marker = '/upload/';
  const markerIndex = cleanUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  let publicPath = cleanUrl.slice(markerIndex + marker.length);
  publicPath = publicPath.replace(/^v\d+\//, '');
  publicPath = publicPath.replace(/\.[^/.]+$/, '');

  return publicPath || null;
}

async function deleteResumeFromCloudinary(fileUrl) {
  const publicId = extractPublicIdFromUrl(fileUrl);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

async function expireResumeIfStale(studentDoc) {
  if (!studentDoc?.resume) return studentDoc;

  const expiryTime = RESUME_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const referenceDate = studentDoc.resumeUpdatedAt || studentDoc.updatedAt;
  if (!referenceDate) return studentDoc;
  const isExpired = Date.now() - new Date(referenceDate).getTime() >= expiryTime;

  if (!isExpired) return studentDoc;

  try {
    await deleteResumeFromCloudinary(studentDoc.resume);
  } catch (_) {}

  studentDoc.resume = null;
  studentDoc.resumeUpdatedAt = null;
  await studentDoc.save();
  return studentDoc;
}

// Upload Resume to Cloudinary
exports.uploadResume = async (req, res) => {
  try {
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Get student profile for current user
    let student = await Student.findOne({ user: req.user._id });

    if (!student) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Student profile not found. Please contact support.' });
    }

    const filePath = req.file.path;

    // Delete old resume from Cloudinary if it exists
    if (student.resume) {
      try {
        await deleteResumeFromCloudinary(student.resume);
      } catch (_) {
        // Don't fail the upload if old file deletion fails
      }
    }

    // Verify Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary configuration is missing. Check CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY in .env');
    }

    // Upload new resume to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'pms/resumes',
      public_id: `resume_${req.user._id}_${Date.now()}`,
      resource_type: 'auto',
      type: 'upload'
    });
    const resumeUrl = (result.secure_url || '').trim();

    // Delete file from local server
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update student profile with resume URL
    student.resume = resumeUrl;
    student.resumeUpdatedAt = new Date();
    await student.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume: resumeUrl,
      student
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: error.message || 'Failed to upload resume',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
};

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    student = await expireResumeIfStale(student);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  try {
    const { phone, branch, cgpa, skills, github } = req.body;

    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Update fields
    if (phone) student.phone = phone;
    if (branch) student.branch = branch;
    if (cgpa) student.cgpa = cgpa;
    if (skills) student.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (github) student.github = github;

    await student.save();

    res.status(200).json({
      message: 'Student profile updated successfully',
      student
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (!student.resume) {
      return res.status(400).json({ message: 'No resume found' });
    }

    // Extract public_id from URL and delete from Cloudinary
    try {
      await deleteResumeFromCloudinary(student.resume);
    } catch (_) {}

    // Update student profile
    student.resume = null;
    student.resumeUpdatedAt = null;
    await student.save();

    res.status(200).json({
      message: 'Resume deleted successfully',
      student
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
