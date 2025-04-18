const express = require('express');
const app = require('./app');
const { PORT } = require('./config/config');
const cors = require('cors');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.options('*', cors()); // Preflight requests
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/', require('./routes/api'));

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
