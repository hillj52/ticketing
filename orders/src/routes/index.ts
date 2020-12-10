import express, { Request, Response } from 'express';

import { requireLogin } from '@hillj52tickets/common';

import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireLogin, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket');

  res.send(orders);
});

export { router as indexOrderRouter };
