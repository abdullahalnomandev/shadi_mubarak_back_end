import { ProfileVisit } from "@/models/profile-visit.model";

interface CreateProfileVisitInput {
  profileId: string;
  userId?: string;         // Optional: logged-in user
  fingerprint?: string;    // Optional: for anonymous tracking
  ipAddress?: string;      // Optional: for logging/debug
}

export const createProfileVisit = async ({
  profileId,
  userId,
  fingerprint,
  ipAddress,
}: CreateProfileVisitInput) => {
  if (!profileId || (!userId && !fingerprint)) return;

  // Avoid duplicate visit within 24 hours
  const existingVisit = await ProfileVisit.findOne({
    profileId,
    $or: [
      userId ? { userId } : {},
      fingerprint ? { fingerprint } : {},
    ],
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
    },
  });

  if (existingVisit) return;

  await ProfileVisit.create({
    profileId,
    userId,
    fingerprint,
    ipAddress,
  });
};
