import { Schema, model } from 'mongoose';
import { IPaymentTransition } from './payment.interface';


const paymentTransitionSchema = new Schema<IPaymentTransition>(
  {
    transition_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package_name: {
      type: String,
      required: true,
    },
    connection: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const PaymentTransition = model<IPaymentTransition>(
  'PaymentTransition',
  paymentTransitionSchema
);

