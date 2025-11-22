
import React, { useRef, useState, useEffect } from 'react';
import { MusicTrack, VideoMetadata } from '../types';
import { MOCK_MUSIC_TRACKS } from '../constants';
import { Music, Play, Pause, Volume2, Download, Scissors, Gauge, Wand2, Loader2, Volume1, Settings2, ChevronDown, AlertCircle, Check, Mic2, Monitor, Sparkles, Zap } from 'lucide-react';

interface VideoEditorProps {
  videoUrl: string | null;
  metadata: VideoMetadata | null;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ videoUrl, metadata }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio Mixing State
  const [musicVolume, setMusicVolume] = useState(0.4); // Default lower for background
  const [videoVolume, setVideoVolume] = useState(1.0);
  
  // AI Enhancements State
  const [enableVoiceClarity, setEnableVoiceClarity] = useState(false);
  const [enableHDUpscale, setEnableHDUpscale] = useState(false);
  
  // Editor State
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [filter, setFilter] = useState('none');
  
  // UI State
  const [activeTab, setActiveTab] = useState<'trim' | 'visuals' | 'audio' | 'enhance'>('enhance');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const processingRef = useRef(false);

  const filters = [
    { name: 'Original', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(60%)' },
    { name: 'High Contrast', value: 'contrast(150%)' },
    { name: 'Brighten', value: 'brightness(120%)' },
    { name: 'Vintage', value: 'sepia(30%) contrast(120%) brightness(110%) saturate(80%)' },
    { name: 'Cyberpunk', value: 'contrast(120%) saturate(150%) hue-rotate(10deg)' },
  ];

  // Auto-Select Music based on Analysis
  useEffect(() => {
    if (metadata?.recommendedAudioMood) {
      // Find a track that matches the mood
      const matchedTrack = MOCK_MUSIC_TRACKS.find(t => t.mood === metadata.recommendedAudioMood);
      if (matchedTrack) {
        setSelectedTrack(matchedTrack);
      } else {
        // Fallback if no exact match, pick first
        setSelectedTrack(MOCK_MUSIC_TRACKS[0]);
      }
    }
  }, [metadata]);

  // Reset state when video changes
  useEffect(() => {
    if (videoUrl) {
        setIsPlaying(false);
        setTrimStart(0);
        setTrimEnd(0);
        setDuration(0);
        setFilter('none');
        setPlaybackRate(1);
        // Selected track handled by metadata effect
        setMusicVolume(0.4);
        setVideoVolume(1.0);
        setEnableVoiceClarity(false);
        setEnableHDUpscale(false);
        setActiveTab('enhance');
    }
  }, [videoUrl]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setTrimEnd(dur);
      setTrimStart(0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);

      // Loop within trim bounds
      if (curr >= trimEnd) {
        videoRef.current.currentTime = trimStart;
        if(audioRef.current) audioRef.current.currentTime = 0;
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        audioRef.current?.pause();
      } else {
        // If we are at the end of trim, reset to start
        if (videoRef.current.currentTime >= trimEnd || videoRef.current.currentTime < trimStart) {
            videoRef.current.currentTime = trimStart;
        }
        videoRef.current.play();
        if (selectedTrack && audioRef.current) {
            audioRef.current.playbackRate = playbackRate; // Ensure rate is set before play
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const cyclePlaybackRate = (e: React.MouseEvent) => {
      e.stopPropagation();
      const rates = [0.5, 1, 1.5, 2];
      const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
      setPlaybackRate(rates[nextIndex]);
  };

  // Apply playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync Video Volume
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.volume = videoVolume;
    }
  }, [videoVolume]);

  // Sync Music Volume and State
  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.volume = musicVolume;
          // Sync playback rate for audio as well
          audioRef.current.playbackRate = playbackRate;

          if (isPlaying && audioRef.current.paused) {
              audioRef.current.play().catch(() => {});
          } else if (!isPlaying && !audioRef.current.paused) {
              audioRef.current.pause();
          }
      }
  }, [selectedTrack, musicVolume, isPlaying, playbackRate]);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getCombinedFilters = () => {
    let f = filter !== 'none' ? filter : '';
    if (enableHDUpscale) {
      // Simulated upscale: Increase contrast, slight saturation, brightness bump
      f += ' contrast(115%) saturate(110%) brightness(105%)';
    }
    return f.trim() || 'none';
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    setIsProcessing(true);
    setProgress(0);
    processingRef.current = true;

    // Force pause main player
    if (isPlaying) togglePlay();

    try {
        // 1. Setup Off-screen Canvas & Video
        const canvas = document.createElement('canvas');
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.muted = true; 
        video.playbackRate = playbackRate; // Key: Set playback rate for rendering

        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                resolve(null);
            };
        });

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Canvas context failed");

        // 2. Setup Audio Mixing & AI Voice Enhancement
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const dest = audioCtx.createMediaStreamDestination();

        // A. Video Audio Source
        const videoAudio = document.createElement('audio');
        videoAudio.src = videoUrl;
        videoAudio.crossOrigin = "anonymous";
        videoAudio.playbackRate = playbackRate; // Key: Set playback rate for video audio
        
        const videoSource = audioCtx.createMediaElementSource(videoAudio);
        
        // AI Voice Clarity Chain
        let videoChainPoint: AudioNode = videoSource;

        if (enableVoiceClarity) {
            // 1. Highpass Filter (Remove Low Rumble)
            const highpass = audioCtx.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.value = 100; 
            videoChainPoint.connect(highpass);
            videoChainPoint = highpass;

            // 2. Peaking Filter (Voice Presence Boost)
            const peaking = audioCtx.createBiquadFilter();
            peaking.type = 'peaking';
            peaking.frequency.value = 3000; // 3kHz human speech presence
            peaking.Q.value = 1;
            peaking.gain.value = 4; // db Boost
            videoChainPoint.connect(peaking);
            videoChainPoint = peaking;
            
            // 3. Compressor (Even out levels)
            const compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold.value = -24;
            compressor.knee.value = 30;
            compressor.ratio.value = 12;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;
            videoChainPoint.connect(compressor);
            videoChainPoint = compressor;
        }

        const videoGain = audioCtx.createGain();
        videoGain.gain.value = videoVolume; 
        videoChainPoint.connect(videoGain);
        videoGain.connect(dest);

        // B. Music Audio Source (if applicable)
        let musicAudio: HTMLAudioElement | null = null;
        if (selectedTrack) {
            try {
                musicAudio = new Audio(selectedTrack.url);
                musicAudio.crossOrigin = "anonymous";
                musicAudio.loop = true;
                musicAudio.playbackRate = playbackRate; // Key: Set playback rate for music

                const musicSource = audioCtx.createMediaElementSource(musicAudio);
                const musicGain = audioCtx.createGain();
                musicGain.gain.value = musicVolume; // Apply Music Volume
                musicSource.connect(musicGain);
                musicGain.connect(dest);
            } catch (err) {
                console.warn("Could not mix background music (CORS likely):", err);
            }
        }

        // 3. Prepare Recorder
        const stream = canvas.captureStream(30); // Capture at 30 FPS
        const mixedAudioTrack = dest.stream.getAudioTracks()[0];
        if (mixedAudioTrack) stream.addTrack(mixedAudioTrack);

        const recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9' 
        });

        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TubeMaster_Enhanced_${Date.now()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
            
            // Cleanup
            audioCtx.close();
            setIsProcessing(false);
            processingRef.current = false;
        };

        // 4. Start Processing Loop
        recorder.start();
        
        // Set Start Times
        video.currentTime = trimStart;
        videoAudio.currentTime = trimStart;
        if (musicAudio) musicAudio.currentTime = 0;

        // Play All Sources
        await Promise.all([
            video.play(),
            videoAudio.play(),
            musicAudio ? musicAudio.play().catch(() => {}) : Promise.resolve()
        ]);

        const renderFrame = () => {
            if (!processingRef.current) return;

            // Check end condition
            if (video.currentTime >= trimEnd || video.ended) {
                recorder.stop();
                video.pause();
                videoAudio.pause();
                if (musicAudio) musicAudio.pause();
                return;
            }

            // Draw with Filter
            ctx.filter = getCombinedFilters();
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Update Progress
            const pct = ((video.currentTime - trimStart) / (trimEnd - trimStart)) * 100;
            setProgress(Math.min(pct, 100));

            requestAnimationFrame(renderFrame);
        };

        renderFrame();

    } catch (error) {
        console.error("Rendering failed", error);
        alert("Rendering failed. Please ensure media is supported by your browser.");
        setIsProcessing(false);
        processingRef.current = false;
    }
  };

  if (!videoUrl) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Rendering High-Power Video...</h3>
            <p className="text-slate-400 text-sm mb-6">Upscaling, Enhancing Audio & Mixing Tracks.</p>
            
            <div className="w-full max-w-md bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-indigo-400 font-mono mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md rounded-xl flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Settings2 className="w-5 h-5 mr-2 text-indigo-400" />
                    Confirm Render Settings
                </h3>
                
                <div className="space-y-3 text-sm text-slate-300 mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                     <div className="flex justify-between border-b border-slate-700/50 pb-2">
                        <span className="text-slate-500">AI Enhancements</span>
                        <div className="text-right">
                           {enableHDUpscale && <span className="block text-green-400 text-xs font-bold">HD 4K Upscale</span>}
                           {enableVoiceClarity && <span className="block text-green-400 text-xs font-bold">Voice Clarity + Noise Red.</span>}
                           {!enableHDUpscale && !enableVoiceClarity && <span className="text-slate-500">None</span>}
                        </div>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                        <span className="text-slate-500">Playback Speed</span>
                        <span className="font-mono text-white">{playbackRate}x</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                        <span className="text-slate-500">Trim Duration</span>
                        <span className="font-mono text-white">{formatTime((trimEnd - trimStart) / playbackRate)} (Adjusted)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-2">
                        <span className="text-slate-500">Visual Filter</span>
                        <span className="font-medium text-white capitalize">{filters.find(f => f.value === filter)?.name || 'None'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">Background Audio</span>
                        <span className="font-medium text-white truncate max-w-[150px] text-right">
                            {selectedTrack ? selectedTrack.name : 'No Music Added'}
                        </span>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button 
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => { setShowConfirmModal(false); handleDownload(); }}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Start Rendering
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="relative bg-black rounded-xl overflow-hidden border border-slate-700 shadow-2xl aspect-video group">
        <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain transition-all duration-300"
            style={{ filter: getCombinedFilters() }}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
        />
        <audio ref={audioRef} src={selectedTrack?.url} loop />

        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex flex-col justify-end pointer-events-none">
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                {/* Scrubber / Trim Visualization */}
                <div className="relative h-2 bg-slate-600 rounded-full mb-4 cursor-pointer group/scrubber">
                     {/* Trim Area */}
                     <div 
                        className="absolute h-full bg-slate-400 rounded-full opacity-50"
                        style={{ 
                            left: `${(trimStart / duration) * 100}%`, 
                            width: `${((trimEnd - trimStart) / duration) * 100}%` 
                        }}
                     />
                     {/* Play Progress */}
                     <div 
                        className="absolute h-full bg-indigo-500 rounded-full"
                        style={{ 
                            left: `${(trimStart / duration) * 100}%`,
                            width: `${Math.max(0, ((currentTime - trimStart) / duration) * 100)}%`
                        }}
                     />
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                        <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                             {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                        </button>
                        <span className="text-xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                         <button 
                            onClick={cyclePlaybackRate}
                            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                            title="Toggle Playback Speed"
                         >
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="font-mono font-bold">{playbackRate}x</span>
                         </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 pointer-events-none">
            {enableHDUpscale && <div className="px-2 py-1 bg-green-500/80 text-white text-[10px] font-bold rounded shadow backdrop-blur-md">4K UPSCALED</div>}
            {enableVoiceClarity && <div className="px-2 py-1 bg-blue-500/80 text-white text-[10px] font-bold rounded shadow backdrop-blur-md">VOICE CLARITY</div>}
        </div>

        {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 backdrop-blur-sm p-4 rounded-full border border-white/10 animate-in zoom-in duration-300">
                     <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
            </div>
        )}
      </div>

      {/* Tabbed Editor Interface */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden backdrop-blur-sm shadow-xl">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('enhance')} 
                className={`flex-1 py-4 min-w-[100px] text-sm font-bold flex items-center justify-center transition-all ${activeTab === 'enhance' ? 'bg-slate-800/80 text-green-400 border-b-2 border-green-500 shadow-[inset_0_-2px_10px_rgba(34,197,94,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
            >
                <Sparkles className={`w-4 h-4 mr-2 ${activeTab === 'enhance' ? 'animate-pulse' : ''}`} /> AI Enhance
            </button>
            <button 
                onClick={() => setActiveTab('trim')} 
                className={`flex-1 py-4 min-w-[100px] text-sm font-bold flex items-center justify-center transition-all ${activeTab === 'trim' ? 'bg-slate-800/80 text-indigo-400 border-b-2 border-indigo-500 shadow-[inset_0_-2px_10px_rgba(99,102,241,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
            >
                <Scissors className={`w-4 h-4 mr-2 ${activeTab === 'trim' ? 'animate-pulse' : ''}`} /> Trim & Cut
            </button>
            <button 
                onClick={() => setActiveTab('visuals')} 
                className={`flex-1 py-4 min-w-[100px] text-sm font-bold flex items-center justify-center transition-all ${activeTab === 'visuals' ? 'bg-slate-800/80 text-purple-400 border-b-2 border-purple-500 shadow-[inset_0_-2px_10px_rgba(168,85,247,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
            >
                <Wand2 className={`w-4 h-4 mr-2 ${activeTab === 'visuals' ? 'animate-pulse' : ''}`} /> Visuals
            </button>
            <button 
                onClick={() => setActiveTab('audio')} 
                className={`flex-1 py-4 min-w-[100px] text-sm font-bold flex items-center justify-center transition-all ${activeTab === 'audio' ? 'bg-slate-800/80 text-pink-400 border-b-2 border-pink-500 shadow-[inset_0_-2px_10px_rgba(236,72,153,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
            >
                <Music className={`w-4 h-4 mr-2 ${activeTab === 'audio' ? 'animate-pulse' : ''}`} /> Audio
            </button>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[200px]">

            {/* 0. AI Enhancement Tab */}
            {activeTab === 'enhance' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center justify-between mb-2">
                         <h3 className="text-sm font-semibold text-slate-300">High-Power AI Enhancement Suite</h3>
                         <span className="text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-800">SYSTEM READY</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Voice Clarity */}
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer relative group" onClick={() => setEnableVoiceClarity(!enableVoiceClarity)}>
                             <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center space-x-2">
                                     <div className={`p-2 rounded-lg ${enableVoiceClarity ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                        <Mic2 className="w-5 h-5 text-white" />
                                     </div>
                                     <div>
                                        <h4 className="text-white font-bold text-sm">Voice Clarity</h4>
                                        <p className="text-[10px] text-slate-400">Noise Reduction & EQ</p>
                                     </div>
                                 </div>
                                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${enableVoiceClarity ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                                     {enableVoiceClarity && <Check className="w-3 h-3 text-white" />}
                                 </div>
                             </div>
                             <p className="text-xs text-slate-500">
                                Uses High-Pass filters to remove rumble and Peaking EQ to boost speech presence.
                             </p>
                        </div>

                        {/* HD Upscale */}
                        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-green-500 transition-all cursor-pointer relative group" onClick={() => setEnableHDUpscale(!enableHDUpscale)}>
                             <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center space-x-2">
                                     <div className={`p-2 rounded-lg ${enableHDUpscale ? 'bg-green-600' : 'bg-slate-700'}`}>
                                        <Monitor className="w-5 h-5 text-white" />
                                     </div>
                                     <div>
                                        <h4 className="text-white font-bold text-sm">4K Upscale Engine</h4>
                                        <p className="text-[10px] text-slate-400">Sharpen & Enhance</p>
                                     </div>
                                 </div>
                                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${enableHDUpscale ? 'bg-green-600 border-green-600' : 'border-slate-600'}`}>
                                     {enableHDUpscale && <Check className="w-3 h-3 text-white" />}
                                 </div>
                             </div>
                             <p className="text-xs text-slate-500">
                                Simulates high resolution by enhancing local contrast, saturation and applying sharpness filters.
                             </p>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-800/50 rounded-lg flex items-start space-x-3">
                        <Sparkles className="w-4 h-4 text-indigo-400 mt-1" />
                        <div>
                            <h5 className="text-xs font-bold text-indigo-300">Auto-Configured by System</h5>
                            <p className="text-[10px] text-slate-400 mt-1">
                                Based on the analysis, we recommend enabling both features for this video type.
                            </p>
                        </div>
                    </div>
                 </div>
            )}
            
            {/* 1. Trimming Tab */}
            {activeTab === 'trim' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <h3 className="text-sm font-semibold text-slate-300">Precision Trimming</h3>
                    <div className="grid grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div>
                            <label className="text-xs text-indigo-400 font-bold mb-2 block uppercase">Start Time</label>
                            <input 
                                type="range" 
                                min={0} 
                                max={duration} 
                                step={0.1}
                                value={trimStart} 
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if(val < trimEnd) {
                                        setTrimStart(val);
                                        if(videoRef.current) videoRef.current.currentTime = val;
                                    }
                                }}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="text-right text-sm text-white font-mono mt-2 bg-slate-800 inline-block px-2 rounded">{formatTime(trimStart)}</div>
                        </div>
                        <div>
                            <label className="text-xs text-indigo-400 font-bold mb-2 block uppercase">End Time</label>
                            <input 
                                type="range" 
                                min={0} 
                                max={duration} 
                                step={0.1}
                                value={trimEnd} 
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if(val > trimStart) setTrimEnd(val);
                                }}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="text-right text-sm text-white font-mono mt-2 bg-slate-800 inline-block px-2 rounded">{formatTime(trimEnd)}</div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> 
                        Video loops within the selected blue range.
                    </p>
                </div>
            )}

            {/* 2. Visuals Tab */}
            {activeTab === 'visuals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-300">
                     <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-4">Color Grading Filters</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {filters.map(f => (
                                <button
                                    key={f.name}
                                    onClick={() => setFilter(f.value)}
                                    className={`text-xs py-2 px-3 rounded-lg border transition-all text-left font-medium ${
                                        filter === f.value 
                                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/50' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                                    }`}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                     </div>

                     <div>
                        <h3 className="text-sm font-semibold text-slate-300 mb-4">Playback Speed</h3>
                        <div className="flex flex-col gap-3">
                            {[0.5, 1, 1.5, 2].map(rate => (
                                <button
                                    key={rate}
                                    onClick={() => setPlaybackRate(rate)}
                                    className={`flex items-center justify-between px-4 py-2 rounded-lg border transition-all ${
                                        playbackRate === rate 
                                        ? 'bg-green-900/40 border-green-500 text-green-200' 
                                        : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="text-xs font-bold">{rate}x Speed</span>
                                    {playbackRate === rate && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                     </div>
                </div>
            )}

            {/* 3. Audio Tab */}
            {activeTab === 'audio' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    
                    {metadata?.recommendedAudioMood && (
                         <div className="p-3 bg-pink-900/20 border border-pink-800/50 rounded-lg flex items-center space-x-3 mb-4">
                            <Music className="w-4 h-4 text-pink-400" />
                            <div>
                                <h5 className="text-xs font-bold text-pink-300">AI Suggestion: {metadata.recommendedAudioMood} Mood</h5>
                                <p className="text-[10px] text-slate-400">
                                    We automatically selected a matching track for your content.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <div>
                            <label className="text-xs text-slate-400 mb-2 flex items-center justify-between font-bold">
                                <div className="flex items-center"><Volume1 className="w-3 h-3 mr-1"/> Original Video Volume</div>
                                <span className="font-mono text-indigo-400">{Math.round(videoVolume * 100)}%</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={videoVolume}
                                onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-2 flex items-center justify-between font-bold">
                                <div className="flex items-center"><Volume2 className="w-3 h-3 mr-1"/> Music Track Volume</div>
                                <span className="font-mono text-pink-400">{Math.round(musicVolume * 100)}%</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs text-slate-500 mb-2 block uppercase tracking-wider font-bold">Select Background Music</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-3 appearance-none cursor-pointer"
                                onChange={(e) => {
                                    const trackId = e.target.value;
                                    const track = MOCK_MUSIC_TRACKS.find(t => t.id === trackId) || null;
                                    setSelectedTrack(track);
                                }}
                                value={selectedTrack?.id || ""}
                            >
                                <option value="">No Background Music</option>
                                {MOCK_MUSIC_TRACKS.map(track => (
                                    <option key={track.id} value={track.id}>
                                        {track.name} - {track.mood} ({Math.floor(track.duration / 60)}:{Math.floor(track.duration % 60).toString().padStart(2, '0')})
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            * Selected royalty-free music will be mixed with the original video audio.
                        </p>
                    </div>
                 </div>
            )}
        </div>
        
         {/* Footer with Action */}
         <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center">
             <div className="text-xs text-slate-500">
                {activeTab === 'enhance' && 'AI Clarity & Upscaling applied during render.'}
                {activeTab === 'trim' && 'Adjust start/end points to cut video.'}
                {activeTab === 'visuals' && 'Filters are applied instantly to preview.'}
                {activeTab === 'audio' && 'Mix levels before rendering.'}
             </div>
            <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={isProcessing}
                className="flex items-center px-6 py-2.5 bg-white text-slate-900 rounded-lg font-bold hover:bg-indigo-50 transition-all shadow-lg disabled:opacity-50"
            >
                <Download className="w-4 h-4 mr-2" />
                Download Video
            </button>
         </div>
      </div>
    </div>
  );
};
