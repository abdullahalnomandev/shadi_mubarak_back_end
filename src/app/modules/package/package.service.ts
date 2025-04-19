import { BioData } from "../biodata/biodata.model";
import { IPackage } from "./package.interface";
import { Package } from "./package.model";


const create = async (payload: IPackage): Promise<IPackage | null> => {
  const existingPackage = await Package.findOne({ name: payload.name });

  if (existingPackage) {
    throw new Error(`Package with name '${payload.name}' already exists`);
  }

  const newPackage = await Package.create(payload);
  return newPackage;
};

const deleteOne = async (id:string):Promise<IPackage | null> =>{
  return await Package.findByIdAndDelete(id); 
}

const updateOne = async (id:string, payload:Partial<IPackage>):Promise<IPackage | null> =>{
  return await Package.findOneAndUpdate({_id:id}, payload, {new:true});
}

const getAll = async (bioDataNo: string): Promise<(IPackage & { effectivePrice: number })[] | null> => {
   
    const [profile, packages] = await Promise.all([
      BioData.findOne({ bioDataNo }, 'profileStatus').lean().exec(),
      Package.find().lean<IPackage[]>().exec(),
    ]);
  
    if (!packages) return [];
  
    return packages.map((pkg: IPackage) => {
      const { price, disCountPercentage, discountCondition, ...rest } = pkg;
      const isVerified = profile?.profileStatus === 'verified';
      const effectivePrice = isVerified
        ? price * (1 - (disCountPercentage ?? 0) / 100)
        : price;
  
      return {
        ...rest,
        price,
        ...(isVerified ? {} : { discountCondition }),
        effectivePrice,
      };
    });
  };
  
  
export const PackageService = {
    create,
    deleteOne,
    updateOne,
    getAll,
};


