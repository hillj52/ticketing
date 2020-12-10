import express from 'express';

import { currentUser, requireLogin } from '@hillj52tickets/common';

const router = express.Router();

router.get('/api/users/currentUser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
