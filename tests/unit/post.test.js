// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');
// const logger = require('../../src/logger')

require('dotenv').config();

describe('POST /v1/fragments', () => {
  // // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('fragment without data does not work', async () => {
    const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').send();
    expect(res.statusCode).toBe(500);
  });

  // test for text/plain
  test('authenticated users create a plain text fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('text/plain');
  });

  // Test for text/plain; charset=utf-8
  test('authenticated users create a plain text charset=utf-8 fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('text/plain; charset=utf-8');
  });
  
  // Test for text/markdown
  test('authenticated users create a markdown text fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('text/markdown');
  });

  // Test for text/html
  test('authenticated users create a html text fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('text/html');
  });

  // Test for text/csv
  test('authenticated users create a csv text fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/csv')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('text/csv');
  });

  // Test for application/json
  test('authenticated users create a application/json fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('application/json');
  });

  // Test for image/png
  test('authenticated users create a image/png fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('image/png');
  });

  // Test for image/jpeg
  test('authenticated users create a image/jpeg fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('image/jpeg');
  });

  // Test for image/webp
  test('authenticated users create a image/webp fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/webp')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('image/webp');
  });

  // Test for image/avif
  test('authenticated users create a image/avif fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/avif')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('image/avif');
  });

  // Test for image/gif
  test('authenticated users create a image/gif fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/gif')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toContain('image/gif');
  });

  // Headers include the correct location of the posted fragment
  test('POST response includes a Location header with a full URL to GET the created fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toEqual(`${res.headers.location}`);
  });

  // unsupported fragment cannot be posted
  test('Fragment with an unsupported type gives error', () => 
    request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'audio/mpeg')
      .auth('user1@email.com', 'password1')
      .send('aa')
      .expect(415)
  );
});
