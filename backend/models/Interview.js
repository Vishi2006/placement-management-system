const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true

    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    date: {
        type: Date
    },
    time: {
        type: String
    },
    mode: {
        type: String,
        enum: ['Online', 'Offline'],
    },
    result: {
        type: String,
        enum: ['Pending', 'Passed', 'Failed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema) 
