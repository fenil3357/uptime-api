import got from "got";

import { BULL_QUEUES } from "../../../constant/bull/bull.constants.js";
import { regularMonitorCheckQueue } from "../../../config/bull/bull.config.js";
import { ENV_VALUES } from "../../../config/env/env.config.js";
import { prisma } from "../../../config/Prisma/prisma.client.js";

export const regularMonitorCheckJob = async () => {
  try {
    await regularMonitorCheckQueue.add(BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE, {}, {
      removeOnComplete: true
    });
  } catch (error: any) {
    console.log("🚀 ~ regularMonitorCheckJob ~ error:", error?.message || error)
    throw new Error(error?.message || 'Something went wrong while adding job to regularMonitorCheckJob');
  }
}

export const serverHealthCheckJob = async () => {
  try {
    await got(ENV_VALUES.SERVER_HEALTH_ENDPOINT as string);
  } catch (error) {
    console.log("🚀 ~ serverHealthCheckJob ~ error:", error);
  }
}

export const recentFailureMonitorsRemovalJob = async () => {
  try {
    await prisma.$queryRaw`WITH monitors_to_update AS (
      SELECT m.id
      FROM "Monitor" m
      WHERE m.is_active = true
      AND (
          SELECT COUNT(*) = 3
          FROM (
              SELECT r.status
              FROM "Report" r
              WHERE r.monitor_id = m.id
              ORDER BY r."createdAt" DESC
              LIMIT 3
          ) AS latest_reports
          WHERE latest_reports.status = 'error'
      )
  )
  UPDATE "Monitor"
  SET is_active = false
  WHERE id IN (SELECT id FROM monitors_to_update)`;
  } catch (error) {
    console.log("🚀 ~ recentFailureMonitorRemovalJob ~ error:", error);
  }
}