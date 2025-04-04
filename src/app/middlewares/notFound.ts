import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (req:Request,res:Response,next:NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        status:"fail",
        message: "Not found",
        errorMessages :[
            {
                path: req.originalUrl,
                message:"Api not found"
            }
        ]
    })
    next();
 }

export default notFound;