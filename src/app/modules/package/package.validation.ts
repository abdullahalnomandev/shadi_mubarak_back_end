import { z } from 'zod';

const createPackageZodSchema = z.object({
  body: z.object({
      name: z.enum(['basic', 'standard', 'popular'], {
        required_error: 'Package name is required and must be one of: basic, standard, popular',
      }),
      connections: z.number({
        required_error: 'Number of connections is required',
      }),
      price: z.number({
        required_error: 'Price is required',
      }),
      disCountPercentage: z.number().optional(),
      description: z.string({
        required_error: 'Description is required',
      }),
      discountCondition: z.string().optional(),
      isSelected: z.boolean().optional(),
  }),
});

const updatePackageZodSchema = z.object({
  body: z.object({
      name: z.enum(['basic', 'standard', 'popular']).optional(),
      connections: z.number().optional(),
      price: z.number().optional(),
      disCountPercentage: z.number().optional(),
      description: z.string().optional(),
      discountCondition: z.string().optional(),
      isSelected: z.boolean().optional(),
  }),
}).refine((data) => data.body, { message: 'Invalid package data' });

export const PackageValidationZodSchema = {
  createPackageZodSchema,
  updatePackageZodSchema,
};
