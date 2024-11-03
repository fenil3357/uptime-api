import { Response } from "express";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants";
export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
export class BadRequestError extends CustomError {
  constructor(message = 'BAD_REQUEST') {
    super(message, httpStatusCodes['Bad Request']);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'INTERNAL_SERVER_ERROR') {
    super(message, httpStatusCodes['Internal Server Error']);
  }
}
export class UnAuthorizationError extends CustomError {
  constructor(message = 'UNAUTHORIZED') {
    super(message, httpStatusCodes['Unauthorized']);
  }
}
export class ForbiddenError extends CustomError {
  constructor(message = 'FORBIDDEN') {
    super(message, httpStatusCodes['Forbidden']);
  }
}
export class NotFoundError extends CustomError {
  constructor(message = 'NOT_FOUND') {
    super(message, httpStatusCodes['Not Found']);
  }
}
export class TooManyRequestsError extends CustomError {
  constructor(message = 'TOO_MANY_REQUESTS') {
    super(message, httpStatusCodes['Too Many Requests'])
  }
}
export class ConflictError extends CustomError {
  constructor(message = 'CONFLICT') {
    super(message, httpStatusCodes['Conflict']);
  }
}

export const handleError = async (err: CustomError, res: Response) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
