import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import optionalAuth from '../../middlewares/optionalAuth';
import { BioDataController } from './biodata.controller';

const router = express.Router();

router.patch(
  '/step/:stepNo',
  auth(ENUM_USER_ROLE.USER),
  BioDataController.updateBioData
);
router.patch('/me', auth(ENUM_USER_ROLE.USER), BioDataController.updateProfile);
router.get(
  '/step/:stepNo',
  // auth(ENUM_USER_ROLE.USER),
  BioDataController.getDetailsByStep
);

router.get(
  '/:id',
  optionalAuth(
    ENUM_USER_ROLE.USER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  BioDataController.getSingleBioData
);

router.get('/', BioDataController.getALlBioData);
router.delete('/', auth(ENUM_USER_ROLE.USER), BioDataController.deleteBioData);

// router.get(
//   '/',
//   BioDataController.getALlBioData
// )

export const BioDataRoutes = router;
