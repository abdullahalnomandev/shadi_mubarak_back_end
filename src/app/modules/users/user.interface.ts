/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  bioDataNo: string;
  email:string;
  role: string;
  password: string;
  profileImage:string;
};

// export type IUserMethods = {
//   isUserExist(id: string): Promise<Partial<IUser> | null>;
//   isPasswordMatch(
//     givenPassword: string,
//     savePassword: string
//   ): Promise<boolean>;
// };

export type UserModel = {
  isUserExist(email:string): Promise<Pick<IUser,"email" | "password"|"role" | "bioDataNo">>;
  isPasswordMatch(givenPassword:string,savePassword:string): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUserFilters = {
  searchTerm?: string;
};
