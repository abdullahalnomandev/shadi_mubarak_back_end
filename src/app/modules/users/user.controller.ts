import { Response, Request, NextFunction } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IUser } from './user.interface';
import { userFilterableFields } from './user.constant';

const createUser = catchAsync(async (req:Request,res:Response,next: NextFunction) => {

  const { user } = req.body;
  const result = await UserService.createUser(user);

  sendResponse<IUser>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'User created successfully',
    data: result
  });

  next();
})

const getAllUsers = catchAsync(async (req:Request, res:Response,next:NextFunction) => {
  const filters = pick(req.query,userFilterableFields)
  const patinationOptions = pick(req.query, paginationFields)
   const result = await UserService.getAllUsers(filters, patinationOptions);
   
  sendResponse<IUser[]>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'Semester retrieved successfully',
    meta:result.meta,
    data: result.data
  });
  next();

})
const getSingleUser = catchAsync(async (req:Request, res:Response,next:NextFunction) => {
 
    const {id} = req.params; 
   const result = await UserService.getUserById(id);
   
  sendResponse<IUser>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'user retrieved successfully',
    data: result
  });
  next();

})

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser
};
