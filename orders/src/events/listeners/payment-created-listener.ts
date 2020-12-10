import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
} from '@hillj52tickets/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Order, OrderStatus } from '../../models/order';

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}

export { PaymentCreatedListener };
