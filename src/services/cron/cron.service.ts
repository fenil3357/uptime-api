import * as cron from 'node-cron'

import { CRON_JOB_TYPES, CRON_JOBS } from '../../constant/cron/cron.constants.js'
import { regularMonitorCheckQueue } from '../../config/bull/bull.config.js';
import { BULL_QUEUES } from '../../constant/bull/bull.constants.js';

export const scheduleCronJob = async (cronJobType: CRON_JOB_TYPES) => {
  switch (cronJobType) {
    case CRON_JOBS.REGULAR_MONITOR_CHECK: {
      cron.schedule('* * * * *', regularMonitorCheckJob)
      break;
    }

    default:
      break;
  }
}

export const regularMonitorCheckJob = async () => {
  try {
    await regularMonitorCheckQueue.add(BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE, {});
  } catch (error: any) {
    console.log("🚀 ~ regularMonitorCheckJob ~ error:", error?.message || error)
    throw new Error(error?.message || 'Something went wrong while adding to regularMonitorCheckJob');
  }
}