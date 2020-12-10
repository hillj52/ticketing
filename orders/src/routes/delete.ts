import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import {
  requireLogin,
  NotFoundError,
  NotAuthorizedError,
  natsWrapper,
} from '@hillj52tickets/common';

import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete(
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

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
