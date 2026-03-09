const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'shortlisted', 'accepted', 'rejected'], default: 'pending' },
    matchScore: { type: Number, default: 0 },
    feedback: { type: String, default: '' }, // e.g., "Strong matches on React and Node.js. Lacking Next.js"
    immediateJoiner: { type: Boolean, default: false },
    coverLetter: { type: String, default: '' },
    resumeData: { type: Buffer }, // Store binary PDF data here
    resumeContentType: { type: String, default: 'application/pdf' },
    resumePath: { type: String }, // To hold the API URL path for downloading the resume

    // Detailed breakdown of score for analytics
    scoreBreakdown: {
        skillMatch: { type: Number, default: 0 },
        experienceMatch: { type: Number, default: 0 },
        keywordMatch: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
