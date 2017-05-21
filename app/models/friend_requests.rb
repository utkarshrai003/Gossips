
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendRequestSchema = new Schema({
  sender_id: Number,
  receiver_id: Number,
  status: { type: String, enum: ['pending', 'accepted'. 'declined'] }
});

var FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = FriendRequest;
