import mongoose from 'mongoose'
import Job from '../models/jobModel.js'
import { JOB_LIMIT, JOB_SORT_BY } from '../utils/constants.js'
import { StatusCodes } from 'http-status-codes'
export const getAllJobs = async (req, resp) => {
  const {
    status,
    jobType,
    sort,
    page,
    startMonth,
    endMonth,
    location,
    search,
  } = req.query
  console.log(req.query)
  let searchObject = {
    createdBy: new mongoose.Types.ObjectId(req.body.createdBy),
  }
  if (search) {
    searchObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ]
  }

  if (status && status !== 'all') {
    searchObject.status = status
  }

  if (jobType && jobType !== 'all') {
    searchObject.jobType = jobType
  }

  if (location && location !== 'all') {
    searchObject.jobLocation = location
  }

  if (searchObject.applyDate) {
    if (startMonth) {
      searchObject.applyDate.$gte = new Date(startMonth)
    }

    if (endMonth) {
      searchObject.applyDate.$lt = new Date(endMonth)
    }
  } else {
    if (startMonth) {
      searchObject.applyDate = { $gte: new Date(startMonth) }
      if (endMonth) {
        searchObject.applyDate.$lt = new Date(endMonth)
      }
    } else {
      if (endMonth) {
        searchObject.applyDate = { $lt: new Date(endMonth) }
      }
    }
  }

  const sortOptions = {
    [JOB_SORT_BY.NEWEST_FIRST]: '-applyDate',
    [JOB_SORT_BY.OLDEST]: 'applyDate',
    [JOB_SORT_BY.ASCENDING]: '-position',
    [JOB_SORT_BY.DESCENDING]: 'position',
  }
  // console.log(sortOptions);
  const sortBy = sortOptions[sort] || 'applyDate'
  const skipJob = (page - 1) * 3
  const jobs = await Job.find(searchObject)
    .sort(sortBy)
    .skip(skipJob)
    .limit(JOB_LIMIT)
  // console.log(jobs)
  const totalJobs = await Job.countDocuments(searchObject)
  const numOfPages = parseInt(totalJobs / JOB_LIMIT) + 1
  console.log({ jobs, numOfPages, totalJobs })
  resp.status(StatusCodes.OK).json({ jobs, numOfPages, totalJobs })
}

export const addJob = async (req, resp) => {
  try {
    console.log(`add job... ${req.body}`)
    const newJob = await Job.create(req.body)

    await newJob.save()
    resp.json({ message: 'add job success', job: req.body })
  } catch (error) {
    console.log(error)
  }
}

export const editJob = async (req, resp) => {
  const oldJob = await Job.find({
    createdBy: new mongoose.Types.ObjectId(req.body.createdBy),
  })
  // console.log(`old job... ${oldJob}`)
  // console.log(req.body)
  const { editJobID, position, jobType, jobLocation, company, status } =
    req.body
  // console.log(`edit job id ${editJobID}`)
  const job = await Job.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(editJobID) },
    {
      position,
      jobType,
      jobLocation,
      company,
      status,
    }
  )
  resp.status(StatusCodes.OK).json({ job })
}

export const deleteJob = async (req, resp) => {
  const deleteId = req.params
  console.log(deleteId)
  try {
    const deleteJob = await Job.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(deleteId),
    })
  } catch (error) {
    console.log(error)
  }
  resp
    .status(StatusCodes.OK)
    .json({ message: `delete job with id:${deleteId} successfully!` })
}
