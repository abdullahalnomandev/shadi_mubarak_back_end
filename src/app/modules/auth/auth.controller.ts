import { Response, Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Authservice } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await Authservice.loginUser(loginData);
  const { refreshToken, ...others } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'User logged in successfully!',
    data: others,
  });
});

const register = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const { password } = req.body;
  const { phone } = req.body;

  const result = await Authservice.registerUser({ email, password, phone });
  const { refreshToken, ...others } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'User created successfully!',
    data: others,
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await Authservice.refreshToken(refreshToken);

  // set refresh token into cookie
  // const cookieOptions = {
  //   secure: config.env === "production",
  //   httpOnly:true
  // }

  // res.cookie('refreshToken',refreshToken, cookieOptions);
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Refresh token generate successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const user = req.user;
  await Authservice.changePassword(user, passwordData);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Password updated successfully !',
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await Authservice.forgetPassword(email);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Email sent successfully!',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordResetInfo } = req.body;
  const token = req.headers.authorization as string;
  await Authservice.resetPassword(passwordResetInfo, token);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Password updated successfully!',
  });
});

export const AuthController = {
  loginUser,
  register,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
