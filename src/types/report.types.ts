import { Prisma } from "@prisma/client";

export type createReportType = Omit<Prisma.ReportCreateInput, 'monitor'> & { monitor_id: string }