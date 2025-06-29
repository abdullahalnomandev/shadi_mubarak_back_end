import { z } from 'zod';

const loginZodSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      password: z.string().optional(),
      token: z.string().optional(),
    })
    .refine(
      data =>
        (data.email && data.password && !data.token) || // Manual login
        (!data.email && !data.password && data.token), // Google login
      {
        message: 'Provide either email & password or token only.',
        path: ['body'],
      }
    ),
});

const registerZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    phone: z.string({
      required_error: 'Phone number is required',
    }),
  }),
});

const verifiZodSchema = z.object({
  body: z.object({
    verificationToken: z.string({
      required_error: 'verificationToken is required',
    }),
  }),
});
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});
const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
});

const resetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
});

const forgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
  }),
});

export const AuthValidationZodSchema = {
  loginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema,
  registerZodSchema,
  forgetPasswordZodSchema,
  verifiZodSchema,
};
