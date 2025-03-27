import { Model } from "mongoose";

export type IUser = {
  id: string;
  role: string;
  password: string;
  email: string;
}

export type UserModel = Model<IUser, object>;

export type IUserFilters =  {
  searchTerm?:string;
}