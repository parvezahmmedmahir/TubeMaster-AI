
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GEMINI_MODEL_VIDEO, GEMINI_MODEL_IMAGE, SYSTEM_INSTRUCTION_VIDEO, DEFAULT_GEMINI_KEY } from "../constants";
import { VideoMetadata } from "../types";

// Schema definition for the expected JSON output
const videoMetadataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A highly clickable, SEO-optimized YouTube title (max 60 chars). Be extremely accurate about software platforms (PC vs Mobile). Use detected power keywords.",
    },
    description: {
      type: Type.STRING,
      description: "A compelling video description including a hook, summary, and call to action. Integrate spoken keywords found in video.",
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "10-15 trending and relevant hashtags for YouTube.",
    },
    thumbnailQuery: {
      type: Type.STRING,
      description: "A precise English search query (legacy use).",
    },
    thumbnailPrompt: {
      type: Type.STRING,
      description: "A precise prompt for the AI Image Generator. It MUST describe the specific 'hero object' and use psychological visual cues (glowing, high contrast, etc) to increase CTR.",
    },
    copyrightRisk: {
      type: Type.STRING,
      enum: ["LOW", "MEDIUM", "HIGH"],
      description: "Estimated risk of copyright strikes based on visual/audio content identified.",
    },
    copyrightNotes: {
      type: Type.STRING,
      description: "Detailed explanation of the copyright risk. If MEDIUM/HIGH, cite specific detected audio tracks, visual matches, or trademarks.",
    },
    category: {
      type: Type.STRING,
      description: "The most fitting video category.",
    },
    tiktokCaption: {
      type: Type.STRING,
      description: "Short, punchy caption optimized for TikTok algorithm with hooks.",
    },
    tiktokHashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-8 high-traffic hashtags for TikTok FYP.",
    },
    instagramHashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Hashtags optimized for Instagram discovery.",
    },
    facebookTitle: {
      type: Type.STRING,
      description: "Engagement-focused title for Facebook Watch (often longer, more emotional).",
    },
    facebookDescription: {
      type: Type.STRING,
      description: "Description format optimized for Facebook feed scrolling.",
    },
    facebookHashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Relevant hashtags for Facebook video search.",
    },
    viralityScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating potential virality.",
    },
    engagingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 5-7 high-impact keywords extracted from on-screen text or spoken audio.",
    },
    recommendedAudioMood: {
      type: Type.STRING,
      enum: ['Upbeat', 'Cinematic', 'Chill', 'Energetic', 'Epic'],
      description: "The recommended background music mood based on video content analysis.",
    }
  },
  required: [
    "title", 
    "description", 
    "hashtags", 
    "thumbnailQuery",
    "thumbnailPrompt",
    "copyrightRisk", 
    "copyrightNotes", 
    "category",
    "tiktokCaption",
    "tiktokHashtags",
    "instagramHashtags",
    "facebookTitle",
    "facebookDescription",
    "facebookHashtags",
    "viralityScore",
    "engagingKeywords",
    "recommendedAudioMood"
  ],
};

export const analyzeVideoContent = async (
  base64Video: string, 
  mimeType: string,
  apiKey?: string
): Promise<VideoMetadata> => {
  try {
    // Use provided key, or env key, or default fallback
    const keyToUse = apiKey || process.env.API_KEY || DEFAULT_GEMINI_KEY;
    
    if (!keyToUse) {
      throw new Error("Gemini API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey: keyToUse });

    // Construct the parts for the model
    const parts = [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Video,
        },
      },
      {
        text: "Analyze this video professionally. Simulate a YouTube/TikTok trend search. Extract hero object for thumbnail. Provide viral metadata for ALL platforms (YouTube, TikTok, Facebook). Recommend audio mood.",
      },
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_VIDEO,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_VIDEO,
        responseMimeType: "application/json",
        responseSchema: videoMetadataSchema,
      },
      contents: {
        parts: parts,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini.");
    }

    const data = JSON.parse(text) as VideoMetadata;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateAIThumbnail = async (prompt: string, aspectRatio: '16:9' | '9:16' | '1:1' = '16:9', apiKey?: string): Promise<string> => {
  try {
    const keyToUse = apiKey || process.env.API_KEY || DEFAULT_GEMINI_KEY;
    const ai = new GoogleGenAI({ apiKey: keyToUse });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_IMAGE,
      contents: {
        parts: [
          {
            text: `Generate a high-quality video thumbnail. Aspect Ratio: ${aspectRatio}. Details: ${prompt}. Do not include text overlay inside the image generation unless specifically asked.`,
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio,
            // imageSize is NOT supported for 'gemini-2.5-flash-image' and causes 500 errors. 
            // It is only available for 'gemini-3-pro-image-preview'.
        }
      }
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data generated.");

  } catch (error) {
    console.error("Gemini Thumbnail Generation Error:", error);
    throw error;
  }
};
