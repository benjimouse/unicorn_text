const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  var date = new Date();
	var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
  //const myText = `Hello ${name}! It's ${current_time}`;
  const myText = getText();
  console.log(myText);
  res.send(JSON.stringify({ text: myText }));
});

app.put('/', (req, res) => {
  console.log(req.displayText);
  const myText = getText();
  console.log(myText);
  res.send(JSON.stringify({ text: myText }));
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});

function getText() {
 return fs.readFileSync('text.txt', 'utf8');
}