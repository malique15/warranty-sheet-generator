const express = require('express');
const Warranty = require('../models/Warranty');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token and get user info
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains username and location
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// ----------------------
// Save warranty (POST)
// ----------------------
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { customerName, machineDetails } = req.body;
    const { username, location } = req.user;

    const newWarranty = new Warranty({
      customerName,
      machineDetails,
      createdBy: username,
      location
    });

    await newWarranty.save();
    res.status(201).json({ msg: 'Warranty saved successfully' });
  } catch (err) {
    console.error('❌ Error saving warranty:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ----------------------
// Search warranty by date (GET)
// ----------------------
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { date } = req.query;
    const { location } = req.user;

    if (!date) return res.status(400).json({ msg: 'Date is required' });

    const inputDate = new Date(date);
    const dayOfWeek = inputDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const startOfWeek = new Date(inputDate);
    startOfWeek.setDate(inputDate.getDate() - ((dayOfWeek + 6) % 7)); // Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    const warranties = await Warranty.find({
      location,
      createdAt: {
        $gte: startOfWeek,
        $lte: endOfWeek
      }
    }).sort({ createdAt: -1 });

    res.json(warranties);
  } catch (err) {
    console.error('❌ Error searching warranty:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
