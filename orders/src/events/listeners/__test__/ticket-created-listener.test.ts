import { TicketCreatedListener } from '../ticket-created-listener';
import { generateId } from '../../../test/mongo-helper';
import { natsWrapper, TicketCreatedEvent } from '@hillj52tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a mock data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: generateId(),
    title: 'Mock Title',
    price: 9.99,
    userId: generateId(),
  };

  // create a mock message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object & message
  await listener.onMessage(data, msg);

  // write assertions
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object & message
  await listener.onMessage(data, msg);

  // write assertions
  expect(msg.ack).toHaveBeenCalled();
});
