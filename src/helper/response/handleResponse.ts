import { Response } from "express";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants.js";

export const handleResponse = (res: Response, dataObject: { message: string, count?: number, data?: any }, statusCode = httpStatusCodes['OK']) => {
  const { message, count, data } = dataObject;
  return res.status(statusCode).json({
    statusCode,
    message,
    count,
    data,
  });
};