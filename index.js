const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = parseInt(process.env.PORT) || 8080;

const pword = process.env.PWORD || "localhost_password";

const DEFAULT_TEXT = "Hello there!";
const TEXT_FILE_PATH = "text.txt";

app.use(bodyParser.json());

app.get('/', (req, res) => {
  const unauthorizedResponse = { status: 401, message: 'Not today you hacker you :)' };
  req.query.pword !== pword ? res.status(unauthorizedResponse.status).send(unauthorizedResponse.message) : null;
  const myText = getText();
  console.log(myText);
  res.setHeader('content-type', 'application/json');
  res.send(JSON.stringify({ text: myText }));
});

app.put('/', (req, res) => {
  const unauthorizedResponse = { status: 401, message: 'Not today you hacker you :)' };
  req.query.pword !== pword ? res.status(unauthorizedResponse.status).send(unauthorizedResponse.message) : null;
  const newText = req.body.displayText;
  overWriteFile(newText);
  res.setHeader('content-type', 'application/json');
  res.send(JSON.stringify({ text: getText() }));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const getText = () => {
  try {
    return fs.readFileSync(TEXT_FILE_PATH, 'utf8');
  } catch (err) {
    console.error(err);
    overWriteFile(DEFAULT_TEXT);
    return DEFAULT_TEXT;
  }
};

const overWriteFile = (content) => {
  try {
    fs.writeFileSync(TEXT_FILE_PATH, content);
  } catch (err) {
    console.error(err);
  }
};

fs.access(TEXT_FILE_PATH, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(err);
    overWriteFile(DEFAULT_TEXT);
  }
});