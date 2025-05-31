import { Schema, model } from 'mongoose';
import { IUserLikedList, UserLikeModel } from './liked-list.interface';

const UserLikedListSchema = new Schema<IUserLikedList, UserLikeModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likedPersonBioNo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserLikedListSchema.index({ userId: 1, likedPersonBioNo: 1 }, { unique: true });

export const UserLikedList = model<IUserLikedList, UserLikeModel>('UserLikedList', UserLikedListSchema);
