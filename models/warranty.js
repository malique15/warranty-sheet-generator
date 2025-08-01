const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  customerName: String,
  brand: String,
  model: String,
  serialNumber: String,
  warrantyPeriod: String,
  armature: String,
  twoCycle: String,
  machineType: String,
  createdBy: String, // username
  location: String, // match with user's location
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Warranty', warrantySchema);
