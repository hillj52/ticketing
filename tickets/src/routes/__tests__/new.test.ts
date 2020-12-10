import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/auth-helper';

import { Ticket } from '../../models/ticket';

import { natsWrapper } from '@hillj52tickets/common';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: '',
      price: '99.99',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      price: '99.99',
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'Mock Title',
      price: '',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'Mock Title',
      price: -4,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'Mock Title',
      price: 'abcd',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'Mock Title',
    })
    .expect(400);
});

it('creates a ticket when valid inputs are provided', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'Mock Title';
  const price = '9.99';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price.toString()).toEqual(price);
});

it('publishes an event when a ticket is created', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'Mock Title';
  const price = '9.99';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
