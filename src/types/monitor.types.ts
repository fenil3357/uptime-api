import { Prisma } from "@prisma/client";

export type createMonitorType = Omit<Prisma.MonitorCreateInput, 'user'> & { user_id: string }