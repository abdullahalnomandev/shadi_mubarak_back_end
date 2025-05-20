import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post(
  '/',
//  validateRequest(PackageValidationZodSchema.createPackageZodSchema),
  PaymentController.createPayment );
router.get(
  '/callback',
//  validateRequest(PackageValidationZodSchema.createPackageZodSchema),
  PaymentController.paymentCallback );

export const PaymentRoutes = router;
