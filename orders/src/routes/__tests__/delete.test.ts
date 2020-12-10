import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';
import { natsWrapper } from '@hillj52tickets/common';

it('marks an order as cancelled', async () => {
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', signIn())
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes order cancelled event on successful cancellation', async () => {
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

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', signIn())
    .send()
    .expect(204);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
