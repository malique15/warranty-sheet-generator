const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  location: { type: String, enum: ['LocationA', 'LocationB', 'LocationC'] }
});

module.exports = mongoose.model('User', userSchema);
