import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order, OrderStatus } from './order';

interface ITicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface ITicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends mongoose.Model<ITicketDocument> {
  build(attributes: ITicketAttributes): ITicketDocument;
  findFromEvent(event: {
    id: string;
    version: number;
  }): Promise<ITicketDocument | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.static('build', (attributes: ITicketAttributes) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
});

ticketSchema.static(
  'findFromEvent',
  (event: { id: string; version: number }) => {
    return Ticket.findOne({
      _id: event.id,
      version: event.version - 1,
    });
  }
);

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<ITicketDocument, ITicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket, ITicketDocument };
