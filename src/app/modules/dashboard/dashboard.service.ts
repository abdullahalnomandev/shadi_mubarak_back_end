import { ENUM_USER_ROLE } from "../../../enums/user";
import { BioData } from "../biodata/biodata.model";
import { UserLikedList } from "../liked-list/liked-list.model";
import { PaymentPurchase } from "../payment/payment.purchase.model";
import { PurchasedBioData } from "../purchase-biodata/purchase-biodata.mode";
import { IDashboard } from "./dashboard.interface";

const getDashboardCounts = async (
  userId: string,
  bioDataNo: string,
  role: string
): Promise<IDashboard> => {
  if (role === ENUM_USER_ROLE.USER) {
    const [
      connectionInfo,
      totalPurchased,
      totalFavorite,
      totalLikedPerson,
      bioData
    ] = await Promise.all([
      PaymentPurchase.findOne({ user_id: userId }),
      PurchasedBioData.countDocuments({ user_id: userId }),
      UserLikedList.countDocuments({ userId }),
      UserLikedList.countDocuments({ likedPersonBioNo: bioDataNo }),
      BioData.findOne({ bioDataNo })
    ]);

    const totalVideoViews = bioData?.view || 0;

    return {
      totalProfileConnections: connectionInfo?.total_connections || 0,
      totalBioDataPurchased: totalPurchased,
      totalBioDataFavorite: totalFavorite,
      totalUsersWhoFavoriteYou: totalLikedPerson,
      profileVisitStats: {
        visitsLast7Days: totalVideoViews,
        visitsLast30Days: totalVideoViews,
        visitsLast90Days: totalVideoViews
      }
    };
  }

  // Placeholder for ADMIN logic
  if (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN) {
    // TODO: Implement admin-specific dashboard logic
    return {
      totalProfileConnections: 0,
      totalBioDataPurchased: 0,
      totalBioDataFavorite: 0,
      totalUsersWhoFavoriteYou: 0,
      profileVisitStats: {
        visitsLast7Days: 0,
        visitsLast30Days: 0,
        visitsLast90Days: 0
      }
    };
  }

  // Optional: Handle unknown roles
  throw new Error('Unsupported user role');
};

export const DashboardService = {
  getDashboardCounts,
};
