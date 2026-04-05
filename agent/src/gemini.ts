import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

type GeminiClient = {
  readonly generate: (prompt: string) => Promise<string>;
};

export function createGeminiClient(apiKey: string): GeminiClient {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const generate = async (prompt: string): Promise<string> => {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  };

  return { generate };
}

export function extractJson<T>(raw: string): T | null {
  try {
    const fenceStripped = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const jsonMatch = fenceStripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}
