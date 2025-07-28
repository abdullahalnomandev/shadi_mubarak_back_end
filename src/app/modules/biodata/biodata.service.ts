/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { PurchasedBioData } from '../purchase-biodata/purchase-biodata.mode';
import { User } from '../users/user.model';
import { bioDataSearchableFields } from './biodata.constant';
import { IBiodata, IBioDataFilters } from './biodata.interface';
import { BioData } from './biodata.model';

const getALlBioData = async (
  filters: IBioDataFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBiodata[]>> => {
  const { searchTerm, minAge, maxAge, minHeight, maxHeight, ...otherFilters } =
    filters;

  // 1) Build the base filter object
  const query: Record<string, unknown> = {};

  // 1a) Text‐search across multiple fields
  if (searchTerm) {
    query.$or = bioDataSearchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }

  // 1b) Age range filter
  if (minAge || maxAge) {
    const today = new Date();
    const dateQuery: Record<string, Date> = {};

    if (maxAge) {
      const minDate = new Date(
        today.getFullYear() - Number(maxAge),
        today.getMonth(),
        today.getDate()
      );
      dateQuery.$gte = minDate;
    }

    if (minAge) {
      const maxDate = new Date(
        today.getFullYear() - Number(minAge),
        today.getMonth(),
        today.getDate()
      );
      dateQuery.$lte = maxDate;
    }
    query['generalInformation.dateOfBirth'] = dateQuery;
  }
  // 1c) Height range filter
  if (minHeight || maxHeight) {
    const heightQuery: Record<string, number> = {};

    if (maxHeight) {
      heightQuery.$lte = Number(maxHeight);
    }
    if (minHeight) {
      heightQuery.$gte = Number(minHeight);
    }
    query['generalInformation.height'] = heightQuery;
  }

  // 1d) Exact‐match filters
  for (const [key, value] of Object.entries(otherFilters)) {
    if (value !== undefined && value !== null && value !== '') {
      query[key] = value;
    }
  }

  // 2) Extract pagination & sorting
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  const sortCondition: Record<string, SortOrder> = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  // 3) Define projection once
  const projection = {
    _id: 0,
    bioDataNo: 1,
    view: 1,
    'generalInformation.gender': 1,
    'generalInformation.dateOfBirth': 1,
    'generalInformation.height': 1,
    'generalInformation.skin': 1,
  };

  // 4) Run count and find in parallel
  const [totalCount, data] = await Promise.all([
    BioData.countDocuments(query),
    BioData.find(query, projection)
      .sort(sortCondition)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
  ]);

  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data,
  };
};

const getBioDataById = async ({
  id: bioDataNo,
  userId,
}: {
  id: string;
  userId?: string;
}): Promise<IBiodata | null> => {
  let projection: any = { contact: 0 };

  if (userId) {
    // Do the two look‑ups in parallel
    const [purchased, user] = await Promise.all([
      PurchasedBioData.exists({
        biodata_no: bioDataNo,
        user_id: userId,
      }),
      User.findById(userId).select('bioDataNo').lean(),
    ]);

    const isOwner = user?.bioDataNo?.toString() === bioDataNo?.toString(); // avoid ObjectId vs string mismatch

    // 👉 Allow contact info if **either** the user owns the biodata OR has purchased it
    if (purchased || isOwner) {
      projection = {}; // no fields excluded
    }
  }

  const result = await BioData.findOneAndUpdate(
    { bioDataNo },
    { $inc: { view: 1 } },
    { new: true }
  )
    .select(projection) // hides contact unless allowed
    .lean<IBiodata>()
    .exec();

  return result;
};

const getBioDataStep = async (
  bioDataNo: string,
  stepNo: number
): Promise<Partial<IBiodata> | null> => {
  const stepFieldMap: Record<number, keyof IBiodata> = {
    1: 'general_information',
    2: 'address',
    3: 'family_information',
    4: 'education',
    5: 'personal_information',
    6: 'expected_partner',
    7: 'marriage_related_information',
    8: 'occupation',
    9: 'agreement',
    10: 'contact',
  };

  const fieldToGet = stepFieldMap[stepNo];

  if (!fieldToGet) {
    throw new Error('Invalid step number');
  }

  const result = await BioData.findById(bioDataNo, {
    [fieldToGet]: 1,
    completedSteps: 1,
    _id: 0,
  }).lean();

  return result;
};

const updateBioData = async (
  bioDataNo: string,
  stepNo: number,
  payload: Partial<IBiodata>
): Promise<IBiodata | null> => {
  const stepFieldMap: Record<number, keyof IBiodata> = {
    1: 'general_information',
    2: 'address',
    3: 'family_information',
    4: 'education',
    5: 'personal_information',
    6: 'expected_partner',
    7: 'marriage_related_information',
    8: 'occupation',
    9: 'agreement',
    10: 'contact',
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
      $addToSet: { completedSteps: stepNo },
    },
    { new: true }
  );

  return result;
};

// {
//   profileStatus: 'verified',
//   completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
// }
const updateProfile = async (
  bioDataNo: string,
  payload: Partial<IBiodata>
): Promise<IBiodata | null> => {
  const result = await BioData.findOneAndUpdate(
    { bioDataNo },
    { $set: payload },
    { new: true }
  );
  return result?.profileStatus;
};

const deleteBioData = async (bioDataNo: string): Promise<IBiodata | null> => {
  const resetPayload: Partial<IBiodata> = {
    profileStatus: 'not_started',
    completedSteps: [],
    view: 0,
    isBlocked: false,
    isDeleted: false,
    // optionally reset others
    education: {},
    general_information: {},
    marriage_related_information: {},
    address: {},
    personal_information: {},
    family_information: {},
    occupation: {},
    expected_partner: {},
    agreement: {},
    contact: {},
  };

  const result = await BioData.findOneAndUpdate(
    { bioDataNo },
    { $set: resetPayload },
    { new: true }
  );
  return result;
};

export const BioDataService = {
  getALlBioData,
  getBioDataStep,
  getBioDataById,
  updateBioData,
  updateProfile,
  deleteBioData,
};
