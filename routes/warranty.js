const express = require('express');
const Warranty = require('../models/warranty');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Save warranty
router.post('/create', verifyToken, async (req, res) => {
  try {
    const newWarranty = new Warranty({
      customerName: req.body.customerName,
      machines: req.body.machines,
      location: req.user.location,
      createdAt: new Date()
    });

    await newWarranty.save();
    res.json({ msg: 'Warranty saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error saving warranty' });
  }
});

// Search warranty by date
router.get('/search', verifyToken, async (req, res) => {
  try {
    const date = new Date(req.query.date);
    if (isNaN(date)) return res.status(400).json({ msg: "Invalid date" });

    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const results = await Warranty.find({
      location: req.user.location,
      createdAt: { $gte: weekStart, $lt: weekEnd }
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Search failed' });
  }
});

module.exports = router;
