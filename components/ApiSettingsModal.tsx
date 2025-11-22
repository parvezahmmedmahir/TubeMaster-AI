
import React, { useState, useEffect } from 'react';
import { Settings, Key, Save, X, Shield, Image, Database, Globe, Lock, User } from 'lucide-react';
import { DEFAULT_GEMINI_KEY, DEFAULT_PEXELS_KEY, DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY } from '../constants';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  pexelsKey: string;
  supabaseUrl: string;
  supabaseKey: string;
  onSave: (g: string, p: string, sUrl: string, sKey: string) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  geminiKey, 
  pexelsKey,
  supabaseUrl,
  supabaseKey,
  onSave 
}) => {
  const [tempGemini, setTempGemini] = useState(geminiKey);
  const [tempPexels, setTempPexels] = useState(pexelsKey);
  const [tempSupabaseUrl, setTempSupabaseUrl] = useState(supabaseUrl);
  const [tempSupabaseKey, setTempSupabaseKey] = useState(supabaseKey);

  useEffect(() => {
    setTempGemini(geminiKey);
    setTempPexels(pexelsKey);
    setTempSupabaseUrl(supabaseUrl);
    setTempSupabaseKey(supabaseKey);
  }, [geminiKey, pexelsKey, supabaseUrl, supabaseKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(tempGemini, tempPexels, tempSupabaseUrl, tempSupabaseKey);
    onClose();
  };

  const resetDefaults = () => {
    setTempGemini(DEFAULT_GEMINI_KEY);
    setTempPexels(DEFAULT_PEXELS_KEY);
    setTempSupabaseUrl(DEFAULT_SUPABASE_URL);
    setTempSupabaseKey(DEFAULT_SUPABASE_KEY);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white">
            <div className="p-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">System Configuration</h3>
              <p className="text-xs text-slate-400">Manage API & Database</p>
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
              Gemini API Key
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={tempGemini}
                onChange={(e) => setTempGemini(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                placeholder="AIza..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>

          {/* Pexels Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 flex items-center">
              <Image className="w-4 h-4 mr-2 text-emerald-400" />
              Pexels API Key
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={tempPexels}
                onChange={(e) => setTempPexels(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                placeholder="Your Pexels Key..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>

          {/* Supabase Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-green-400">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Cloud Database (Supabase)</span>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center">
                    <Globe className="w-3 h-3 mr-1.5 text-cyan-400" />
                    Project URL
                </label>
                <div className="relative">
                  <input 
                      type="text" 
                      value={tempSupabaseUrl}
                      onChange={(e) => setTempSupabaseUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none font-mono"
                      placeholder="https://your-project.supabase.co"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
            </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 flex items-center">
                    <Lock className="w-3 h-3 mr-1.5 text-amber-400" />
                    Anon Public Key
                </label>
                <div className="relative">
                  <input 
                      type="password" 
                      value={tempSupabaseKey}
                      onChange={(e) => setTempSupabaseKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:ring-2 focus:ring-green-500 outline-none font-mono"
                      placeholder="eyJh..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
            </div>
             <p className="text-[10px] text-slate-500">
                Used to save analysis history. Create a table named <code>analyses</code> in your Supabase project.
            </p>
          </div>

          {/* Copyright Section */}
          <div className="pt-6 mt-4 border-t border-slate-800/50 text-center">
               <div className="inline-flex items-center justify-center space-x-2 bg-slate-950/50 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
                   <User className="w-3 h-3 text-indigo-400" />
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       System Architect: <span className="text-white">MAHIR</span> &copy; 2025
                   </span>
               </div>
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
              Save Config
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
