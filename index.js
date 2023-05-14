const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const winston = require('winston');
const app = express();
const port = parseInt(process.env.PORT) || 8080;

const pword = process.env.PWORD || "localhost_password";

const DEFAULT_TEXT = "Hello there!";
const TEXT_FILE_PATH = "text.txt";

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

app.get('/', (req, res) => {
  const unauthorizedResponse = { status: 401, message: 'Not today you hacker you :)' };
  req.query.pword !== pword ? res.status(unauthorizedResponse.status).send(unauthorizedResponse.message) : null;
  const myText = getText();
  logger.info(myText);
  res.json({ text: myText });
});

app.put('/', (req, res) => {
  const unauthorizedResponse = { status: 401, message: 'Not today you hacker you :)' };
  req.query.pword !== pword ? res.status(unauthorizedResponse.status).send(unauthorizedResponse.message) : null;
  const newText = req.body.displayText;
  overWriteFile(newText);
  res.json({ text: getText() });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const getText = () => {
  try {
    return fs.readFileSync(TEXT_FILE_PATH, 'utf8');
  } catch (err) {
    logger.error(err);
    overWriteFile(DEFAULT_TEXT);
    return DEFAULT_TEXT;
  }
};

const overWriteFile = (content) => {
  try {
    fs.writeFileSync(TEXT_FILE_PATH, content);
  } catch (err) {
    logger.error(err);
  }
};

fs.access(TEXT_FILE_PATH, fs.constants.F_OK, (err) => {
  if (err) {
    logger.error(err);
    overWriteFile(DEFAULT_TEXT);
  }
});