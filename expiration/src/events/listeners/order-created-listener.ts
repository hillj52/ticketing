import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@hillj52tickets/common';
import { expirationQueue } from '../../queues/expiration-queue';
import { QUEUE_GROUP_NAME } from './queue-group-name';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay }
    );

    msg.ack();
  }
}

export { OrderCreatedListener };
