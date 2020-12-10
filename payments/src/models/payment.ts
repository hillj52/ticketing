import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface IPaymentAttributes {
  orderId: string;
  stripeId: string;
}

interface IPaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number;
}

interface IPaymentModel extends mongoose.Model<IPaymentDocument> {
  build(attribute: IPaymentAttributes): IPaymentDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.static('build', (attributes: IPaymentAttributes) => {
  return new Payment(attributes);
});

const Payment = mongoose.model<IPaymentDocument, IPaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
