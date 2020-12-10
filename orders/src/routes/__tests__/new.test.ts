import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';

import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

import { natsWrapper } from '@hillj52tickets/common';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if the ticket does not exist', async () => {
  const ticketId = generateId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 19.99,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'mockOtherUser',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 19.99,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 19.99,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'mockOtherUser',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 19.99,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signIn())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
