const admin = require('firebase-admin');
const { PRIVATE_KEY_JSON } = require('config');
const { FieldValue } = require('firebase-admin/firestore');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(PRIVATE_KEY_JSON),
  });
}

const db = admin.firestore();
const docRef = db.collection('unicorn').doc('status');

async function getDocumentText() {
  try {
    const doc = await docRef.get();
    if (!doc.exists) {
      return 'No text set!';
    }
    return doc.data().text || 'No text set!';
  } catch (error) {
    console.error('[Firestore] Failed to get document:', error);
    return 'Error!';
  }
}

async function updateDocumentText(text, updatedBy) {
  const now = FieldValue.serverTimestamp();

  await docRef.set(
    {
      text,
      updatedAt: now,
      updatedBy,
    },
    { merge: true }
  );

  // Also log into subcollection
  await docRef.collection('history').add({
    text,
    updatedAt: now,
    updatedBy,
  });

  console.log(`[Firestore] Text updated by ${updatedBy}`);
}

module.exports = {
  getDocumentText,
  updateDocumentText,
};
