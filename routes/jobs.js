const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');

// Create a Job
router.post('/jobs', async (req, res) => {
  try {
    const { title, department, positions, status } = req.body;
    const newJob = new Job({ title, department, positions, status });
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get All Jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
