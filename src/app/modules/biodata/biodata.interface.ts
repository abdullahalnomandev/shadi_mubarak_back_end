import { Model } from 'mongoose';

type IGeneralInformation = {
  biodataType: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  skin: string;
  nationality: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
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
  howManyBrothers: string;
  brothersInformation?: string;
  howManySisters: string;
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
  parentsAwareOfRegistration: string;
  confirmTruthOfProvidedInformation: string;
  agreeToLegalResponsibilityForFalseInfo: string;
};
type ExpectedPartner = {
  age: string; // ex: 18-25, 26-30, 31-35, 36-40
  complexion: string[]; // e.g. ["Fair", "Light", "Dark"]
  height: string;
  education: string;
  district: string;
  maritalStatus: string[];
  profession: string;
  financialCondition: string;
  specialExpectationsOrRequests?: string; // optional in case it's not always provided
  educationalQualification?: string;
};
type Contact = {
  brideName: string;
  guardianPhoneNumber: string;
  relationWithGuardian: string;
  emailUsedForRegistration: string;
};
type PersonalInformation = {
  usualOutdoorClothing: string; // e.g. "Abaya and Niqab", "Hijab only", etc.
  beardAccordingToSunnah?: 'yes' | 'no'; // For male candidates
  clothingAboveAnkles?: 'yes' | 'no'; // For male candidates
  wearsNiqab?: 'yes' | 'no'; // For female candidates
  wearingNiqabSince: string; // e.g. "2015", "Since childhood", or "Not applicable"
  dailyPrayerRoutine: 'yes' | 'no';
  skippedPrayersPerWeek: string; // how many times Salah is missed per week
  followsMahramGuidelines: 'yes' | 'no'; // e.g. doesn't travel without mahram
  quranRecitationAbility: 'yes' | 'no';
  fiqhFollowed: string;
  mediaConsumptionHabits: string; // freeform or enum e.g. "No", "Sometimes", "Only Islamic content"
  mentalOrPhysicalDiseases: string;
  involvedInSpecialWork: string; // e.g. "Da'wah", "Teaching", "Volunteering"
  beliefsAboutShrine: string; // freeform opinion on mazar/dargah etc.
  islamicBooksRead: string; // comma-separated list of books
  islamicScholarsPreferred: string[]; // list of preferred scholars from predefined options
  hobbiesAndInterests: string; // freeform text about interests and preferences
  groomMobileNumber: string; // format: +8801XXXXXXXXX
  previousRelationship: string; // description of any past relationships
};

type MarriageRelatedInformation = {
  // Common fields for both male and female
  doParentsAgree: 'yes' | 'no';
  reasonForMarriage: string;

  // Male-specific fields
  canKeepWifeInVeil?: string;
  allowWifeToStudy?: 'yes' | 'no';
  allowWifeToWork?: 'yes' | 'no';
  residenceAfterMarriage?: string;
  expectGiftsFromBrideFamily?: string;

  // Female-specific fields
  willingToWorkAfterMarriage?: string;
  continueStudiesAfterMarriage?: string;
};

type EducationSystem = 'general' | 'alia' | 'quami';

type HighestQualification =
  | 'A' // HSC / Primary Islamic / etc
  | 'B' // SSC / Ibtidaiyah / etc
  | 'C' // Below SSC / Mutawassitah
  | 'D' // Diploma / Sanabia Uliya
  | 'E' // Diploma (Ongoing) / Fazilat
  | 'F' // Undergraduate / Takmil
  | 'G' // Graduate / Takhassus
  | 'H' // Postgraduate
  | 'I'; // Doctorate

type ResultOption = string; // "A+", "B", "Mumtaz", etc. — you can refine later if you want

type GroupOption = string; // "science", "commerce", "arts", "vocational", etc.

interface EducationalQualifications {
  education_system: EducationSystem;
  additional_qualifications: string;
  highest_qualification: HighestQualification;

  // SSC / Dakhil / Equivalent
  passing_year_ssc?: number;
  group_ssc?: GroupOption;
  result_ssc?: ResultOption;

  // Post SSC Medium
  post_ssc_medium?: 'hsc' | 'diploma';

  // HSC / Alim / Equivalent
  passing_year_hsc?: number;
  group_hsc?: GroupOption;
  result_hsc?: ResultOption;

  // Diploma
  diploma_subject?: string;
  diploma_institution?: string;
  diploma_passing_year?: number;
  diploma_current_study_year?: string;

  // Graduation
  graduation_subject?: string;
  graduation_institution?: string;
  graduation_year?: number;
  graduation_current_study_year?: string; // Only if ongoing

  // Post Graduation
  postgraduation_subject?: string;
  postgraduation_institution?: string;
  postgraduation_year?: number;

  // Doctorate
  doctorate_subject?: string;
  doctorate_institution?: string;
  doctorate_year?: number;

  // Below SSC (for C level)
  below_ssc?: string;

  // Quami / Madrasha
  madrasha_name?: string;
  result?: ResultOption;
  passing_year?: number;

  // Takmil & Takhassus (only for level G)
  takmil_madrasha_name?: string;
  takmil_result?: ResultOption;
  takmil_passing_year?: number;

  takhassus_madrasha_name?: string;
  takhassus_result?: ResultOption;
  takhassus_passing_year?: number;
}

export type IBiodata = {
  bioDataNo: string;
  view: number;
  isLived: boolean; // default: false
  completedSteps: number[]; // e.g. [1,2,3,4,5,6]
  isBlocked: boolean;
  isDeleted: boolean;
  profileStatus?: ProfileStatus;
  education?: EducationalQualifications;
  general_information?: IGeneralInformation;
  marriage_related_information?: MarriageRelatedInformation;
  address?: IAddress;
  personal_information?: PersonalInformation;
  family_information?: FamilyInformation;
  occupation?: Occupation;
  expected_partner?: ExpectedPartner;
  agreement?: Agreement;
  contact?: Contact;
  
};

export type BioDataModel = Model<IBiodata, Record<string, unknown>>;

export type IBioDataFilters = {
  searchTerm?: string;
  bioDataNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
  minAge?: number;
  maxAge?: number;
  minHeight?: number;
  maxHeight?: number;
};
