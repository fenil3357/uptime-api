import got, { Headers, Response } from "got";
import { Monitor } from "@prisma/client";

import { API_REQUEST_TYPE } from "../../types/api.types.js";
import { isValidJson } from "../../utils/isJson.js";
import { ENV_VALUES } from "../../config/env/env.config.js";
import { generateChatCompletion } from "../openai/openai.service.js";
import generateErrorAnalysisPrompt from "../../helper/prompts/errorAnalysis.prompt.js";
import { sendMessageToNotificationQueue } from "../rabbitmq/rabbitmq.service.js";
import { createReportType } from "../../types/report.types.js";
import { getOneMonitor } from "../database/monitor/monitor.service.js";
import { createReportsBulk } from "../database/report/report.service.js";
import { getOneUser } from "../database/user/user.service.js";

export const executeApiRequest = async (data: API_REQUEST_TYPE): Promise<Response> => {
  try {
    return await got(data.endpoint, {
      method: data?.method,
      headers: data?.headers,
      json: ((data?.method === 'GET') ? undefined : data?.json),
      timeout: { request: 10000 }
    });
  } catch (error) { throw error; }
}

export const executeMonitorHealthCheck = async (monitor: Monitor & { user: { name: string, email: string } }): Promise<createReportType> => {
  const { id, endpoint, method, headers, payload, name, type, user } = monitor;
  try {
    const response: Response<any> = await executeApiRequest({
      endpoint,
      method,
      headers: (headers ? (headers as Headers) : undefined),
      json: payload ? payload as object : undefined
    });

    // Report - success attempt
    return {
      monitor_id: id,
      status: 'SUCCESS',
      data: isValidJson(response?.body) ? JSON.parse(response?.body) : {},
      message: isValidJson(response?.body) ? (JSON.parse(response?.body)?.message) : ((response?.statusMessage as string) || 'OK'),
      statusCode: response.statusCode,
      time_taken: response?.timings?.phases?.total as number
    }
  } catch (error: any) {
    const errorMessage = isValidJson(error?.response?.body) ? (JSON.parse(error?.response?.body)?.message) : error.message;
    const errorJson = isValidJson(error?.response?.body) ? JSON.parse(error?.response?.body) : {};

    let errorAnalysis = undefined;
    if (ENV_VALUES.AI_ENABLED) errorAnalysis = await generateChatCompletion(generateErrorAnalysisPrompt(errorMessage, errorJson));

    // Push message to queue to notify user
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
          errorMessage: errorMessage,
          errorJson: errorJson
        },
        errorAnalysis: errorAnalysis || undefined
      }
    });

    // Report - failed attempt
    return {
      monitor_id: id,
      status: 'ERROR',
      data: errorJson,
      message: errorMessage,
      statusCode: error.response?.statusCode,
      time_taken: error?.response?.timings?.phases?.total ? (error?.response?.timings?.phases?.total as number) : null
    }
  }
}

export const executeSingleMonitorHealthCheck = async (monitor: Monitor) => {
  try {
    if (!monitor || !monitor?.user_id) return;

    const user = await getOneUser({
      id: monitor?.user_id
    }, {
      name: true,
      email: true
    })

    if(!user) return;

    const results = await executeMonitorHealthCheck({
      ...monitor,
      user: {
        name: user?.name as string,
        email: user?.email as string
      }
    });
    await createReportsBulk([results]);
  } catch (error) {
    console.log("🚀 ~ executeSingleMonitorHealthCheck ~ error:", error);
  }
}