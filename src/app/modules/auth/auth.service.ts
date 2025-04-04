import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import { ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const loginUser = async (payload: ILoginUser):Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Match password
  if (isUserExist.password && !await User.isPasswordMatch(password, isUserExist.password))
     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');

  const {id,role} = isUserExist;
  //create access token
  const accessToken = jwtHelpers.createToken({
    id,
    email,
    role 
  },config.jwt.secret as Secret,  config.jwt.expires_in as string)
  
  //create refresh token
  const refreshToken = jwtHelpers.createToken({
    id,
    email,
    role 
  },config.jwt.refresh_secret as Secret,  config.jwt.refresh_expires_in as string)
  
  return {
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token:string):Promise<IRefreshTokenResponse> =>{

    // verify token

    let verifiedToken = null;
   try {
    verifiedToken = jwtHelpers.verifiedToken(token,config.jwt.secret as Secret);
   } catch (error) {
     throw new ApiError(httpStatus.FORBIDDEN,"Invalid refresh token")
   }

   const {  email } = verifiedToken as jwt.JwtPayload;

  const isUserExist = await User.isUserExist(email);
   if(!isUserExist){
    throw new ApiError(httpStatus.NOT_FOUND,"User does not exist")
   }

   const newAccessToken = jwtHelpers.createToken({
    id: isUserExist.id,
    email:isUserExist.email,
    role:isUserExist.role
  },config.jwt.secret as Secret,  config.jwt.expires_in as string)
  
  return {
    accessToken:newAccessToken
  }
}

export const Authservice = {
  loginUser,
  refreshToken
};
