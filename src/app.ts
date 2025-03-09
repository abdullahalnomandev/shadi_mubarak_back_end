import express, { Application, Request, Response } from 'express'
import cors from 'cors';
import { UserRouter } from './app/modules/users/users.route';

const app: Application = express()

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Application routes
app.use('/api/v1/users',UserRouter);

//Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Working!')
})

export default app
