
import React, { useCallback } from 'react';
import { Upload, AlertCircle, Scan, ShieldCheck, Zap, Music, Search } from 'lucide-react';
import { MAX_VIDEO_SIZE_MB } from '../constants';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect, isLoading }) => {
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Warn if over 100MB in browser environment, though constant is higher
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        alert(`File too large. Please use files under ${MAX_VIDEO_SIZE_MB}MB.`);
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <label
        htmlFor="video-upload"
        className={`relative group flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden
          ${isLoading 
            ? 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed' 
            : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/20'
          }
        `}
      >
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 transition-transform duration-500 group-hover:-translate-y-4">
          <div className={`p-5 rounded-full mb-4 transition-all duration-500 ${isLoading ? 'bg-slate-800' : 'bg-indigo-500/10 group-hover:bg-indigo-500 text-indigo-500 group-hover:text-white shadow-lg shadow-indigo-500/30'}`}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>
          <p className="mb-2 text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
            {isLoading ? 'Analyzing Video...' : 'Upload Your Video'}
          </p>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Supports MP4, MOV, WebM (Up to {MAX_VIDEO_SIZE_MB}MB)
          </p>
        </div>

        {/* Hover Overlay / Analysis Preview */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end pb-6 px-6 pointer-events-none">
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
             <div className="flex items-center space-x-2 bg-white/5 p-2 rounded backdrop-blur-sm border border-white/5">
               <ShieldCheck className="w-4 h-4 text-green-400" />
               <span>Copyright Check</span>
             </div>
             <div className="flex items-center space-x-2 bg-white/5 p-2 rounded backdrop-blur-sm border border-white/5">
               <Zap className="w-4 h-4 text-yellow-400" />
               <span>Virality Score</span>
             </div>
             <div className="flex items-center space-x-2 bg-white/5 p-2 rounded backdrop-blur-sm border border-white/5">
               <Search className="w-4 h-4 text-blue-400" />
               <span>SEO Keywords</span>
             </div>
             <div className="flex items-center space-x-2 bg-white/5 p-2 rounded backdrop-blur-sm border border-white/5">
               <Music className="w-4 h-4 text-pink-400" />
               <span>Audio Sync</span>
             </div>
          </div>
          <p className="text-center text-indigo-300 text-xs mt-3 font-medium tracking-wide uppercase">
            Powered by TubeMaster AI System
          </p>
        </div>

        <input 
          id="video-upload" 
          type="file" 
          accept="video/*" 
          className="hidden" 
          onChange={handleFileChange} 
          disabled={isLoading}
        />
      </label>
      
      <div className="mt-4 flex items-start space-x-3 p-4 bg-slate-800/50 border border-slate-700 rounded-xl shadow-inner">
        <div className="bg-blue-900/30 p-2 rounded-lg">
          <Scan className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Professional Analysis</h4>
          <p className="text-xs text-slate-400 mt-1">
            Our high-power system analyzes 24+ data points including visual composition, audio sentiment, and copyright compliance before you publish.
          </p>
        </div>
      </div>
    </div>
  );
};
