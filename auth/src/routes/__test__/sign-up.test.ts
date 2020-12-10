import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful sign up', async () =>
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(201));

it('returns a 400 with an invalid email', async () =>
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock&email.com',
      password: 'mockPassword',
    })
    .expect(400));

it('returns a 400 with an invalid password', async () =>
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'aa',
    })
    .expect(400));

it('returns a 400 with no email or password', async () =>
  await request(app).post('/api/users/signUp').send({}).expect(400));

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(400);
});

it('sets a cookie after successful sign up', async () => {
  const response = await request(app).post('/api/users/signUp').send({
    email: 'mock@email.com',
    password: 'mockPassword',
  });
  expect(response.get('Set-Cookie')).toBeDefined();
});
