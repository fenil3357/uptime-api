import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { httpStatusCodes } from "../constant/httpStatus/httpStatusCodes.constants";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatusCodes['Bad Request']).json({
      status: 'ERROR',
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};
