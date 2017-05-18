
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');

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
        res.redirect('/profile');
      }
    });
  }
  else {
    res.send({status: 400, error: "Name and Username needs to provided."});
  }
});

router.get('/welcome', function(req, res) {
  res.sendFile('welcome.html', { root: path.join(__dirname, '../views') });
});

router.get('/profile', function(req, res) {
  res.sendFile('profile.html', { root: path.join(__dirname, '../views') });
});

module.exports = router;
