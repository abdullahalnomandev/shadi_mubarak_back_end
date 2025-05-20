import { Schema, model } from 'mongoose';
import { IBKashAccessToken } from './payment.interface';

const BKashTokenSchema = new Schema<IBKashAccessToken>(
  {
    access_token: {
      type: String,
      required: true,
    },
    expires_in: {
      type: Number,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      required: true,
      default: "Bearer",
    },
    method: {
      type: String,
      required: true,
      unique: true,
      default: "bkash"
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const BKashToken = model<IBKashAccessToken>(
  'BKashToken',
  BKashTokenSchema
);
