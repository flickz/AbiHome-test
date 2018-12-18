/* eslint-env jest */

const userDummy = {
  _id: 'fooade32r'
};

const save = function (cb) {
  return cb(null, userDummy);
};

const exec = function (doc) {
  return Promise.resolve({
    ...userDummy,
    ...doc
  });
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
    select
  };
};

Model.create = function (doc) {
  return Promise.resolve({
    ...userDummy,
    ...doc
  });
};

Model.findOneAndUpdate = function (userId, doc) {
  return {
    exec
  };
};

Model.deleteOne = function (userId) {
  return {
    exec
  };
};

module.exports = Model;
