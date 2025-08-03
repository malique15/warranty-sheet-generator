// Load environment variables from .env
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/auth');
const warrantyRoutes = require('./routes/warranty');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());                // Enable CORS for cross-origin requests
app.use(express.json());        // Parse incoming JSON bodies

// Routes
app.use('/api/auth', authRoutes);           // e.g., POST /api/auth/login
app.use('/api/warranty', warrantyRoutes);   // e.g., POST /api/warranty/create

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

