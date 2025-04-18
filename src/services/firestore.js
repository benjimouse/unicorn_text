const admin = require('../utils/firebase'); // <- import the initialized admin instance
const db = admin.firestore();

// Collection and document names
const COLLECTION_NAME = 'displayText';
const DOCUMENT_NAME = 'current';


/**
 * Fetch the current display text document from Firestore.
 */
const getDocumentText = async () => {
  try {
    const doc = await db.collection(COLLECTION_NAME).doc(DOCUMENT_NAME).get();
    if (doc.exists) {
      const data = doc.data();
      return {
        text: data.text || '',
        updatedAt: data.updatedAt || null,
        updatedBy: data.updatedBy || 'unknown',
      };
    }
    return { text: '', updatedAt: null, updatedBy: 'unknown' };
  } catch (err) {
    console.error('❌ Firestore getDocumentText failed:', err);
    throw err;
  }
};

/**
 * Update the display text document and log the update to history.
 *
 * @param {string} newText - New text to display.
 * @param {string} updatedBy - Who/what updated it.
 */
const updateDocumentText = async (newText, updatedBy) => {
  try {
    const safeUpdatedBy = updatedBy && typeof updatedBy === 'string' && updatedBy.trim() !== ''
      ? updatedBy
      : 'unknown';

    const timestamp = new Date().toISOString();

    const docRef = db.collection(COLLECTION_NAME).doc(DOCUMENT_NAME);

    // Update the current text
    await docRef.set({
      text: newText,
      updatedAt: timestamp,
      updatedBy: safeUpdatedBy,
    });

    // Log the change into a subcollection "history"
    await docRef.collection('history').add({
      text: newText,
      updatedAt: timestamp,
      updatedBy: safeUpdatedBy,
    });

    console.log(`✅ Updated display text and logged to history at ${timestamp}`);
  } catch (err) {
    console.error('❌ Firestore updateDocumentText failed:', err);
    throw err;
  }
};

module.exports = {
  getDocumentText,
  updateDocumentText,
};
