import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body, query, params, cookies } = req;
      await schema.parseAsync({
        body,
        query,
        params,
        cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
