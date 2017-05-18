
var express = require('express');
var database = require('./config/connection.js');
var app = express();

// Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(require('./app/controllers'));

app.listen(8081, function () {
  console.log('Server started at port: 8081');
});
