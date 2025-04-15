import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { IUserFilters } from '../users/user.interface';
import { userSearchableFields } from '../users/user.constant';
import { IBiodata } from './biodata.interface';
import { BioData } from './biodata.model';

const getALlBioData = async (
    filters: IUserFilters,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<IBiodata[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];
    // Handle search term filtering
    if (searchTerm) {
      andConditions.push({
        $or: userSearchableFields.map(field => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      });
    }
  
    // Handle additional filters
    if (Object.keys(filtersData).length > 0) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
  
    // Extract pagination details
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(paginationOptions);
  
    // Construct sorting conditions
    const sortConditions: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
  
  
    // Query users with filters, sorting, and pagination
    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    const usersBioData = await BioData.find(
      whereCondition,
      {
         bioDataNo: 1,
          view: 1,
          "generalInformation.gender":1,
          "generalInformation.dateOfBirth":1,
           "generalInformation.height":1, 
           "generalInformation.skin":1, 
           _id: 0 } 
    ) .sort(sortConditions)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();  
   
    // const total = await BioData.countDocuments();
  
    return {
      meta: { page, limit, total:usersBioData?.length },
      data: usersBioData,
    };
  };
  

   

const getBioDataById = async (id: string): Promise<IBiodata | null> => {
  const result = await BioData.findOneAndUpdate(
    { bioDataNo: id },
    { $inc: { view: 1 } },
    { new: true } 
  ).lean<IBiodata>().exec();

  return result;
};

  const getBioDataStep = async (
    bioDataNo: string,
    stepNo: number
  ): Promise<Partial<IBiodata> | null> => {
  
    const stepFieldMap: Record<number, keyof IBiodata> = {
      1: 'generalInformation',
      2: 'address',
      3: 'educationalQualifications',
      4: 'familyInformation',
      5: 'personalInformation',
      6: 'occupation',
      7: 'marriageRelatedInformation',
      8:'expectedPartner',
      9:'agreement',
      10:'contact'

    };
  
    const fieldToGet = stepFieldMap[stepNo];
  
    if (!fieldToGet) {
      throw new Error('Invalid step number');
    }
  
    const result = await BioData.findById(bioDataNo,
      { [fieldToGet]: 1,completedSteps:1, _id: 0 }
    ).lean();
  
    return result;
  };
   

  const updateBioData = async (
    bioDataNo: string,
    stepNo: number,
    payload: Partial<IBiodata>
  ): Promise<IBiodata | null> => {
  
    const stepFieldMap: Record<number, keyof IBiodata> = {
      1: 'generalInformation',
      2: 'address',
      3: 'educationalQualifications',
      4: 'familyInformation',
      5: 'personalInformation',
      6: 'occupation',
      7:'marriageRelatedInformation',
      8:'expectedPartner',
      9:'agreement',
      10:'contact'
    };
  
    const fieldToUpdate = stepFieldMap[stepNo];
  
    if (!fieldToUpdate) {
      throw new Error('Invalid step number');
    }
  
    const updateFieldValue = payload[fieldToUpdate];
    if (!updateFieldValue) {
      throw new Error(`Missing data for step ${stepNo}`);
    }
  
    const result = await BioData.findOneAndUpdate(
      { bioDataNo },
      {
        $set: { [fieldToUpdate]: updateFieldValue },
        $addToSet: { completedSteps: stepNo }
      },
      { new: true }
    );
  
    return result;
  };
  

export const BioDataService = {
    getALlBioData,
    getBioDataStep,
    getBioDataById,
    updateBioData
};
