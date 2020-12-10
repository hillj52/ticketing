import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  natsWrapper,
  OrderCancelledEvent,
  OrderStatus,
} from '@hillj52tickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '../../../models/order';
import { generateId } from '../../../test/mongo-helper';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: generateId(),
    version: 0,
    status: OrderStatus.Created,
    price: 9.99,
    userId: generateId(),
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: generateId(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('updates the status of the order to cancelled', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
