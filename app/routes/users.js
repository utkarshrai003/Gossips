
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var isUserAuthenticated = require('./auth')
var _ = require('underscore');
var swig  = require('swig');

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
  var template = swig.compileFile(path.join(__dirname, '../views/profile.html'));
  var output = template({
    user: req.session["user"]
  });
  res.send(output);
});

router.get('/search_users', isUserAuthenticated, function(req, res) {
  User.find({'username': new RegExp(req.query.key, 'i'), 'name': new RegExp(req.query.key, 'i') }, function(err, records) {
    if(err) {
      console.log(err);
    }
    else {
      res.send(_.map(records, function(obj) {
        return {
          id: obj.id,
          name: obj.username
        }
      }));
    }
  });
});

router.get('/users/:id', isUserAuthenticated, function(req, res) {
  var id = req.params.id;
  User.findOne({id: id}, function(err, user) {
    if(err) {
      res.send({status: 400, error: "No such User exists."});
    }
    else {
      var template = swig.compileFile(path.join(__dirname, '../views/user.html'));
      console.log(template);
      var output = template({
        id: id
      });
      res.send(output);
    }
  });
});

module.exports = router;
