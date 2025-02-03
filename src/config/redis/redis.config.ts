import { ConnectionOptions } from "bullmq";
import { ENV_VALUES } from "../env/env.config.js";

export const redisConfig: ConnectionOptions = {
  host: ENV_VALUES.REDIS_HOST,
  port: ENV_VALUES.REDIS_PORT,
  username: ENV_VALUES.REDIS_USERNAME,
  password: ENV_VALUES.REDIS_PASSWORD
}
