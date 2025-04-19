import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IPackage } from './package.interface';
import { PackageService } from './package.service';

// Get all packages
const getAll = catchAsync(async (req: Request, res: Response) => {
    const {bioDataNo} = (req as any).user;

  const result = await PackageService.getAll(bioDataNo);
  sendResponse<IPackage[]>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Packages retrieved successfully',
    data: result,
  });
});

// Create a new package
const createOne = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await PackageService.create( payload);
  sendResponse<IPackage>(res, {
    statusCode: httpStatus.CREATED,
    status: 'success',
    message: 'Package created successfully',
    data: result,
  });
});

// Update an existing package by ID
const UpdateOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await PackageService.updateOne(id, payload);
  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Package updated successfully',
    data: result,
  });
});

// Delete a package by ID
const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.deleteOne(id);
  sendResponse<IPackage>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Package deleted successfully',
    data: result,
  });
});

export const PackageController = {
  getAll,
  createOne,
  UpdateOne,
  deleteOne,
};
