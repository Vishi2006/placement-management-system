const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    resumeUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected', 'HR-Approved', 'Finalized'],
        default: 'Applied'
    },
    hrApprovedAt: {
        type: Date,
        default: null
    },
    hrApprovedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    selectedByHR: {
        type: Boolean,
        default: false
    },
    tpoFinalizedAt: {
        type: Date,
        default: null
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

//prevent duplicate job applications
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema) 