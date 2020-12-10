import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  natsWrapper,
  OrderCreatedEvent,
  OrderStatus,
} from '@hillj52tickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';
import { generateId } from '../../../test/mongo-helper';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: generateId(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: generateId(),
    status: OrderStatus.Created,
    ticket: {
      id: generateId(),
      price: 9.99,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.id).toEqual(data.id);
  expect(order!.status).toEqual(data.status);
  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
