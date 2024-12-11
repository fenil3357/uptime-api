import { Queue } from "bullmq";

import { BULL_QUEUES } from "../../constant/bull/bull.constants.js";

const connection = {
  host: '127.0.0.1',
  port: 6379,
};


export const regularMonitorCheckQueue = new Queue(BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE, {
  connection
});