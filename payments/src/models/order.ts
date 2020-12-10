import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@hillj52tickets/common';

interface IOrderAttributes {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderDocument extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderModel extends mongoose.Model<IOrderDocument> {
  build(attributes: IOrderAttributes): IOrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.static('build', (attributes: IOrderAttributes) => {
  return new Order({
    ...attributes,
    _id: attributes.id,
  });
});

const Order = mongoose.model<IOrderDocument, IOrderModel>('Order', orderSchema);

export { Order, OrderStatus };
