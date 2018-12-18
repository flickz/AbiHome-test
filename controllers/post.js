const Post = require('../models/post');

exports.createPost = (postDetails) => {
  return Post.create(postDetails);
};

exports.getPost = (postId) => {
  return Post.findOne({ _id: postId }).populate('author', 'name username').exec();
};

exports.deletePost = (postId) => {
  return Post.deleteOne({ _id: postId }).exec();
};

exports.updatePost = (postId, postDetails) => {
  return Post.findOneAndUpdate({ _id: postId }, postDetails, { new: true }).exec();
};
