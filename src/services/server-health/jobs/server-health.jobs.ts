import got from "got";
import { ENV_VALUES } from "../../../config/env/env.config.js";

export const serverHealthCheckJob = async () => {
  try {
    await got(ENV_VALUES.SERVER_HEALTH_ENDPOINT as string);
  } catch (error) {
    console.log("🚀 ~ serverHealthCheckJob ~ error:", error);
  }
}