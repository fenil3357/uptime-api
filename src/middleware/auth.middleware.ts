import { Response, NextFunction } from "express";

import { CustomError, UnAuthorizationError } from "../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../constant/httpStatus/httpStatusCodes.constants.js";
import { verifyToken } from "../services/jwt/jwt.js";
import { getOneUser } from "../services/database/user/user.service.js";
import { IRequestWithUser } from "../types/utils.interface.js";

export const userAuthMiddleware = async (req: IRequestWithUser, _res: Response, next: NextFunction) => {
  try {
    const token = req?.headers?.authorization;
    if (!token) throw new UnAuthorizationError('No token provided');

    const data: any = verifyToken(token.split(' ')[1]);

    const user = await getOneUser({
      id: data?.id as string
    }, {
      id: true,
      email: true,
      monitors: true
    });

    if (!user) throw new UnAuthorizationError('This user does not exists');

    req.user = user;
    return next();
  } catch (error: any) {
    console.log("🚀 ~ userAuthMiddleware ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        error?.message || 'Unauthorized',
        httpStatusCodes['Unauthorized']
      )
    )
  }
}