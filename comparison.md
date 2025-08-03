router.post('/register', async (req, res) => {
  const { username, password, location } = req.body;

  if (!username || !password || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, location });

  try {
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.use('/api/auth', require('./routes/auth'));

















require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Correct route import
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });











// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
















