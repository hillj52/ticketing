import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  NotAuthorizedError,
  NotFoundError,
  requireLogin,
} from '@hillj52tickets/common';

import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireLogin,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw new NotFoundError();
    }

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
