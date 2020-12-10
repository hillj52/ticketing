import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'Mock Title',
    price: 9.99,
    userId: 'mockUserId',
  });
  await ticket.save();

  const t1 = await Ticket.findById(ticket.id);
  const t2 = await Ticket.findById(ticket.id);

  t1!.set({ price: 10.99 });
  t2!.set({ price: 19.99 });

  await t1!.save();

  // This should fail, version is out of date
  try {
    await t2!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Mock Title',
    price: 9.99,
    userId: 'mockUserId',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
