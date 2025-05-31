import { Schema, model } from "mongoose";
import { IProfileVisit } from "./profile-visite.interface";

const ProfileVisitSchema = new Schema<IProfileVisit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },         
    profileId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fingerprint: { type: String },                                     
    ipAddress: { type: String },                                           
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
  }
);

export const ProfileVisit = model<IProfileVisit>("ProfileVisit", ProfileVisitSchema);

