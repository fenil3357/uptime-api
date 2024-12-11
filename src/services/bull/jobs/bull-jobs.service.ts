import { BULL_QUEUES } from "../../../constant/bull/bull.constants.js";
import { regularMonitorCheckQueue } from "../../../config/bull/bull.config.js";

export const regularMonitorCheckJob = async () => {
  try {
    await regularMonitorCheckQueue.add(BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE, {});
  } catch (error: any) {
    console.log("🚀 ~ regularMonitorCheckJob ~ error:", error?.message || error)
    throw new Error(error?.message || 'Something went wrong while adding job to regularMonitorCheckJob');
  }
}