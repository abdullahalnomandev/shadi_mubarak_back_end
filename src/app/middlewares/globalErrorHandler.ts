/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../../config";
import { IGenericErrorMessage } from "../../interfaces/error";
import ApiError from "../../errors/ApiError";
import handleValidationError from "../../errors/handleValidationError";
import { errorLogger } from "../../shared/logger";
import { ZodError } from "zod";
import handleZodError from "../../errors/handleZodError";
import handleCastError from "../../errors/handleCastError";

const globalErrorHandler:ErrorRequestHandler = (error ,req:Request, res:Response, next:NextFunction) => {

    config.env === "development" ?
      console.log("🔥 globalErrorHandler ~ " , error) : errorLogger.error("🔥 globalErrorHandler ~ " , error)

    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages: IGenericErrorMessage[] = [];

    if(error?.name === "ValidationError"){
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    }
    else if( error instanceof ZodError){
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorMessages = simplifiedError.errorMessages
    }
    else if (error?.name === 'CastError') {
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof ApiError){
        statusCode = error?.statusCode;
        message = error?.message;
        errorMessages = error?.message ?
        [
            {
                path:'',
                message: error?.message
            }
        ] : [];
    }
    else if (error instanceof Error){
        message = error?.message
        errorMessages = error?.message ?
        [
            {
                path:'',
                message: error?.message
            }
        ] : [];
    }

    res.status(statusCode).json({
        status:"fail",
        message,
        errorMessages,
        stack : config.env !== "production" ? error?.stack : undefined
    })

  }

  export default globalErrorHandler;