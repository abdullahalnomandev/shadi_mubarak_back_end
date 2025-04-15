import express from 'express';
import { BioDataController } from './biodata.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();


router.patch(
  '/step/:stepNo',
  auth(ENUM_USER_ROLE.USER),
  BioDataController.updateBioData
);
router.get(
  '/step/:stepNo',
  // auth(ENUM_USER_ROLE.USER),
  BioDataController.getDetailsByStep
);

router.get(
  '/:id',
  BioDataController.getSingleBioData
);

router.get(
  '/',
  BioDataController.getALlBioData
);





// router.get(
//   '/',
//   BioDataController.getALlBioData 
// )

export const BioDataRoutes = router;
