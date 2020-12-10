import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';

it('fetches the order', async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 9.99,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signIn())
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error when trying to fetch another users order', async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 9.99,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signIn('aDifferentMockUser'))
    .send()
    .expect(401);
});
