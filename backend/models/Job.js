const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        package: {
            type: Number
        },
        location: {
            type: String
        },
        skills: [
            {
                type: String
            }
        ],
        description: {
            type: String
        }
    }, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);