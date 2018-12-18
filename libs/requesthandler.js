const { getUserByToken } = require('../controllers/user');
const { tokenHasExpired } = require('../libs/util');

exports.parseToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const headerItems = authHeader.split(' ');
  if (headerItems[0] !== 'AbiHomeTest-api-v1') {
    return res.status(401).send('Unknown authorization bearer');
  }

  if (headerItems[1]) {
    req.accessToken = headerItems[1];
  } else {
    req.accessToken = null;
  }

  next();
};

exports.verifyToken = async (req, res, next) => {
  if (!req.accessToken) {
    return res.status(400).send('Please provide the user access token.');
  }

  const accessToken = req.accessToken;
  let user;

  try {
    user = await getUserByToken(accessToken);
  } catch (err) {
    return res.status(500).send('Unable to verify user access token');
  }

  if (user === null || !user._id) {
    return res.status(404).send('No user with the id found');
  }

  if (user.token && user.token.access_token !== accessToken) {
    return res.status(401).send('Invalid token, please provide the right token');
  }

  if (tokenHasExpired(user.token.expiry)) {
    return res.status(401).send('Access token has expired, please generate a new one.');
  }
  req.tokenVerified = true;
  req.user = user;
  next();
};
