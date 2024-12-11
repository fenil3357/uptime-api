import { Prisma, Report } from "@prisma/client";

import { CustomError } from "../../../helper/errors/custom-errors.js";
import { httpStatusCodes } from "../../../constant/httpStatus/httpStatusCodes.constants.js";
import { prisma } from "../../../config/Prisma/prisma.client.js";
import { createReportType } from "../../../types/report.types.js";

export const createReport = async (data: createReportType): Promise<Report | null> => {
  try {
    return await prisma.report.create({ data });
  } catch (error: any) {
    console.log("🚀 ~ createReport ~ error:", error?.message || error);
    throw new CustomError(
      error?.message || 'Something went wrong while creating a new report',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}

export const getOneReport = async (query: Prisma.ReportWhereInput, projection?: Prisma.ReportSelect): Promise<Report | null> => {
  try {
    return await prisma.report.findFirst({
      where: query,
      select: projection
    });
  } catch (error: any) {
    console.log("🚀 ~ getOneReport ~ error:", error?.message || error)
    throw new CustomError(
      error?.message || 'Something went wrong while fetching one report',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}

export const getReports = async (query: Prisma.ReportWhereInput, projection?: Prisma.ReportSelect): Promise<Report[] | null> => {
  try {
    return await prisma.report.findMany({
      where: query,
      select: projection
    });
  } catch (error: any) {
    console.log("🚀 ~ getReports ~ error:", error?.message || error);
    throw new CustomError(
      error?.message || 'Something went wrong while fetching reports',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}

export const createReportsBulk = async (data: createReportType[]): Promise<Prisma.BatchPayload> => {
  try {
    return await prisma.report.createMany({ data });
  } catch (error: any) {
    console.log("🚀 ~ createReportsBulk ~ error:", error?.message || error);
    throw new CustomError(
      error?.message || 'Something went wrong while creating reports in bulk.',
      error?.statusCode || httpStatusCodes['Internal Server Error']
    )
  }
}