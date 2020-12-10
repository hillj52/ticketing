import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { OrderStatus } from '@hillj52tickets/common';

import { ITicketDocument } from './ticket';

interface IOrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDocument;
}

interface IOrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDocument;
  version: number;
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
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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
  return new Order(attributes);
});

const Order = mongoose.model<IOrderDocument, IOrderModel>('Order', orderSchema);

export { Order, OrderStatus };
