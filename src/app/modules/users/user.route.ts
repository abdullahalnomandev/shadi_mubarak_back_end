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
router.get("/:id",UserController.getSingleUser);
router.get(
  '/',
  UserController.getAllUsers
);


export const UserRoutes = router;
