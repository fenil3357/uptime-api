import { ENV_VALUES } from "../../config/env/env.config.js";
import openai from "../../config/openai/openai.config.js";

export const generateChatCompletion = async (prompt: string): Promise<string | null> => {
  try {
    const completion = await openai.chat.completions.create({
      model: ENV_VALUES.OPENAI_CHAT_COMPLETION_MODEL as string,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.2
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.log("🚀 ~ generateChatCompletion ~ error:", error)
    return null;
  }
}