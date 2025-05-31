import { Schema, model } from 'mongoose';
import { IPurchaseBioData } from './purchase-biodata.interface';

const purchasedBioDataSchema = new Schema<IPurchaseBioData>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    biodata_no: {
      type: String,
      required: true,
      index: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Create compound index for faster queries
purchasedBioDataSchema.index({ user_id: 1, biodata_no: 1 }, { unique: true });

export const PurchasedBioData = model<IPurchaseBioData>(
  'PurchasedBioData',
  purchasedBioDataSchema
);

 