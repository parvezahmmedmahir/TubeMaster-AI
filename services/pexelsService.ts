import { PexelsPhoto } from "../types";

export const searchPexelsImages = async (query: string, apiKey: string): Promise<PexelsPhoto[]> => {
  if (!query || !apiKey) return [];

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos || [];
  } catch (error) {
    console.error("Pexels Search Error:", error);
    return [];
  }
};
