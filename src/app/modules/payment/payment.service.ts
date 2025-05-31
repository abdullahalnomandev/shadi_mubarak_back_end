import { Response } from "express";
import { Package } from "../package/package.model";
import {  IBKashCallbackProps, IPaymentTransitionInfo } from "./payment.interface";
import { PaymentPurchase } from "./payment.purchase.model";
import { PaymentTransition } from "./payment.transition.model";


import crypto from "crypto";
import { bConfig } from "./payment.bkash.util";
import config from "../../../config";

const createPayment = async ({
  payload,
  url,
  user_id
}: {
  payload: IPaymentTransitionInfo;
  url: string;
  user_id: string;
}): Promise<{ redirectUrl: string }> => {
  let redirectUrl = "";

  // Start a MongoDB transaction
  const session = await Package.startSession();
  
  try {
    await session.startTransaction();

    // Find package within transaction
    const pkg = await Package.findById(payload.package_id).session(session);
    if (!pkg) {
      throw new Error("Package not found");
    }

    switch (payload.method) {
      case "bkash": {
        // Create bKash payment
        const payment = await bConfig.createPayment({
          mode: "0011",
          payerReference: " ",
          callbackURL: `${url}/callback`,
          amount: pkg.price.toString(),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: crypto.randomUUID(),
        });

        // Create payment transition record within transaction
        await PaymentTransition.create([{
          payment_id: payment.paymentID,
          user_id: user_id,
          package_id: pkg._id,
          method: payload.method,
          amount: pkg.price,
          connection: pkg.connections,
        }], { session });

        redirectUrl = payment.bkashURL;
        break;
      }
      default:
        throw new Error(`Unsupported payment method: ${payload.method}`);
    }

    // Commit the transaction
    await session.commitTransaction();
    
    return { redirectUrl };

  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    // End session
    session.endSession();
  }
};

const PaymentCallback = async (payload: IBKashCallbackProps, res: Response): Promise<void> => {
  const failUrl = `${config.client_url}/failure`;
  const successUrl = `${config.client_url}/success`;

  try {
    const { paymentID, status } = payload;

    // Handle failure or cancel status first
    if (status === "failure" || status === "cancel") {
      await PaymentTransition.deleteOne({ payment_id: paymentID });
      res.redirect(failUrl);
      return;
    }

    // Execute payment and verify status
    const executed = await bConfig.executePayment(paymentID);
    if (status !== "success" || executed.statusCode !== "0000") {
      res.redirect(failUrl);
      return;
    }

    // Find and update the payment
    const payment = await PaymentTransition.findOneAndUpdate(
      { payment_id: paymentID },
      { isPayment: true },
      { new: true }
    );

    if (!payment) {
      res.redirect(failUrl);
      return;
    }

    // Get related package info
    const packageInfo = await Package.findById(payment.package_id);
    if (!packageInfo) {
      res.redirect(failUrl);
      return;
    }

    // Update or create purchase using findOneAndUpdate with upsert
    await PaymentPurchase.findOneAndUpdate(
      { user_id: payment.user_id },
      {
        $inc: {
          total_connections: packageInfo.connections,
          total_amount: packageInfo.price,
        },
      },
      { upsert: true, new: true }
    );

    res.redirect(successUrl);
  } catch (error) {
    res.redirect(failUrl);
  }
};


  
  
export const PaymentService = {
    createPayment,
    PaymentCallback
};


