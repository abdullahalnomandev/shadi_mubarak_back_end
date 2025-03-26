import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routers from './app/routes';
import httpStatus from 'http-status';

const app: Application = express()

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application root routes
app.use('/api/v1',routers);


//Testing
// app.get('/',  (req: Request, res: Response,next:NextFunction) => {
//    throw new Error("Not implemented")
// })

 // global error handler
 app.use(globalErrorHandler)

 // handle not found
 app.use((req:Request,res:Response,next:NextFunction) => {
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
 })

export default app
