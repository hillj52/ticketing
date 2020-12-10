import { natsWrapper } from '@hillj52tickets/common';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
  try {
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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
