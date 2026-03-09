const express = require('express');
const router = express.Router();
const multer = require('multer');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');
const { parseResume, calculateMatchScore } = require('../utils/aiMatcher');

// Configure multer for memory storage for immediate parsing
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST /api/applications/:jobId/apply
router.post('/:jobId/apply', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if already applied
        const existingApp = await Application.findOne({ job: job._id, candidate: req.user._id });
        if (existingApp) return res.status(400).json({ message: 'You have already applied' });

        let resumeText = '';
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                resumeText = await parseResume(req.file.buffer);
            } else {
                resumeText = req.file.buffer.toString('utf-8');
            }
        }

        const scoreData = calculateMatchScore(resumeText, job.description, job.requiredSkills, job.experienceLevel);

        const matchScorePercentage = Math.round(scoreData.totalScore * 100);
        const feedback = `AI Score Breakdown: Skill Match (${Math.round(scoreData.breakdown.skillMatch * 100)}%), Keyword Match (${Math.round(scoreData.breakdown.keywordMatch * 100)}%), Experience Match (${Math.round(scoreData.breakdown.experienceMatch * 100)}%). Total: ${matchScorePercentage}% Match.`;

        const { immediateJoiner, coverLetter } = req.body;

        const application = await Application.create({
            job: job._id,
            candidate: req.user._id,
            matchScore: matchScorePercentage,
            scoreBreakdown: scoreData.breakdown,
            feedback: feedback,
            immediateJoiner: immediateJoiner === 'true', // multer form-data sends strings
            coverLetter: coverLetter || '',
            resumeData: req.file ? req.file.buffer : null,
            resumeContentType: req.file ? req.file.mimetype : '',
            resumePath: 'true' // simple boolean check string to render button on frontend
        });

        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   GET /api/applications/job/:jobId (Company view)
router.get('/job/:jobId', protect, authorize('company', 'admin'), async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('candidate', 'name email candidateDetails')
            .select('-resumeData') // PREVENTS CRASH
            .sort({ matchScore: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   GET /api/applications/my (Candidate view)
router.get('/my', protect, authorize('candidate'), async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user._id })
            .populate({
                path: 'job',
                select: 'title company companyName status requiredSkills location salary experienceLevel description',
                populate: {
                    path: 'company',
                    select: 'name companyDetails'
                }
            })
            .select('-resumeData')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   PUT /api/applications/:id/status (Accept/reject)
router.put('/:id/status', protect, authorize('company', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        application.status = status;
        await application.save();

        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   GET /api/applications/resume/:id (View resume PDF)
router.get('/resume/:id', protect, authorize('company', 'admin'), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application || !application.resumeData) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.set('Content-Type', application.resumeContentType || 'application/pdf');
        res.send(application.resumeData);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
