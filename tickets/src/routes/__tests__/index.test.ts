import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/auth-helper';

const createTicket = ({ title, price }: { title: string; price: string }) => {
  return request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title,
    price,
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket({ title: 'Mock Ticket 1', price: '9.99' });
  await createTicket({ title: 'Mock Ticket 2', price: '12.45' });
  await createTicket({ title: 'Mock Ticket 3', price: '17.39' });

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
