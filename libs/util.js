const moment = require('moment');
const uuid = require('uuid');

exports.generateToken = () => {
  const accessToken = uuid.v4();
  const duration = moment.duration({ days: 1 });
  const expiry = moment().add(duration);
  return {
    access_token: accessToken,
    expiry
  };
};

exports.tokenHasExpired = (expiryDate) => {
  if (moment().isAfter(expiryDate)) {
    return true;
  }
  return false;
};
