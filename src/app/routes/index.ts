import express from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BioDataRoutes } from '../modules/biodata/biodata.route';
import { UserLikedListRoutes } from '../modules/liked-list/liked-list.route';
import { PackageRoutes } from '../modules/package/package.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { PurchaseBioDataRoutes } from '../modules/purchase-biodata/purchase-biodata.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';

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
    },
    {
        path:"/liked-list",
        route: UserLikedListRoutes
    },
    {
        path:"/package",
        route: PackageRoutes
    },
    {
        path:"/payment",
        route: PaymentRoutes
    },
    {
        path:"/purchase-biodata",
        route: PurchaseBioDataRoutes
    },
    {
        path:"/dashboard",
        route: DashboardRoutes
    }
];

moduleRoutes.forEach(({path,route}) => router.use(path,route))

export default router;