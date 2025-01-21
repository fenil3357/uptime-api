import { NextFunction, Response, Request } from "express";
import { CustomError, NotFoundError, TooManyRequestsError } from "../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants.js";
import { IRequestWithUser } from "../../types/utils.interface.js";
<<<<<<< Updated upstream
import { createMonitor } from "../../services/database/monitor/monitor.service.js";
=======
import { createMonitor, getMonitors, getOneMonitor } from "../../services/database/monitor/monitor.service.js";
>>>>>>> Stashed changes
import { handleResponse } from "../../helper/response/handleResponse.js";
import { updateUserMonitorCount } from "../../services/database/user/user.service.js";


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
<<<<<<< Updated upstream
=======
}

export const getUserMonitorsController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req?.user;

    const monitors = await getMonitors({
      user_id: user?.id,
    }, {
      id: true,
      name: true,
      type: true,
      is_active: true
    });

    return handleResponse(
      res,
      {
        message: `User's monitors fetched successfully.`,
        data: monitors
      }
    );
  } catch (error: any) {
    console.log("🚀 ~ getUserMonitorsController ~ error:", error?.message || error);
    return next(
      new CustomError(
        error?.message || 'Something went wrong while creating a new monitor.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}

export const getOneMonitorController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req?.user;
    const { id, reportStartDate, reportEndDate, reportOnly } = req?.query;

    const monitor = await getOneMonitor({
      user_id: user?.id,
      id: id as string
    }, (reportOnly == '1') ? { Report: true } : {
      id: true,
      type: true,
      name: true,
      endpoint: true,
      method: true,
      headers: true,
      payload: true,
      is_active: true,
      Report: true,
      createdAt: true,
      updatedAt: true
    },
      reportStartDate ? new Date(reportStartDate as string) : undefined,
      reportEndDate ? new Date(reportEndDate as string) : undefined
    );

    if (!monitor) throw new NotFoundError('Monitor with given id does not exists.')

    return handleResponse(
      res,
      {
        message: 'Monitor data fetched successfully.',
        data: monitor
      }
    );
  } catch (error: any) {
    console.log("🚀 ~ getOneMonitorController ~ error:", error?.message || error)
    return next(
      new CustomError(
        error?.message || 'Something went wrong while creating a new monitor.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
>>>>>>> Stashed changes
}