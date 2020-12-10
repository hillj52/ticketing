import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/auth-helper';

it('responds with details about the current user', async () => {
  const cookie = await signIn();

  const response = await request(app)
    .get('/api/users/currentUser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('mock@test.com');
});

it('responds with null when not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentUser')
    .send()
    .expect(401);
});
