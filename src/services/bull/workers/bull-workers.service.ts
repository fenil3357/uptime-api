import { Monitor } from "@prisma/client";
import { Worker } from "bullmq";
import pMap from 'p-map';
import got, { Headers } from 'got'

import { BULL_QUEUES } from "../../../constant/bull/bull.constants.js";
import { getMonitors } from "../../database/monitor/monitor.service.js";
import { createReportType } from "../../../types/report.types.js";
import { createReportsBulk } from "../../database/report/report.service.js";
import { isValidJson } from "../../../utils/isJson.js";
import { redisConfig } from "../../../config/redis/redis.config.js";
import { ENV_VALUES } from "../../../config/env/env.config.js";
import { sendMessageToNotificationQueue } from "../../rabbitmq/rabbitmq.service.js";

export const REGULAR_MONITOR_CHECK_QUEUE_WORKER = new Worker(
  BULL_QUEUES.REGULAR_MONITOR_CHECK_QUEUE,
  async (job) => {
    try {
      const monitors = await getMonitors({
        is_active: true
      }, {
        id: true,
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

      const results: createReportType[] = await pMap(
        monitors as (Monitor & { user: { name: string, email: string } })[],
        async (monitor: Monitor & { user: { name: string, email: string } }): Promise<createReportType> => {
          const { id, endpoint, method, headers, payload, name, type, user } = monitor;

          try {
            const response = await got(endpoint, {
              method,
              headers: (headers ? (headers as Headers) : undefined),
              json: payload || undefined,
              timeout: {
                request: 10000, // 10 seconds
              },
            });

            return {
              monitor_id: id,
              status: 'SUCCESS',
              data: isValidJson(response?.body) ? JSON.parse(response?.body) : {},
              message: isValidJson(response?.body) ? (JSON.parse(response?.body)?.message) : ((response?.statusMessage as string) || 'OK'),
              statusCode: response.statusCode,
              time_taken: response?.timings?.phases?.total as number
            }
          } catch (error: any) {
            await sendMessageToNotificationQueue({
              type: 'ERROR',
              content: {
                endpoint,
                monitorName: name as string,
                monitorPageUrl: `${ENV_VALUES.CLIENT_ENDPOINT}/monitor?id=${id}`,
                type,
                userName: user.name,
                userEmail: user.email,
                errorReport: {
                  time: new Date().toLocaleString(),
                  errorMessage: isValidJson(error?.response?.body) ? (JSON.parse(error?.response?.body)?.message) : error.message,
                  errorJson: isValidJson(error?.response?.body) ? JSON.parse(error?.response?.body) : {}
                }
              }
            })

            return {
              monitor_id: id,
              status: 'ERROR',
              data: isValidJson(error?.response?.body) ? JSON.parse(error?.response?.body) : {},
              message: isValidJson(error?.response?.body) ? (JSON.parse(error?.response?.body)?.message) : error.message,
              statusCode: error.response?.statusCode,
              time_taken: error?.response?.timings?.phases?.total ? (error?.response?.timings?.phases?.total as number) : null
            }
          }
        }
      );

      // Store the results as report
      await createReportsBulk(results);
    } catch (error: any) {
      console.log("🚀 ~ Error occurred in REGULAR_MONITOR_CHECK_QUEUE_WORKER:", error)
    }
  }, { connection: redisConfig }
)
