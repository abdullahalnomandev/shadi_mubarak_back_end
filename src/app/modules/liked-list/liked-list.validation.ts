import { z } from 'zod';

const userLikedListSchema = z.object({
  body: z.object({
    likedPersonId: z.string().trim(), 
  })
});


export const UserLikedListValidation = {
  userLikedListSchema,
};
