import { Types } from "mongoose";
import { IUser } from "../users/user.interface";

export type IPurchaseBioData = {
  biodata_no: string;
  user_id: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
};