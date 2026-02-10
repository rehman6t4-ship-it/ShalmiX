
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables.
// Following guidelines: new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a product description in English and Urdu using AI.
 * Uses a response schema to ensure structured JSON output as recommended.
 */
export const generateProductDescription = async (productName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional marketing copywriter for the Shahalmi Market in Lahore, Pakistan. 
      Generate a compelling product description in both English and Urdu for a product named: "${productName}". 
      Make it sound wholesale-ready and attractive to Pakistani retailers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            en: {
              type: Type.STRING,
              description: 'The product description in English.',
            },
            ur: {
              type: Type.STRING,
              description: 'The product description in Urdu.',
            },
          },
          required: ["en", "ur"],
        },
      }
    });
    // response.text is a getter, used correctly here.
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Generation failed", error);
    return { en: "High quality product from Shahalmi.", ur: "شاہ عالمی کی اعلیٰ معیار کی پروڈکٹ" };
  }
};

/**
 * Gets business advice based on market statistics using the specified Gemini 3 model for text tasks.
 */
export const getBusinessAdvice = async (marketStats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these market stats for a Pakistani wholesaler: ${JSON.stringify(marketStats)}. 
      Give 2-3 brief, actionable business tips in English and Urdu.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Advice failed", error);
    return "Focus on inventory management and customer relationship building. اپنے انوینٹری مینجمنٹ اور کسٹمر ریلیشن شپ بلڈنگ پر توجہ دیں۔";
  }
};
