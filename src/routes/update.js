const express = require('express');
const router = express.Router();
const { requireOAuthOnly } = require('middlewares/auth');
const { updateLimiter } = require('middlewares/rateLimiters');
const { updateDocumentText } = require('services/firestore');

router.put('/update', updateLimiter, requireOAuthOnly, async (req, res) => {
  try {
    const { displayText } = req.body;
    const user = req.user?.email || 'unknown';

    await updateDocumentText(displayText, user);

    res.status(200).json({ message: 'Text updated successfully!' });
  } catch (error) {
    console.error('[Route] ❌ Failed to update text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
