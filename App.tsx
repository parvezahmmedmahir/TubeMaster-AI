
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { ThumbnailGenerator } from './components/ThumbnailGenerator';
import { VideoEditor } from './components/VideoEditor';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { analyzeVideoContent } from './services/geminiService';
import { VideoMetadata, PlatformMode } from './types';
import { DEFAULT_GEMINI_KEY, DEFAULT_PEXELS_KEY } from './constants';
import { AlertCircle, Sparkles, Zap, Youtube, Facebook, Music2 } from 'lucide-react';

function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // API Key Management
  const [geminiKey, setGeminiKey] = useState(DEFAULT_GEMINI_KEY);
  const [pexelsKey, setPexelsKey] = useState(DEFAULT_PEXELS_KEY);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Platform State
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformMode>('YOUTUBE');

  const handleFileSelect = async (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setAnalysisResult(null);
    setError(null);

    await performAnalysis(file);
  };

  const performAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // Safety check for browser memory
      if (file.size > 500 * 1024 * 1024) {
         throw new Error("File is too large for browser-based analysis. Please use a file under 500MB for this demo.");
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const mimeType = file.type;

        try {
          // Pass dynamic key to service
          const data = await analyzeVideoContent(base64Data, mimeType, geminiKey);
          setAnalysisResult(data);
        } catch (err) {
          console.error(err);
          setError("System Analysis Error: Unable to connect to Gemini API. Check API Key in Settings.");
        } finally {
          setIsAnalyzing(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to process video file.");
        setIsAnalyzing(false);
      };

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleSaveKeys = (newGemini: string, newPexels: string) => {
    setGeminiKey(newGemini);
    setPexelsKey(newPexels);
  };

  return (
    // Removed bg-slate-900 so CSS background shows
    <div className="min-h-screen text-slate-200 pb-20 overflow-x-hidden">
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <ApiSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiKey={geminiKey}
        pexelsKey={pexelsKey}
        onSave={handleSaveKeys}
      />

      {/* Hero Background Glow */}
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/20 blur-[100px] pointer-events-none"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-slate-800/50 rounded-full px-3 py-1 mb-4 border border-slate-700 backdrop-blur-md">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">World's Most Powerful Video System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-xl">
            TubeMaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Multi-Platform</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Universal Upload System. High-professional analysis for YouTube, TikTok, and Facebook with platform-specific thumbnails and metadata.
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-900/20 border border-red-800/50 p-4 rounded-xl flex items-center text-red-200 backdrop-blur-md shadow-lg">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Platform Selector */}
            {!videoUrl && (
                <div className="flex justify-center mb-4">
                    <div className="bg-slate-900/60 p-1 rounded-xl border border-slate-700 flex space-x-2 shadow-xl">
                        <button 
                            onClick={() => setSelectedPlatform('YOUTUBE')}
                            className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 font-bold ${
                                selectedPlatform === 'YOUTUBE' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Youtube className="w-5 h-5 mr-2" />
                            YouTube
                        </button>
                        <button 
                            onClick={() => setSelectedPlatform('TIKTOK')}
                            className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 font-bold ${
                                selectedPlatform === 'TIKTOK' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Music2 className="w-5 h-5 mr-2" />
                            TikTok
                        </button>
                        <button 
                            onClick={() => setSelectedPlatform('FACEBOOK')}
                            className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 font-bold ${
                                selectedPlatform === 'FACEBOOK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <Facebook className="w-5 h-5 mr-2" />
                            Facebook
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-900/40 rounded-3xl border border-slate-800/50 p-1 shadow-2xl shadow-black/50 backdrop-blur-md">
                {!videoUrl ? (
                    <div className="p-8 relative">
                        {/* Platform Indicator Badge inside Uploader */}
                        <div className="absolute top-4 right-4 z-20">
                             <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                 selectedPlatform === 'TIKTOK' ? 'bg-pink-900/20 text-pink-400 border-pink-500/30' :
                                 selectedPlatform === 'FACEBOOK' ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' :
                                 'bg-red-900/20 text-red-400 border-red-500/30'
                             }`}>
                                 Target: {selectedPlatform}
                             </span>
                        </div>
                        <VideoUploader onFileSelect={handleFileSelect} isLoading={isAnalyzing} />
                    </div>
                ) : (
                    <VideoEditor videoUrl={videoUrl} metadata={analysisResult} />
                )}
            </div>
            
            {videoUrl && !isAnalyzing && (
                <div className="text-center">
                    <button 
                        onClick={() => { setVideoUrl(null); setAnalysisResult(null); }}
                        className="text-sm text-slate-500 hover:text-slate-300 underline transition-colors"
                    >
                        Upload New Video
                    </button>
                </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            
            {isAnalyzing ? (
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-800/30 rounded-3xl border border-slate-800/50 p-8 relative overflow-hidden backdrop-blur-sm">
                 <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                 <div className="relative w-24 h-24 mb-6">
                   <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                   <div className="absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin animation-delay-150"></div>
                   <div className="absolute inset-4 border-b-4 border-cyan-500 rounded-full animate-spin animation-delay-300"></div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">High-Power Analysis...</h3>
                 <p className="text-slate-400 text-center max-w-xs text-sm">
                    Generating metadata for {selectedPlatform}, extracting audio hooks, and simulating viral trends.
                 </p>
               </div>
            ) : analysisResult ? (
              <>
                <div className="flex items-center space-x-2 text-indigo-400 mb-2 pl-1">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-xl font-bold text-white">Strategic Analysis Report</h2>
                </div>
                
                {/* Analysis Results with Default Tab based on Platform */}
                <AnalysisResults metadata={analysisResult} initialTab={selectedPlatform} />
                
                {/* Thumbnail Generator with Aspect Ratio Awareness & Dynamic Keys */}
                <ThumbnailGenerator 
                    prompt={analysisResult.thumbnailPrompt} 
                    fallbackQuery={analysisResult.thumbnailQuery} 
                    engagingKeywords={analysisResult.engagingKeywords}
                    platformMode={selectedPlatform}
                    geminiApiKey={geminiKey}
                    pexelsApiKey={pexelsKey}
                />
              </>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800/50 backdrop-blur-sm">
                <p>System Ready for {selectedPlatform}.</p>
                <p className="text-xs mt-2 text-slate-600">Select Mode: YouTube, TikTok, Facebook</p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
