import { NextFunction, Response } from "express";
import { Prisma } from "@prisma/client";

import { CustomError, NotFoundError, TooManyRequestsError } from "../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../constant/httpStatus/httpStatusCodes.constants.js";
import { IRequestWithUser } from "../../types/utils.interface.js";
import { createMonitor, deleteOneMonitor, getMonitors, getOneMonitor, updateOneMonitor } from "../../services/database/monitor/monitor.service.js";
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
    if (!user?.monitors || user.monitors <= 0) return next(new TooManyRequestsError('You do not have enough monitor quota left. Please contact us if you want to upgrade your plan.'))

    const monitor = await createMonitor({
      name: name || new Date().toLocaleString() + '_' + user.email,
      user_id: user.id,
      type: type,
      endpoint,
      method: method || undefined,
      payload: payload ? JSON.parse(payload) : undefined,
      headers: headers ? JSON.parse(headers) : undefined
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
        error?.message || 'Something went wrong while creating a monitor! Please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
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
        error?.message || 'Something went wrong while fetching monitors data! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}

export const getOneMonitorController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req?.user;
    const { id, reportStartDate, reportEndDate, reportOnly, monitorOnly } = req?.query;

    let projection: Prisma.MonitorSelect = {
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
    };

    if (reportOnly == '1') projection = { Report: true }
    else if (monitorOnly == '1') projection = { ...projection, Report: false }

    const monitor = await getOneMonitor({
      user_id: user?.id,
      id: id as string
    }, projection,
      reportStartDate ? new Date(reportStartDate as string) : undefined,
      reportEndDate ? new Date(reportEndDate as string) : undefined
    );

    if (!monitor) return next(new NotFoundError('Monitor with given id does not exists.'))

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
        error?.message || 'Something went wrong while fetching monitor data! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}

export const updateMonitorController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req?.user;
    const { name, is_active, payload, headers, method, endpoint, type } = req?.body;
    const { id } = req?.params;

    const updatedMonitor = await updateOneMonitor({
      id,
      user_id: user?.id
    }, {
      name,
      is_active,
      payload,
      headers,
      method,
      endpoint,
      type
    });

    if (!updatedMonitor) return next(new NotFoundError('The monitor with given id does not exists'));

    return handleResponse(
      res,
      {
        message: 'Monitor details updated successfully',
        data: updatedMonitor
      }
    );
  } catch (error: any) {
    console.log("🚀 ~ updateMonitorController ~ error:", error?.message || error)
    return next(
      new CustomError(
        error?.message || 'Something went wrong while updating monitor data! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}

export const deleteMonitorController = async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = req?.user;
    const { id } = req?.params;

    const monitor = await deleteOneMonitor({
      id,
      user_id: user?.id
    });

    if (!monitor) return next(new NotFoundError('The monitor with given id does not exists'));

    return handleResponse(
      res,
      {
        message: 'Monitor has been deleted successfully!',
        data: monitor
      }
    );
  } catch (error: any) {
    console.log("🚀 ~ deleteMonitorController ~ error:", error?.message || error)
    return next(
      new CustomError(
        error?.message || 'Something went wrong while deleting monitor data! please try again.',
        error?.statusCode || httpStatusCodes['Internal Server Error']
      )
    )
  }
}