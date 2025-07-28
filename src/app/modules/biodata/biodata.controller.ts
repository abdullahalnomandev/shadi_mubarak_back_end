/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bioDataFilterableFields } from './biodata.constant';
import { IBiodata } from './biodata.interface';
import { BioDataService } from './biodata.service';
// import pick from '../../../shared/pick';
// import { bioDataFilterableFields } from './biodata.constant';
// import { paginationFields } from '../../../constants/pagination';

const updateBioData = catchAsync(async (req: Request, res: Response) => {
  const { ...bioData } = req.body;
  const bioDataNo = (req as any).user.bioDataNo;
  const stepNo = Number(req.params.stepNo);
  //   console.log({ stepNo, bioData });
  const result = await BioDataService.updateBioData(bioDataNo, stepNo, bioData);
  sendResponse<IBiodata>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'BioData updated successfully',
    data: result,
  });
});

const getALlBioData = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bioDataFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BioDataService.getALlBioData(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'BioData retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getSingleBioData = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req?.user?.id;

  console.log({ userId });

  const result = await BioDataService.getBioDataById({ id, userId });
  sendResponse<IBiodata>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'BioData retrieved successfully',
    data: result,
  });
});
const getDetailsByStep = catchAsync(async (req: Request, res: Response) => {
  const stepNo = Number(req.params.stepNo);
  const bioDataId = '67fc068da8a5af9875132620';
  // const bioDataId = (req as any).user.id ;
  const result = await BioDataService.getBioDataStep(bioDataId, stepNo);
  sendResponse<Partial<IBiodata>>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'BioData retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { bioDataNo } = req.user;
  const payload = req.body;
  const result = await BioDataService.updateProfile(bioDataNo, payload);
  sendResponse<IBiodata>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'BioData updated successfully',
    data: result,
  });
});

const deleteBioData = catchAsync(async (req: Request, res: Response) => {
  const { bioDataNo } = req.user;
  const result = await BioDataService.deleteBioData(bioDataNo);
  sendResponse<IBiodata>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'BioData deleted successfully',
    data: result,
  });
});

export const BioDataController = {
  updateBioData,
  getALlBioData,
  getDetailsByStep,
  getSingleBioData,
  updateProfile,
  deleteBioData,
};
