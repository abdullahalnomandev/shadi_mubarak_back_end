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
    profileStatus: {
      type: String,
      enum: ['not_started','incomplete','not_submitted','pending', 'rejected', 'verified'],
      default: 'not_started',
    },

    educationalQualifications: {
      type: {
        // SSC
        ssc_passing_year: {
          type: Number
        },
        ssc_group: {
          type: String,
          enum: ['Science', 'Commerce', 'Arts', 'Other']
        },
        ssc_result: {
          type: String,
          enum: ['A+', 'A', 'A-', 'B', 'C', 'D']
        },
    
        // HSC
        hsc_passing_year: {
          type: Number
        },
        hsc_group: {
          type: String,
          enum: ['Science', 'Commerce', 'Arts', 'Other']
        },
        hsc_result: {
          type: String,
          enum: ['A+', 'A', 'A-', 'B', 'C', 'D']
        },
    
        // Diploma
        diploma_subject: {
          type: String
        },
        diploma_institution: {
          type: String
        },
        diploma_passing_year: {
          type: Number
        },
    
        // Graduation
        graduation_subject: {
          type: String
        },
        graduation_institution: {
          type: String
        },
        graduation_year: {
          type: String
        }
      },
      required: false
    },    

    generalInformation: {
      type: {
        gender: { type: String, required: true },
        dateOfBirth: { type: String, required: true },
        height: { type: String, required: true },
        weight: { type: Number, required: true },
        skin: { type: String, required: true },
        nationality: { type: String, required: true },
        maritalStatus: {
          type: String,
          required: true,
        },
      },
      required: false,
    },

    marriageRelatedInformation: {
      type: {
        doYouAgreeWithParents: String,
        willingToWorkAfterMarriage: String,
        wantToContinueStudyAfterMarriage: String,
        whyAreYouGettingMarried: String
      },
      required: false,
    },
    address: {
      type: {
        present_address: {
          type: {
            full: { type: String },
            area: { type: String }
          },
        },
        permanent_address: {
          type: {
            full: { type: String },
            area: { type: String }
          },
        },
        grow_up: { type: String },
      },
      required: false,
    },
    personalInformation: {
      type: {
        clothingOutside: { type: String},
        wearingNiqabSince: { type: String },
        praysFiveTimes: { type: Boolean },
        missedPrayersPerWeek: { type: Number },
        compliesWithMahram: { type: Boolean },
        canReciteQuranCorrectly: { type: Boolean },
        fiqhFollowed: { type: String},
        watchesOrListensToMedia: { type: String },
        mentalOrPhysicalDiseases: String,
        involvedInSpecialWork: String,
        beliefsAboutShrine: { type: String, required: true },
        islamicBooksRead: [String],
        islamicScholarsPreferred: [String],
        hobbiesAndInterests: [String],
        mobileNumber: { type: String, required: true },
      },
      required: false,
    },

    familyInformation: {
      type: {
        isParentAlive: String,
        fatherProfession: String,
        isMotherAlive: String,
        motherProfession: String,
        howManyBrothers: {
          type: Number,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        brothersInformation: String,
        howManySisters: {
          type: Number,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        sistersInformation: String,
        professionOfUncles: String,
        familyFinancialStatus: {
          type: String,
          enum: ['upper_class','upper_middle_class', 'middle_class', 'lower_class', 'lower_middle_class' ],
        },
        descriptionOfFinancialCondition: String,
        familyReligiousCondition: String,
      },
      required: false,
    },

    occupation: {
      type: {
        occupation: { type: String, required: true },
        monthlyIncome: Number,
        descriptionOfProfession: { type: String, required: true },
      },
      required: false,
    },

    expectedPartner: {
      type: {
        age: String,
        complexion:{
          type:  [String],
          enum: ['brown','fair','dark', 'bright_brown',"bright_fair"],
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
        parentsAwareOfRegistration: { type: Boolean, required: true },
        confirmTruthOfProvidedInformation: { type: Boolean, required: true },
        agreeToLegalResponsibilityForFalseInfo: { type: Boolean, required: true },
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
  { name: "ssc_passing_year", type: "number", label: "SSC Passing Year", required: true },
  { name: "ssc_group",        type: "select", label: "Group",           options: ["Science", "Commerce", "Arts", "Other"], required: true },
  { name: "ssc_result",       type: "select", label: "Result",          options: ["A+", "A", "A-", "B", "C", "D"],     required: true },
];

const HSC_FIELDS = [
  { name: "hsc_passing_year", type: "number", label: "HSC Passing Year", required: true },
  { name: "hsc_group",        type: "select", label: "Group",            options: ["Science", "Commerce", "Arts", "Other"], required: true },
  { name: "hsc_result",       type: "select", label: "Result",           options: ["A+", "A", "A-", "B", "C", "D"],     required: true },
];

const DIPLOMA_FIELDS = [
  { name: "diploma_subject",         type: "text",   label: "Diploma Subject",     required: true },
  { name: "diploma_institution",     type: "text",   label: "Institution Name",    required: true },
  { name: "diploma_passing_year",    type: "number", label: "Diploma Passing Year",required: true },
];

const GRADUATION_FIELDS = [
  { name: "graduation_subject",      type: "text",   label: "Subject",             required: true },
  { name: "graduation_institution",  type: "text",   label: "Institution Name",    required: true },
  { name: "graduation_year",         type: "number", label: "Year of Study",       required: true },
];

const POSTGRAD_FIELDS = [
  { name: "pg_subject",              type: "text",   label: "PG Subject",          required: true },
  { name: "pg_institution",          type: "text",   label: "PG Institution",      required: true },
  { name: "pg_passing_year",         type: "number", label: "PG Passing Year",     required: true },
];

const DOCTORATE_FIELDS = [
  { name: "doctorate_subject",       type: "text",   label: "Doctorate Subject",   required: true },
  { name: "doctorate_institution",   type: "text",   label: "Doctorate Institution",required: true },
  { name: "doctorate_passing_year",  type: "number", label: "Doctorate Passing Year",required: true },
];

// Final configuration
export const educationConfig = {
  general: {
    label: "General Education",
    levels: [
      {
        key: "below_ssc",
        label: "Below SSC",
        fields: [
          { name: "class", type: "select", label: "Class", options: ["5","6","7","8","9","10","11","12"], required: true }
        ]
      },
      {
        key: "ssc",
        label: "SSC",
        fields: SSC_FIELDS
      },
      {
        key: "hsc",
        label: "HSC",
        fields: HSC_FIELDS
      },
      {
        key: "diploma_running",
        label: "Diploma (Running)",
        fields: [...SSC_FIELDS, ...DIPLOMA_FIELDS]
      },
      {
        key: "diploma_completed",
        label: "Diploma (Completed)",
        fields: [...SSC_FIELDS, ...DIPLOMA_FIELDS]
      },
      {
        key: "undergraduate",
        label: "Undergraduate",
        fields: [
          {
            name: "undergraduate_path",
            type: "select",
            label: "Entry Path",
            options: ["HSC → Graduation", "Diploma → Graduation"],
            required: true
          }
        ],
        conditional: {
          "HSC → Graduation": [
            ...HSC_FIELDS,
            ...GRADUATION_FIELDS
          ],
          "Diploma → Graduation": [
            ...SSC_FIELDS,      // you still need SSC baseline
            ...DIPLOMA_FIELDS,
            ...GRADUATION_FIELDS
          ]
        }
      },
      {
        key: "graduate",
        label: "Graduate",
        fields: [
          {
            name: "graduate_path",
            type: "select",
            label: "Entry Path",
            options: ["HSC → Graduation", "Diploma → Graduation"],
            required: true
          }
        ],
        conditional: {
          "HSC → Graduation": [
            ...SSC_FIELDS,
            ...HSC_FIELDS,
            ...GRADUATION_FIELDS
          ],
          "Diploma → Graduation": [
            ...SSC_FIELDS,
            ...DIPLOMA_FIELDS,
            ...GRADUATION_FIELDS
          ]
        }
      },
      {
        key: "post_graduate",
        label: "Post‑Graduate",
        fields: [...SSC_FIELDS, ...HSC_FIELDS, ...DIPLOMA_FIELDS, ...GRADUATION_FIELDS, ...POSTGRAD_FIELDS]
      },
      {
        key: "doctorate",
        label: "Doctorate",
        fields: [...SSC_FIELDS, ...HSC_FIELDS, ...DIPLOMA_FIELDS, ...GRADUATION_FIELDS, ...POSTGRAD_FIELDS, ...DOCTORATE_FIELDS]
      }
    ]
  },

  alia: {
    label: "Alia Education",
    levels: [
      {
        key: "dakhil",
        label: "Dakhil",
        fields: [
          { name: "madrasha_name", type: "text",   label: "Madrasha Name", required: true },
          { name: "dakhil_passing_year", type: "number", label: "Passing Year", required: true },
          { name: "dakhil_result",       type: "select", label: "Result", options: ["Jayyid", "Mumtaz", "Makbul"], required: true }
        ]
      }
    ]
  },

  qawmi: {
    label: "Qawmi Education",
    levels: [
      {
        key: "ibtidaiyah",
        label: "Ibtidaiyah",
        fields: [
          { name: "madrasha_name", type: "text",   label: "Madrasha Name", required: true },
          { name: "ibtidaiyah_passing_year", type: "number", label: "Passing Year", required: true },
          { name: "ibtidaiyah_result", type: "select", label: "Result", options: ["Jayyid", "Mumtaz", "Makbul"], required: true }
        ]
      },
      // add mutawassitah, sanabia, fazilat… as needed
    ]
  }
};

