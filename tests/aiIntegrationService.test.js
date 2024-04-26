const { generateStoryline, generateAnimationScript } = require("../services/aiIntegrationService");
const { expect } = require("chai");

describe("AI Integration Service", function() {
  describe("generateStoryline", function() {
    it("should generate a non-empty storyline", async function() {
      const promptText = "Create a compelling storyline for a series titled: 'The Adventures of Radooks'";
      const storyline = await generateStoryline(promptText);
      expect(storyline).to.be.a('string');
      expect(storyline.length).to.be.greaterThan(0);
    });

    it("should handle errors gracefully and provide a specific error message for empty prompts", async function() {
      try {
        const promptText = ""; // Intentionally causing an error
        await generateStoryline(promptText);
        throw new Error("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.an('error');
        expect(error.message).to.include("Prompt cannot be empty");
      }
    });
  });

  describe("generateAnimationScript", function() {
    it("should generate a detailed animation script", async function() {
      const promptText = "Create detailed animation script for a scene with a dragon flying over mountains.";
      const script = await generateAnimationScript(promptText);
      expect(script).to.be.a('string');
      expect(script.length).to.be.greaterThan(0);
    });

    it("should handle errors gracefully and provide a specific error message for empty prompts", async function() {
      try {
        const promptText = ""; // Intentionally causing an error
        await generateAnimationScript(promptText);
        throw new Error("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.an('error');
        expect(error.message).to.include("Prompt cannot be empty");
      }
    });
  });
});