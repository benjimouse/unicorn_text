const express = require('express');
const router = express.Router();
const { getDocumentText, updateDocumentText } = require('../services/firestore');
const { PWORD } = require('../config/config');

// GET current display text
router.get('/', async (req, res) => {
    if (req.query.pword !== PWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

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
    if (req.query.pword !== PWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

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
