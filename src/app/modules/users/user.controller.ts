import { Response, Request } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IUser } from './user.interface';
import { userFilterableFields } from './user.constant';

const createUser = catchAsync(async (req:Request,res:Response) => {

  const { user } = req.body;
  const result = await UserService.createUser(user);
  sendResponse<IUser>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'User created successfully',
    data: result
  });
})

const getAllUsers = catchAsync(async (req:Request, res:Response) => {
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

})
const getSingleUser = catchAsync(async (req:Request, res:Response) => {
 
  console.log('cookie update',req.cookies)

   const {id} = req.params; 
   const result = await UserService.getUserById(id);
   
  sendResponse<IUser>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'user retrieved successfully',
    data: result
  });

})

const updateUser = catchAsync(async (req:Request, res:Response) => {
 
    const {id} = req.params; 
    const updateData = req.body;
    const result = await UserService.updateUserById(id, updateData);
   
  sendResponse<IUser>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'user updated successfully',
    data: result
  });

});

const deleteUser = catchAsync(async (req:Request, res:Response) => {
 
    const {id} = req.params; 
    const result = await UserService.deleteUserById(id);
   
  sendResponse<IUser>(res,{
    statusCode:httpStatus.OK,
    status:'success',
    message: 'User deleted successfully',
    data: result
  });

})

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
