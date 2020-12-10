import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// required to create a new user for typescript
interface IUserAttributes {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User document has to help typescript
interface IUserDocument extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User model has to help typescript
interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attributes: IUserAttributes): IUserDocument;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
});

userSchema.static('build', (attributes: IUserAttributes) => {
  return new User(attributes);
});

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export { User };
