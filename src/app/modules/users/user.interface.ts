/* eslint-disable no-unused-vars */
import  { Model, Types } from 'mongoose';
import { IBiodata } from '../biodata/biodata.interface';

export type IUser = {
  toObject(): { [x: string]: any; password: any; };
  id: Types.ObjectId;
  bioDataNo: string;
  email:string;
  role: string;
  password: string;
  bioData : Types.ObjectId | IBiodata;
};

// export type IUserMethods = {
//   isUserExist(id: string): Promise<Partial<IUser> | null>;
//   isPasswordMatch(
//     givenPassword: string,
//     savePassword: string
//   ): Promise<boolean>;
// };

export type UserModel = {
  isUserExist(email:string): Promise<Pick<IUser, "id" |  "email" | "password"|"role" | "bioDataNo">>;
  isPasswordMatch(givenPassword:string,savePassword:string): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUserFilters = {
  searchTerm?: string;
};
