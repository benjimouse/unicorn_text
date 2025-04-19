const express = require('express');
const router = express.Router();
const { getDocumentText, updateDocumentText } = require('services/firestore');
const { API_TOKEN } = require('config');

// Middleware to check Authorization header
router.use((req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1]; // 'Bearer TOKEN'
  if (token !== API_TOKEN) {
    console.warn('[Auth Middleware] Unauthorized request');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// GET current display text
router.get('/', async (req, res) => {
  try {
    const data = await getDocumentText();
    res.json({
      text: data.text,
      updatedAt: data.updatedAt,
      updatedBy: data.updatedBy,
    });
  } catch (error) {
    console.error('❌ Failed to fetch text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// PUT to update the display text
router.put('/', async (req, res) => {
  try {
    const { displayText, updatedBy } = req.body;

    if (!displayText || typeof displayText !== 'string' || displayText.trim() === '') {
      return res.status(400).json({ error: 'Invalid displayText provided' });
    }

    const whoUpdated = updatedBy || 'web-frontend';

    await updateDocumentText(displayText, whoUpdated);

    const updatedData = await getDocumentText();
    res.json({
      text: updatedData.text,
      updatedAt: updatedData.updatedAt,
      updatedBy: updatedData.updatedBy,
    });
  } catch (error) {
    console.error('❌ Failed to update text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
