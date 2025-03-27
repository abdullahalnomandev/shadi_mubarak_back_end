import { User } from './user.model';
import { IUser, IUserFilters } from './user.interface';
import { generateUserId } from './user.utils';
import ApiError from '../../../errors/ApiError';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';
import { userSearchableFields } from './user.constant';


const createUser = async (user: IUser): Promise<IUser | null> => {

  // user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_round));
  const createUser = await User.create(user);

  if (!createUser) {
    throw new ApiError(400, 'Failed to create user');
  }

  if (!user.id) {
    const id = await generateUserId();
    user.id = id;
  }
  return createUser;
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
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Construct sorting conditions
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }


  // Query users with filters, sorting, and pagination
  const whereCondition = andConditions.length ? { $and: andConditions } : {};
  const users = await User.find(whereCondition).sort(sortConditions).skip(skip).limit(limit);

  // Get total user count
  const total = await User.countDocuments();

  return {
    meta: { page, limit, total },
    data: users,
  };
};

const getUserById = async (id: string):Promise<IUser | null> => {
  const result = await User.findById(id);
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
