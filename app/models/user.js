
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  friends: [ {type: Schema.Types.ObjectId, ref: 'User'} ]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
