
import React, { useEffect, useState } from 'react';
import { generateAIThumbnail } from '../services/geminiService';
import { searchPexelsImages } from '../services/pexelsService';
import { Image as ImageIcon, Download, RefreshCw, Sparkles, Wand2, Search, Globe, Tag, Smartphone, Monitor, Square, Camera, Layers, Palette, Sun, Paintbrush } from 'lucide-react';
import { PlatformMode } from '../types';

interface ThumbnailGeneratorProps {
  prompt: string;
  fallbackQuery: string;
  engagingKeywords?: string[];
  platformMode?: PlatformMode;
  geminiApiKey: string;
  pexelsApiKey: string;
}

type AspectRatio = '16:9' | '9:16' | '1:1';
type GenMode = 'AI' | 'PEXELS';

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ 
  prompt, 
  fallbackQuery, 
  engagingKeywords, 
  platformMode = 'YOUTUBE',
  geminiApiKey,
  pexelsApiKey
}) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [mode, setMode] = useState<GenMode>('AI');

  // Advanced Generation Controls
  const [imgStyle, setImgStyle] = useState('Cinematic Realistic');
  const [lighting, setLighting] = useState('Dramatic');
  const [palette, setPalette] = useState('Vibrant');

  useEffect(() => {
      // Auto-set aspect ratio when platform changes
      if (platformMode === 'TIKTOK') setAspectRatio('9:16');
      else if (platformMode === 'FACEBOOK') setAspectRatio('1:1'); 
      else setAspectRatio('16:9');
  }, [platformMode]);

  useEffect(() => {
    // Smart Prompt Construction Logic
    let finalPrompt = prompt;
    
    // Incorporate engaging keywords if available
    if (engagingKeywords && engagingKeywords.length > 0) {
        const keywordsString = engagingKeywords.slice(0, 4).join(", ");
        if (finalPrompt) {
            finalPrompt = `${finalPrompt}. VISUAL EMPHASIS ON: ${keywordsString}. Make these elements glow or stand out high contrast.`;
        } else {
            finalPrompt = `High quality ${platformMode} thumbnail for ${fallbackQuery}. Featuring 3D representations of: ${keywordsString}.`;
        }
    } else if (!finalPrompt) {
        finalPrompt = `${fallbackQuery}, high quality ${platformMode} thumbnail, trending`;
    }

    // If switching modes, just ensure we have a prompt or query
    if (mode === 'PEXELS') {
       setCustomPrompt(fallbackQuery || "Business Background");
    } else {
       setCustomPrompt(finalPrompt);
    }

  }, [prompt, fallbackQuery, engagingKeywords, platformMode, mode]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'AI') {
          // Construct full prompt with style modifiers
          const fullStylePrompt = `${customPrompt}. \nStyle: ${imgStyle}. \nLighting: ${lighting}. \nColor Palette: ${palette}. \nResolution: 4K, Ultra-Detailed.`;
          
          const imageBase64 = await generateAIThumbnail(fullStylePrompt, aspectRatio, geminiApiKey);
          setGeneratedImage(imageBase64);
      } else {
          // Pexels Mode
          const photos = await searchPexelsImages(customPrompt, pexelsApiKey);
          if (photos && photos.length > 0) {
              // Select the best matching orientation if possible, or just the first high res one
              // Pexels returns different sizes. Let's grab large2x or large
              const photo = photos[0];
              setGeneratedImage(photo.src.large2x || photo.src.large);
          } else {
              alert("No stock photos found for this query.");
          }
      }
    } catch (error) {
      console.error(error);
      alert(`Failed to generate/fetch thumbnail. Check API Key for ${mode}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 animate-in fade-in duration-700 shadow-2xl shadow-black/40">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                 <h3 className="text-lg font-semibold text-white flex items-center">
                    {mode === 'AI' ? <Sparkles className="w-5 h-5 mr-2 text-indigo-400" /> : <Camera className="w-5 h-5 mr-2 text-emerald-400" />}
                    {mode === 'AI' ? 'AI Realistic Thumbnail' : 'Stock Photo Search'}
                </h3>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex bg-slate-900/60 rounded-lg p-1 border border-slate-700">
                <button
                    onClick={() => setMode('AI')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center ${
                        mode === 'AI' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Wand2 className="w-3 h-3 mr-1" /> AI Gen
                </button>
                <button
                    onClick={() => setMode('PEXELS')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center ${
                        mode === 'PEXELS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <ImageIcon className="w-3 h-3 mr-1" /> Pexels
                </button>
            </div>
        </div>
        
        {/* Controls Row 1: Aspect & Platform */}
        <div className="flex flex-wrap gap-2">
             <div className="flex space-x-2 bg-slate-900/40 p-1 rounded-lg border border-slate-800 w-fit">
                 <button 
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-2 rounded flex items-center space-x-1 text-xs transition-all ${aspectRatio === '16:9' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    title="YouTube Landscape"
                 >
                     <Monitor className="w-3 h-3" /> <span>16:9</span>
                 </button>
                 <button 
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-2 rounded flex items-center space-x-1 text-xs transition-all ${aspectRatio === '9:16' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    title="TikTok Vertical"
                 >
                     <Smartphone className="w-3 h-3" /> <span>9:16</span>
                 </button>
                 <button 
                    onClick={() => setAspectRatio('1:1')}
                    className={`p-2 rounded flex items-center space-x-1 text-xs transition-all ${aspectRatio === '1:1' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    title="Facebook Square"
                 >
                     <Square className="w-3 h-3" /> <span>1:1</span>
                 </button>
             </div>
             
             <div className="flex items-center space-x-2">
               <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold border border-indigo-500/30 px-2 py-1 rounded bg-indigo-900/20 flex items-center h-full">
                 <Globe className="w-3 h-3 mr-1" /> {platformMode} Mode
               </span>
            </div>
        </div>

        {/* Controls Row 2: AI Style Modifiers (Only in AI Mode) */}
        {mode === 'AI' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-lg animate-in slide-in-from-top-2 fade-in">
                 
                 {/* Image Style */}
                 <div className="space-y-1">
                    <label className="text-[10px] text-indigo-300 font-bold uppercase flex items-center">
                        <Paintbrush className="w-3 h-3 mr-1" /> Art Style
                    </label>
                    <select 
                        value={imgStyle}
                        onChange={(e) => setImgStyle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="Cinematic Realistic">Cinematic Realistic</option>
                        <option value="3D Render">3D Render (Blender)</option>
                        <option value="Cyberpunk">Cyberpunk / Neon</option>
                        <option value="Anime">Anime / Manga</option>
                        <option value="Cartoon">Cartoon / Vector</option>
                        <option value="Minimalist">Minimalist</option>
                        <option value="Oil Painting">Oil Painting</option>
                        <option value="Hyper-Surreal">Hyper-Surreal</option>
                    </select>
                 </div>

                 {/* Lighting */}
                 <div className="space-y-1">
                    <label className="text-[10px] text-indigo-300 font-bold uppercase flex items-center">
                        <Sun className="w-3 h-3 mr-1" /> Lighting
                    </label>
                    <select 
                        value={lighting}
                        onChange={(e) => setLighting(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="Dramatic">Dramatic / High Contrast</option>
                        <option value="Cinematic">Cinematic (Teal & Orange)</option>
                        <option value="Natural">Natural / Soft</option>
                        <option value="Studio">Studio Lighting</option>
                        <option value="Neon">Neon Glow</option>
                        <option value="Dark">Dark & Moody</option>
                        <option value="Golden Hour">Golden Hour</option>
                    </select>
                 </div>

                 {/* Color Palette */}
                 <div className="space-y-1">
                    <label className="text-[10px] text-indigo-300 font-bold uppercase flex items-center">
                        <Palette className="w-3 h-3 mr-1" /> Color Palette
                    </label>
                    <select 
                        value={palette}
                        onChange={(e) => setPalette(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="Vibrant">Vibrant & Saturated</option>
                        <option value="High Contrast">High Contrast</option>
                        <option value="Dark">Dark / Matte</option>
                        <option value="Pastel">Pastel / Soft</option>
                        <option value="Warm">Warm (Red/Orange)</option>
                        <option value="Cool">Cool (Blue/Cyan)</option>
                        <option value="Monochromatic">Monochromatic</option>
                    </select>
                 </div>

             </div>
        )}

        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 relative group">
             <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center">
                    <span>{mode === 'AI' ? 'Subject Description' : 'Search Query'}</span>
                </label>
                {mode === 'AI' && engagingKeywords && engagingKeywords.length > 0 && (
                    <span className="text-[10px] text-yellow-400 flex items-center bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-700/30">
                        <Tag className="w-3 h-3 mr-1" /> Keyword Infused
                    </span>
                )}
             </div>
             <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full bg-slate-800 text-slate-200 text-sm p-2 rounded border border-slate-600 focus:border-indigo-500 outline-none h-24 resize-none"
                placeholder={mode === 'AI' ? "Describe the core subject of the image..." : "Search for photos..."}
             />
             <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {mode === 'AI' ? <Wand2 className="w-4 h-4 text-indigo-400" /> : <Search className="w-4 h-4 text-emerald-400" />}
             </div>
        </div>

        <button 
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full flex items-center justify-center text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50 shadow-lg font-medium group relative overflow-hidden
                ${mode === 'AI' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-900/20' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20'
                }`}
        >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    {mode === 'AI' ? 'Simulating Trends...' : 'Searching Stock...'}
                </>
            ) : (
                <>
                    {mode === 'AI' ? <Wand2 className="w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                    {generatedImage ? 'Regenerate' : mode === 'AI' ? 'Generate 3D Thumbnail' : 'Search Pexels'}
                </>
            )}
        </button>
      </div>

      {!generatedImage && !loading && (
        <div className={`flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-700 hover:border-indigo-500/50 transition-colors
            ${aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[200px] mx-auto' : aspectRatio === '1:1' ? 'aspect-square max-w-[300px] mx-auto' : 'aspect-video'}`}
        >
          <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
          <p className="text-sm font-medium text-slate-400">Ready for {aspectRatio}</p>
          <p className="text-xs text-slate-600 mt-1">Optimized for {platformMode}</p>
        </div>
      )}

      {loading && (
          <div className={`flex flex-col items-center justify-center text-indigo-400 bg-slate-900/30 rounded-lg border border-slate-700 relative overflow-hidden
             ${aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[200px] mx-auto' : aspectRatio === '1:1' ? 'aspect-square max-w-[300px] mx-auto' : 'aspect-video'}`}
          >
               <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
               
               <div className="flex items-center space-x-3 mb-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-150"></div>
               </div>
               
               <Search className="w-8 h-8 text-indigo-400 mb-2 relative z-10 animate-pulse" />
               <p className="text-sm relative z-10 font-bold text-white">
                   {mode === 'AI' ? `Generating ${aspectRatio}...` : 'Fetching Stock...'}
               </p>
          </div>
      )}

      {generatedImage && !loading && (
        <div className={`group relative rounded-lg overflow-hidden border-2 border-indigo-500/50 shadow-2xl shadow-indigo-900/20
            ${aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[300px] mx-auto' : aspectRatio === '1:1' ? 'aspect-square max-w-[400px] mx-auto' : 'aspect-video'}`}
        >
          <img 
            src={generatedImage} 
            alt="Generated Thumbnail" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <a 
              href={generatedImage} 
              download={`thumbnail-${aspectRatio.replace(':','-')}.png`}
              className="bg-white text-slate-900 px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 hover:bg-indigo-50 transition-colors transform scale-90 group-hover:scale-100 duration-200 shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Download {aspectRatio}</span>
            </a>
          </div>
          <div className="absolute top-2 right-2 bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-white/10 flex items-center">
             {mode === 'AI' ? <Wand2 className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
             {mode === 'AI' ? 'AI Generated' : 'Pexels Stock'}
          </div>
        </div>
      )}
    </div>
  );
};
