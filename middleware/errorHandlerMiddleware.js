import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (error, req, resp, next) => {
  console.log(`error handler middleware`)
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const errorMessage =
    error.message || 'there is an error, try again later please...'

  resp.status(statusCode).json({ message: errorMessage })
}

export default errorHandlerMiddleware
