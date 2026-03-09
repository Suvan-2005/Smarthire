const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['candidate', 'company', 'admin'], default: 'candidate' },

    // Specific to companies
    companyDetails: {
        logo: String,
        about: String,
        contactInfo: String
    },

    // Specific to candidates
    candidateDetails: {
        resumeUrl: String,
        resumeText: String, // Extracted text for matching
        skills: [String], // Automatically extracted or manually entered
        experienceLevel: String // e.g., 'Junior', 'Mid', 'Senior'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
