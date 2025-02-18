import { NextFunction, Response } from "express";

import { CustomError } from "../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants.js";
import { IRequestWithUser } from "../../types/utils.interface.js";
import { getOneUser } from "../../services/database/user/user.service.js";
import { handleResponse } from "../../helper/response/handleResponse.js";

export const getOneUserController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req?.user;

    const userData = await getOneUser({
      id: user?.id
    }, {
      id: true,
      email: true,
      name: true,
      monitors: true,
      avatar: true
    });

    return handleResponse(
      res,
      {
        message: 'User data fetched successfully.',
        data: userData
      }
    );
  } catch (error: any) {
    console.log("🚀 ~ getUserById ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        'Something went wrong! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}