require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const winston = require('winston');
const app = express();
const port = parseInt(process.env.PORT) || 8080;

const pword = process.env.PWORD || "localhost_password";

const DEFAULT_TEXT = "Hello there!";
const TEXT_FILE_PATH = "text.txt";
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.PRIVATE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

logger.on('error', (err) => {
  console.error('Logger error:', err);
});

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const unauthorizedResponse = { status: 401, message: 'Not today you hacker you :)' };
  req.query.pword !== pword ? res.status(unauthorizedResponse.status).send(unauthorizedResponse.message) : null;
  const myText = await getDocumentText();
  logger.info(myText);
  res.json({ text: myText });
});

app.put('/', async (req, res) => {
  const unauthorizedResponse = { status: 401, message: 'Not today you hacker you :)' };
  req.query.pword !== pword ? res.status(unauthorizedResponse.status).send(unauthorizedResponse.message) : null;
  const newText = req.body.displayText;
  await updateDocumentText(newText);
  res.json({ text: await getDocumentText() });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


const getDocumentText = async () => {
  try {
    const doc = await db.collection('myCollection').doc('myDoc').get();
    return doc.exists ? doc.data().text : DEFAULT_TEXT;
  } catch (err) {
    console.error(err);
    return DEFAULT_TEXT;
  }
};

const updateDocumentText = async (content) => {
  try {
    await db.collection('myCollection').doc('myDoc').set({ text: content });
  } catch (err) {
    console.error(err);
  }
};