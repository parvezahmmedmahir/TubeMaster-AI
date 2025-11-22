
import React from 'react';
import { Youtube, Zap, ShieldCheck, Crown, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-lg shadow-red-900/20 border border-red-500/20">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TubeMaster AI
            </span>
          </div>
          
          {/* Branding Section */}
          <div className="hidden lg:flex items-center space-x-2 px-4 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
             <Crown className="w-3 h-3 text-amber-400" />
             <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">System Architect: <span className="text-white">MAHIR</span></span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center text-slate-400 text-sm">
              <Zap className="h-4 w-4 mr-1 text-yellow-500" />
              <span>Powered by Gemini 2.5</span>
            </div>
            <div className="hidden md:flex items-center text-slate-400 text-sm">
              <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
              <span>Copyright Safe Check</span>
            </div>
            
            {/* Settings Trigger */}
            <button 
              onClick={onOpenSettings}
              className="p-2 bg-slate-800/50 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
              title="API Configuration"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
