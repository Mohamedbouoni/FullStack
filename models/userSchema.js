const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: null },
  role: { type: String, enum: ['user', 'admin', 'recruiter'], default: 'user' },
  createdAt: {
    type: Date,
    default: Date.now
  } 

});

module.exports = mongoose.model('User', UserSchema);
