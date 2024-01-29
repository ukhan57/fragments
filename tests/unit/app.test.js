// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET 404 response', () => {

  // requesting to an unexisting source should produce 404 error
  test('HTTP unit test to verify 404', async () => {
    const res = await request(app).get('/fragments/random');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
