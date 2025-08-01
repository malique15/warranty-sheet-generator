const express = require('express');
const Warranty = require('../models/warranty');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, async (req, res) => {
  const warranty = new Warranty({
    ...req.body,
    createdBy: req.user.username,
    location: req.user.location,
  });
  await warranty.save();
  res.send("Warranty saved");
});

router.get('/search', auth, async (req, res) => {
  const { date } = req.query;
  const start = new Date(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 7); // for weekly range

  const warranties = await Warranty.find({
    location: req.user.location,
    createdAt: { $gte: start, $lt: end }
  });

  res.json(warranties);
});

module.exports = router;
