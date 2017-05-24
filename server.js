
// App
var express = require('express');
var app = express();

// Database
var database = require('./config/connection.js');

// Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Sessions
var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Serving static content from the public repo
app.use(express.static('public/images'));

// Routes
var routes = require('./app/routes');
app.use('/', routes);
// app.use(require('./app/controllers/users.js'));
// app.use(require('./app/controllers/friend_requests.js'));

// Listening to the port
app.listen(8081, function () {
  console.log('Server started at port: 8081');
});
