import {
  Publisher,
  TicketCreatedEvent,
  Subjects,
} from '@hillj52tickets/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
