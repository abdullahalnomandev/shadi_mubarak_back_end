import { Model } from 'mongoose';

type IGeneralInformation = {
  gender: string;
  dateOfBirth: string;
  height: string;
  weight: number;
  skin: string;
  nationality: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
};

type IAddress = {
  present_address: {
    full: string;
    area: string;
  };
  permanent_address: {
    full: string;
    area: string;
  };
  grow_up: string;
};

type ProfileStatus = 'rejected' | 'verified' | 'in_process' | 'not_submitted';

type FamilyInformation = {
  isParentAlive: boolean;
  fatherProfession?: string;
  isMotherAlive: boolean;
  motherProfession?: string;
  howManyBrothers: number;
  brothersInformation?: string;
  howManySisters: number;
  sistersInformation?: string;
  professionOfUncles?: string;
  familyFinancialStatus: string;
  descriptionOfFinancialCondition: string;
  familyReligiousCondition: string;
};
type Occupation = {
  occupation: string;
  monthlyIncome: number;
  descriptionOfProfession: string;
};

type Agreement = {
  parentsAwareOfRegistration: boolean;
  confirmTruthOfProvidedInformation: boolean;
  agreeToLegalResponsibilityForFalseInfo: boolean;
};

type ExpectedPartner = {
  age: number; // ex: 18-25, 26-30, 31-35, 36-40
  complexion: string[]; // e.g. ["Fair", "Light", "Dark"]
  height: string;
  educationalQualification: string;
  district: string;
  maritalStatus: string[];
  profession: string;
  financialCondition: string;
  specialExpectationsOrRequests?: string; // optional in case it's not always provided
};
type Contact = {
  brideName: string;
  guardianPhoneNumber: string;
  relationWithGuardian: string;
  emailUsedForRegistration: string;
};
type PersonalInformation = {
  clothingOutside: string; // e.g. "Abaya and Niqab", "Hijab only", etc.
  wearingNiqabSince: string; // e.g. "2015", "Since childhood", or "Not applicable"
  praysFiveTimes: boolean;
  missedPrayersPerWeek: number; // how many times Salah is missed per week
  compliesWithMahram: boolean; // e.g. doesn’t travel without mahram
  canReciteQuranCorrectly: boolean;
  fiqhFollowed: string; // e.g. "Hanafi", "Shafi'i", etc.
  watchesOrListensToMedia: string; // freeform or enum e.g. "No", "Sometimes", "Only Islamic content"
  mentalOrPhysicalDiseases?: string; // optional in case of none
  involvedInSpecialWork?: string; // e.g. "Da'wah", "Teaching", "Volunteering"
  beliefsAboutShrine: string; // freeform opinion on mazar/dargah etc.
  islamicBooksRead: string[]; // list of books
  islamicScholarsPreferred: string[]; // list of scholars
  hobbiesAndInterests: string[]; // e.g. ["Reading", "Writing", "Cooking"]
  mobileNumber: string;
};

type MarriageRelatedInformation = {
  doYouAgreeWithParents: boolean;
  willingToWorkAfterMarriage: boolean;
  wantToContinueStudyAfterMarriage: boolean;
  whyAreYouGettingMarried: string;
};

type EducationalQualifications = {
  educationMedium: string; // e.g. "Bangla Medium", "English Medium", "Madrasa"
  sscPassingYear: number;
  sscDepartment: string;
  sscResult: string; // Can be "5.00", "A+", "GPA 4.5", etc.

  hscPassingYear?: number;
  hscDepartment?: string;
  hscResult?: string;

  honorsSubject?: string;
  institutionName?: string;
  currentYearOfStudy?: string; // e.g. "2nd year", "Honours Final Year"

  otherEducation?: string; // for diploma, short courses, etc.
};

export type IBiodata = {
  bioDataNo: string;
  view: number;
  isLived: boolean; // default: false
  completedSteps: number[]; // e.g. [1,2,3,4,5,6]
  isBlocked: boolean;
  profileStatus?: ProfileStatus;
  educational_qualifications?: EducationalQualifications;
  general_information?: IGeneralInformation;
  marriage_related_information?: MarriageRelatedInformation;
  address?: IAddress;
  personal_information: PersonalInformation;
  family_information: FamilyInformation;
  occupation?: Occupation;
  expected_partner?: ExpectedPartner;
  agreement?: Agreement;
  contact?: Contact;
};

export type BioDataModel = Model<IBiodata, Record<string, unknown>>;

export type IBioDataFilters = {
  searchTerm?: string;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
};
