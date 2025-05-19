import { Schema } from "mongoose";
import { PaymentStatus } from "./payment.constant";
import { IUser } from "../users/user.interface";

export type IPaymentTransition = {
    transition_id: string;
    user_id: Schema.Types.ObjectId | IUser;
    package_name: string;
    connection: string;
    method: string;
    amount: number;
    status: PaymentStatus;
  };
  
  
export type IPaymentPurchase = {
    user_id: Schema.Types.ObjectId;
    total_connection: number;
    total_amount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export type IPurchasedBioData = {
    userId: Schema.Types.ObjectId;
    biodata_no: string; 
    payment_id: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  }
  