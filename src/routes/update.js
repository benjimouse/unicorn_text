const express = require('express');
const router = express.Router();
const { updateDocumentText } = require('services/firestore');
const { requireOAuthAndCheckAllowlist } = require('middlewares/auth');

router.put('/', requireOAuthAndCheckAllowlist, async (req, res) => {
  try {
    const { displayText } = req.body;
    await updateDocumentText(displayText, req.authenticatedAs);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Update Route] Failed to update text:', error);
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
