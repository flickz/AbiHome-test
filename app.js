const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

require('./libs/db');
const requestHandler = require('./libs/requesthandler');
const routes = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API Token route
app.post('/api/token', routes.token.create);

// Checks the authrorization bearer and parse the access token if included
app.use(requestHandler.parseToken);
// User Routes
app.get('/api/v1/users/:username', routes.v1.users.get);
app.post('/api/v1/users', routes.v1.users.create);
app.put('/api/v1/users/:userId', requestHandler.verifyToken, routes.v1.users.update);
app.delete('/api/v1/users/:userId', requestHandler.verifyToken, routes.v1.users.delete);

// Post Routes
app.get('/api/v1/posts/:postId', routes.v1.posts.get);
app.post('/api/v1/posts', requestHandler.verifyToken, routes.v1.posts.create);
app.delete('/api/v1/posts/:postId', requestHandler.verifyToken, routes.v1.posts.delete);
app.put('/api/v1/posts/:postId', requestHandler.verifyToken, routes.v1.posts.update);
app.patch('/api/v1/posts/like/:postId', requestHandler.verifyToken, routes.v1.posts.likePost);
app.patch('/api/v1/posts/unlike/:postId', requestHandler.verifyToken, routes.v1.posts.unlikePost);

module.exports = app;
