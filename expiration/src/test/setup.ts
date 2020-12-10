jest.mock('@hillj52tickets/common', () => {
  const original = jest.requireActual('@hillj52tickets/common');

  return {
    __esmodule: true,
    ...original,
    natsWrapper: {
      client: {
        publish: jest
          .fn()
          .mockImplementation(
            (subject: string, data: string, callback: () => void) => {
              callback();
            }
          ),
      },
    },
  };
});
