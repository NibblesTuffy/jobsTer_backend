import mongoose from 'mongoose'
import { JOB_LOCATION } from '../utils/constants.js'

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: JOB_LOCATION.MELBOURNE,
  },
})

export default mongoose.model('User', userSchema)
