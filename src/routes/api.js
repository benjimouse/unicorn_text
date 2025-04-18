const express = require('express');
const router = express.Router();
const { getDocumentText, updateDocumentText } = require('../services/firestore');
const { API_TOKEN } = require('../config/config');

// Middleware to check Authorization header
router.use((req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1]; // 'Bearer TOKEN'
  if (token !== API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// GET current display text
router.get('/', async (req, res) => {
  try {
    const text = await getDocumentText();
    res.json({ text });
  } catch (error) {
    console.error('❌ Failed to fetch text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// PUT to update the display text
router.put('/', async (req, res) => {
  try {
    const { displayText } = req.body;
    await updateDocumentText(displayText);
    const updatedText = await getDocumentText();
    res.json({ text: updatedText });
  } catch (error) {
    console.error('❌ Failed to update text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
