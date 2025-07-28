/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields } from './user.constant';
import { IUser } from './user.interface';
import { UserService } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req.body;
  const result = await UserService.createUser(user);

  // eslint-disable-next-line no-unused-vars
  const { password, ...safeUser } = result.toObject(); // `toObject()` if it's a Mongoose doc

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'User created successfully',
    data: safeUser,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const patinationOptions = pick(req.query, paginationFields);
  const result = await UserService.getAllUsers(filters, patinationOptions);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Semester retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.getUserById(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'user retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { bioDataNo } = req.user;
  const result = await UserService.getMe(bioDataNo);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'user retrieved successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await UserService.updateUserById(id, updateData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'user updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserService.deleteUserById(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMe,
};
