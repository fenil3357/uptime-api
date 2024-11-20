import { NextFunction, Response, Request } from "express";
import { CustomError, TooManyRequestsError } from "../../helper/errors/custom-errors";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants";
import { IRequestWithUser } from "../../types/utils.interface";
import { createMonitor } from "../../services/database/monitor/monitor.service";
import { handleResponse } from "../../helper/response/handleResponse";
import { updateUserMonitorCount } from "../../services/database/user/user.service";


export const createMonitorController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const {
      name,
      type,
      endpoint,
      method,
      payload,
      headers,
    } = req?.body;

    const user = req?.user;

    // Check if user has enough monitors or not
    if (!user?.monitors || user.monitors <= 0) {
      throw new TooManyRequestsError('You do not have enough monitor quota left. Please contact us if you want to upgrade your plan.')
    }

    const monitor = await createMonitor({
      name: name || new Date().toLocaleString() + '_' + user.email,
      user_id: user.id,
      type: type,
      endpoint,
      method: method || undefined,
      payload: payload || undefined,
      headers: headers || undefined
    });

    // Update usage
    await updateUserMonitorCount({ id: user.id }, -1);

    return handleResponse(
      res,
      {
        message: 'New monitor created successfully.',
        data: monitor
      },
      httpStatusCodes['Created']
    );
  } catch (error: any) {
    console.log("🚀 ~ createMonitorController ~ error:", error?.message || error, error?.statusCode)
    return next(
      new CustomError(
        error?.message || 'Something went wrong while creating a new monitor.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}