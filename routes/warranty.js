const express = require('express');
const Warranty = require('../models/warranty.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { username, location }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};

// ✅ Create warranty
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { customerName, machineDetails } = req.body;
    const { username, location } = req.user;

    const newWarranty = new Warranty({
      customerName,
      machineDetails,   // ✅ consistent
      createdBy: username,
      location
    });

    await newWarranty.save();
    res.status(201).json({ msg: 'Warranty saved successfully' });
  } catch (err) {
    console.error('Error saving warranty:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Search warranties by week
router.get('/search', verifyToken, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ msg: 'Date required' });

    const { location } = req.user;

    const inputDate = new Date(date);
    const dayOfWeek = inputDate.getDay();
    const startOfWeek = new Date(inputDate);
    startOfWeek.setDate(inputDate.getDate() - ((dayOfWeek + 6) % 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const warranties = await Warranty.find({
      location,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek }
    }).sort({ createdAt: -1 });

    res.json(warranties);   // ✅ frontend expects array
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Get single warranty by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);
    if (!warranty) return res.status(404).json({ msg: 'Warranty not found' });
    res.json(warranty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
