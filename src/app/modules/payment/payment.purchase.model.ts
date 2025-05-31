import { Schema, model } from 'mongoose';
import { IPaymentPurchase } from './payment.interface';

const paymentPurchaseSchema = new Schema<IPaymentPurchase>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    total_connections: {
      type: Number,
      required: true,
      default: 0,
    },
    total_amount: {
      type: Number,
      required: true,
      default: 0,
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
