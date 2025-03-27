import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    user: z.object({
      role: z.string({
        required_error: "Role is required",
      }),
      password: z.string({
        required_error: "Password is required",
      }),
      email: z.string({
        required_error: "Email is required",
      }),
    }),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    user: z.object({
      role: z.string({
        required_error: "Role is required",
      }).optional(),
      password: z.string({
        required_error: "Password is required",
      }).optional(),
      email: z.string({
        required_error: "Email is required",
      }).optional(),
    }),
  }),
}).refine((data) => (data.body.user) , {message:"Invalid user"});



export const UserValidationZodSchema = {
    createUserZodSchema,
    updateUserZodSchema
}
