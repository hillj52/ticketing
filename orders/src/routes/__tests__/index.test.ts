import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/auth-helper';
import { generateId } from '../../test/mongo-helper';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async ({
  title,
  price,
}: {
  title: string;
  price: number;
}) => {
  const ticket = Ticket.build({
    id: generateId(),
    title: 'Mock Ticket',
    price: 19.99,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  const ticket1 = await buildTicket({ title: 'Mock Ticket 1', price: 1.99 });
  const ticket2 = await buildTicket({ title: 'Mock Ticket 2', price: 2.99 });
  const ticket3 = await buildTicket({ title: 'Mock Ticket 3', price: 3.99 });

  const user1 = signIn('mockUser1');
  const user2 = signIn('mockUser2');

  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0]).toEqual(order1);
  expect(response.body[1]).toEqual(order2);
});
