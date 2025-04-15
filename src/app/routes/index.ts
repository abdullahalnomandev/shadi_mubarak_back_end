import express from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BioDataRoutes } from '../modules/biodata/biodata.route';

const router = express.Router();

const moduleRoutes = [
    {
        path:'/users',
        route: UserRoutes
    },
    {
        path:'/auth',
        route: AuthRoutes
    },
    {
        path:"/bioData",
        route: BioDataRoutes
    }
];

moduleRoutes.forEach(({path,route}) => router.use(path,route))

export default router;