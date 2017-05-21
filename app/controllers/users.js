
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var isUserAuthenticated = require('./auth')

router.post('/sign_up', function(req, res) {
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

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if(!user || err) {
      res.redirect('/welcome');
    }
    else {
      if(user.password == password) {
        req.session.user = user;
        console.log(user.username + " logged in !!");
        res.redirect('/profile');
      }
    }
  })
});

router.get('/welcome', function(req, res) {
  res.sendFile('welcome.html', { root: path.join(__dirname, '../views') });
});

router.get('/profile', isUserAuthenticated, function(req, res) {
  res.sendFile('profile.html', { root: path.join(__dirname, '../views') });
});

module.exports = router;
