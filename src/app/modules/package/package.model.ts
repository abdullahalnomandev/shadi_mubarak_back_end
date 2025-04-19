import { Schema, model } from 'mongoose';
import { IPackage, IPackageModel } from './package.interface';

const PackageSchema = new Schema<IPackage, IPackageModel>(
  {
    name: {
      type: String,
      enum: ['basic', 'standard', 'popular'],
      required: true,
    },
    connections: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    disCountPercentage: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    discountCondition: {
      type: String,
      required: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);


export const Package = model<IPackage, IPackageModel>('Package', PackageSchema);