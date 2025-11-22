
export type PlatformMode = 'YOUTUBE' | 'TIKTOK' | 'FACEBOOK';

export interface VideoMetadata {
  title: string;
  description: string;
  hashtags: string[];
  thumbnailQuery: string; // Kept for legacy/fallback
  thumbnailPrompt: string; // New field for AI Image Generator
  copyrightRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  copyrightNotes: string;
  category: string;
  // Multi-platform additions
  tiktokCaption: string;
  tiktokHashtags: string[]; // New
  instagramHashtags: string[];
  facebookTitle: string;
  facebookDescription: string; // New
  facebookHashtags: string[]; // New
  viralityScore: number; // 0-100
  engagingKeywords: string[]; // New field for extracted power words
  recommendedAudioMood: string; // New field for auto-music selection
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number; // 0 to 100
  error: string | null;
  result: VideoMetadata | null;
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string; // URL to an mp3 file
  duration: number;
  mood: string; // Added for matching
}
