const rateLimit = require('express-rate-limit');

// For public text fetching: allow more generous rate
const textLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per minute
  message: { error: 'Too many requests, slow down! 🐢' },
});

// For updating: stricter
const updateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 updates per minute
  message: { error: 'Too many updates, take a breath! 🧘' },
});

module.exports = { textLimiter, updateLimiter };
