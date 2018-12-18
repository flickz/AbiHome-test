const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  num_of_likes: {
    default: 0,
    type: Number
  },
  likers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
