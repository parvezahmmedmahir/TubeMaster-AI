
import React, { useState, useEffect } from 'react';
import { Settings, Key, Save, X, Shield, Image } from 'lucide-react';
import { DEFAULT_GEMINI_KEY, DEFAULT_PEXELS_KEY } from '../constants';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  pexelsKey: string;
  onSave: (newGeminiKey: string, newPexelsKey: string) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  geminiKey, 
  pexelsKey, 
  onSave 
}) => {
  const [tempGemini, setTempGemini] = useState(geminiKey);
  const [tempPexels, setTempPexels] = useState(pexelsKey);

  // Sync state when modal opens or props change
  useEffect(() => {
    setTempGemini(geminiKey);
    setTempPexels(pexelsKey);
  }, [geminiKey, pexelsKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(tempGemini, tempPexels);
    onClose();
  };

  const resetDefaults = () => {
    setTempGemini(DEFAULT_GEMINI_KEY);
    setTempPexels(DEFAULT_PEXELS_KEY);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white">
            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">System Configuration</h3>
              <p className="text-xs text-slate-400">Manage API Connections</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Gemini Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-indigo-400" />
              Gemini API Key (Analysis & AI Images)
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={tempGemini}
                onChange={(e) => setTempGemini(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono"
                placeholder="Enter Gemini API Key..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">Used for high-power video analysis and generative thumbnails.</p>
          </div>

          {/* Pexels Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center">
              <Image className="w-4 h-4 mr-2 text-emerald-400" />
              Pexels API Key (Stock Photos)
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={tempPexels}
                onChange={(e) => setTempPexels(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono"
                placeholder="Enter Pexels API Key..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">Used for searching high-quality stock photography.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 bg-slate-950/50 rounded-b-2xl border-t border-slate-800">
          <button 
            onClick={resetDefaults}
            className="text-xs text-slate-500 hover:text-indigo-400 underline transition-colors"
          >
            Restore Defaults
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-900/20 flex items-center transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
