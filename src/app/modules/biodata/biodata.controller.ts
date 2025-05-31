/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IBiodata } from './biodata.interface';
import { BioDataService } from './biodata.service';
import pick from '../../../shared/pick';
import { bioDataFilterableFields } from './biodata.constant';
import { paginationFields } from '../../../constants/pagination';
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
  const userId = req.query.userId ? String(req.query.userId) : undefined;

  const result = await BioDataService.getBioDataById({id,userId});
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
export const BioDataController = {
  updateBioData,
  getALlBioData,
  getDetailsByStep,
  getSingleBioData,
};
