import { createGeminiClient } from "./gemini";
import "dotenv/config";

async function main() {
  console.log("Loading API Key from process.env...", !!process.env.GEMINI_API_KEY);
  const client = createGeminiClient(process.env.GEMINI_API_KEY as string);
  console.log("Generating with Gemini 2.5 Flash...");
  try {
    const res = await client.generate('Are you alive? Answer \'yes\' in JSON format like {"vote": "yes"}');
    console.log("Response:", res);
  } catch (e) {
    console.error("Gemini Error:", e);
  }
}

main();
