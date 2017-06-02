var express = require('express');
var router = express.Router();
var FriendRequest = require('../models/friend_request');
var User = require('../models/user');
var path = require('path');
var isUserAuthenticated = require('./auth');
var _ = require('underscore');

router.post('/send_request', isUserAuthenticated, function(req, res) {
  var sender_id = req.session.user._id;
  var receiver_id = req.body.to_user;

  var promise = FriendRequest.findOne({
    $or: [{sender: sender_id, receiver: receiver_id}, {receiver: sender_id, sender: receiver_id}]},
    {}, {sort: {'created_at': -1}}).exec();

  // If request is not already there, or is not accepted and pending
  // create the record
  promise.then(function(friend_request) {
    console.log("checkpoint 1");
    if( !friend_request || ( friend_request && !(friend_request.status=='accepted' || friend_request.status=='pending')) ) {
      var request = new FriendRequest({
        sender: sender_id,
        receiver: receiver_id
      });
      return request.save();
    }
    else {
      res.send({status: 400, error: "Friend Request already sent"});
    }
  })
  // Get all the requests to be sent to the receiver via sockets
  .then(function(friend_request) {
    console.log("checkpoint 2" + friend_request);
    return FriendRequest.find({receiver: receiver_id, status: 'pending'}).exec();
  })
  // Get the user info from requests and prepae the object to be sent
  .then(function(requests) {
    console.log("checkpoint 3" + requests);
    var sender_ids = _.map(requests, function(obj) {
      return obj.sender;
    });
    return User.find({_id: {$in: sender_ids}}).exec();
  })
  // Publish the requests and redirect
  .then(function(requests) {
    console.log("checkpoint 4" + requests);
    // req.app.io.emit(receiver_id, {type: 'notification', sub_type: 'friend_requests', data: {from: requests}});
    res.redirect('/profile');
  })
  .catch(function(err) {
    res.send({status: 400, error: err});
  });
});

router.get('/test', function(req, res) {
  FriendRequest.remove({}, function(err, record) {

  });
  res.send({data: "removed"});
  // User.find({}).populate("friends.user").exec(function(err, records) {
  //   if(err) {
  //     res.send({status: 400, error: err});
  //   }
  //   else {
  //     res.send({status: 200, records: records});
  //   }
  // });
});


// CAN BE REFACTORED I THINK
// Endpoint to return the users who sent friend requests to the currently logged in user
router.get('/friend_requests', isUserAuthenticated, function(req, res) {
  var promise = FriendRequest.find({receiver: req.session.user._id, status: 'pending'}).populate('sender', '_id name username').exec();
  promise.then(function(requests_with_sender) {
    res.send({status: 200, data: requests_with_sender});
  })
  .catch(function(err) {
    res.send({status: 400, error: err});
  });
});

// request id is required
router.post('/accept_request', isUserAuthenticated, function(req, res) {
  var request_id = req.body.request_id;

  promise  = FriendRequest.findOneAndUpdate({_id: request_id}, {status: 'accepted'}).exec();

  // adding friend to receiver
  promise.then(function(request) {
    const sender = User.findOne({_id: request.sender}).exec();
    const receiver = User.findOne({_id: request.receiver}).exec();
    return Promise.all([sender, receiver]);
  })
  .then(resolves => {
    const sender = resolves[0];
    const receiver = resolves[1];
    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    return Promise.all([ sender.save(), receiver.save() ]);
  })
  .then(resolves => {
    res.send({status: 200, data: "done"});
  })
  .catch((err) => {
    console.error(err);
    res.send({status: 400, error: err});
  });



  //   , function(err, res) {
  //     if(err) {
  //       console.log("GOT ERROR" + err);
  //     }
  //     User.findOne({_id: request.receiver}, function(err, res2) {
  //       console.log("Res 2 ", res2);
  //       res.friends.push(res2._id);
  //       res.save().catch(console.log)
  //       // console.log(res.save());
  //       console.log("User is " + JSON.stringify(res.friends));
  //     });
  //     // res.friends.push(res);
  //     // console.log(res.friends);
  //     // res.save();
  //     // console.log(res.save());
  //   });
  // })
  // .then(function(user) {
  //   console.log("User :" + user);
  //   res.send({status: 200, data: "done"});
  // })
  // .catch(function(err) {
  //   res.send({status: 400, error: err})
  // })
});


module.exports = router;
