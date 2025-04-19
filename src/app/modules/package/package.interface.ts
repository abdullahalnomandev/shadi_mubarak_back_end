import { Model } from "mongoose";

  
export type IPackage = {
    name:"basic"|"standard"|"popular";
    connections: number;
    price: number;
    disCountPercentage?: number;
    description: string;
    discountCondition?: string;
    isSelected?: boolean;
  };

  export type IPackageModel = Model<IPackage, Record<string, unknown>>;

  export type IPackageDataFilters = {
    searchTerm?: string;
  };
  