import { Worker } from "bullmq";
import pMap from 'p-map';
import got from 'got'

import { BULL_QUEUES } from "../../../constant/bull/bull.constants.js";
import { getMonitors } from "../../database/monitor/monitor.service.js";

export const REGULAR_MONITOR_CHECK_QUEUE_WORKER = new Worker(
  BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE,
  async (job) => {
    console.log('JOB STARTED!!!')
    const monitors = await getMonitors({
      is_active: true
    }, {
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

    console.log('MONITORS DATA FETCHED!!!');

    const results = await pMap(
      monitors as any,
      async (monitor: any) => {
        const { user_id, name, endpoint, method, headers, payload } = monitor;

        try {
          const response = await got(endpoint, {
            method,
            headers: headers || undefined,
            json: payload || undefined,
            timeout: {
              request: 10000, // 10 seconds
            },
          });

          const timings = response.timings;
          console.log(`Monitor ${name} timings`, timings);
          return timings;
        } catch (error: any) {
          // console.log("🚀 ~ Error in worker:", error)
          console.log(error.message);
        }
      }
    )

    console.log("🚀 ~ results:", results)
    console.log('JOB ENDED!!!')
  }, {
  connection: {
    host: '127.0.0.1',
    port: 6379
  }
}
)
