import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
const loginUser = async (payload: ILoginUser):Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // check user exist
  // const isUserExist = await User.findOne({email},{email:1,password:1}).lean();
  // if(!isUserExist) throw new ApiError(httpStatus.NOT_FOUND,"User does not exist!");

  const user = new User();
  const isUserExist = await user.isUserExist(email);
  if (!isUserExist)
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');

  // Match password
  if (
    isUserExist.password &&
    !user.isPasswordMatch(password, isUserExist.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  //create access token & refresh token
  const {id,role} = isUserExist;
  const accessToken = jwtHelpers.createToken({
    id,
    email,
    role: role 
  },config.jwt.secret as Secret,  config.jwt.expires_in as string)
  
  const refreshToken = jwtHelpers.createToken({
    id,
    email,
    role: role 
  },config.jwt.refresh_secret as Secret,  config.jwt.refresh_expires_in as string)
  

  
  return {
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token:string) =>{

    // verify token
    let verifiedToken = null;
   try {
     verifiedToken = jwt.verify(token,config.jwt.secret as Secret);

   } catch (error) {
     throw new ApiError(httpStatus.FORBIDDEN,"Invalid refresh token")
   }

    const {email , role} = verifiedToken;

    const user = new User();
    const isUserExist = await user.isUserExist(email);
    if(!isUserExist){
      throw new ApiError(httpStatus.NOT_FOUND,'User does not exist')
    }
}

export const Authservice = {
  loginUser,
  refreshToken
};
