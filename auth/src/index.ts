import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }

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
    console.log('Auth service listening on port 3000!');
  });
};

start();
