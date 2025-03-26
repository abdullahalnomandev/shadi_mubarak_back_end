import express from 'express';
import { UserRoutes } from '../modules/users/user.route';

const router = express.Router();

const moduleRoutes = [
    {
        path:'/users',
        route: UserRoutes
    }
];

moduleRoutes.forEach(({path,route}) => router.use(path,route))

export default router;