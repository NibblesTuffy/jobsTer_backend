import { StatusCodes } from 'http-status-codes'
import User from '../models/userModel.js'
import { BadRequestError } from '../error/customError.js'
import Job from '../models/jobModel.js'
import mongoose from 'mongoose'
import day from 'dayjs'
export const getCurrentUser = async (req, resp) => {
  try {
    const user = await User.findById(req.body.createdBy)

    const { location, name, lastName, email } = user
    if (user) {
      resp.status(StatusCodes.OK).json({ location, name, lastName, email })
    } else {
      throw new BadRequestError('no profile info')
    }
  } catch (error) {
    throw new BadRequestError('no profile info')
  }
}

export const updateUser = async (req, resp) => {
  //   const { name, email, lastName, location } = req.body
  try {
    // console.log(req.body);
    const findUser = await User.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.body.createdBy)}, req.body)
    const updatedUser = await User.findById(req.body.createdBy)
    const { name, lastName, location, email } = updatedUser
    resp
      .status(StatusCodes.OK)
      .json({
        message: 'update successfully',
        updatedUser: { name, lastName, location, email },
      })
  } catch (error) {
    throw new BadRequestError('update user fail')
  }
}

export const getStats = async (req, resp) => {
  const statsArray = await Job.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.body.createdBy) },
    },
    {
      $group: { _id: '$status', count: { $sum: 1 } },
    },
  ])
  const stats = statsArray.reduce((acc, cur) => {
    const { _id, count } = cur
    acc[_id] = count
    return acc
  }, {})
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  }

  const monthly = await Job.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.body.createdBy) },
    },
    {
      $group: {
        _id: { year: { $year: '$applyDate' }, month: { $month: '$applyDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ])
  console.log(monthly);
  //[ { _id: { year: 2023, month: 9 }, count: 2 } ]
  const monthlyApplications = monthly.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item
    const date = day().year(year).month(month).format('MMM YY')
    return { date, count }
  })
  console.log(monthlyApplications)

  resp.json({
    defaultStats: defaultStats,
    monthlyApplications: monthlyApplications,
  })
}
