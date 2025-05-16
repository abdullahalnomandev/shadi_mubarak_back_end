import { paginationHelper } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { IBiodata, IBioDataFilters } from './biodata.interface';
import { BioData } from './biodata.model';
import { bioDataSearchableFields } from './biodata.constant';

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

const getBioDataById = async (id: string): Promise<IBiodata | null> => {
  const result = await BioData.findOneAndUpdate(
    { bioDataNo: id },
    { $inc: { view: 1 } },
    { new: true }
  )
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
    4: 'educational_qualifications',
    5: 'personal_information',
    6: 'occupation',
    7: 'marriage_related_information',
    8: 'expected_partner',
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
    4: 'educational_qualifications',
    5: 'personal_information',
    6: 'occupation',
    7: 'marriage_related_information',
    8: 'expected_partner',
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

export const BioDataService = {
  getALlBioData,
  getBioDataStep,
  getBioDataById,
  updateBioData,
};
