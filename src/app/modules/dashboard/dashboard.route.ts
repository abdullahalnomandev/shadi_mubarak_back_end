import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
 auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER , ENUM_USER_ROLE.SUPER_ADMIN),
  DashboardController.getDashboardInformation
);

export const DashboardRoutes = router;