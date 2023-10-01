import mongoose from 'mongoose'
import { JOB_LOCATION, JOB_STATUS, JOB_TYPE } from '../utils/constants.js'
const jobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      enum: Object.values(JOB_LOCATION),
      default: JOB_LOCATION.MELBOURNE,
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    applyDate: {
      type: Date,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Job', jobSchema)
