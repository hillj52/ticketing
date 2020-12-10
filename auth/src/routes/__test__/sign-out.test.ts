import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signUp')
    .send({
      email: 'mock@email.com',
      password: 'mockPassword',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signOut')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
