import { z } from 'zod';

// Common schemas
const addressSchema = z.object({
  present_address: z.string({ required_error: 'Present address is required' }).max(500),
  permanent_address: z.string({ required_error: 'Permanent address is required' }).max(500),
  grow_up: z.string({ required_error: 'Grow up location is required' }).max(500),
  isSame_address: z.boolean({ required_error: 'Address similarity flag is required' }),
});

const educationalQualificationsSchema = z.object({
  educationMedium: z.string({ required_error: 'Education medium is required' }),
  sscPassingYear: z.number({ required_error: 'SSC passing year is required' })
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  sscDepartment: z.string({ required_error: 'SSC department is required' }),
  sscResult: z.string({ required_error: 'SSC result is required' }),
  hscPassingYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  hscDepartment: z.string().optional(),
  hscResult: z.string().optional(),
  honorsSubject: z.string().optional(),
  institutionName: z.string().optional(),
  currentYearOfStudy: z.string().optional(),
  otherEducation: z.string().optional(),
});

// Main BioData schemas
const createBioDataSchema = z.object({
  body: z.object({
    bioDataNo: z.string({ required_error: 'BioData number is required' }),
    generalInformation: z.object({
      gender: z.string({ required_error: 'Gender is required' }),
      dateOfBirth: z.string({ required_error: 'Date of birth is required' }), // or use z.date()
      height: z.string({ required_error: 'Height is required' }),
      weight: z.number({ required_error: 'Weight is required' }).min(20).max(200),
      skin: z.string({ required_error: 'Skin description is required' }),
      nationality: z.string({ required_error: 'Nationality is required' }),
      maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], {
        required_error: 'Marital status is required',
      }),
    }),

    address: addressSchema,

    contact: z.object({
      brideName: z.string({ required_error: 'Bride name is required' }).max(100),
      guardianPhoneNumber: z.string({ required_error: 'Guardian phone number is required' }),
      relationWithGuardian: z.string({ required_error: 'Relation with guardian is required' }).max(100),
    }),

    // Other optional fields can be added here with .optional()
  }),
});

const updateBioDataSchema = z.object({
  body: z.object({
    educationalQualifications: educationalQualificationsSchema.optional(),
    marriageRelatedInformation: z.object({
      doYouAgreeWithParents: z.boolean({ required_error: 'This field is required' }),
      willingToWorkAfterMarriage: z.boolean({ required_error: 'This field is required' }),
      wantToContinueStudyAfterMarriage: z.boolean({ required_error: 'This field is required' }),
      whyAreYouGettingMarried: z.string({ required_error: 'This field is required' }).max(500),
    }).optional(),

    personalInformation: z.object({
      clothingOutside: z.string({ required_error: 'This field is required' }),
      wearingNiqabSince: z.string({ required_error: 'This field is required' }),
      praysFiveTimes: z.boolean({ required_error: 'This field is required' }),
      missedPrayersPerWeek: z.number({ required_error: 'This field is required' }).min(0).max(21),
      compliesWithMahram: z.boolean({ required_error: 'This field is required' }),
      canReciteQuranCorrectly: z.boolean({ required_error: 'This field is required' }),
      fiqhFollowed: z.string({ required_error: 'This field is required' }),
      watchesOrListensToMedia: z.string({ required_error: 'This field is required' }),
      beliefsAboutShrine: z.string({ required_error: 'This field is required' }),
      mentalOrPhysicalDiseases: z.string().max(500).optional(),
      involvedInSpecialWork: z.string().max(500).optional(),
      islamicBooksRead: z.array(z.string().max(100)).optional(),
      islamicScholarsPreferred: z.array(z.string().max(100)).optional(),
      hobbiesAndInterests: z.array(z.string().max(100)).optional(),
    }).optional(),

    // Add other updateable fields as needed
  }),
});

export const BioDataValidation = {
  createBioDataSchema,
  updateBioDataSchema,

};