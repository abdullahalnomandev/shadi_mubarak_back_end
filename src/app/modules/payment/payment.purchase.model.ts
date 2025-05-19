import { Schema, model } from 'mongoose';
import { IPaymentPurchase } from './payment.interface';

const paymentPurchaseSchema = new Schema<IPaymentPurchase>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    total_connection: {
      type: Number,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const PaymentPurchase = model<IPaymentPurchase>(
  'PaymentPurchase',
  paymentPurchaseSchema
);
