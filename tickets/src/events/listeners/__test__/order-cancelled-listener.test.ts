import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';
import { generateId } from '../../../test/mongo-helper';

import { Message } from 'node-nats-streaming';
import {
  natsWrapper,
  OrderCancelledEvent,
  OrderStatus,
} from '@hillj52tickets/common';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'Mock Title',
    price: 99,
    userId: generateId(),
  });
  await ticket.save();

  ticket.set({ orderId: generateId() });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: ticket.orderId!,
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
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
});
