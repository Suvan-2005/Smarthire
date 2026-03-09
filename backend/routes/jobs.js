const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/jobs
router.get('/', async (req, res) => {
    try {
        const query = { status: 'active' };
        const jobs = await Job.find(query).populate('company', 'name companyDetails');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   POST /api/jobs
router.post('/', protect, authorize('company', 'admin'), async (req, res) => {
    try {
        const { title, companyName, description, requiredSkills, experienceLevel, salary, location } = req.body;

        const job = await Job.create({
            company: req.user._id,
            companyName,
            title,
            description,
            requiredSkills,
            experienceLevel,
            salary,
            location
        });

        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name companyDetails');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
