export type IDashboard = {
    totalProfileConnections: number;
    totalBioDataPurchased: number;
    totalBioDataFavorite: number;
    totalUsersWhoFavoriteYou: number;
    profileVisitStats: {
      visitsLast7Days: number;
      visitsLast30Days: number;
      visitsLast90Days: number;
    };
  };
  