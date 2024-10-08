// // tests/unit/deleteById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/111').expect(401));

  // // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).delete('/v1/fragments/111').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('returns 404 if fragment not found', async () => {
    const res = (await request(app).delete('/v1/fragments/invalid-id').auth('user1@email.com', 'password1'));

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users can delete a fragment', async () => {
    const postRes = await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set('Content-Type', 'text/plain')
    .send('This is a fragment');

    expect(postRes.statusCode).toBe(201);
    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app).delete('/v1/fragments/' + id).auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
  });
});

