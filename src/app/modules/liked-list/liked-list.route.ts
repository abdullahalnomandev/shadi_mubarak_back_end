import express from 'express';
import { UserLikedListController } from './liked-list.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserLikedListValidation } from './liked-list.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(UserLikedListValidation.userLikedListSchema),
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN
),
  UserLikedListController.createOne
);

router.get(
  '/get-all-liked-list',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN
),
  UserLikedListController.getAllLikedList
);

router.delete(
  '/delete-liked-list/:id',
  auth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN
),
  UserLikedListController.deleteLikedList
);



export const UserLikedListRoutes = router;
