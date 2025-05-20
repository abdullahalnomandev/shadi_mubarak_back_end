import { IBKashExecutePaymentResponse, IBKashRefreshTokenResponse } from './payment.interface';
/* eslint-disable no-unused-vars */
import axios from "axios";
import config from "../../../config";

import { BKashToken } from "./payment.bkash-token.model";
import { IBKashCreatePaymentPayload, IBKashCreatePaymentResponse, IBKashExecutePaymentPayload, IBKashGrantTokenResponse } from "./payment.interface";



type BKashAPI = {
  grantToken: () => Promise<IBKashGrantTokenResponse>;
  getRefreshToken: () => Promise<IBKashGrantTokenResponse>;
  createPayment: (payload: IBKashCreatePaymentPayload) => Promise<IBKashCreatePaymentResponse>;
  executePayment: (paymentId: string) => Promise<IBKashExecutePaymentPayload>;
};

const getValidAccessToken = async (): Promise<string> => {
  const tokenEntry = await BKashToken.findOne({ method: "bkash" });
  const isExpired =
    !tokenEntry?.updatedAt ||
    Date.now() - new Date(tokenEntry.updatedAt).getTime() > 48 * 60 * 1000;

  if (!tokenEntry?.access_token || isExpired) {
    const refreshed = await bConfig.getRefreshToken();
    return refreshed.id_token;
  }

  return tokenEntry.access_token;
};

export const bConfig: BKashAPI = {
  grantToken: async () => {
    const { data } = await axios.post<IBKashGrantTokenResponse>(
      `${config.bkash.base_url}/tokenized/checkout/token/grant`,
      {
        app_key: config.bkash.app_key,
        app_secret: config.bkash.app_secret,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.bkash.username,
          password: config.bkash.password,
        },
      }
    );

    await BKashToken.updateOne(
      { method: "bkash" },
      {
        access_token: data.id_token,
        refresh_token: data.refresh_token
      },
      { upsert: true }
    );
    
    return data;
  },

  getRefreshToken: async () => {
    const savedToken = await BKashToken.findOne({ method: "bkash" });

    if (!savedToken?.refresh_token) {
      return bConfig.grantToken();
    }

    const { data } = await axios.post<IBKashRefreshTokenResponse>(
      `${config.bkash.base_url}/tokenized/checkout/token/refresh`,
      {
        app_key: config.bkash.app_key,
        app_secret: config.bkash.app_secret,
        refresh_token: savedToken.refresh_token,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.bkash.username,
          password: config.bkash.password,
        },
      }
    );

    await BKashToken.updateOne(
      { method: "bkash" },
      {
        access_token: data.id_token,
        refresh_token: data.refresh_token,
      },
      { upsert: true }
    );

    return data;
  },

  createPayment: async (payload: IBKashCreatePaymentPayload) => {
    const accessToken = await getValidAccessToken();

    const { data } = await axios.post<IBKashCreatePaymentResponse>(
      `${config.bkash.base_url}/tokenized/checkout/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: accessToken,
          username: config.bkash.username,
          password: config.bkash.password,
          "X-App-Key": config.bkash.app_key,
        },
      }
    );

    return data;
  },

  executePayment: async (paymentId: string) => {
    const accessToken = await getValidAccessToken();

    const { data } = await axios.post<IBKashExecutePaymentResponse>(
      `${config.bkash.base_url}/tokenized/checkout/execute`,
      { paymentID: paymentId },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: accessToken,
          "X-App-Key": config.bkash.app_key,
          username: config.bkash.username,
          password: config.bkash.password,
        },
      }
    );

    return data;
  },
};
