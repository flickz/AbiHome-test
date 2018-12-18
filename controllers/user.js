const { generateToken } = require('../libs/util');
const User = require('../models/user');

exports.createToken = async (username) => {
  const token = generateToken();
  return User.findOneAndUpdate({ username }, { token }, { new: true }).exec();
};

exports.getUserByToken = (token) => {
  return User.findOne({ 'token.access_token': token }).exec();
};

exports.createUser = ({ username, email, name }) => {
  const token = generateToken();
  return User.create({
    username,
    email,
    name,
    token
  });
};

exports.getUserByUsername = (username) => {
  return User.findOne({ username }).select('_id name username email').exec();
};

exports.getUserById = (userId) => {
  return User.findById(userId).exec();
};

exports.updateUser = (userId, userInfo) => {
  return User.findOneAndUpdate({ _id: userId }, userInfo, { new: true }).exec();
};

exports.deleteUser = (userId) => {
  return User.deleteOne({ _id: userId }).exec();
};

exports.getToken = (username) => {
  return User.find({ username }).select('token').exec();
};

// Means of Id could either be a username or userId
exports.getUser = async (meansOfId) => {
  let user;

  try {
    user = await User.findById(meansOfId).exec();
  } catch (err) {
    console.error(err);
  }

  if (user) {
    return user;
  }

  try {
    user = await User.findOne({ username: meansOfId }).exec();
  } catch (err) {
    console.error(err);
  }

  if (user) {
    return user;
  }

  return null;
};
