const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
  brand: String,
  warrantyPeriod: String,
  model: String,
  serialNumber: String,
  armature: String,
  twoCycle: String,
  machineType: String
});

const WarrantySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  machineDetails: [MachineSchema],   // ✅ consistent naming
  createdBy: String,
  location: String
}, { timestamps: true });

module.exports = mongoose.model('Warranty', WarrantySchema);
