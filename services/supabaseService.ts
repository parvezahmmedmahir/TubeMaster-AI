
import { createClient } from '@supabase/supabase-js';
import { VideoMetadata, PlatformMode } from '../types';

export const saveAnalysisToCloud = async (
  metadata: VideoMetadata, 
  platform: PlatformMode,
  supabaseUrl: string, 
  supabaseKey: string
) => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase configuration missing. Please check Settings.");
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Assuming a table 'analyses' exists with: id, title, platform, content (jsonb), created_at
    const { data, error } = await supabase
      .from('analyses')
      .insert([
        { 
          title: metadata.title,
          platform: platform,
          content: metadata,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Supabase Save Error:", error);
    throw new Error(error.message || "Failed to save to cloud database.");
  }
};
