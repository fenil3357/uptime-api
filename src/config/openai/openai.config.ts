import OpenAI from "openai";

import { ENV_VALUES } from "../env/env.config.js";

const openai = new OpenAI({ apiKey: ENV_VALUES.OPENAI_API_KEY })

export default openai;