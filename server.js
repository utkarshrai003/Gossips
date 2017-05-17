
var express = require('express');
var app = express();

app.listen(8081, function () {
  console.log('Server started at port: 8081');
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});
