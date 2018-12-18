const PostController = require('../../controllers/post');

exports.get = (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send('Please provide the post id');
  }
  const postId = req.params.postId;
  PostController.getPost(postId)
    .then((doc) => {
      if (doc) {
        return res.status(200).send({
          success: true,
          message: 'Post successfully retrived',
          data: doc
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'No post found'
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: 'Failed to get post, please try again.'
      });
    });
};

exports.create = (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).send('All fields are required, please provide title and body.');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  PostController.createPost({ title, body, author: req.user._id })
    .then(doc => {
      return res.status(201).send({
        success: true,
        message: 'Post was created successfully',
        data: doc
      });
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not create post, please try again.'
      });
    });
};

exports.delete = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send('Please provide the post id');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  const postId = req.params.postId;
  let post;
  try {
    post = await PostController.getPost(postId);
  } catch (err) {
    return res.status(500).send('An unknown error occured when trying to update post, please try again.');
  }

  if (!post) {
    return res.status(404).send('No post with the id found');
  }

  if (post.author._id.toString() !== req.user._id.toString()) {
    return res.status(401).send('User not authroized to delete this post.');
  }

  PostController.deletePost(postId)
    .then(doc => {
      return res.status(200).send({
        success: true,
        message: 'Post was deleted successfully'
      });
    }).catch(error => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not delete post, please try again.'
      });
    });
};

exports.update = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send('Please provide the post id');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  const postId = req.params.postId;
  let post;
  try {
    post = await PostController.getPost(postId);
  } catch (err) {
    return res.status(500).send('An unknown error occured when trying to update post, please try again.');
  }

  if (!post) {
    return res.status(404).send('No post with the id found');
  }

  if (post.author._id.toString() !== req.user._id.toString()) {
    return res.status(401).send('User not authroized to edit this post.');
  }

  PostController.updatePost(postId, req.body)
    .then(doc => {
      return res.status(200).send({
        success: true,
        message: 'Post was successfully updated',
        data: doc
      });
    }).catch(error => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not update post, please try again.'
      });
    });
};

exports.likePost = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send('Please provide the post id');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  const postId = req.params.postId;
  const userId = req.user._id;
  let post;
  try {
    post = await PostController.getPost(postId);
  } catch (err) {
    console.log(err);
    return res.status(500).send('An unknown error occured when trying to update post, please try again.');
  }

  if (!post) {
    return res.status(404).send('No post with the id found');
  }

  // Check if the user has liked the post already
  if (post.likers.indexOf(userId) !== -1) {
    return res.status(200).send({
      success: true,
      message: 'You already like the post once',
      data: post
    });
  }

  post.likers = [...post.likers, userId];
  post.num_of_likes = post.likers.length;

  return post.save()
    .then((post) => {
      return res.status(200).send({
        success: true,
        message: 'Post successfully liked',
        data: post
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not like post, please try again.'
      });
    });
};

exports.unlikePost = async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).send('Please provide the post id');
  }

  if (req.tokenVerified === false) {
    return res.status(401).send('Could not verify your token');
  }

  const postId = req.params.postId;
  const userId = req.user._id;
  let post;
  try {
    post = await PostController.getPost(postId);
  } catch (err) {
    console.log(err);
    return res.status(500).send('An unknown error occured when trying to update post, please try again.');
  }

  if (!post) {
    return res.status(404).send('No post with the id found');
  }

  // Check if the user liked the post
  if (post.likers.indexOf(userId) === -1) {
    return res.status(200).send({
      success: true,
      message: 'You haven\'t liked the post',
      data: post
    });
  }

  const likers = post.likers.filter((uid) => {
    return uid.toString() !== userId.toString();
  });
  console.log(likers);
  post.num_of_likes = likers.length;
  post.likers = likers;

  return post.save()
    .then((post) => {
      return res.status(200).send({
        success: true,
        message: 'Post successfully unliked',
        data: post
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: 'Could not unlike post, please try again.'
      });
    });
};
