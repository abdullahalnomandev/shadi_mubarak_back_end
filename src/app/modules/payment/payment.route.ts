import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
//  validateRequest(PackageValidationZodSchema.createPackageZodSchema),
auth(ENUM_USER_ROLE.USER),
PaymentController.createPayment );
router.get(
  '/callback',
//  validateRequest(PackageValidationZodSchema.createPackageZodSchema),\
auth(ENUM_USER_ROLE.USER),
PaymentController.paymentCallback );

export const PaymentRoutes = router;
