import { IUserLikedList } from "./liked-list.interface";
import { UserLikedList } from "./liked-list.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { SortOrder } from "mongoose";

const createOne = async (
  userId: string,
  likedPersonId: string,
): Promise<IUserLikedList> => {

  return await UserLikedList.create({
    userId,
    likedPersonId,
  });
};

const getAllLikedList = async (
  userId: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUserLikedList[]>> => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await UserLikedList.find({userId})
    .populate({
        path:"likedPersonId",
        select:["bioDataNo"],
        populate:{
          path:"bioData", 
          select:["address.permanent_address.full"]
        }
    })
    .sort(sortConditions)
    .skip(skip)
    .limit(limit).lean().exec();

  const total = await UserLikedList.countDocuments();
  

  return {
    meta: { page, limit, total },
    data: result,
  };
};



const deleteLikedList = async (id: string): Promise<IUserLikedList | null> => {
  const result = await UserLikedList.findByIdAndDelete(id);
  return result;
};

export const UserLikedListService = {
  createOne,
  getAllLikedList,
  deleteLikedList,
};
