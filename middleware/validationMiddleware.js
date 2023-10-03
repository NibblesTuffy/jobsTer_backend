import { body, param, validationResult } from 'express-validator'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../error/customError.js'
import { JOB_LOCATION, JOB_STATUS, JOB_TYPE } from '../utils/constants.js'
import mongoose from 'mongoose'
import User from '../models/userModel.js'
import Job from '../models/jobModel.js'
export const validationErrors = (validateValues) => {
  return [
    validateValues,
    (req, resp, next) => {
      const result = validationResult(req)
      console.log(result)
      if (!result.isEmpty()) {
        const errorMessage = result.errors.map((error) => {
          return error.msg
        })
        if (errorMessage[0].startsWith('no job')) {
          throw new NotFoundError(errorMessage[0])
        }

        if (errorMessage[0].startsWith('Unauthorized')) {
          throw new UnauthorizedError(errorMessage[0])
        }
        console.log(errorMessage)
        throw new BadRequestError(errorMessage.join(','))
      }
      next()
    },
  ]
}

export const validationJobInput = validationErrors([
  body('company').notEmpty().withMessage('Please provide your company name'),
  body('position').notEmpty().withMessage('Please provide your position'),
  body('jobLocation')
    .isIn(Object.values(JOB_LOCATION))
    .withMessage('Please set correct job location'),
  body('jobType')
    .isIn(Object.values(JOB_TYPE))
    .withMessage('Please set correct job type'),
  body('status')
    .isIn(Object.values(JOB_STATUS))
    .withMessage('Please set correct job status'),
])

//check the input id:
// 1) is valid object id
// 2) is in database
export const validationIDParam = validationErrors([
  param('id').custom(async (value, { req }) => {
    const isValid = mongoose.Types.ObjectId.isValid(value)
    if (!isValid) {
      throw new BadRequestError('invalid mongodb id')
    }
    const findJob = await Job.findById(value)
    console.log(req)
    const isOwner = req.body.createdBy === findJob.createdBy.toString()
    if (!findJob) {
      throw new NotFoundError(`no job with id ${value}`)
    }
    if (!isOwner) {
      throw new UnauthorizedError('Unauthorized Error')
    }
  }),
])
//check the input user info(register)
// 1) email should be in right format never been used
// 2) password, last name, location and name should not be empty
export const validationRegisterUser = validationErrors([
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (value) => {
      console.log({ value })
      const user = await User.findOne({ email: value })
      if (user) {
        // console.log(`user find... ${user}`)
        throw new BadRequestError(`email already exist`)
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('please provide password')
    .isLength({ min: 8 })
    .withMessage('password should have at least 8 characters'),
  body('name').notEmpty().withMessage('please provide your name'),
  body('lastName').notEmpty().withMessage('please provide your last name'),
  body('location')
    .isIn(Object.values(JOB_LOCATION))
    .withMessage('please choose correct job location'),
])

export const validationLoginUser = validationErrors([
  body('email')
    .notEmpty()
    .withMessage('please provide your email')
    .isEmail()
    .withMessage('please provide valid email address'),
  body('password').notEmpty().withMessage('please provide password'),
  // .isLength({ min: 8 })
  // .withMessage('password should have at least 8 characters'),
])

//check if email has already exist
export const validationUserInput = validationErrors([
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value })
      console.log(`user id ${user._id}`)
      console.log(`req.body.createdBy ${req.body.createdBy}`)
      if (user && user._id.toString() !== req.body.createdBy) {
        throw new BadRequestError(`email already exist`)
      }
    }),
  body('name').notEmpty().withMessage('please provide your name'),
  body('lastName').notEmpty().withMessage('please provide your last name'),
  body('location')
    .isIn(Object.values(JOB_LOCATION))
    .withMessage('please choose correct job location'),
])
