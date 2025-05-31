import { z } from 'zod';

const userLikedListSchema = z.object({
  body: z.object({
    likedPersonBioNo: z.string().trim(), 
  })
});


export const UserLikedListValidation = {
  userLikedListSchema,
};
