import express from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = express.Router();

const moduleRoutes = [
    {
        path:'/users',
        route: UserRoutes
    },
    {
        path:'/auth',
        route: AuthRoutes
    }
];

moduleRoutes.forEach(({path,route}) => router.use(path,route))

export default router;