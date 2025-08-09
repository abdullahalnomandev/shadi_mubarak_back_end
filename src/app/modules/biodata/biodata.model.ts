/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { BioDataModel, IBiodata } from './biodata.interface';

const BioDataSchema = new Schema<IBiodata, BioDataModel>(
  {
    bioDataNo: { type: String, unique: true, required: true },
    isLived: { type: Boolean, required: true, default: false },
    view: { type: Number, default: 0 },
    completedSteps: { type: [Number], default: [] },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    profileStatus: {
      type: String,
      enum: [
        'not_started',
        'incomplete',
        'not_submitted',
        'pending',
        'rejected',
        'verified',
      ],
      default: 'not_started',
    },

    education: {
      type: {
        // System and Qualification
        education_system: { type: String },
        additional_qualifications: { type: String },
        highest_qualification: { type: String },

        // SSC / Dakhil / Equivalent
        passing_year_ssc: { type: Number },
        group_ssc: { type: String },
        result_ssc: { type: String },

        // Post SSC Medium
        post_ssc_medium: { type: String }, // "hsc" or "diploma"

        // HSC / Alim / Equivalent
        passing_year_hsc: { type: Number },
        group_hsc: { type: String },
        result_hsc: { type: String },

        // Diploma
        diploma_subject: { type: String },
        diploma_institution: { type: String },
        diploma_passing_year: { type: Number },
        diploma_current_study_year: { type: String }, // Only if ongoing

        // Graduation
        graduation_subject: { type: String },
        graduation_institution: { type: String },
        graduation_year: { type: Number },
        graduation_current_study_year: { type: String }, // Only if ongoing

        // Post Graduation
        postgraduation_subject: { type: String },
        postgraduation_institution: { type: String },
        postgraduation_year: { type: Number },

        // Doctorate
        doctorate_subject: { type: String },
        doctorate_institution: { type: String },
        doctorate_year: { type: Number },

        // Below SSC (for C level)
        below_ssc: { type: String }, // class_3 to class_10

        // Quami / Madrasha
        madrasha_name: { type: String },
        result: { type: String },
        passing_year: { type: Number },

        // Takmil & Takhassus (only for level G)
        takmil_madrasha_name: { type: String },
        takmil_result: { type: String },
        takmil_passing_year: { type: Number },

        takhassus_madrasha_name: { type: String },
        takhassus_result: { type: String },
        takhassus_passing_year: { type: Number },
      },
      required: false,
    },

    general_information: {
      type: {
        biodataType: String,
        dateOfBirth: Date,
        height: String,
        weight: String,
        skin: String,
        nationality: String,
        maritalStatus: String,
      },
      required: false,
    },
    marriage_related_information: {
      type: {
        doParentsAgree: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
        reasonForMarriage: {
          type: String,
          required: true,
        },
        // Male-specific fields
        canKeepWifeInVeil: {
          type: String,
        },
        allowWifeToStudy: {
          type: String,
          enum: ['yes', 'no'],
        },
        allowWifeToWork: {
          type: String,
          enum: ['yes', 'no'],
        },
        residenceAfterMarriage: {
          type: String,
        },
        expectGiftsFromBrideFamily: {
          type: String,
        },
        // Female-specific fields
        willingToWorkAfterMarriage: {
          type: String,
        },
        continueStudiesAfterMarriage: {
          type: String,
        },
      },
      required: false,
    },
    address: {
      type: {
        present_address: {
          type: {
            full: { type: String },
            area: { type: String },
          },
        },
        permanent_address: {
          type: {
            full: { type: String },
            area: { type: String },
          },
        },
        grow_up: { type: String },
      },
      required: false,
    },
    personal_information: {
      type: {
        usualOutdoorClothing: { type: String, required: true },
        beardAccordingToSunnah: {
          type: String,
          enum: ['yes', 'no'],
        },
        clothingAboveAnkles: {
          type: String,
          enum: ['yes', 'no'],
        },
        wearsNiqab: {
          type: String,
          enum: ['yes', 'no'],
        },
        wearingNiqabSince: { type: String },
        dailyPrayerRoutine: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
        skippedPrayersPerWeek: { type: String },
        followsMahramGuidelines: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
        quranRecitationAbility: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
        fiqhFollowed: { type: String },
        mediaConsumptionHabits: { type: String },
        mentalOrPhysicalDiseases: { type: String },
        involvedInSpecialWork: { type: String },
        beliefsAboutShrine: { type: String, required: true },
        islamicBooksRead: { type: String },
        islamicScholarsPreferred: [String],
        hobbiesAndInterests: { type: String },
        groomMobileNumber: { type: String },
        previousRelationship: { type: String },
      },
      required: false,
    },

    family_information: {
      type: {
        isParentAlive: String,
        fatherProfession: String,
        isMotherAlive: String,
        motherProfession: String,
        howManyBrothers: {
          type: String,
        },
        brothersInformation: String,
        howManySisters: {
          type: String,
        },
        sistersInformation: String,
        professionOfUncles: String,
        familyFinancialStatus: {
          type: String,
          enum: [
            'upper_class',
            'upper_middle_class',
            'middle_class',
            'lower_class',
            'lower_middle_class',
          ],
        },
        descriptionOfFinancialCondition: String,
        familyReligiousCondition: String,
      },
      required: false,
    },

    occupation: {
      type: {
        occupation: { type: String, required: true },
        monthlyIncome: String,
        descriptionOfProfession: { type: String, required: true },
      },
      required: false,
    },

    expected_partner: {
      type: {
        age: {
          type: String,
          required: true,
        },
        complexion: {
          type: [String],
          enum: ['brown', 'fair', 'dark', 'bright_brown', 'bright_fair'],
        },
        height: String,
        educationalQualification: String,
        district: String,
        maritalStatus: {
          type: [String],
          enum: ['never_married', 'widowed', 'divorced'],
        },
        profession: String,
        financialCondition: { type: String, required: true },
        specialExpectationsOrRequests: String,
      },
      required: false,
    },

    agreement: {
      type: {
        parentsAwareOfRegistration: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
        confirmTruthOfProvidedInformation: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
        agreeToLegalResponsibilityForFalseInfo: {
          type: String,
          enum: ['yes', 'no'],
          required: true,
        },
      },
      required: false,
    },

    contact: {
      type: {
        brideName: { type: String, required: true },
        guardianPhoneNumber: { type: String, required: true },
        relationWithGuardian: { type: String, required: true },
        emailUsedForRegistration: { type: String, required: true },
      },
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const BioData = model<IBiodata, BioDataModel>('BioData', BioDataSchema);

// Diploma Running
// Diploma
// Undergraduate
// Graduate
// Post Graduate
// Doctorate

// const ssc_info = {
//   ssc_passing_year: true,
//   ssc_group: ["science","commerce","arts","other"],
//   ssc_result: ['A+', 'A-', 'A', 'B', 'C','D'],
// }
// const hsc_info = {
//   hsc_passing_year: true,
//   hsc_group: ['Science', 'Commerce', 'Arts',"Other"],
//   hsc_result: ['A+', 'A-', 'A', 'B', 'C','D'],
// }

// const diploma_info = {
//   diploma_subject: true,
//   name_of_institution: true,
//   passing_year: true,
// }

// const graduation_info = {
//   graduate_study_subject: true,
//   name_of_institution: true,
//   studying_year: true,
// }

// const educationConfig = {
//   general: {
//     highest_educational_qualification: {
//       below_ssc: {
//         class: ['class_5', 'class_6', 'class_7', 'class_8', 'class_9', 'class_10', 'class_11', 'class_12'],
//       },
//       ssc: {
//         ...ssc_info,
//         yearReading:["HSC first year","HSC second year","HSC result not published yet","I'm not studying any more"]
//       },
//       hsc: {
//         ...ssc_info,
//         ...hsc_info
//       },
//       diploma_running: {
//         ...ssc_info,
//         ...diploma_info
//       },
//       diploma: {
//         ...ssc_info,
//         ...diploma_info
//       },
//       undergraduate: {
//        ssc_info,
//         hsc:{
//           ...hsc_info,
//         },
//         diploma: {
//           ...diploma_info,
//         },
//         ...graduation_info
//       },
//       graduate: {
//         ...ssc_info,
//         hsc:{
//          ...hsc_info,
//         },
//         diploma: {
//          ...diploma_info,
//         },
//         ...graduation_info
//       },
//       post_graduate: {
//         ...ssc_info,
//         hsc:{
//           ...hsc_info,
//         },
//         diploma: {
//           ...diploma_info
//         },
//         ...graduation_info,

//         post_graduate_study_subject: true,
//         name_of_post_graduate_institution: true,
//         passing_year_of_post_graduation: true,
//       },
//       doctorate: {
//         ...ssc_info,
//         hsc:{
//           ...hsc_info,
//         },
//         diploma: {
//           ...diploma_info
//         },
//         ...graduation_info,

//         post_graduate_study_subject: true,
//         name_of_post_graduate_institution: true,
//         passing_year_of_post_graduation: true,

//         doctorate_study_subject: true,
//         name_of_doctorate_institution: true,
//         passing_year_of_doctorate: true,
//       }
//     }
//   },
//   get alia() {
//     return this.general
//    },
//   qawmi: {
//     highest_educational_qualification: {
//       primary_islamic_education: true,
//       ibtidaiyah:{
//         name_of_ibtidaiyah_madrasha: true,
//         ibtidaiyah_result :["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year: true
//       },
//       mutawassitah:{
//         name_of_mutawassitah: true,
//         mutawassitah_result :["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year: true
//       },
//       sanabia:{
//         name_of_sanabia: true,
//         sanabia_result :["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year: true
//       },
//       fazilat:{
//         name_of_fazilat:true,
//         fazilat_result : ["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year: true
//       },
//       takmil:{
//         name_of_takmil:true,
//         takmil_result : ["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year: true
//       },
//       takhassus:{
//         name_of_takmil:true,
//         takmil_result : ["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year: true,

//         name_of_takhassus:true,
//         takhassus_result : ["Jayyid Jiddan","Mumtaz","Jayyid Jiddan","Jayyid","Makbul"],
//         passing_year_of_takhssus: true
//       }
//     }
//   },

// }

// // your reusable blocks
// const ssc_info = {
//   ssc_passing_year:   { type: "number", label: "SSC Passing Year", required: true },
//   ssc_group:          { type: "select", label: "Group", options: ["Science","Commerce","Arts","Other"], required: true },
//   ssc_result:         { type: "select", label: "Result", options: ["A+","A-","A","B","C","D"], required: true }
// };
// const hsc_info = {
//   hsc_passing_year:   { type: "number", label: "HSC Passing Year", required: true },
//   hsc_group:          { type: "select", label: "Group", options: ["Science","Commerce","Arts","Other"], required: true },
//   hsc_result:         { type: "select", label: "Result", options: ["A+","A-","A","B","C","D"], required: true }
// };
// const diploma_info = {
//   diploma_subject:    { type: "text",   label: "Diploma Subject", required: true },
//   name_of_institution:{ type: "text",   label: "Institution Name", required: true },
//   passing_year:       { type: "number", label: "Passing Year", required: true }
// };
// const graduation_info = {
//   graduate_study_subject:   { type: "text",   label: "Subject", required: true },
//   name_of_institution:      { type: "text",   label: "Institution Name", required: true },
//   studying_year:            { type: "number", label: "Studying Year", required: true }
// };

// final config
// your reusable blocks
// Shared field definitions
const SSC_FIELDS = [
  {
    name: 'ssc_passing_year',
    type: 'number',
    label: 'SSC Passing Year',
    required: true,
  },
  {
    name: 'ssc_group',
    type: 'select',
    label: 'Group',
    options: ['Science', 'Commerce', 'Arts', 'Other'],
    required: true,
  },
  {
    name: 'ssc_result',
    type: 'select',
    label: 'Result',
    options: ['A+', 'A', 'A-', 'B', 'C', 'D'],
    required: true,
  },
];

const HSC_FIELDS = [
  {
    name: 'hsc_passing_year',
    type: 'number',
    label: 'HSC Passing Year',
    required: true,
  },
  {
    name: 'hsc_group',
    type: 'select',
    label: 'Group',
    options: ['Science', 'Commerce', 'Arts', 'Other'],
    required: true,
  },
  {
    name: 'hsc_result',
    type: 'select',
    label: 'Result',
    options: ['A+', 'A', 'A-', 'B', 'C', 'D'],
    required: true,
  },
];

const DIPLOMA_FIELDS = [
  {
    name: 'diploma_subject',
    type: 'text',
    label: 'Diploma Subject',
    required: true,
  },
  {
    name: 'diploma_institution',
    type: 'text',
    label: 'Institution Name',
    required: true,
  },
  {
    name: 'diploma_passing_year',
    type: 'number',
    label: 'Diploma Passing Year',
    required: true,
  },
];

const GRADUATION_FIELDS = [
  {
    name: 'graduation_subject',
    type: 'text',
    label: 'Subject',
    required: true,
  },
  {
    name: 'graduation_institution',
    type: 'text',
    label: 'Institution Name',
    required: true,
  },
  {
    name: 'graduation_year',
    type: 'number',
    label: 'Year of Study',
    required: true,
  },
];

const POSTGRAD_FIELDS = [
  { name: 'pg_subject', type: 'text', label: 'PG Subject', required: true },
  {
    name: 'pg_institution',
    type: 'text',
    label: 'PG Institution',
    required: true,
  },
  {
    name: 'pg_passing_year',
    type: 'number',
    label: 'PG Passing Year',
    required: true,
  },
];

const DOCTORATE_FIELDS = [
  {
    name: 'doctorate_subject',
    type: 'text',
    label: 'Doctorate Subject',
    required: true,
  },
  {
    name: 'doctorate_institution',
    type: 'text',
    label: 'Doctorate Institution',
    required: true,
  },
  {
    name: 'doctorate_passing_year',
    type: 'number',
    label: 'Doctorate Passing Year',
    required: true,
  },
];

// Final configuration
export const educationConfig = {
  general: {
    label: 'General Education',
    levels: [
      {
        key: 'below_ssc',
        label: 'Below SSC',
        fields: [
          {
            name: 'class',
            type: 'select',
            label: 'Class',
            options: ['5', '6', '7', '8', '9', '10', '11', '12'],
            required: true,
          },
        ],
      },
      {
        key: 'ssc',
        label: 'SSC',
        fields: SSC_FIELDS,
      },
      {
        key: 'hsc',
        label: 'HSC',
        fields: HSC_FIELDS,
      },
      {
        key: 'diploma_running',
        label: 'Diploma (Running)',
        fields: [...SSC_FIELDS, ...DIPLOMA_FIELDS],
      },
      {
        key: 'diploma_completed',
        label: 'Diploma (Completed)',
        fields: [...SSC_FIELDS, ...DIPLOMA_FIELDS],
      },
      {
        key: 'undergraduate',
        label: 'Undergraduate',
        fields: [
          {
            name: 'undergraduate_path',
            type: 'select',
            label: 'Entry Path',
            options: ['HSC → Graduation', 'Diploma → Graduation'],
            required: true,
          },
        ],
        conditional: {
          'HSC → Graduation': [...HSC_FIELDS, ...GRADUATION_FIELDS],
          'Diploma → Graduation': [
            ...SSC_FIELDS, // you still need SSC baseline
            ...DIPLOMA_FIELDS,
            ...GRADUATION_FIELDS,
          ],
        },
      },
      {
        key: 'graduate',
        label: 'Graduate',
        fields: [
          {
            name: 'graduate_path',
            type: 'select',
            label: 'Entry Path',
            options: ['HSC → Graduation', 'Diploma → Graduation'],
            required: true,
          },
        ],
        conditional: {
          'HSC → Graduation': [
            ...SSC_FIELDS,
            ...HSC_FIELDS,
            ...GRADUATION_FIELDS,
          ],
          'Diploma → Graduation': [
            ...SSC_FIELDS,
            ...DIPLOMA_FIELDS,
            ...GRADUATION_FIELDS,
          ],
        },
      },
      {
        key: 'post_graduate',
        label: 'Post‑Graduate',
        fields: [
          ...SSC_FIELDS,
          ...HSC_FIELDS,
          ...DIPLOMA_FIELDS,
          ...GRADUATION_FIELDS,
          ...POSTGRAD_FIELDS,
        ],
      },
      {
        key: 'doctorate',
        label: 'Doctorate',
        fields: [
          ...SSC_FIELDS,
          ...HSC_FIELDS,
          ...DIPLOMA_FIELDS,
          ...GRADUATION_FIELDS,
          ...POSTGRAD_FIELDS,
          ...DOCTORATE_FIELDS,
        ],
      },
    ],
  },

  alia: {
    label: 'Alia Education',
    levels: [
      {
        key: 'dakhil',
        label: 'Dakhil',
        fields: [
          {
            name: 'madrasha_name',
            type: 'text',
            label: 'Madrasha Name',
            required: true,
          },
          {
            name: 'dakhil_passing_year',
            type: 'number',
            label: 'Passing Year',
            required: true,
          },
          {
            name: 'dakhil_result',
            type: 'select',
            label: 'Result',
            options: ['Jayyid', 'Mumtaz', 'Makbul'],
            required: true,
          },
        ],
      },
    ],
  },

  qawmi: {
    label: 'Qawmi Education',
    levels: [
      {
        key: 'ibtidaiyah',
        label: 'Ibtidaiyah',
        fields: [
          {
            name: 'madrasha_name',
            type: 'text',
            label: 'Madrasha Name',
            required: true,
          },
          {
            name: 'ibtidaiyah_passing_year',
            type: 'number',
            label: 'Passing Year',
            required: true,
          },
          {
            name: 'ibtidaiyah_result',
            type: 'select',
            label: 'Result',
            options: ['Jayyid', 'Mumtaz', 'Makbul'],
            required: true,
          },
        ],
      },
      // add mutawassitah, sanabia, fazilat… as needed
    ],
  },
};
