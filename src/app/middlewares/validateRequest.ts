import { Request , Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => async (req:Request, res:Response, next:NextFunction):Promise<void> => {
  try {
    const {body,query,params,cookies} = req;
    await schema.parseAsync({
        body,
        query,
        params,
        cookies
    });
    return next();
  } catch (error) {
    next(error);
  }
};

export default validateRequest;
