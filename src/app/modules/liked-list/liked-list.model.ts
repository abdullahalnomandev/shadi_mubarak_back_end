import { Schema, model } from 'mongoose';
import { IUserLikedList, UserLikeModel } from './liked-list.interface';

const UserLikedListSchema = new Schema<IUserLikedList, UserLikeModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likedPersonId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserLikedListSchema.index({ userId: 1, likedPersonId: 1 }, { unique: true });

export const UserLikedList = model<IUserLikedList, UserLikeModel>('UserLikedList', UserLikedListSchema);
