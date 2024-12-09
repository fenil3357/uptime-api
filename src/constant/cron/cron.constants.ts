export const CRON_JOBS = {
  REGULAR_MONITOR_CHECK: 'REGULAR_MONITOR_CHECK'
}

export type CRON_JOB_TYPES = typeof CRON_JOBS[keyof typeof CRON_JOBS];
