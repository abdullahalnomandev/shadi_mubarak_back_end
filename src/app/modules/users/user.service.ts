import { User } from './user.model';
import {  IUser, IUserFilters } from './user.interface';
import { generateUserId } from './user.utils';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';
import { userSearchableFields } from './user.constant';
import { BioData } from '../biodata/biodata.model';
import mongoose from 'mongoose';

export const createUser = async (user: IUser): Promise<IUser> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if user already exists
    const existingUser = await User.isUserExist(user.email);
    if (existingUser) {
      throw new ApiError(409, 'User already exists with this email');
    }

    // 2. Generate unique bioDataNo and assign it
    const bioDataNo = await generateUserId();
    user.bioDataNo = bioDataNo;

    // 3. Create BioData with bioDataNo as _id
    const createdBioData = await BioData.create(
      [{  bioDataNo }],
      { session }
    );

    if (!createdBioData || createdBioData.length === 0) {
      throw new ApiError(500, 'Failed to create biodata');
    }

    // 4. Create the user with a reference to bioDataNo
    user.bioData = createdBioData[0].id;
    const createdUser = await User.create([user], { session });

    if (!createdUser || createdUser.length === 0) {
      throw new ApiError(500, 'Failed to create user');
    }

    // 5. Commit transaction
    await session.commitTransaction();
    return createdUser[0];
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  // Handle search term filtering
  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  // Handle additional filters
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Extract pagination details
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(paginationOptions);

  // Construct sorting conditions
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }


  // Query users with filters, sorting, and pagination
  const whereCondition = andConditions.length ? { $and: andConditions } : {};
  const users = await User.find(whereCondition).sort(sortConditions).skip(skip).limit(limit).populate('bioData');

  // Get total user count
  const total = await User.countDocuments();

  return {
    meta: { page, limit, total },
    data: users,
  };
};

const getUserById = async (id: string):Promise<IUser | null> => {
  const result = await User.findById(id).populate("bioData");
  return result;
}
const updateUserById = async (id: string, payload: Partial<IUser>):Promise<IUser | null> => {
  return await User.findOneAndUpdate({_id:id}, payload,{new:true});

}

const deleteUserById = async (id: string):Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
}

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
