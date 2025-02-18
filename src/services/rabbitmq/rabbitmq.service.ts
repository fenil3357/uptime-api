import { Connection } from "amqplib";

import { ENV_VALUES } from "../../config/env/env.config.js";
import connectRabbitMq from "../../config/rabbitmq/rabbitmq.config.js";

export const sendMessageToNotificationQueue = async (
  data:
    {
      type: 'SUCCESS' | 'ERROR',
      content: {
        userName: string,
        userEmail: string,
        monitorName: string,
        type: "WEBSITE" | "API",
        endpoint: string,
        monitorPageUrl: string,
        errorReport?: {
          time: string,
          errorMessage: string,
          errorJson?: object
        },
        errorAnalysis?: string
      }
    }
): Promise<void> => {
  try {
    const connection = await connectRabbitMq();
    const channel = await connection.createChannel();
    await channel.assertQueue(ENV_VALUES.RABBITMQ_NOTIFICATION_QUEUE as string, { durable: true })
    channel.sendToQueue(ENV_VALUES.RABBITMQ_NOTIFICATION_QUEUE as string, Buffer.from(JSON.stringify(data)))
    await channel.close();
  } catch (error) {
    console.log("🚀 ~ sendMessageToNotifiationQueue error:", error);
  }
}