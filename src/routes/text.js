const express = require('express');
const router = express.Router();
const { getDocumentText } = require('services/firestore');
const { allowBearerOrOAuth } = require('middlewares/auth');

router.get('/', allowBearerOrOAuth, async (req, res) => {
  try {
    const text = await getDocumentText();
    res.json({ text });
  } catch (error) {
    console.error('[Text Route] Error fetching text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
