import { ILikedUserResponse, IUserLikedList } from "./liked-list.interface";
import { UserLikedList } from "./liked-list.model";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {  Types } from "mongoose";

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
): Promise<IGenericResponse<ILikedUserResponse[]>> => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(paginationOptions);

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1; 
  }

  // Use aggregation to combine match, lookup, projection, and pagination
  const result = await UserLikedList.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } }, // Match the userId

    // Lookup the liked person
    {
      $lookup: {
        from: 'users', // Assuming the collection name for users is 'users'
        localField: 'likedPersonId',
        foreignField: '_id',
        as: 'likedPerson'
      }
    },

    // Unwind the likedPerson array (only one element)
    { $unwind: '$likedPerson' },

    // Lookup bioData and include only the necessary fields
    {
      $lookup: {
        from: 'biodatas', // Assuming the collection name for biodatas is 'biodatas'
        localField: 'likedPerson.bioData',
        foreignField: '_id',
        as: 'bioData'
      }
    },

    // Unwind the bioData array (only one element)
    { $unwind: '$bioData' },

    // Project the necessary fields
    {
      $project: {
        _id: 1,
        userId: 1,
        likedPerson: {
          _id: 1,
          bioDataNo: 1,
          address: { $ifNull: ['$bioData.address.present_address.full', null] } 
        }
      }
    },

    { $skip: skip },
    { $limit: limit },
    { $sort: sortConditions },
  ]).exec();

  const total = await UserLikedList.countDocuments({ userId });

  return {
    meta: { page, limit, total },
    data: result, // No need for additional formatting since projection was done in the aggregation
  };
};


const deleteLikedList = async (id: string): Promise<IUserLikedList | null> => {
  return await UserLikedList.findByIdAndDelete(id);

};

export const UserLikedListService = {
  createOne,
  getAllLikedList,
  deleteLikedList,
};
