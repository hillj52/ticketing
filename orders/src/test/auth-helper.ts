import jwt from 'jsonwebtoken';

export const signIn = (id: string = 'mockTestId') => {
  // Build a JWT payload. { id, email }
  const payload = {
    id,
    email: 'mock@test.com',
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build the session Object.  { jwt: MY_JWT }
  const session = { jwt: token };
  // Turn the session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a string that is the cookie with the encoded data
  return [`express:sess=${base64}`];
};
