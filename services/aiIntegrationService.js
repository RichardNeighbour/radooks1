import { Configuration, OpenAIApi } from "openai";
import logger from "../utils/logger.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function generateStoryline(promptText) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: promptText,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    logger.info("Storyline generated successfully.");
    return response.data.choices[0].text.trim();
  } catch (error) {
    logger.error("Error generating storyline: " + error.message);
    logger.error(error.stack);
    throw error; // Rethrow the error after logging
  }
}

// Added a trivial change to ensure there's a change to commit.
// This comment is a placeholder for any minor adjustments needed to trigger a git commit.

export { generateStoryline };