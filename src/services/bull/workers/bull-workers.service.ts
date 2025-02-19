import { Monitor } from "@prisma/client";
import { Worker } from "bullmq";
import pMap from 'p-map';

import { BULL_QUEUES } from "../../../constant/bull/bull.constants.js";
import { getMonitors } from "../../database/monitor/monitor.service.js";
import { createReportType } from "../../../types/report.types.js";
import { createReportsBulk } from "../../database/report/report.service.js";
import { redisConfig } from "../../../config/redis/redis.config.js";
import { executeMonitorHealthCheck } from "../../got/got.service.js";

export const REGULAR_MONITOR_CHECK_QUEUE_WORKER = new Worker(
  BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE,
  async () => {
    try {
      const monitors = await getMonitors({
        is_active: true
      }, {
        id: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        name: true,
        endpoint: true,
        method: true,
        headers: true,
        payload: true,
        type: true
      });

      const results: createReportType[] = await pMap(
        monitors as (Monitor & { user: { name: string, email: string } })[],
        async (monitor: Monitor & { user: { name: string, email: string } }): Promise<createReportType> => await executeMonitorHealthCheck(monitor)
      );

      // Store the results as report
      await createReportsBulk(results);
    } catch (error: any) {
      console.log("🚀 ~ Error occurred in REGULAR_MONITOR_CHECK_QUEUE_WORKER:", error)
    }
  }, { connection: redisConfig }
)
