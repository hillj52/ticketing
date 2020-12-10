import request from 'supertest';
import { app } from '../../app';

import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';

it('returns a 404 if the ticket is not found', async () => {
  const id = generateId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket, if the ticket exists', async () => {
  const title = 'Mock Title';
  const price = '9.99';

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price.toString()).toEqual(price);
});
