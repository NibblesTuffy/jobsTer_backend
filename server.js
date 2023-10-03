import express from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import jobRouter from './routes/jobRoutes.js'
import authRouter from './routes/authRoutes.js'
import { authMiddleware } from './middleware/authMiddleware.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
dotenv.config()

const app = express()

if (process.env.NODE_ENVIRONMENT === 'development') {
  app.use(morgan('dev'))
}
const corsOptions = {
  credentials: true,
  origin: 'https://jobster-frontend.onrender.com',
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
//all the job info should be linked with a user so auth should be done
app.use('/api/v1/toolkit/jobs', authMiddleware, jobRouter)
app.use('/api/v1/toolkit/auth', authRouter)
// app.use('/api/v1/toolkit/user', userRouter)
//for validation layer test... would return an error message array
// app.post('/test', validationJobInput, (req, resp) => {
//   resp.json({ result: req.body })
// })
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5100

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    app.listen(port, 'localhost',() => {
      console.log(`server running on port ${port}..`)
    })
  } catch (error) {
    console.log(`start error ${error}`)
  }
}

connectDB()
