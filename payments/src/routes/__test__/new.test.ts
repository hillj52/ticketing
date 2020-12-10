import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';
import { Order, OrderStatus } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when attempting to purchase an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signIn())
    .send({
      token: 'mockStripeToken',
      orderId: generateId(),
    })
    .expect(404);
});

it('returns a 401 when attempting to purchase an order belonging to another user', async () => {
  const order = Order.build({
    id: generateId(),
    userId: generateId(),
    version: 0,
    price: 99.99,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signIn())
    .send({
      token: 'mockStripeToken',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when attempting to purchase a cancelled order', async () => {
  const userId = generateId();

  const order = Order.build({
    id: generateId(),
    userId,
    version: 1,
    price: 99.99,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signIn(userId))
    .send({
      token: 'mockStripeToken',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = generateId();

  const order = Order.build({
    id: generateId(),
    userId,
    version: 1,
    price: 99.99,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signIn(userId))
    .send({
      token: 'mockStripeToken',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(stripe.charges.create).toHaveBeenCalled();
  expect(chargeOptions.source).toEqual('mockStripeToken');
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: 'mockStripeId',
  });
  expect(payment).not.toBeNull();
});
