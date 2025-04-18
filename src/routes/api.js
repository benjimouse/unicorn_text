const express = require('express');
const router = express.Router();
const { getDocumentText, updateDocumentText } = require('../services/firestore');
const { API_TOKEN } = require('../config/config');

// Middleware to check Authorization header
router.use((req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    console.log(`[Auth Middleware] Authorization Header: "${authHeader}"`);
  
    const token = authHeader.split(' ')[1];
    console.log(`[Auth Middleware] Parsed token: "${token}"`);
  
    console.log(`[Auth Middleware] Expected token: "${API_TOKEN}"`);
  
    if (token !== API_TOKEN) {
      console.warn('[Auth Middleware] ❌ Unauthorized Access Attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    console.log('[Auth Middleware] ✅ Authorized Request');
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
