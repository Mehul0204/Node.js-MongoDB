const request = require('supertest');
const mongoose = require('mongoose');
const { getApp } = require('../app');

describe('Todo List App', () => {
  let app;

  beforeAll(async () => {
    app = await getApp();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET / returns 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
  });
});
