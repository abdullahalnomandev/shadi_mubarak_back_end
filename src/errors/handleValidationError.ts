import mongoose from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";
import { IGenericErrorResponse } from "../interfaces/common";

const handleValidationError = (err: mongoose.Error.ValidationError):IGenericErrorResponse => {

    const statusCode = 400;
    const errors: IGenericErrorMessage[] = Object.values(err.errors).map((el:mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
        return {
            path: el?.path,
            message: el?.message,
        };
    });

    return {
        statusCode,
        message:"Validation Error",
        errorMessages: errors
    }
    
};

export default handleValidationError;
