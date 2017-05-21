
var express = require('express');
var app = express();

// Database
var database = require('./config/connection.js');

// Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Seesions
var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static('public/images'));

app.use(require('./app/controllers/users.js'));

app.listen(8081, function () {
  console.log('Server started at port: 8081');
});
