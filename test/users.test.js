/* eslint-env jest */
const request = require('supertest');
const express = require('express');

const users = require('../routes/v1/users');
jest.mock('../models/user');

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
  app.post('/api/v1/users', users.create);
  app.put('/api/v1/users/:userId', users.update);
  app.delete('/api/v1/users/:userId', users.delete);
  app.get('/api/v1/users/:username', users.get);

  return app;
}

const user = {
  name: 'Oluwaseun seun',
  email: 'oluwaseun@gmail.com',
  username: 'oluwaseun'
};

describe('User', () => {
  const app = setupMockServer();

  describe('Create user: POST /api/v1/users', () => {
    it('should create a user', () => {
      return request(app)
        .post('/api/v1/users/')
        .type('json')
        .send(JSON.stringify(user))
        .then((response) => {
          expect(response.statusCode).toEqual(201);
        });
    });
  });

  describe('Update user: PUT /api/v1/users/:userId', () => {
    it('should update a user', () => {
      return request(app)
        .put('/api/v1/users/foo')
        .type('json')
        .send(JSON.stringify(user))
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });

  describe('Get user: GET /api/v1/users/:username', () => {
    it('should get the user info', () => {
      return request(app)
        .get('/api/v1/users/foo')
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });

  describe('Delete user: DELETE /api/v1/users/:userId', () => {
    it('should delete the user info', () => {
      return request(app)
        .delete('/api/v1/users/foo')
        .then((response) => {
          expect(response.statusCode).toEqual(200);
        });
    });
  });
});
