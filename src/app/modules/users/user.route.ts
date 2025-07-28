import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidationZodSchema } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidationZodSchema.createUserZodSchema),
  UserController.createUser
);
router.get(
  '/me',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.getMe
);
router.get('/:id', UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidationZodSchema.updateUserZodSchema),
  UserController.updateUser
);
router.delete('/:id', UserController.deleteUser);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.getAllUsers
);

export const UserRoutes = router;
