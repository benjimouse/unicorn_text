const express = require('express');
const router = express.Router();
const { allowBearerOrOAuth } = require('middlewares/auth');
const { textLimiter } = require('middlewares/rateLimiters');
const { getDocumentText } = require('services/firestore');

router.get('/', textLimiter, allowBearerOrOAuth, async (req, res) => {
  try {
    const text = await getDocumentText();
    res.json({ text });
  } catch (error) {
    console.error('[Route] ❌ Failed to fetch text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
