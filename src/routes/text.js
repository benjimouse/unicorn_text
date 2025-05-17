const express = require('express');
const router = express.Router();
const { allowBearerOrOAuth } = require('middlewares/auth');
const { textLimiter } = require('middlewares/rateLimiters');
const { getDocumentText } = require('services/firestore');

router.get('/', textLimiter, allowBearerOrOAuth, async (req, res) => {
  try {
    const { text, updatedBy = 'unknown', updatedAt = null } = await getDocumentText();
    res.json({ text, updatedBy, updatedAt });
  } catch (err) {
    console.error('❌ Failed to fetch text:', err);
    res.status(500).json({ error: 'Failed to fetch text' });
  }
});

module.exports = router;
