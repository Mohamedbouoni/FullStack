// models/loggedUserSchema.js
const mongoose = require('mongoose');

const LoggedUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  loginDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoggedUser', LoggedUserSchema);
