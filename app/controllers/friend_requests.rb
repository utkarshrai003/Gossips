var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var isUserAuthenticated = require('./auth');

router.post('/send_request', function(req, res) {
  var sender_id = req.body.sender_id;
  var receiver_id = req.body.receiver_id
  
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;
  var password_confirmation = req.body.password_confirmation;

  if(password!=password_confirmation) {
    res.send({status: 400, error: "Password and password confirmation should match."});
  }

  if(name && username) {
    var user = new User({
      name: name,
      username: username,
      password: password
    });
    user.save(function(err, record) {
      if(err) {
        console.log(err);
      }
      else {
        res.redirect('/welcome');
      }
    });
  }
  else {
    res.send({status: 400, error: "Name and Username needs to provided."});
  }
});
