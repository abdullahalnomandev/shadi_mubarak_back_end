import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const auth = (...requireRoles:string[]) => async (req:Request, res:Response, next:NextFunction) => {
    
    let verifiedUser = null;
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : null;
            
        if(!token) throw new ApiError(httpStatus.UNAUTHORIZED,"Your are not authorized");
        // verify token
        verifiedUser = jwtHelpers.verifiedToken(token,config.jwt.secret as Secret);
        req.user = verifiedUser ;

        // guard
        if(requireRoles.length && !requireRoles.includes(verifiedUser.role)){
            throw new ApiError(httpStatus.FORBIDDEN,"Forbidden")
        }
        next();
    } catch (error) {
        next(error);
    }
}

export default auth;