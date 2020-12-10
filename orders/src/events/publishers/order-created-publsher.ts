import { Publisher, OrderCreatedEvent, Subjects } from '@hillj52tickets/common';

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

export { OrderCreatedPublisher };
