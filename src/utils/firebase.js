const admin = require('firebase-admin');
const { PRIVATE_KEY_JSON } = require('config');

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(PRIVATE_KEY_JSON),
  });
}

module.exports = admin;