import express, { Application } from 'express'
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routers from './app/routes';
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound';

const app: Application = express()

app.use(cors())
app.use(cookieParser())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application root routes
app.use('/api/v1',routers);

 // global error handler
 app.use(globalErrorHandler)

 // handle not found
 app.use(notFound);


export default app
