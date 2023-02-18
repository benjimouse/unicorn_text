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
  if(req.query.pword!=pword){
    res.status(401, 'Not today you hacker you :)');
    res.send("Not today you hacker you");
  } else {
    var date = new Date();
    var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
    //const myText = `Hello ${name}! It's ${current_time}`;
    const myText = getText();
    console.log(myText);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify({ text: myText }));
  }
});
const StringDecoder = require("string_decoder").StringDecoder;

app.put('/', (req, res) => {
  if(req.query.pword!=pword){
    res.status(401, 'Not today you hacker you :)');
    res.send("Not today you hacker you");
  } else {
    const newText = req.body.displayText;
    overWriteFile(newText);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify({ text: getText() }));
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const getText = () => {
  if(!fs.existsSync(TEXT_FILE_PATH)){
    overWriteFile(DEFAULT_TEXT);
  }
  return fs.readFileSync(TEXT_FILE_PATH, 'utf8');
 }
 const overWriteFile = (content) => {
    fs.writeFileSync(TEXT_FILE_PATH, content);
 }