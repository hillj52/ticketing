import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@hillj52tickets/common';

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

export { ExpirationCompletePublisher };
