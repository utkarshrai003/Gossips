var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var isUserAuthenticated = require('./auth');

router.post('/send_request', function(req, res) {
  console.log(req.body.id);
  console.log(req.session.user.id);

  res.send({status: 200});
});

module.exports = router;
