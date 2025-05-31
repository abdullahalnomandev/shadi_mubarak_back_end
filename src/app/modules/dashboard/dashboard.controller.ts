import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getDashboardInformation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const bioNo = req.user?.bioDataNo;
  const role = req.user?.role;
  const result = await DashboardService.getDashboardCounts(userId,bioNo,role);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    status:"success",
    message: 'Dashboard information retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getDashboardInformation,

};