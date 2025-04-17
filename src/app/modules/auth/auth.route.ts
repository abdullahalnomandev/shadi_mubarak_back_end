import express from 'express';
import { AuthValidationZodSchema } from './auth.validation';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidationZodSchema.loginZodSchema),
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidationZodSchema.refreshTokenZodSchema),
  AuthController.refreshToken
);

// router.post(
//   '/forgot-password',
//   validateRequest(AuthValidationZodSchema.forgotPasswordZodSchema),
//   AuthController.forgotPassword 
// )

router.post(
  '/reset-password',
  validateRequest(AuthValidationZodSchema.resetPasswordZodSchema),
  AuthController.resetPassword 
)

router.post(
  '/change-password',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(AuthValidationZodSchema.changePasswordZodSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
