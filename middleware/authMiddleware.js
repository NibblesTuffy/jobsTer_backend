import { UnauthenticatedError } from '../error/customError.js'
import { decodeToken } from '../utils/jwtUtils.js'
import { StatusCodes } from 'http-status-codes'
export const authMiddleware = async (req, resp, next) => {
  const { token } = req.cookies
  try {
    if (token) {
      const decode = decodeToken(token)
      console.log(decode)
      req.body.createdBy = decode.id
    } else {
      throw new UnauthenticatedError('Invalid credential')
    }
  } catch (error) {
    console.log(error)
    if (error.statusCode === StatusCodes.BAD_REQUEST) {
      resp.redirect('/landing')
    }
  }

  next()
}
