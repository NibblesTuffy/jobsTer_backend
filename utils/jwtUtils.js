import jwt from 'jsonwebtoken'

export const createToken = (info) => {
  const token = jwt.sign(info, process.env.TOKEN_KEY, {
    expiresIn: process.env.TOKEN_EXPIRE,
  })
  return token
}

export const decodeToken = (token) => {
  const decode = jwt.verify(token, process.env.TOKEN_KEY)
  return decode
}
