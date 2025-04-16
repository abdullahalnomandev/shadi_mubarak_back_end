import { Model, Types } from 'mongoose';

export type IUserLikedList ={
  userId: Types.ObjectId;        
  likedPersonId: Types.ObjectId;  
}

export type UserLikeModel = Model<IUserLikedList>;
