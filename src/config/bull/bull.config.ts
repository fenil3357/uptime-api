import { Queue } from "bullmq";

import { BULL_QUEUES } from "../../constant/bull/bull.constants.js";
import { redisConfig } from "../redis/redis.config.js";

export const regularMonitorCheckQueue = new Queue(BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE, {
  connection: redisConfig
});