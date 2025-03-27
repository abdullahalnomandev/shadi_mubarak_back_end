import express from 'express';
import { AuthValidationZodSchema } from './auth.validation';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';

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

export const AuthRoutes = router;
