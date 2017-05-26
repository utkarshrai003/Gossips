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
    $or: [{sender_id: sender_id, receiver_id: receiver_id}, {receiver_id: sender_id, sender_id: receiver_id}]},
    {}, {sort: {'created_at': -1}}).exec();

  // If request is not already there, or is not accepted and pending
  // create the record
  promise.then(function(friend_request) {
    console.log("checkpoint 1");
    if( !friend_request || ( friend_request && !(friend_request.status=='accepted' || friend_request.status=='pending')) ) {
      var request = new FriendRequest({
        sender_id: sender_id,
        receiver_id: receiver_id
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
    return FriendRequest.find({receiver_id: receiver_id, status: 'pending'}).exec();
  })
  // Get the user info from requests and prepae the object to be sent
  .then(function(requests) {
    console.log("checkpoint 3" + requests);
    var sender_ids = _.map(requests, function(obj) {
      return obj.sender_id;
    });
    return User.find({_id: {$in: sender_ids}}).exec();
  })
  // Publish the requests and redirect
  .then(function(requests) {
    console.log("checkpoint 4" + requests);
    req.app.io.emit(receiver_id, {type: 'notification', sub_type: 'friend_requests', data: {from: requests}});
    res.redirect('/profile');
  })
  .catch(function(err) {
    res.send({status: 400, error: err});
  });
});

router.get('/test', function(req, res) {
  // FriendRequest.remove({}, function(err, record) {
  //
  // });
  // res.send({data: "removed"});
  User.find({}, function(err, records) {
    if(err) {
      res.send({status: 400, error: "My error"});
    }
    else {
      res.send({status: 200, records: records});
    }
  });
});


// CAN BE REFACTORED I THINK
// Endpoint to return the users who sent friend requests to the currently logged in user
// router.get('/friend_requests', isUserAuthenticated, function(req, res) {
//   var promise = FriendRequest.find({receiver_id: req.session.user._id, status: 'pending'}).exec();
//
//   promise.then(function(requests) {
//     var data = [];
//     _.each(requests, function(request) {
//       var sender_id = request.sender_id;
//       User.findOneAsync({_id: sender_id}).exec(function(err, record) {
//         data.push({
//           request: request,
//           sender: user
//         });
//       });
//       console.log("Data is : " + data);
//     });
//     res.send({status: 200, senders: data});
//   })
//   .catch(function(err) {
//     res.send({ status: 400, error: err });
//   });


  // promise.then(function(requests) {
  //   var sender_ids = _.map(requests, function(obj) {
  //     return obj.sender_id;
  //   });
  //   console.log("Sender ids =>  " + sender_ids);
  //   return User.find({_id: {$in: sender_ids}}).exec();
  // })
  // .then(function(request_senders) {
  //   console.log("Request senders => " + request_senders);
  //   res.send({status: 200, senders: request_senders});
  // })
  // .catch(function(err) {
  //   res.send({ status: 400, error: err });
  // });
// });

// {
//   request_id: ,
//   sender_info:
// }

// request id is required
// router.post('/accept_request', isUserAuthenticated, function(req, res) {
//   var current_user_id = req.session.user._id;
//   var friend_user_id = req.body.friend_id;
//   var picked;
//
//   // For friend 1
//   User.findOne({_id: current_user_id}).exec(function(err, record) {
//     picked = _.pick(record, "_id", "name", "username");
//     User.update({_id: current_user_id}, {$push: {friends: picked}}).exec(function(err, record) {
//       // if(err) {
//       //   res.send({ststus: 400, error: err});
//       // }
//     });
//   });
//
//   // For friend 1
//   User.findOne({_id: friend_user_id}).exec(function(err, record) {
//     picked = _.pick(record, "_id", "name", "username");
//     User.update({_id: friend_user_id}, {$push: {friends: picked }}).exec(function(err, record) {
//       console.log('checkpoint 1');
//       // if(err) {
//       //   res.send({status: 400, error: err});
//       // }
//     });
//   });
//
//   res.send({status: 200, data: "done"});
// });


module.exports = router;
