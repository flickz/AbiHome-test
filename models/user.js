const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    unique: true,
    required: '{PATH} is required!',
    type: String
  },
  email: {
    unique: true,
    type: String,
    required: '{PATH} is required!'
  },
  name: {
    type: String,
    required: '{PATH} is required!'
  },
  token: {
    expiry: Date,
    access_token: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
