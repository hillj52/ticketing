import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/ticket';
import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';

import { natsWrapper } from '@hillj52tickets/common';

it('returns a 404 if the provided id does not exist', async () => {
  const id = generateId();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: 'Mock Title',
      price: '9.99',
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateId();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', '')
    .send({
      title: 'Mock Title',
      price: '9.99',
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const {
    body: { id },
  } = await request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title: 'Mock Title',
    price: '9.99',
  });

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn('aDifferentUserId'))
    .send({
      title: 'New Mock Title',
      price: '0.01',
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const {
    body: { id },
  } = await request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title: 'Mock Title',
    price: '9.99',
  });

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: '',
      price: '0.01',
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: 'A New Mock Title',
      price: '-3',
    })
    .expect(400);
});

it('updates a ticket when valid input is provided', async () => {
  const {
    body: { id },
  } = await request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title: 'Mock Title',
    price: '9.99',
  });

  const updatedTitle = 'A Much Better Mock Title';
  const updatedPrice = '19.99';

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const {
    body: { title, price },
  } = await request(app).get(`/api/tickets/${id}`).send();

  expect(title).toEqual(updatedTitle);
  expect(price.toString()).toEqual(updatedPrice);
});

it('publishes an event when a ticket is updated', async () => {
  const {
    body: { id },
  } = await request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title: 'Mock Title',
    price: '9.99',
  });

  const updatedTitle = 'A Much Better Mock Title';
  const updatedPrice = '19.99';

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const {
    body: { id },
  } = await request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title: 'Mock Title',
    price: '9.99',
  });

  const ticket = await Ticket.findById(id);
  ticket!.set({ orderId: generateId() });
  await ticket!.save();

  const updatedTitle = 'A Much Better Mock Title';
  const updatedPrice = '19.99';

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(400);
});
