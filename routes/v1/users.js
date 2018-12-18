const UserController = require('../../controllers/user');

exports.get = (req, res) => {
  if (!req.params.username) {
    return res.status(400).send('Please provide username');
  }

  const username = req.params.username;

  UserController.getUserByUsername(username)
    .then((doc) => {
      if (doc) {
        return res.status(200).send({
          success: true,
          message: 'User information successfully retrived',
          data: doc
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'No user found'
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: 'Failed to get user\'s information, please try again.'
      });
    });
};

exports.create = (req, res) => {
  const { name, username, email } = req.body;
  if (!name || !username || !email) {
    return res.status(400).send('All fields are required, please provide your name, email, and username');
  }

  UserController.createUser({ name, email, username })
    .then(doc => {
      return res.status(201).send({
        success: true,
        message: 'User account creation was successful',
        data: doc
      });
    })
    .catch(error => {
      console.error(error);
      if (error.code && error.code === 11000) {
        return res.status(400).send({
          success: false,
          message: 'Email or Username already exist, please choose a new one.'
        });
      }
      return res.status(500).send({
        success: false,
        message: 'Could not create user, please try again.'
      });
    });
};

exports.delete = (req, res) => {
  if (!req.params.userId) {
    return res.status(400).send('Please provide the user id');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  const userId = req.user._id;

  UserController.deleteUser(userId, req.body)
    .then(doc => {
      return res.status(200).send({
        success: true,
        message: 'User account deleted successfully'
      });
    }).catch(error => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not delete user, please try again.'
      });
    });
};

exports.update = async (req, res) => {
  if (!req.params.userId) {
    return res.status(400).send('Please provide the user id');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  const userId = req.user._id;
  UserController.updateUser(userId, { ...req.body })
    .then(doc => {
      return res.status(200).send({
        success: true,
        message: 'User information was successfully updated',
        data: doc
      });
    }).catch(error => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not update user, please try again.'
      });
    });
};
