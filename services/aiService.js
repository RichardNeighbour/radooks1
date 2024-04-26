const { Configuration, OpenAIApi } = require("openai");
const openAIConfig = require("../config/openAIConfig");
const logger = require("../utils/logger");

const configuration = new Configuration({
  apiKey: openAIConfig.apiKey
});
const openai = new OpenAIApi(configuration);

async function generateStoryline(promptText) {
  try {
    if (!promptText) {
      throw new Error("Prompt cannot be empty");
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Update model to the latest version
      prompt: promptText,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    logger.info(`Storyline generated successfully for prompt: ${promptText}`);
    return response.data.choices[0].text.trim();
  } catch (error) {
    logger.error("Error generating storyline:", error.message);
    logger.error(error.stack);
    throw error;
  }
}

module.exports = {
  generateStoryline,
};