import amqplib, { Connection } from 'amqplib'

import { ENV_VALUES } from '../env/env.config.js';

let connection: Connection | undefined

const connectRabbitMq = async (): Promise<amqplib.Connection> => {
  try {
    if (!connection) connection = await amqplib.connect(ENV_VALUES.RABBITMQ_CONNECTION_URL as string);
    return connection;
  } catch (error: any) {
    console.log("🚀 ~ connect ~ error:", error)
    throw new Error(error?.message || 'Something went wrong while connecting to rabbitMQ!')
  }
}

export default connectRabbitMq;