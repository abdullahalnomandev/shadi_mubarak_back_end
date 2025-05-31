import { Types } from "mongoose";

export type IProfileVisit = {
  profileId: Types.ObjectId;     // The profile being visited
  userId?: Types.ObjectId;       // Optional: viewer's user ID
  fingerprint?: string;          // Optional: anonymous device ID
  ipAddress?: string;            // Optional: IP address
};
