const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();

// Global Middlewares
app.use(cors());             // ← ENABLE CORS HERE
app.options('*', cors());    // ← Handle preflight OPTIONS requests
app.use(bodyParser.json());  // ← Parse JSON request bodies

// Simple logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use('/', apiRoutes);

// Health check
app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

module.exports = app;
