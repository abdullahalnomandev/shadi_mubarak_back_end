import { Schema, model } from 'mongoose';
import { IPaymentTransition } from './payment.interface';


const paymentTransitionSchema = new Schema<IPaymentTransition>(
  {
    payment_id: {
      type:String,
      require : true,
      unique : true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package_id: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    isPayment: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
    connections: {
      type: Number,
      default: 0,
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

