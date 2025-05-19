import { Schema, model } from 'mongoose';
import { IPurchasedBioData } from './payment.interface';

const purchasedBioDataSchema = new Schema<IPurchasedBioData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    biodata_no: {
      type: String,
      required: true,
      index: true,
    },
    payment_id: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentPurchase',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Create compound index for faster queries
purchasedBioDataSchema.index({ userId: 1, biodata_no: 1 }, { unique: true });

export const PurchasedBioData = model<IPurchasedBioData>(
  'PurchasedBioData',
  purchasedBioDataSchema
);

 