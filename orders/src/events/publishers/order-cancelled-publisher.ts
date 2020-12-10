import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@hillj52tickets/common';

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

export { OrderCancelledPublisher };
