import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Message } from 'node-nats-streaming';
import {
  ExpirationCompleteEvent,
  natsWrapper,
  OrderStatus,
} from '@hillj52tickets/common';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { generateId } from '../../../test/mongo-helper';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 9.99,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: generateId(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
