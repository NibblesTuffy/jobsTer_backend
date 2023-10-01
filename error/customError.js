import { StatusCodes } from 'http-status-codes'

export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.StatusCode = StatusCodes.NOT_FOUND
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequestError'
    this.StatusCode = StatusCodes.BAD_REQUEST
  }
}

// Unauthorized: You have a valid credential (e.x. JWT)
// but don't have access to the certain resources
// (e.x. Ones that are configured with hasRole('blahblah')
//  not allowed URLs in security config mentioned below)
//  (Http Status code: 403)
// Unauthenticated: Your have an invalid login credential
// (Http Status code: 401)
export class UnauthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthenticatedError'
    this.StatusCode = StatusCodes.UNAUTHORIZED
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.StatusCode = StatusCodes.FORBIDDEN
  }
}
