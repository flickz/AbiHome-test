const UserController = require('../controllers/user');
const { tokenHasExpired } = require('../libs/util');

exports.create = async (req, res) => {
  if (!req.body.username) {
    return res.status(400).send('Please provide your username');
  }

  const username = req.body.username;
  let user;

  try {
    user = await UserController.getUser(username);
  } catch (err) {
    console.log(err);
    return res.status(500).send('An unkown error occur, please try again.');
  }

  if (!user) {
    return res.status(404).send('No user found with the username');
  }
  // Check if the user has a token or if the user token has expired
  if (user.token.hasOwnProperty('access_token') === false || tokenHasExpired(user.token.expiry)) {
    UserController.createToken(username)
      .then(doc => {
        return res.status(201).send({
          success: true,
          message: 'New token created successfully',
          data: doc.token
        });
      })
      .catch(error => {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: 'Could not create token'
        });
      });
  } else {
    return res.status(200).send({
      success: true,
      message: 'Token was successfully retrieved',
      data: user.token
    });
  }
};
