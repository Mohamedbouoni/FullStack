const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },  // job ID the employee applied for
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // the user applying
  resume: { type: String }, // file path or link to uploaded resume
  appliedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
