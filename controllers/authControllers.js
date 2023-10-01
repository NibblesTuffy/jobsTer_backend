import User from '../models/userModel.js'
import { StatusCodes } from 'http-status-codes'
import { hashPassword } from '../utils/hashPassword.js'
import { UnauthenticatedError } from '../error/customError.js'
import bcrypt from 'bcryptjs'
import { createToken } from '../utils/jwtUtils.js'
export const login = async (req, resp) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const { name, lastName, location } = user
  if (user) {
    const compare = await bcrypt.compare(password, user.password)
    if (compare) {
      const token = createToken({ id: user._id })
      resp.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      resp
        .status(StatusCodes.OK)
        .json({ user: { email, location, name, lastName } })
    } else {
      //401 Unauthorized
      // Indicates that the request requires user authentication information.
      // The client MAY repeat the request with a suitable Authorization header field
      throw new UnauthenticatedError('wrong password')
    }
  } else {
    //     403 Forbidden
    //         Unauthorized request.
    // The client does not have access rights to the content.
    // Unlike 401, the client’s identity is known to the server.
    throw new UnauthenticatedError('invalid email')
  }
}

export const register = async (req, resp) => {
  try {
    const { password, name, lastName, email, location } = req.body
    req.body.password = await hashPassword(password)

    const newUser = new User(req.body)
    await newUser.save()

    const user = await User.findOne({ email })
    const token = createToken({ id: user._id })
    resp.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    })
    resp
      .status(StatusCodes.OK)
      .json({ user: { email, location, name, lastName } })
    // resp
    //   .status(StatusCodes.CREATED)
    //   .json({ user: { name, lastName, email, location } })
  } catch (error) {}
}

export const logout = async (req, resp) => {
  resp.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  resp.status(StatusCodes.OK).json({ message: 'User log out!' })
}
