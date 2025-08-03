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

const warrantyRoutes = require('./routes/warranty');
app.use('api/warranty', warrantyRoutes);


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

