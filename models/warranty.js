const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  machineDetails: [
    {
      brand: String,
      warrantyPeriod: String,
      model: String,
      serialNumber: String,
      armature: String,
      twoCycle: String,
      machineType: String
    }
  ],
  createdBy: { type: String, required: true },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Warranty', warrantySchema);