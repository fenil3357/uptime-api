import got from "got";

import { BULL_QUEUES } from "../../../constant/bull/bull.constants.js";
import { regularMonitorCheckQueue } from "../../../config/bull/bull.config.js";
import { ENV_VALUES } from "../../../config/env/env.config.js";
import { pauseRecentFailureMonitors } from "../../database/monitor/monitor.service.js";

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
  } catch (error: any) {
    console.log("🚀 ~ serverHealthCheckJob ~ error:", error?.message || error);
  }
}

export const recentFailureMonitorsRemovalJob = async () => {
  try {
    await pauseRecentFailureMonitors();
  } catch (error: any) {
    console.log("🚀 ~ recentFailureMonitorRemovalJob ~ error:", error?.message || error);
  }
}