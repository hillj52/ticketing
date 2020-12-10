import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ITicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface ITicketModel extends mongoose.Model<ITicketDocument> {
  build(attributes: ITicketAttributes): ITicketDocument;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: true,
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.static('build', (attributes: ITicketAttributes) => {
  return new Ticket(attributes);
});

const Ticket = mongoose.model<ITicketDocument, ITicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
