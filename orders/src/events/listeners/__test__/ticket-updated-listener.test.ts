import { TicketUpdatedListener } from '../ticket-updated-listener';
import { generateId } from '../../../test/mongo-helper';
import { natsWrapper, TicketUpdatedEvent } from '@hillj52tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Title',
    price: 9.99,
  });
  await ticket.save();

  // create a mock data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'New Mock Title',
    price: 19.99,
    userId: generateId(),
  };

  // create a mock message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('finds updates and saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object & message
  await listener.onMessage(data, msg);

  // write assertions
  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.version).toBeGreaterThan(ticket.version);
  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object & message
  await listener.onMessage(data, msg);

  // write assertions
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if a version has been skipped', async () => {
  const { msg, data, listener } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
