import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@hillj52tickets/common';

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

export { TicketUpdatedPublisher };
