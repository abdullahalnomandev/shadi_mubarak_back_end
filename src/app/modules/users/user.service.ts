import mongoose, { SortOrder } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { sendEmail } from '../../../shared/sendEmail';
import { BioData } from '../biodata/biodata.model';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import { generateUserId, generateVerifyEmailHtml } from './user.utils';

export const createUser = async (userData: IUser): Promise<IUser> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if user already exists
    const existingUser = await User.isUserExist(userData.email);
    if (existingUser) {
      throw new ApiError(409, 'User already exists');
    }

    // 2. Generate unique bioDataNo
    const bioDataNo = await generateUserId();

    // 3. Create BioData with bioDataNo
    const createdBioData = await BioData.create([{ bioDataNo }], { session });
    if (!createdBioData || createdBioData.length === 0) {
      throw new ApiError(500, 'Failed to create biodata');
    }

    // 4. Build user object
    const user = {
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      provider: userData.provider,
      emailVerified: userData.provider === 'google', // Verified if Google
      verificationToken: userData?.verificationToken,
      bioDataNo,
      bioData: createdBioData[0]._id,
    };

    if (!user.emailVerified & !user.verificationToken) {
      throw new ApiError(500, 'Verification token is required');
    }

    // 5. If provider is email, send verification email
    if (userData.provider === 'email') {
      const verifyUrl = `${config.server_url}/auth/verify?token=${user.verificationToken}`;
      const emailInfo = {
        email: user.email,
        subject: 'Verify your account!',
        html: generateVerifyEmailHtml(verifyUrl),
      };

      await sendEmail(emailInfo);
    }

    // 6. Create the user
    const createdUser = await User.create([user], { session });
    if (!createdUser || createdUser.length === 0) {
      throw new ApiError(500, 'Failed to create user');
    }

    // 7. Commit transaction
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
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  // Construct sorting conditions
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Query users with filters, sorting, and pagination
  const whereCondition = andConditions.length ? { $and: andConditions } : {};
  const users = await User.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate('bioData');

  // Get total user count
  const total = await User.countDocuments();

  return {
    meta: { page, limit, total },
    data: users,
  };
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id).populate('bioData');
  return result;
};
const updateUserById = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
