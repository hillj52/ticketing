import mongoose from 'mongoose';

import { natsWrapper } from '@hillj52tickets/common';

import { app } from './app';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.NATS_URI) {
      throw new Error('NATS_URI must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }

    await natsWrapper.connect({
      clusterId: process.env.NATS_CLUSTER_ID,
      clientId: process.env.NATS_CLIENT_ID,
      url: process.env.NATS_URI,
    });
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.MONGO_USERNAME) {
      throw new Error('MONGO_USERNAME must be defined');
    }

    if (!process.env.MONGO_PASSWORD) {
      throw new Error('MONGO_PASSWORD must be defined');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      auth: {
        user: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
      },
      authSource: 'admin',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connection to mongo successful!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Tickets service listening on port 3000!');
  });
};

start();
