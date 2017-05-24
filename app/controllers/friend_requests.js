var express = require('express');
var router = express.Router();
var FriendRequest = require('../models/friend_request');
var path = require('path');
var isUserAuthenticated = require('./auth');

router.post('/send_request', isUserAuthenticated, function(req, res) {
  var sender_id = req.session.user._id;
  var receiver_id = req.body.to_user;

  FriendRequest.findOne({
    $or: [{sender_id: sender_id, receiver_id: receiver_id}, {receiver_id: sender_id, sender_id: receiver_id}],
    })
    .sort('-created_at')
    .exec(function(err, friend_request) {
      if(err) {
        res.send({status: 400, error: "Error occured"});
      }
      else {
        if( !friend_request || ( friend_request && !(friend_request.status=='accepted' || friend_request.status=='pending')) ) {
          var request = new FriendRequest(
            {
              sender_id: sender_id,
              receiver_id: receiver_id
            });
            request.save(function(err, record) {
              if(err) {
                console.log(err);
              }
              else {
                
                res.redirect('/profile');
              }
            });
          }
          else {
            res.send({status: 400, error: "Friend Request already sent"});
          }
        }
      });
});

router.get('/friend_requests', function(rq, res) {
  FriendRequest.find({}, function(err, records) {
    if(err) {
      res.send({status: 400, error: "My errro"});
    }
    else {
      res.send({status: 200, records: records});
    }
  });
});


module.exports = router;
