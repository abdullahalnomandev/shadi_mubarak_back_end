import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { sendEmail } from '../../../shared/sendEmail';
import { BioData } from '../biodata/biodata.model';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { generateUserId, generateVerifyEmailHtml } from '../users/user.utils';
import {
  IChangePassword,
  ICreateUser,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import {
  generateResetPasswordEmailHtml,
  getUserInfoWithToken,
} from './auth.util';

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
  if (
    !token &&
    user.password &&
    !(await User.isPasswordMatch(password as string, user.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Extract user data for token generation
  const { bioDataNo, role } = user;
  const tokenPayload = {
    id: user._id,
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

export const registerUser = async ({
  email,
  password,
  phone,
  provider = 'email',
}: ICreateUser): Promise<
  ILoginUserResponse | { message: string; user: Partial<IUser> }
> => {
  if (!email || !phone || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if user already exists
    let existingUser = await User.isUserExist(email);
    if (existingUser && !existingUser.emailVerified && provider === 'email') {
      await User.deleteOne({ bioDataNo: existingUser.bioDataNo });
      await BioData.deleteOne({ bioDataNo: existingUser.bioDataNo });
      existingUser = null;
    }
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, 'User already exists');
    }

    // Step 2: Generate unique bioData number
    const bioDataNo = await generateUserId();

    // Step 3: Create BioData
    const bioData = await BioData.create([{ bioDataNo }], { session });
    if (!bioData?.[0]) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create biodata'
      );
    }

    // Step 4: Generate verification token for email users
    const verificationToken =
      provider === 'email'
        ? jwtHelpers.createToken(
            { email, bioDataNo },
            config.jwt.secret as string,
            '15m'
          )
        : null;

    // Step 5: Prepare user data
    const userPayload = {
      email,
      password,
      phone,
      provider,
      bioDataNo,
      bioData: bioData[0]._id,
      emailVerified: provider === 'google',
      verificationToken,
    };

    // Step 6: Create user
    const createdUser = await User.create([userPayload], { session });
    if (!createdUser?.[0]) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user'
      );
    }

    const savedUser = createdUser[0];

    if (provider === 'email') {
      const verifyUrl = `${config.client_url}/verify?token=${verificationToken}`;
      const emailHtml = generateVerifyEmailHtml(verifyUrl);

      // ✅ Commit the transaction before sending email
      await session.commitTransaction();

      // ✅ Then send the email
      sendEmail({
        to: email,
        subject: 'Verify your account!',
        html: emailHtml,
      });

      return {
        id: savedUser._id,
        email: savedUser.email,
        phone: savedUser.phone,
        provider: savedUser.provider,
        bioDataNo: savedUser.bioDataNo,
        emailVerified: savedUser.emailVerified,
      };
    }

    // Step 7: Generate tokens for Google users
    const tokenPayload = {
      id: savedUser._id,
      bioDataNo,
      email,
      role: savedUser.role,
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

    // ✅ Commit transaction for Google users
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

const verifyUser = async (token: {
  token: string;
}): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  if (!token) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Verification token is required'
    );
  }

  // Step 1: Verify JWT token
  let decoded;
  try {
    decoded = jwtHelpers.verifiedToken(token, config.jwt.secret as string) as {
      email: string;
      bioDataNo: string;
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invalid or expired verification token'
    );
  }

  const { email, bioDataNo } = decoded;

  // Step 2: Find and update user atomically
  const user = await User.findOneAndUpdate(
    { email, bioDataNo, verificationToken: token },
    {
      $set: {
        emailVerified: true,
        verificationToken: null,
      },
    },
    { new: true } // returns updated user
  );

  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User not found or already verified'
    );
  }

  // Step 3: Generate access and refresh tokens
  const tokenPayload = {
    id: user._id,
    email: user.email,
    bioDataNo: user.bioDataNo,
    role: user.role,
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

  return {
    accessToken,
    refreshToken,
  };
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
  email: string,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  const isUserExist = await User.findOne({ email }).select('password');
  // checking old password
  if (
    isUserExist &&
    !(await User.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      ' Current password is incorrect'
    );
  }

  if (isUserExist) {
    isUserExist.password = newPassword;
    await isUserExist.save();
  }
};

const forgetPassword = async (email: string): Promise<void> => {
  const user = await User.isUserExist(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const token = jwtHelpers.createToken(
    {
      bioDataNo: user.bioDataNo,
      role: user.role,
    },
    config.jwt.secret as string,
    '15m'
  );

  const resetLink = `${config.client_url}/reset-password?token=${token}`;
  const html = generateResetPasswordEmailHtml(resetLink);

  await sendEmail({
    to: user.email,
    subject: 'Reset your password !',
    html,
  });
};

const resetPassword = async (
  newPassword: string,
  token: string
): Promise<void> => {
  const decoded = jwtHelpers.verifiedToken(token, config.jwt.secret as Secret);

  if (!decoded || !decoded.bioDataNo) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid or expired token');
  }

  // Check if user exists by bioDataNo
  const user = await User.findOne({ bioDataNo: decoded.bioDataNo });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user is deleted
  const bioData = await BioData.findOne(
    { bioDataNo: decoded.bioDataNo },
    'isDeleted'
  ).lean();

  if (bioData?.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Hash the new password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round)
  );

  // Update user password
  await User.updateOne(
    { bioDataNo: decoded.bioDataNo },
    { password: newHashedPassword }
  );
};

export const Authservice = {
  loginUser,
  registerUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
  verifyUser,
};
