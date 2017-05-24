
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendRequestSchema = new Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending'}
});

var FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
