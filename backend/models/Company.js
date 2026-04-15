const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        website: {
            type: String
        },
        logo: {
            type: String
        },
        description: {
            type: String
        },
        hrEmail: {
            type: String
        }
    }, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);