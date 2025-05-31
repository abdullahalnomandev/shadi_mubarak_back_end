import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PurchaseBioDataController } from './purchase-biodata.controller';
import express from 'express';


const router = express.Router();

router.post(
  '/',
//   validateRequest(AuthValidationZodSchema.loginZodSchema),
auth(ENUM_USER_ROLE.USER,ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
 PurchaseBioDataController.create
);
router.get(
  '/',
//   validateRequest(AuthValidationZodSchema.loginZodSchema),
auth(ENUM_USER_ROLE.USER,ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN),
 PurchaseBioDataController.getPurchasedConnection
);



export const PurchaseBioDataRoutes = router;
