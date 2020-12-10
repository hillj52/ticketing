import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@hillj52tickets/common';

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

export { PaymentCreatedPublisher };
