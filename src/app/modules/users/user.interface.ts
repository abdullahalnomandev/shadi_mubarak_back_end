/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IBiodata } from '../biodata/biodata.interface';

export type IUser = {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  bioDataNo: string;
  email: string;
  role: string;
  phone: string;
  password: string;
  isDeleted?: boolean;
  status?: 'active' | 'blocked';
  bioData: Types.ObjectId | IBiodata;
  provider: 'email' | 'google';
  emailVerified: boolean;
  verificationToken?: string;
};

// export type IUserMethods = {
//   isUserExist(id: string): Promise<Partial<IUser> | null>;
//   isPasswordMatch(
//     givenPassword: string,
//     savePassword: string
//   ): Promise<boolean>;
// };

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<
    Pick<
      IUser,
      '_id' | 'email' | 'password' | 'role' | 'bioDataNo' | 'emailVerified'
    >
  >;
  isPasswordMatch(
    givenPassword: string,
    savePassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUserFilters = {
  searchTerm?: string;
};
