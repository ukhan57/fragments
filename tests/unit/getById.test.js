// // tests/unit/getById.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/111').expect(401));

  // // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments/111').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('returns 404 if fragment not found', async () => {
    const res = (await request(app).get('/v1/fragments/invalid-id').auth('user1@email.com', 'password1'));

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Fragment not found');
  });

  // test('authenticated users get a fragment', async () => {
  //   const postRes = await request(app)
  //   .post('/v1/fragments')
  //   .auth('user1@email.com', 'password1')
  //   .set('Content-Type', 'text/plain')
  //   .send('This is a fragment');

  //   // Check if the fragment is successfully created
  //   expect(postRes.statusCode).toBe(201);

  //   // Extract the ID of the created fragment from the response
  //   let fragmentId;
  //   if ('fragment' in postRes.body && 'id' in postRes.body.fragment) {
  //     fragmentId = postRes.body.fragment.id;
  //   } else {
  //     throw new Error('Fragment ID not found in response body');
  //   }

  //   const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth('user1@email.com', 'password1');

  //   expect(res.statusCode).toBe(201);
  //   expect(res.headers['content-type']).toBe('text/plain');
  //   expect(res.text).toBe('This is a test fragment.');
  // });
});


// // tests/unit/getFragmentById.test.js

// const request = require('supertest');
// const app = require('../../src/app');

// describe('GET /v1/fragments/:id/info', () => {

//   test('Should return 404: fragment not found', async () => {
//     const getRes = await request(app)
//       .get('/v1/fragments/wrongId/info')
//       .auth('user1@email.com', 'password1');

//     console.log('getRes.body:', getRes.body); // Debug log

//     expect(getRes.statusCode).toBe(404);
//     expect(getRes.body).toStrictEqual({
//       status: 'error',
//       error: { code: 404, message: 'not found' }, // Updated message
//     });
//   });
// });



