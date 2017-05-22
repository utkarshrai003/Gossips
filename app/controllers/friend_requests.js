var express = require('express');
var router = express.Router();
var FriendRequest = require('../models/friend_request');
var path = require('path');
var isUserAuthenticated = require('./auth');

router.post('/send_request', function(req, res) {
  var sender_id = req.session.user._id;
  var receiver_id = req.body.to_user;

  FriendRequest.findOne({
    $and: [
      {
        $or: [{sender_id: sender_id, receiver_id: receiver_id}, {receiver_id: sender_id, sender_id: receiver_id}],
        $or: [{status: 'declined'}]
      }
    ]
  }, function(err, request) {
    if(err) {
      res.send({status: 400, error: "Error occured"});
    }
    else if(!request) {
      var request = new FriendRequest(
        {
          sender_id: sender_id,
          receiver_id, receiver_id
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
    }
  });


  res.send({status: 200});
});

module.exports = router;
