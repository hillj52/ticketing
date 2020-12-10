import request from 'supertest';
import { app } from '../app';

export const signIn = async () => {
  const email = 'mock@test.com';
  const password = 'mockPassword';

  const response = await request(app)
    .post('/api/users/signUp')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
