// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: 'AIzaSyAoZ6C3yFiK_54Sm2_s-rJVL5J4AKvgCaI'
// });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//     config: {
//       thinkingConfig: {
//         thinkingBudget: 0,
//       },
//     }
//   });
//   console.log(response.text);
// }

// await main();

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold
} from '@google/generative-ai'

const apiKey= process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
})

const generationConfig = {
  temperature : 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
}

export const chatSession = model.startChat({
  generationConfig,
  history:[]
})
