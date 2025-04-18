const admin = require('firebase-admin');
const { PRIVATE_KEY_JSON } = require('../config/config');

admin.initializeApp({
    credential: admin.credential.cert(PRIVATE_KEY_JSON)
});

const db = admin.firestore();
const COLLECTION = 'myCollection';
const DOC_ID = 'myDoc';

const DEFAULT_TEXT = "Hello there!";

const getDocumentText = async () => {
    const doc = await db.collection(COLLECTION).doc(DOC_ID).get();
    return doc.exists ? doc.data().text : DEFAULT_TEXT;
};

const updateDocumentText = async (content) => {
    await db.collection(COLLECTION).doc(DOC_ID).set({ text: content });
};

module.exports = { getDocumentText, updateDocumentText };
