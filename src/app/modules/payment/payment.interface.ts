import { Schema } from "mongoose";
import { IUser } from "../users/user.interface";
import { IPackage } from "../package/package.interface";

export type IPaymentTransition = {
    payment_id: string;
    user_id: Schema.Types.ObjectId | IUser;
    package_id: Schema.Types.ObjectId | IPackage;
    method: string;
    amount?: number;
    isPayment: boolean;
    connections?: number;
  };
  
  
export type IPaymentPurchase = {
    user_id: Schema.Types.ObjectId;
    total_connections: number;
    total_amount: number;
    createdAt?: Date;
    updatedAt?: Date;
  }


  
  export type ITransaction = {
    user_id: Schema.Types.ObjectId;
    amount: string;
    payment_method: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  export type IBKashAccessToken = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type?: string;
    method?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }


  export type IBKashGrantTokenResponse = {
    id_token: string;
    refresh_token: string;
  };
  
  export type IBKashRefreshTokenResponse = {
    id_token: string;
    refresh_token: string;
  };
  
  export type IBKashCreatePaymentPayload = {
    mode: string;
    payerReference: string;
    callbackURL: string;
    merchantAssociationInfo?: string;
    amount: string | null | undefined;
    currency: string;
    intent: string;
    merchantInvoiceNumber: string;
  };
  export type IBKashExecutePaymentPayload = {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    payerReference: string;
    customerMsisdn: string;
    trxID: string;
    amount: string;
    transactionStatus: string;
    paymentExecuteTime: string; 
    currency: string;
    intent: string;
    merchantInvoiceNumber: string;
  };

  export type IBKashCreatePaymentResponse = {
    paymentID: string;
    bkashURL: string;
    callbackURL: string;
    successCallbackURL: string;
    failureCallbackURL: string;
    cancelledCallbackURL: string;
    amount: string;
    intent: string;
    currency: string;
    paymentCreateTime: string;
    transactionStatus: string;
    merchantInvoiceNumber: string;
    statusCode: string;
    statusMessage: string;
  };
  
  export type IBKashExecutePaymentResponse = {
    statusCode: string;
    statusMessage: string;
    paymentID: string;
    payerReference: string;
    customerMsisdn: string;
    trxID: string;
    amount: string;
    transactionStatus: string;
    paymentExecuteTime: string; // Consider using Date if you plan to parse it
    currency: string;
    intent: string;
    merchantInvoiceNumber: string
  };
  
  export type IPaymentTransitionInfo = {
    user_id: string,
    package_id: string,
    method: string,
  }

  export type IBKashCallbackProps = {
    packageId: string;
    paymentID: string;
    status: 'success' | 'failure' | 'cancel';
    signature: string;
    apiVersion: string;
  };
  