import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../users/user.model';
import { IChangePassword, ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import  { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { sendEmail } from '../../../shared/sendEmail';
import bcrypt from 'bcrypt';

const loginUser = async (payload: ILoginUser):Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Match password
  if (isUserExist.password && !await User.isPasswordMatch(password, isUserExist.password))
     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');

  const { id, bioDataNo, role } = isUserExist;
  //create access token
  const accessToken = jwtHelpers.createToken({
    id,
    bioDataNo,
    email,
    role 
  },config.jwt.secret as Secret,  config.jwt.expires_in as string)
  
  //create refresh token
  const refreshToken = jwtHelpers.createToken({
    id,
    bioDataNo,
    email,
    role 
  },config.jwt.refresh_secret as Secret,  config.jwt.refresh_expires_in as string)
  
  return {
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token:string):Promise<IRefreshTokenResponse> =>{
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
   { id: isUserExist.bioDataNo, role: isUserExist.role },
   config.jwt.secret as Secret,
   config.jwt.expires_in as string
 );

 return {
   accessToken: newAccessToken,
 };
}
const changePassword = async (userData:JwtPayload | null,payload:IChangePassword):Promise<void> =>{

  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ email: userData?.email }).select( '+password');
  if (!isUserExist)  throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  
  // checking old password
  if (
isUserExist &&
    !(await User.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Old password is incorrect');
  }

  isUserExist.password = newPassword;
  isUserExist.save();
}


const forgetPassword = async ( email:string):Promise<void> =>{
    
  const user = await User.isUserExist(email);
  if (!user)  throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist'); 
  
  const jwtPayload = {
    id: user.id,
    role: user.role,
  };

  const resetToken = jwtHelpers.createToken(
    jwtPayload,
    config.jwt.secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.email}&token=${resetToken} `;
  await sendEmail(user.email, resetUILink);

}

const resetPassword = async (payload:{email:string,password:string},token:string):Promise<void> =>{

    const user = await User.isUserExist(payload.email);
    if (!user)  throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');

    const decoded = jwtHelpers.verifiedToken(token,config.jwt.secret as Secret);
    if (!decoded) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
    }

    const newHasPassword = await bcrypt.hashSync(
      user.password,
      Number(config.bcrypt_salt_round)
    );

    await User.findOneAndUpdate(
      { id:decoded.id },
      {
        password: newHasPassword,
      },
    );
}

export const Authservice = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword
};
