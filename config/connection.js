
// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gossips-db');

var db = mongoose.connection;

db.on('error', function() {
  console.error.bind(console, 'connection error:');
});

db.once('open', function() {
  console.log("Successfully connected to database");
});
