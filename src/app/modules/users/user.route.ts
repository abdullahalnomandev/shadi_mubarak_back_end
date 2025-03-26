import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidationZodSchema } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidationZodSchema.createUserZodSchema),
  UserController.createUser
);

export const UserRoutes = router;
