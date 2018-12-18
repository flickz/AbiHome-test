/* eslint-env jest */

const dummyPost = {
  _id: 'post-id'
};

const save = function (doc) {
  return Promise.resolve({
    ...dummyPost,
    ...doc
  });
};

const exec = function (doc) {
  return Promise.resolve({
    ...dummyPost,
    author: {
      _id: '1'
    },
    likers: [],
    save
  });
};

const populate = function (prop, fields) {
  return {
    exec
  };
};

const select = function (fields) {
  return {
    exec: exec
  };
};

function Model (_doc) {
  this._doc = _doc;
  return {
    save
  };
}

Model.findOne = function (option) {
  return {
    select,
    populate
  };
};

Model.create = function (doc) {
  return Promise.resolve({
    ...dummyPost,
    ...doc
  });
};

Model.findOneAndUpdate = function (postId, doc) {
  return {
    exec
  };
};

Model.deleteOne = function (postId) {
  return {
    exec
  };
};

module.exports = Model;
