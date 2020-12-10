import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// Refactor this into a secret file
const pepper = '96844ec1899d23bf';

export class Password {
  static toHash = async (password: string) => {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(
      `${pepper}${password}`,
      salt,
      64
    )) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  };

  static compare = async (storedPassword: string, suppliedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(
      `${pepper}${suppliedPassword}`,
      salt,
      64
    )) as Buffer;

    return buffer.toString('hex') === hashedPassword;
  };
}
