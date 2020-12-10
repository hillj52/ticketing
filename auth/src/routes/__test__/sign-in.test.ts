import request from 'supertest';
import { app } from '../../app';

it('fails when signing in with an email that does not exist', async () => {
  await request(app)
    .post('/api/users/signIn')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(400);
});

it('fails when providing an incorrect password', async () => {
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signIn')
    .send({
      email: 'mock@email.com',
      password: 'wrongPassword',
    })
    .expect(400);
});

it('responds with a cookie on successful login attempt', async () => {
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signIn')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
