import { Prisma, Monitor } from "@prisma/client";

import { prisma } from "../../../config/Prisma/prisma.client";
import { CustomError } from "../../../helper/errors/custom-errors";
import { httpStatusCodes } from "../../../constant/httpStatus/httpStatusCodes.constants";

export const createMonitor = async (data: Omit<Prisma.MonitorCreateInput, 'user'> & { user_id: string }): Promise<Monitor | null> => {
  try {
    return await prisma.monitor.create({ data });
  } catch (error: any) {
    throw new CustomError(
      error?.message || 'Something went wrong while creating a new monitor.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const getOneMonitor = async (query: Prisma.MonitorWhereInput, projection?: Prisma.MonitorSelect): Promise<Monitor | null> => {
  try {
    return await prisma.monitor.findFirst({
      where: query,
      select: projection || undefined
    })
  } catch (error: any) {
    console.log("🚀 ~ getOneMonitor ~ error:", error?.message || error);
    throw new CustomError(
      error?.message || 'Something went wrong while fetching monitor data.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const deleteOneMonitor = async (query: Prisma.MonitorWhereUniqueInput): Promise<Monitor | null> => {
  try {
    return await prisma.monitor.delete({
      where: query
    });
  } catch (error: any) {
    console.log("🚀 ~ deleteOneMonitor ~ error:", error?.message || error);
    throw new CustomError(
      error?.message || 'Something went wrong while fetching deleting a monitor.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const updateOneMonitor = async (query: Prisma.MonitorWhereUniqueInput, dataToUpdate: Prisma.MonitorUpdateInput): Promise<Monitor | null> => {
  try {
    return await prisma.monitor.update({
      data: dataToUpdate,
      where: query
    });
  } catch (error: any) {
    console.log("🚀 ~ updateOneMonitor ~ error:", error?.message || error)
    throw new CustomError(
      error?.message || 'Something went wrong while updating monitor data.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}