import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PaymentService } from './payment.service';
import {  IBKashCallbackProps } from './payment.interface';


// Create a new package
const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user_id = req.user?.id;

  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const result = await PaymentService.createPayment({payload,url,user_id});
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    status: 'success',
    message: 'Payment created successfully',
    data: result,
  });
});

const paymentCallback = catchAsync(async (req: Request, res: Response) => {

 const queryParams = req.query;
  await PaymentService.PaymentCallback(queryParams as IBKashCallbackProps, res);
});





export const PaymentController = {
  createPayment,
  paymentCallback
};
