import { Response, Request, NextFunction } from 'express';
import { userService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createUser = catchAsync(async (req:Request,res:Response,next: NextFunction) => {

  const { user } = req.body;
  const result = await userService.createUser(user);
  // res.status(200).json({
  //   status: 'success',
  //   message: 'User created successfully',
  //   data: result,
  // });
  sendResponse(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'User created successfully',
    data: result
  });

  next();

})

export const UserController = {
  createUser,
};
