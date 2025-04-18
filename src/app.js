const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const { PWORD } = require('./config/config');

const app = express();

// Middleware
app.use(bodyParser.json());

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
