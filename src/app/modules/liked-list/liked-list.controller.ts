import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserLikedListService } from './liked-list.service';
import { ILikedUserResponse, IUserLikedList } from './liked-list.interface';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const createOne = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { likedPersonId } = req.body;
  const result = await UserLikedListService.createOne(userId, likedPersonId);

  sendResponse<IUserLikedList>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Added to liked list successfully',
    data: result,
  });
});


const getAllLikedList = catchAsync(async (req: Request, res: Response) => {

  const userId = (req.user as any).id;
  const paginationOptions = pick(req.query, paginationFields);
  const result = await UserLikedListService.getAllLikedList(userId, paginationOptions);

  sendResponse<ILikedUserResponse[]>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Liked lists retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});
const deleteLikedList = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserLikedListService.deleteLikedList(id);

  sendResponse<IUserLikedList>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Liked list deleted successfully',
    data: result,
  });
});

export const UserLikedListController = {
  createOne,
  getAllLikedList,
  deleteLikedList,
};
