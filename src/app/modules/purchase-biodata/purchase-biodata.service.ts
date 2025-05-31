import { IPaymentPurchase } from "../payment/payment.interface";
import { PaymentPurchase } from "../payment/payment.purchase.model";
import { IPurchaseBioData } from "./purchase-biodata.interface";
import { PurchasedBioData } from "./purchase-biodata.mode";
import mongoose from 'mongoose';

const create = async (payload: { biodata_no: string; user_id: string }): Promise<IPurchaseBioData | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if user has available connections and retrieve the doc
    const userPayment = await PaymentPurchase.findOne({ user_id: payload.user_id }).lean().session(session);

    if (!userPayment || userPayment.total_connections <= 0) {
      throw new Error('No available connections. Please purchase a connection first.');
    }

    // Decrement available connections
    await PaymentPurchase.updateOne(
      { user_id: payload.user_id },
      { $inc: { total_connections: -1 } },
      { session }
    );

    // Create purchase record
    const result = await PurchasedBioData.create([payload], { session });

    await session.commitTransaction();
    return result[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const getPurchasedConnection = async (user_id: string): Promise<IPaymentPurchase | null> => {

    return await PaymentPurchase.findOne({ user_id }).select("total_connections").lean().exec();

};

export const PurchaseBioDataService = {
  create,
  getPurchasedConnection
};
