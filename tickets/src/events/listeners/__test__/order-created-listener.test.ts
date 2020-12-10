import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { generateId } from '../../../test/mongo-helper';

import { Message } from 'node-nats-streaming';
import {
  natsWrapper,
  OrderCreatedEvent,
  OrderStatus,
} from '@hillj52tickets/common';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'Mock Title',
    price: 99,
    userId: generateId(),
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: generateId(),
    version: 0,
    status: OrderStatus.Created,
    userId: generateId(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const publishedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.ticket.id).toEqual(publishedData.id);
});
