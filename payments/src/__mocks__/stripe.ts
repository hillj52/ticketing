const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: 'mockStripeId' }),
  },
};

export { stripe };
