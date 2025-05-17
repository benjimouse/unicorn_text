const express = require('express');
const cors = require('cors');
const app = express();
const textRoutes = require('routes/text');
const updateRoutes = require('routes/update');
const busRoutes = require('routes/bus');


// Global Middleware
app.use(cors());            
app.use(express.json());    

// Routes
app.use('/text', textRoutes);
app.use('/update', updateRoutes);
app.use('/bus', busRoutes);

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
