const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  salary: { type: Number, required: true }  // Add the salary field
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
