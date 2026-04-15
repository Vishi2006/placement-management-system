const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        phone: {
            type: String
        },
        branch: {
            type: String,
            default: ''
        },
        cgpa: {
            type: Number,
        },
        skills: [
            {
                type: String
            }
        ],
        resume: {
            type: String
        },
        resumeUpdatedAt: {
            type: Date
        },
        profilePhoto: {
            type: String
        },
        github: {
            type: String
        },
        placed: {
            type: Boolean,
            default: false
        }
    }, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);    