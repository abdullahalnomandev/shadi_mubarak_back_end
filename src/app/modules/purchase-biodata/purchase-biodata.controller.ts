import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PurchaseBioDataService } from './purchase-biodata.service';



// Create a new package
const create = catchAsync(async (req: Request, res: Response) => {
  const {biodata_no} = req.body;
  const user_id = req.user?.id;

  const result = await PurchaseBioDataService.create({biodata_no, user_id});
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    status: 'success',
    message: 'BioData purchased successfully',
    data: result,
  });
});

const getPurchasedConnection = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.user?.id;

  const result = await PurchaseBioDataService.getPurchasedConnection(user_id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    status: 'success',
    message: 'Connection retrieved successfully',
    data: result,
  });
});


export const PurchaseBioDataController = {
  create,
  getPurchasedConnection
  
};
