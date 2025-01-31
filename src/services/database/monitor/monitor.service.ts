import { Prisma, Monitor } from "@prisma/client";

import { prisma } from "../../../config/Prisma/prisma.client.js";
import { CustomError } from "../../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../../constant/httpStatus/httpStatusCodes.constants.js";
import { createMonitorType } from "../../../types/monitor.types.js";

export const createMonitor = async (data: createMonitorType): Promise<Monitor | null> => {
  try {
    return await prisma.monitor.create({ data });
  } catch (error: any) {
    throw new CustomError(
      error?.message || 'Something went wrong while creating a new monitor.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    );
  }
}

export const getOneMonitor = async (query: Prisma.MonitorWhereInput, projection?: Prisma.MonitorSelect, reportStartDate?: Date, reportEndDate?: Date): Promise<Monitor | null> => {
  try {
    return await prisma.monitor.findFirst({
      where: query,
      select: {
        ...projection,
        Report: {
          where: {
            createdAt: {
              gte: reportStartDate,
              lte: reportEndDate
            }
          }
        }
      }
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
    return await prisma.monitor.delete({ where: query });
  } catch (error: any) {
    // Custom handling for case : monitor does not exists
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return null;
    console.log("🚀 ~ deleteOneMonitor ~ error:", error);
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

export const getMonitors = async (query: Prisma.MonitorWhereInput, projection?: Prisma.MonitorSelect, page: number = 1, limit: number = 5): Promise<Monitor[] | null> => {
  try {
    const skip = (page - 1) * limit;

    const monitors = await prisma.monitor.findMany({
      where: query,
      select: {
        ...projection,
        Report: {
          skip,
          orderBy: {
            createdAt: 'desc'
          },
          take: limit,
          select: {
            status: true,
            time_taken: true,
            createdAt: true,
            message: true
          }
        }
      }
    });

    for (const monitor of monitors) {
      monitor.Report.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return monitors;
  } catch (error: any) {
    console.log("🚀 ~ getMonitors ~ error:", error?.message || error);
    throw new CustomError(
      error?.message || 'Something went wrong while fetching monitors.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}