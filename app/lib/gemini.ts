import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable (see "Set up your API key" above)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

// Access your API key (see "Set up your API key" above)
// Access your API key (see "Set up your API key" above)
// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

// async function listAvailableModels() {
//   console.log('--- Listing Gemini Models ---');
//   try {
//     const { models } = await genAI.listModels();
//     const textModels = models.filter(model => model.supportedGenerationMethods?.includes('generateContent') && model.name.includes('gemini'));
//     console.log('Available Text Models supporting generateContent:', textModels.map(m => m.name));
//     console.log('--- End Listing Gemini Models ---');
//     return textModels;
//   } catch (error) {
//     console.error('Error listing Gemini models:', error);
//     return [];
//   }
// }

export async function getGeminiResponse(prompt: string) {
  // Temporarily hardcode model to bypass listModels error
  // const availableModels = await listAvailableModels();
  // const targetModel = availableModels.find(model => model.name.includes('gemini-1.0-pro') || model.name.includes('gemini-pro'));

  // if (!targetModel) {
  //   throw new Error('No suitable Gemini Pro model found for generateContent. Please check model availability in your region.');
  // }

  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // Hardcoded for testing

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
