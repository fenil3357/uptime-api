import { Worker } from "bullmq";
import { BULL_QUEUES } from "../../constant/bull/bull.constants.js";

export const REGULAR_MONITOR_CHECK_QUEUE_WORKER = new Worker(
  BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE,
  async (job) => {
    const { } = job.data;
    console.log("🚀 ~ job.data:", job.data)
  }
)