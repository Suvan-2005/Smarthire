const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    experienceLevel: { type: String }, // e.g., Entry, Mid, Senior
    salary: { type: String },
    location: { type: String },
    status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
