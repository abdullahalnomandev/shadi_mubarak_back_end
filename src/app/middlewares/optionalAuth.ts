import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';

const optionalAuth =
  () => async (req: Request, res: Response, next: NextFunction) => {
    let verifiedUser = null;
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.split(' ')[1] : null;

      // If no token is present, continue without verification
      if (!token) {
        req.user = null;
        return next();
      }

      // verify token if present
      verifiedUser = jwtHelpers.verifiedToken(
        token,
        config.jwt.secret as Secret
      );
      req.user = verifiedUser;

      next();
    } catch (error) {
      // If token verification fails, continue without user
      req.user = null;
      next();
    }
  };

export default optionalAuth;
