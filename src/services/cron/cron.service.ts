import * as cron from 'node-cron'

import { CRON_JOB_TYPES, CRON_JOBS } from '../../constant/cron/cron.constants.js'
import { regularMonitorCheckJob } from '../bull/jobs/bull-jobs.service.js';
import { serverHealthCheckJob } from '../server-health/jobs/server-health.jobs.js';

export const scheduleCronJob = async (cronJobType: CRON_JOB_TYPES) => {
  try {
    switch (cronJobType) {
      case CRON_JOBS.REGULAR_MONITOR_CHECK: {
        cron.schedule('*/1 * * * *', regularMonitorCheckJob)
        break;
      }

      case CRON_JOBS.REGULAR_SERVER_HEALTH_CHECK: {
        cron.schedule(`*/10 * * * *`, serverHealthCheckJob);
        break;
      }

      default:
        break;
    }
  } catch (error: any) {
    console.log("🚀 ~ scheduleCronJob ~ error:", error?.message || error);
    throw new Error(error?.message || 'Something went wrong while scheduling cron job')
  }
}