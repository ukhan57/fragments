// tests/unit/put.test.js

const request = require('supertest');
const app = require('../../src/app');

require('dotenv').config();

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('fragment with incorrect content-type data does not work', async () => {
    const data1 = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data1);
    expect(postRes.statusCode).toBe(201);
    expect(postRes.headers['content-type']).toContain('text/plain');

    const id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('This is the updated fragment');

    const putRes = await request(app)
      .put('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/random')
      .send(data2);
    expect(putRes.statusCode).toBe(400);
  });

  // Headers include the correct location of the posted fragment
  test('PUT response includes a Location header with a full URL to GET the created fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    expect(postRes.statusCode).toBe(201);

    const id = JSON.parse(postRes.text).fragment.id;
    const data2 = Buffer.from('This is the updated fragment');

    const putRes = await request(app)
      .put('/v1/fragments/' + id)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data2);
    expect(putRes.statusCode).toBe(200);    
    expect(putRes.headers.location).toEqual(`${postRes.headers.location}`);
  });

  // unsupported fragment cannot be posted
  test('Fragment with incorrect id gives error', async () => {
    const data = Buffer.from('This is a fragment');
    const putRes = await request(app)
      .put('/v1/fragments/randomId')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(putRes.statusCode).toBe(404);
  })
});
