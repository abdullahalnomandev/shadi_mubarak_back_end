import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import {
  IChangePassword,
  ICreateUser,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { sendEmail } from '../../../shared/sendEmail';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { generateUserId } from '../users/user.utils';
import { BioData } from '../biodata/biodata.model';
import { getUserInfoWithToken } from './auth.util';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password, token } = payload;
  let userEmail: string;

  // Handle token-based authentication
  if (token) {
    try {
      const tokenData = await getUserInfoWithToken(token);
      userEmail = tokenData.data.email;
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  } else if (email) {
    // Handle email-based authentication
    userEmail = email;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email or token is required');
  }

  // Verify user existence
  const user = await User.isUserExist(userEmail);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Validate password
  if ( !token && user.password && !(await User.isPasswordMatch(password as string, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Extract user data for token generation
  const { id, bioDataNo, role } = user;
  const tokenPayload = {
    id,
    bioDataNo,
    userEmail,
    role,
  };

  // Generate authentication tokens
  const accessToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
const registerUser = async ({
  email,
  password,
  phone,
}: ICreateUser): Promise<ILoginUserResponse> => {
  // Input validation
  if (!email || !password || !phone) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if user already exists
    const existingUser = await User.isUserExist(email);
    if (existingUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'User already exists with this email'
      );
    }

    // 2. Generate unique bioDataNo
    const bioDataNo = await generateUserId();

    // 3. Create BioData document
    const bioData = await BioData.create([{ bioDataNo }], {
      session,
    });

    if (!bioData?.[0]) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create biodata'
      );
    }

    // 4. Create User document
    const newUser = await User.create(
      [
        {
          email,
          password,
          phone,
          bioDataNo,
          bioData: bioData[0]._id,
        },
      ],
      { session }
    );

    if (!newUser?.[0]) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user'
      );
    }

    // 5. Generate tokens
    const tokenPayload = {
      id: newUser[0]._id,
      bioDataNo,
      email,
      role: newUser[0].role,
    };

    const accessToken = jwtHelpers.createToken(
      tokenPayload,
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      tokenPayload,
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    // 6. Commit transaction
    await session.commitTransaction();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error instanceof ApiError
      ? error
      : new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Error during user registration'
        );
  } finally {
    session.endSession();
  }
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifiedToken(
      token,
      config.jwt.refresh_secret as string
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { email } = verifiedToken;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.bioDataNo,
      role: isUserExist.role,
      bioDataNo: isUserExist.bioDataNo,
      email: isUserExist.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
const changePassword = async (
  userData: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ email: userData?.email }).select(
    '+password'
  );
  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');

  // checking old password
  if (
    isUserExist &&
    !(await User.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Old password is incorrect');
  }

  isUserExist.password = newPassword;
  isUserExist.save();
};

const forgetPassword = async (email: string): Promise<void> => {
  const user = await User.isUserExist(email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');

  const jwtPayload = {
    id: user.id,
    role: user.role,
  };

  const resetToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.secret as string,
    '10m'
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
  await sendEmail(user.email, resetUILink);
};

const resetPassword = async (
  payload: { email: string; password: string },
  token: string
): Promise<void> => {
  const user = await User.isUserExist(payload.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');

  const decoded = jwtHelpers.verifiedToken(token, config.jwt.secret as Secret);
  if (!decoded) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  const newHasPassword = await bcrypt.hashSync(
    user.password,
    Number(config.bcrypt_salt_round)
  );

  await User.findOneAndUpdate(
    { id: decoded.id },
    {
      password: newHasPassword,
    }
  );
};

export const Authservice = {
  loginUser,
  registerUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
