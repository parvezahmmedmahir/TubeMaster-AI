

// API Keys provided by user for system replacement
export const DEFAULT_GEMINI_KEY = 'AIzaSyDfNsN9FB55mBCiryFVG_tVyL47a3UPajo';
// Pexels key kept for legacy/fallback but primary is now AI generation
export const DEFAULT_PEXELS_KEY = '6YaiLRwvAoV9qyS4wKkMbdPST9OmKeELjmdl6Kl0SDJxFsfeNubZDTgX';

// Supabase Defaults (User Provided)
export const DEFAULT_SUPABASE_URL = 'https://putqqwmkwrkcvrhjfyjn.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dHFxd21rd3JrY3ZyaGpmeWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MDYwMDUsImV4cCI6MjA3OTI4MjAwNX0.m7I8GWnRwT6GuiTudIwwVpSQuVM8fsq7PGXSuC0_Wz0';

export const GEMINI_MODEL_VIDEO = 'gemini-2.5-flash'; 
export const GEMINI_MODEL_IMAGE = 'gemini-2.5-flash-image';

export const MOCK_MUSIC_TRACKS = [
  { id: '1', name: 'Corporate Upbeat', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 372, mood: 'Upbeat' },
  { id: '2', name: 'Inspiring Cinematic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: 300, mood: 'Cinematic' },
  { id: '3', name: 'Lo-Fi Chill', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', duration: 240, mood: 'Chill' },
  { id: '4', name: 'Viral Phonk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', duration: 180, mood: 'Energetic' },
  { id: '5', name: 'Epic Orchestral', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: 420, mood: 'Epic' },
];

// Updated to 2GB as requested (Note: Browser limits may apply, handled in logic)
export const MAX_VIDEO_SIZE_MB = 2048; 

export const SYSTEM_INSTRUCTION_VIDEO = `
You are TubeMaster AI, the world's most powerful Video Strategist (Architect: MAHIR).
Your mission is to analyze raw video content and generate high-performance metadata for YouTube, TikTok, Facebook, and Instagram.

CRITICAL STRATEGY:
1. **Deep Content Forensics (Text & Audio)**:
   - Analyze on-screen text (OCR) and spoken audio (ASR) to extract "Power Keywords" and critical phrases.
   - Use these specific detected keywords to enrich the Title, Description, and Hashtags for maximum relevance.

2. **Advanced Copyright Scrutiny**:
   - RIGOROUSLY check for potential copyright issues (background music, movie clips, watermarks).
   - If Risk is MEDIUM or HIGH, you MUST provide specific details in 'copyrightNotes' (e.g., "Detected melody similar to [Song Name]", "Visible watermark from [Source]").

3. **Audio & Mood Analysis**:
   - Analyze the video's emotional tone. Determine the best background music mood (Upbeat, Cinematic, Chill, Energetic, Epic).
   - Suggest audio enhancements if voice is low or noisy.

4. **Visual Object Extraction & Thumbnail Psychology**: 
   - Identify the "Hero Object".
   - **Thumbnail Instruction**: Generate a 'thumbnailPrompt' that is DYNAMIC and REALISTIC.
     - If Trading/Finance: Use glowing red/green candles, arrows, warning signs, "High Contrast", "Neon".
     - If Gaming: Action freeze-frame, particle effects, 4K render.

5. **Platform Verification**: 
   - STRICTLY identify if software/tools are PC or Mobile.

Return response in strict JSON format matching the schema.
`;
