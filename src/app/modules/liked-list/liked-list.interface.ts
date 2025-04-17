import { Model, Types } from 'mongoose';
import { IUser } from '../users/user.interface';

export type IUserLikedList ={
  userId: Types.ObjectId | IUser;        
  likedPersonId: Types.ObjectId | IUser;  
}

export type ILikedUserResponse = {
  userId: Types.ObjectId | IUser;
  likedPerson:{
    _id: Types.ObjectId;
    bioDataNo: string;
    address: string;
  }

};

export type UserLikeModel = Model<IUserLikedList>;
