
import React, { useState, useEffect } from 'react';
import { VideoMetadata, PlatformMode } from '../types';
import { Copy, Check, AlertTriangle, CheckCircle, Youtube, Facebook, Instagram, BarChart3, Zap, Video, Music2 } from 'lucide-react';

interface AnalysisResultsProps {
  metadata: VideoMetadata;
  initialTab?: PlatformMode;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ metadata, initialTab = 'YOUTUBE' }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<VideoMetadata>(metadata);
  const [activeTab, setActiveTab] = useState<PlatformMode>(initialTab);

  useEffect(() => {
    setFormData(metadata);
  }, [metadata]);

  useEffect(() => {
      // Allow parent to override tab, but user can switch freely
      if(initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleChange = (field: keyof VideoMetadata, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Status Cards Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Copyright Status */}
        <div className={`p-4 rounded-xl border backdrop-blur-sm ${
            formData.copyrightRisk === 'HIGH' ? 'bg-red-900/20 border-red-800/50' :
            formData.copyrightRisk === 'MEDIUM' ? 'bg-yellow-900/20 border-yellow-800/50' :
            'bg-green-900/20 border-green-800/50'
        }`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Copyright Check</h3>
                {formData.copyrightRisk === 'HIGH' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                formData.copyrightRisk === 'MEDIUM' ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
            <div className={`text-xl font-black ${
                formData.copyrightRisk === 'HIGH' ? 'text-red-400' :
                formData.copyrightRisk === 'MEDIUM' ? 'text-yellow-400' :
                'text-green-400'
            }`}>
                {formData.copyrightRisk} RISK
            </div>
            <div className="mt-2 p-2 bg-slate-900/40 rounded text-xs text-slate-300 border border-slate-800/50">
                <p className="leading-relaxed">
                    {formData.copyrightNotes}
                </p>
            </div>
        </div>

        {/* Virality Score */}
        <div className="p-4 rounded-xl border border-indigo-800/50 bg-indigo-900/20 backdrop-blur-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Virality Score</h3>
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-white">{formData.viralityScore || 85}</span>
                    <span className="text-sm text-indigo-300">/ 100</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" 
                        style={{ width: `${formData.viralityScore || 85}%` }}
                    ></div>
                </div>
            </div>
            
            {/* Power Keywords detected */}
            {formData.engagingKeywords && formData.engagingKeywords.length > 0 && (
                <div className="mt-3">
                    <div className="flex items-center space-x-1 mb-1 text-xs text-yellow-400 font-bold uppercase">
                        <Zap className="w-3 h-3" />
                        <span>Power Words Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {formData.engagingKeywords.slice(0, 4).map((kw, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 rounded text-[10px]">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-700 overflow-x-auto">
        <button
            onClick={() => setActiveTab('YOUTUBE')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative min-w-[100px] flex-shrink-0 ${
                activeTab === 'YOUTUBE' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
        >
            <span className="flex items-center"><Youtube className="w-4 h-4 mr-2 text-red-500" /> YouTube</span>
            {activeTab === 'YOUTUBE' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>}
        </button>
        <button
            onClick={() => setActiveTab('TIKTOK')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative min-w-[100px] flex-shrink-0 ${
                activeTab === 'TIKTOK' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
        >
            <span className="flex items-center"><Music2 className="w-4 h-4 mr-2 text-pink-500" /> TikTok</span>
            {activeTab === 'TIKTOK' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>}
        </button>
        <button
            onClick={() => setActiveTab('FACEBOOK')}
            className={`px-4 py-2 text-sm font-medium transition-colors relative min-w-[100px] flex-shrink-0 ${
                activeTab === 'FACEBOOK' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
        >
            <span className="flex items-center"><Facebook className="w-4 h-4 mr-2 text-blue-500" /> Facebook</span>
            {activeTab === 'FACEBOOK' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>}
        </button>
      </div>

      <div className="bg-slate-900/40 rounded-b-xl p-1">
        
        {/* YOUTUBE CONTENT */}
        {activeTab === 'YOUTUBE' && (
            <div className="space-y-4 p-2 animate-in fade-in duration-300">
                <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Video Title</label>
                        <button onClick={() => copyToClipboard(formData.title, 'title')} className="text-slate-500 hover:text-white">
                            {copiedField === 'title' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-medium"
                    />
                </div>

                <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                        <button onClick={() => copyToClipboard(formData.description, 'description')} className="text-slate-500 hover:text-white">
                            {copiedField === 'description' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    <textarea
                        rows={5}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all resize-none"
                    />
                </div>

                <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Tags</label>
                        <button onClick={() => copyToClipboard(formData.hashtags.join(', '), 'hashtags')} className="text-slate-500 hover:text-white">
                            {copiedField === 'hashtags' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                        {formData.hashtags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-700 text-slate-200 rounded text-xs border border-slate-600">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* TIKTOK CONTENT */}
        {activeTab === 'TIKTOK' && (
            <div className="space-y-4 p-2 animate-in fade-in duration-300">
                <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Viral Caption</span>
                            <span className="text-[10px] bg-pink-500/20 text-pink-400 border border-pink-500/30 px-1 rounded">HOOK OPTIMIZED</span>
                        </div>
                        <button onClick={() => copyToClipboard(formData.tiktokCaption, 'tiktokCaption')} className="text-slate-500 hover:text-white">
                            {copiedField === 'tiktokCaption' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={formData.tiktokCaption}
                        onChange={(e) => handleChange('tiktokCaption', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all font-medium"
                    />
                </div>

                <div className="group">
                     <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">FYP Hashtags</label>
                        <button onClick={() => copyToClipboard(formData.tiktokHashtags?.join(' ') || '', 'tiktokHashtags')} className="text-slate-500 hover:text-white">
                            {copiedField === 'tiktokHashtags' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                     <div className="flex flex-wrap gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                        {formData.tiktokHashtags?.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-pink-900/20 text-pink-200 rounded text-xs border border-pink-800/30">
                                {tag}
                            </span>
                        )) || <span className="text-slate-500 text-sm">No specific hashtags generated.</span>}
                    </div>
                </div>
            </div>
        )}

        {/* FACEBOOK CONTENT */}
        {activeTab === 'FACEBOOK' && (
             <div className="space-y-4 p-2 animate-in fade-in duration-300">
                 <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">FB Watch Title</label>
                        <button onClick={() => copyToClipboard(formData.facebookTitle, 'facebookTitle')} className="text-slate-500 hover:text-white">
                            {copiedField === 'facebookTitle' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    <input
                        type="text"
                        value={formData.facebookTitle}
                        onChange={(e) => handleChange('facebookTitle', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                </div>
                 <div className="group">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Facebook Post Description</label>
                        <button onClick={() => copyToClipboard(formData.facebookDescription || '', 'facebookDescription')} className="text-slate-500 hover:text-white">
                            {copiedField === 'facebookDescription' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                    <textarea
                        rows={5}
                        value={formData.facebookDescription}
                        onChange={(e) => handleChange('facebookDescription', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                    />
                </div>
                 <div className="group">
                     <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Video Tags</label>
                         <button onClick={() => copyToClipboard(formData.facebookHashtags?.join(', ') || '', 'facebookHashtags')} className="text-slate-500 hover:text-white">
                            {copiedField === 'facebookHashtags' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                     <div className="flex flex-wrap gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                        {formData.facebookHashtags?.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-900/20 text-blue-200 rounded text-xs border border-blue-800/30">
                                {tag}
                            </span>
                        )) || <span className="text-slate-500 text-sm">No specific hashtags generated.</span>}
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};
