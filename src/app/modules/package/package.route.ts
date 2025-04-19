import express from 'express';
import { PackageController } from './package.controller';
import { PackageValidationZodSchema } from './package.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(PackageValidationZodSchema.createPackageZodSchema),
  PackageController.createOne
);

router.patch(
  '/:id',
  validateRequest(PackageValidationZodSchema.updatePackageZodSchema),
  PackageController.UpdateOne
);

router.delete('/:id', PackageController.deleteOne);

router.get('/', 
    auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.SUPER_ADMIN,ENUM_USER_ROLE.USER),
    PackageController.getAll);

export const PackageRoutes = router;
