/* eslint-env jest */
const request = require('supertest');
const express = require('express');

const posts = require('../routes/v1/posts');
jest.mock('../models/post');

function setAccessToken (req, res, next) {
  req.accessToken = '133e5110a-fooo-foo';
  req.user = {
    _id: '1'
  };

  next();
}

function setupMockServer () {
  const app = express();

  app.use(express.json());
  app.use(setAccessToken);
  app.post('/api/v1/posts', posts.create);
  app.put('/api/v1/posts/:postId', posts.update);
  app.delete('/api/v1/posts/:postId', posts.delete);
  app.get('/api/v1/posts/:postId', posts.get);
  app.patch('/api/v1/posts/like/:postId', posts.likePost);
  app.patch('/api/v1/posts/unlike/:postId', posts.unlikePost);

  return app;
}

const post = {
  title: 'The end of time',
  body: 'Who will see the end of time?'
};

describe('Post', () => {
  const app = setupMockServer();

  describe('Create post: POST /api/v1/posts', () => {
    it('should create a post', () => {
      return request(app)
        .post('/api/v1/posts/')
        .type('json')
        .send(JSON.stringify(post))
        .then((response) => {
          expect(response.statusCode).toEqual(201);
        });
    });
  });

  describe('Update post: PUT /api/v1/posts/:postId', () => {
    it('should update a post', () => {
      return request(app)
        .put('/api/v1/posts/foo')
        .type('json')
        .send(JSON.stringify(post))
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });

  describe('Get post: GET /api/v1/posts/:postId', () => {
    it('should get a post', () => {
      return request(app)
        .get('/api/v1/posts/foo')
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });

  describe('Delete post: DELETE /api/v1/posts/:postId', () => {
    it('should delete a post', () => {
      return request(app)
        .delete('/api/v1/posts/foo')
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });

  describe('Like post: PATCH /api/v1/posts/like/:postId', () => {
    it('should like a post', () => {
      return request(app)
        .patch('/api/v1/posts/like/foo')
        .type('json')
        .send(JSON.stringify({}))
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });

  describe('Unlike post: PATCH /api/v1/posts/unlike/:postId', () => {
    it('should unlike a post', () => {
      return request(app)
        .patch('/api/v1/posts/like/foo')
        .type('json')
        .send(JSON.stringify({}))
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });
});
